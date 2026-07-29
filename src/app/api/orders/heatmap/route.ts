import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getWeaverOrdersHeatmap } from "@/lib/demand/store";

export async function GET(req: Request) {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const region =
    searchParams.get("region") ?? auth.weaver?.region ?? undefined;
  const national = searchParams.get("scope") === "national";

  const data = await getWeaverOrdersHeatmap(
    national ? undefined : region || undefined,
  );
  return NextResponse.json(data);
}
