import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { isValidIndianMobile, normalizePhone } from "@/lib/auth/phone";
import { resolveUserAfterOtp } from "@/lib/auth/resolve-user";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  readSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { ensureBuyerInJsonStore } from "@/lib/demand/store";

function parseRole(raw: unknown): UserRole | null {
  const s = String(raw ?? "").toUpperCase();
  if (s === "WEAVER") return UserRole.WEAVER;
  if (s === "BUYER") return UserRole.BUYER;
  return null;
}

/**
 * Pitch-friendly login — no OTP.
 * POST { phone, role, mode?, name?, region?, primaryLanguage?, categories? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const role = parseRole(body.role);
    const modeRaw = String(body.mode ?? "login").toLowerCase();
    const mode = modeRaw === "register" ? "register" : "login";

    if (!role) {
      return NextResponse.json(
        { error: "role must be WEAVER or BUYER" },
        { status: 400 },
      );
    }
    if (!isValidIndianMobile(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number" },
        { status: 400 },
      );
    }

    const categories = Array.isArray(body.categories)
      ? body.categories.map((c: unknown) => String(c))
      : undefined;

    const user = await resolveUserAfterOtp({
      phone,
      role,
      mode,
      name: body.name ? String(body.name) : undefined,
      region: body.region ? String(body.region) : undefined,
      primaryLanguage: body.primaryLanguage
        ? String(body.primaryLanguage)
        : undefined,
      categories,
    });

    if (user.buyer) {
      await ensureBuyerInJsonStore({
        id: user.buyer.id,
        name: user.buyer.businessName,
        region: user.buyer.region,
        email: user.buyer.email,
      });
    }

    const old = await readSessionToken();
    await destroySession(old);
    await clearSessionCookie();

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        userId: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        weaverId: user.weaver?.id ?? null,
        buyerId: user.buyer?.id ?? null,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    console.error("[auth/login]", message);
    const isConfig =
      /DATABASE_URL|PostgreSQL|SQLite file|Demo cooperative is missing/i.test(
        message,
      ) || message.includes("Can't reach database");
    return NextResponse.json(
      {
        error: isConfig
          ? "Database not ready. Set DATABASE_URL on Vercel, run prisma db push + db:seed, then redeploy."
          : message,
      },
      { status: isConfig ? 500 : 400 },
    );
  }
}
