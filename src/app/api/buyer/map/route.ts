import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getBuyerWeaverMapData } from "@/lib/demand/store";
import { searchSuggestions } from "@/lib/map/build-map-data";

export async function GET(req: Request) {
  const auth = await requireRole(UserRole.BUYER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (q != null) {
    return NextResponse.json({ suggestions: searchSuggestions(q) });
  }

  const data = await getBuyerWeaverMapData();
  return NextResponse.json(data);
}
