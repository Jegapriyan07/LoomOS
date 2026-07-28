import { prisma } from "@/lib/auth/db";
import {
  hashSessionToken,
  readSessionToken,
} from "@/lib/auth/session";
import type { UserRole } from "@/generated/prisma/client";
import type { Weaver } from "@/lib/types";

export type SessionUser = {
  userId: string;
  phone: string;
  name: string;
  role: UserRole;
  weaverId: string | null;
  buyerId: string | null;
  weaver: Weaver | null;
  buyer: {
    id: string;
    name: string;
    region: string;
    email?: string | null;
  } | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await readSessionToken();
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          weaver: { include: { cooperative: true } },
          buyer: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  const { user } = session;
  const weaverProfile = user.weaver;
  const buyerProfile = user.buyer;

  let weaver: Weaver | null = null;
  if (weaverProfile) {
    let categories: string[] = [];
    try {
      categories = JSON.parse(weaverProfile.categoriesJson) as string[];
    } catch {
      categories = [];
    }
    weaver = {
      id: weaverProfile.id,
      name: user.name,
      primaryLanguage: weaverProfile.primaryLanguage as Weaver["primaryLanguage"],
      region: weaverProfile.region,
      categories,
      cooperativeName: weaverProfile.cooperative.name,
    };
  }

  return {
    userId: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    weaverId: weaverProfile?.id ?? null,
    buyerId: buyerProfile?.id ?? null,
    weaver,
    buyer: buyerProfile
      ? {
          id: buyerProfile.id,
          name: buyerProfile.businessName,
          region: buyerProfile.region,
          email: buyerProfile.email,
        }
      : null,
  };
}

export async function requireRole(
  role: UserRole,
): Promise<SessionUser | { error: string; status: number }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in required", status: 401 };
  }
  if (user.role !== role) {
    return { error: "Wrong account type for this action", status: 403 };
  }
  return user;
}
