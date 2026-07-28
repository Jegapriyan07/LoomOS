import { NextResponse } from "next/server";

/** OTP removed for pitch — use POST /api/auth/login */
export async function POST() {
  return NextResponse.json(
    {
      error: "OTP login removed. Use POST /api/auth/login with { phone, role }.",
      login: "/api/auth/login",
    },
    { status: 410 },
  );
}
