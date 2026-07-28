import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/auth/db";
import type { UserRole } from "@/generated/prisma/client";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function pepper(): string {
  return process.env.OTP_PEPPER ?? "loomos-dev-otp-pepper";
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(`${pepper()}:${code}`).digest("hex");
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

/**
 * Pitch / Dev OTP: always 123456 when no SMS provider is configured,
 * so the deployed site can list one fixed code. With MSG91/Twilio, generate random.
 */
export async function createOtpChallenge(
  phone: string,
  role: UserRole,
): Promise<{ code: string }> {
  const { DEMO_OTP_CODE } = await import("@/lib/demo/logins");
  const { isSmsProviderConfigured } = await import("@/lib/auth/sms");
  const code = isSmsProviderConfigured() ? generateOtpCode() : DEMO_OTP_CODE;
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpChallenge.updateMany({
    where: { phone, role, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.otpChallenge.create({
    data: { phone, role, codeHash, expiresAt },
  });

  return { code };
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; error: string };

export async function verifyOtpChallenge(
  phone: string,
  role: UserRole,
  code: string,
): Promise<VerifyOtpResult> {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { phone, role, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { ok: false, error: "No active OTP — request a new code" };
  }
  if (challenge.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "OTP expired — request a new code" };
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Too many attempts — request a new code" };
  }

  const match = challenge.codeHash === hashOtp(code.trim());
  if (!match) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, error: "Incorrect code" };
  }

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  return { ok: true };
}
