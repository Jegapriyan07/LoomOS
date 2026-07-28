import { prisma } from "@/lib/auth/db";
import { UserRole } from "@/generated/prisma/client";
import { randomBytes } from "node:crypto";

const DEFAULT_COOP_ID = "demo-cluster-nila";

export type WeaverSignupProfile = {
  name: string;
  region: string;
  primaryLanguage: string;
  categories: string[];
};

/**
 * After OTP verify: resolve existing user, or create weaver/buyer on register.
 */
export async function resolveUserAfterOtp(args: {
  phone: string;
  role: UserRole;
  /** login = existing only; register = create profile when new */
  mode?: "login" | "register";
  name?: string;
  region?: string;
  primaryLanguage?: string;
  categories?: string[];
}) {
  const mode = args.mode ?? "login";
  const existing = await prisma.user.findFirst({
    where: { phone: args.phone, role: args.role },
    include: { weaver: true, buyer: true },
  });

  // Existing account: always sign in (Register with a known phone just logs in).
  if (existing) return existing;

  if (mode === "login") {
    if (args.role === UserRole.WEAVER) {
      throw new Error(
        "No weaver account for this phone. Tap Register to create your profile.",
      );
    }
    if (args.role === UserRole.BUYER) {
      throw new Error(
        "No buyer account for this phone. Use Register with your business name.",
      );
    }
  }

  if (args.role === UserRole.WEAVER) {
    const name = (args.name ?? "").trim();
    if (!name) {
      throw new Error("Name is required to register as a weaver");
    }
    const categories = (args.categories ?? [])
      .map((c) => c.trim())
      .filter(Boolean);
    if (categories.length === 0) {
      throw new Error("Select at least one weaving category for your profile");
    }

    const coop = await prisma.cooperative.findUnique({
      where: { id: DEFAULT_COOP_ID },
    });
    if (!coop) {
      throw new Error(
        "Demo cooperative is missing. Run npm run db:seed, then try again.",
      );
    }

    const userId = `user-weaver-${randomBytes(4).toString("hex")}`;
    const weaverId = `weaver-${randomBytes(4).toString("hex")}`;
    const region = args.region?.trim() || "Tamil Nadu";
    const primaryLanguage = args.primaryLanguage?.trim() || "hi";

    return prisma.user.create({
      data: {
        id: userId,
        phone: args.phone,
        name,
        role: UserRole.WEAVER,
        weaver: {
          create: {
            id: weaverId,
            cooperativeId: coop.id,
            region,
            primaryLanguage,
            categoriesJson: JSON.stringify(categories),
            givenName: name.split(/\s+/)[0] ?? name,
          },
        },
      },
      include: { weaver: true, buyer: true },
    });
  }

  if (args.role === UserRole.BUYER) {
    const name = (args.name ?? "").trim();
    if (!name) {
      throw new Error("Business name required for first-time buyer signup");
    }
    const userId = `user-buyer-${randomBytes(4).toString("hex")}`;
    const buyerId = `buyer-${randomBytes(4).toString("hex")}`;
    return prisma.user.create({
      data: {
        id: userId,
        phone: args.phone,
        name,
        role: UserRole.BUYER,
        buyer: {
          create: {
            id: buyerId,
            region: args.region?.trim() || "Tamil Nadu",
            businessName: name,
          },
        },
      },
      include: { weaver: true, buyer: true },
    });
  }

  throw new Error("Unsupported role for self-signup");
}
