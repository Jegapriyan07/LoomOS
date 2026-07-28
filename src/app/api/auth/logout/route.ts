import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  destroySession,
  readSessionToken,
} from "@/lib/auth/session";

export async function POST() {
  const token = await readSessionToken();
  await destroySession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
