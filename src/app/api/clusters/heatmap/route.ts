import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getSessionUser } from "@/lib/auth/current-user";
import { DEMAND_CATEGORIES, type DemandCategoryId } from "@/lib/demand/types";
import { buildGovClusterHeat } from "@/lib/map/gov-cluster-heat";
import type { GovSocietyType } from "@/lib/gov/weavers-database";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<UserRole>([
  UserRole.BUYER,
  UserRole.WEAVER,
  UserRole.COOP_ADMIN,
]);

const VALID_CAT = new Set(DEMAND_CATEGORIES.map((c) => c.id));

/**
 * Official cluster density heatmap.
 * GET ?scope=national|state&region=&societyType=all|cooperative|pc&categoryId=
 */
export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!ALLOWED.has(user.role)) {
    return NextResponse.json(
      { error: "Wrong account type for this action" },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const rawScope = url.searchParams.get("scope");
  const scope = rawScope === "state" ? "state" : "national";
  const region = url.searchParams.get("region");
  const rawType = url.searchParams.get("societyType") ?? "all";
  const societyType =
    rawType === "cooperative" || rawType === "pc"
      ? (rawType as GovSocietyType)
      : "all";
  const catRaw = url.searchParams.get("categoryId");
  const categoryId =
    catRaw && VALID_CAT.has(catRaw as DemandCategoryId)
      ? (catRaw as DemandCategoryId)
      : null;

  try {
    const payload = await buildGovClusterHeat({
      scope,
      region,
      societyType,
      categoryId,
    });
    return NextResponse.json(payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Cluster heatmap failed";
    console.error("[clusters/heatmap]", message, e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
