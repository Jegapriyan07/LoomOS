import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getTodaysRecommendation } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }

  try {
    const recommendation = await getTodaysRecommendation(auth.weaverId);
    return NextResponse.json(recommendation);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 },
    );
  }
}
