import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { verifyOtpChallenge } from "@/lib/auth/otp";
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
 * POST { phone, code, role, mode?, name?, region?, primaryLanguage?, categories? }
 * mode: "login" | "register" — register creates weaver/buyer profile.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const code = String(body.code ?? "");
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
    if (!/^\d{6}$/.test(code.trim())) {
      return NextResponse.json(
        { error: "Enter the 6-digit OTP" },
        { status: 400 },
      );
    }

    const verified = await verifyOtpChallenge(phone, role, code);
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 401 });
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
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Verify failed" },
      { status: 400 },
    );
  }
}
