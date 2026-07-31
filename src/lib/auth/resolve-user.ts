import { prisma } from "@/lib/auth/db";
import { UserRole } from "@/generated/prisma/client";
import { randomBytes } from "node:crypto";
import {
  coopForLocation,
  DEFAULT_COOP_ID,
  normalizeDistrict,
  normalizeState,
} from "@/lib/auth/regions";

/**
 * After phone auth: resolve existing user, or create weaver/buyer on register.
 * Weaver cooperative society is assigned from selected state + cluster
 * (society name matches the cluster name).
 */
export async function resolveUserAfterOtp(args: {
  phone: string;
  role: UserRole;
  mode?: "login" | "register";
  name?: string;
  region?: string;
  primaryLanguage?: string;
  categories?: string[];
  district?: string;
  yearsWeaving?: string;
  businessType?: string;
  email?: string;
}) {
  const mode = args.mode ?? "login";
  const existing = await prisma.user.findFirst({
    where: { phone: args.phone, role: args.role },
    include: { weaver: true, buyer: true },
  });

  // Existing account: always sign in (Register with a known phone just logs in).
  if (existing) return existing;

  // Same phone already used under the other role (schema: phone is unique)
  const otherRole = await prisma.user.findFirst({
    where: { phone: args.phone },
    select: { role: true },
  });
  if (otherRole) {
    throw new Error(
      `This phone is already registered as a ${otherRole.role.toLowerCase()}. Use a different number for ${args.role.toLowerCase()} login.`,
    );
  }

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

    const state = normalizeState(args.region?.trim() || "Tamil Nadu");
    const district = normalizeDistrict(state, args.district ?? "");
    const assignment = coopForLocation(state, district);
    let coop = await prisma.cooperative.findUnique({
      where: { id: assignment.cooperativeId },
    });
    if (!coop) {
      coop = await prisma.cooperative.findUnique({
        where: { id: DEFAULT_COOP_ID },
      });
    }
    if (!coop) {
      throw new Error(
        "Demo cooperative is missing. Run npm run db:seed, then try again.",
      );
    }

    const userId = `user-weaver-${randomBytes(4).toString("hex")}`;
    const weaverId = `weaver-${randomBytes(4).toString("hex")}`;
    const primaryLanguage = args.primaryLanguage?.trim() || "en";
    const years = (args.yearsWeaving ?? "").trim();
    const givenName = name.split(/\s+/)[0] ?? name;
    // Persist light extras without a schema migration (pitch demo)
    const categoriesPayload = [
      ...categories,
      ...(district ? [`district:${district}`] : []),
      ...(years ? [`years:${years}`] : []),
    ];

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
            region: state,
            primaryLanguage,
            categoriesJson: JSON.stringify(categoriesPayload),
            givenName,
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
    const state = normalizeState(args.region?.trim() || "Tamil Nadu");
    const userId = `user-buyer-${randomBytes(4).toString("hex")}`;
    const buyerId = `buyer-${randomBytes(4).toString("hex")}`;
    const email = (args.email ?? "").trim() || null;
    const businessType = (args.businessType ?? "").trim();
    const displayName = businessType ? `${name} (${businessType})` : name;

    return prisma.user.create({
      data: {
        id: userId,
        phone: args.phone,
        name: displayName,
        role: UserRole.BUYER,
        buyer: {
          create: {
            id: buyerId,
            region: state,
            businessName: name,
            email,
          },
        },
      },
      include: { weaver: true, buyer: true },
    });
  }

  throw new Error("Unsupported role for self-signup");
}
