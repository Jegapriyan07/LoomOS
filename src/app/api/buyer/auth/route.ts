import { NextResponse } from "next/server";

/**
 * Legacy mock email/password auth removed.
 * Use phone OTP: POST /api/auth/otp/send and /api/auth/otp/verify.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Mock email/password auth retired. Use phone OTP at /api/auth/otp/send and /api/auth/otp/verify.",
      otpSend: "/api/auth/otp/send",
      otpVerify: "/api/auth/otp/verify",
      me: "/api/auth/me",
    },
    { status: 410 },
  );
}
