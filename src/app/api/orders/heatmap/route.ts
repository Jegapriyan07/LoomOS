import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getWeaverOrdersHeatmap } from "@/lib/demand/store";
import { PRIMARY_DEMAND } from "@/lib/map/hub-geo";

export async function GET(req: Request) {
  try {
    const auth = await requireRole(UserRole.WEAVER);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const rawScope = searchParams.get("scope");
    const scope =
      rawScope === "national" || rawScope === "state" || rawScope === "district"
        ? rawScope
        : // legacy: scope=national | default district (Delhi / IIT)
          searchParams.get("national") === "1"
          ? "national"
          : "district";

    const region =
      searchParams.get("region") ??
      auth.weaver?.region ??
      PRIMARY_DEMAND.region;
    const district =
      searchParams.get("district") ??
      (scope === "district" ? PRIMARY_DEMAND.district : undefined);

    const data = await getWeaverOrdersHeatmap({
      scope,
      region: scope === "national" ? undefined : region,
      district: scope === "district" ? district : undefined,
    });
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Heatmap failed";
    console.error("[orders/heatmap]", message, e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
