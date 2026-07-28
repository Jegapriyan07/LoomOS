import { NextResponse } from "next/server";

/**
 * Use phone login: POST /api/auth/login
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Mock email/password auth retired. Use phone login at /api/auth/login.",
      login: "/api/auth/login",
    },
    { status: 410 },
  );
}
