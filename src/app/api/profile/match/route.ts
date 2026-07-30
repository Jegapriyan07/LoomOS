import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getProfileMatch } from "@/lib/profile/match";

export const dynamic = "force-dynamic";

/**
 * Personal Profile Score — logged-in weaver only.
 * Does not expose score for other weavers, buyers, or public share links.
 */
export async function GET() {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }

  try {
    const payload = await getProfileMatch(auth.weaverId);
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}
