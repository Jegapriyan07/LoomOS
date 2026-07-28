import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { createOtpChallenge } from "@/lib/auth/otp";
import { isValidIndianMobile, normalizePhone } from "@/lib/auth/phone";
import { getOtpDelivery } from "@/lib/auth/sms";

function parseRole(raw: unknown): UserRole | null {
  const s = String(raw ?? "").toUpperCase();
  if (s === "WEAVER") return UserRole.WEAVER;
  if (s === "BUYER") return UserRole.BUYER;
  return null;
}

/** POST { phone, role: "WEAVER" | "BUYER" } */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const role = parseRole(body.role);

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

    const { code } = await createOtpChallenge(phone, role);
    const delivery = await getOtpDelivery().send(phone, code);

    return NextResponse.json({
      ok: true,
      phone,
      role,
      /** Dev OTP — SMS provider not wired */
      isDevOtp: delivery.isDev,
      devCode: delivery.devCode,
      note: delivery.isDev
        ? "Dev OTP — SMS provider not wired. Use the code shown here / in the server log."
        : "OTP sent by SMS.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send OTP";
    console.error("[otp/send]", message);
    const isConfig =
      /DATABASE_URL|PostgreSQL|SQLite file/i.test(message) ||
      message.includes("Can't reach database");
    return NextResponse.json(
      {
        error: isConfig
          ? "Server database is not configured. Set DATABASE_URL (PostgreSQL) in Vercel env vars and redeploy."
          : message,
      },
      { status: 500 },
    );
  }
}
