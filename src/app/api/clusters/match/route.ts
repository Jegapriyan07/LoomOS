import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getSessionUser } from "@/lib/auth/current-user";
import { matchOfficialClusters } from "@/lib/gov/cluster-match";
import {
  findGovListingForCluster,
  loadGovWeaversClusters,
  GOV_WEAVERS_SOURCE_CHIP,
  societyTypeLabel,
} from "@/lib/gov/weavers-database";
import type { DemandCategoryId } from "@/lib/demand/types";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";

export const dynamic = "force-dynamic";

const VALID = new Set(DEMAND_CATEGORIES.map((c) => c.id));
const ALLOWED = new Set<UserRole>([
  UserRole.BUYER,
  UserRole.WEAVER,
  UserRole.COOP_ADMIN,
]);

/**
 * Official Cluster Match — buyer (or weaver looking up own cluster).
 * GET ?categoryId=&region=&district=&quantity=&neededBy=&limit=
 * GET ?lookupState=&lookupCluster= — weaver profile listing check
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
  const lookupState = url.searchParams.get("lookupState");
  const lookupCluster = url.searchParams.get("lookupCluster");

  if (lookupState) {
    const seed = await loadGovWeaversClusters();
    const entry = findGovListingForCluster(
      seed,
      lookupState,
      lookupCluster ?? "",
    );
    return NextResponse.json({
      listed: Boolean(entry),
      entry,
      societyTypeLabel: entry ? societyTypeLabel(entry.societyType) : null,
      meta: seed.meta,
      sourceChip: GOV_WEAVERS_SOURCE_CHIP,
      message: entry
        ? `Your cooperative cluster “${entry.societyName}” appears in the Ministry Weavers Database (curated seed).`
        : "This cluster is not in the curated Weavers Database seed for this demo.",
    });
  }

  const categoryId = (url.searchParams.get("categoryId") ??
    "cotton-saree") as DemandCategoryId;
  if (!VALID.has(categoryId)) {
    return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
  }

  const region = url.searchParams.get("region") ?? "Tamil Nadu";
  const district = url.searchParams.get("district");
  const quantityRaw = url.searchParams.get("quantity");
  const neededBy = url.searchParams.get("neededBy");
  const limitRaw = url.searchParams.get("limit");

  const payload = await matchOfficialClusters({
    categoryId,
    region,
    district,
    quantity: quantityRaw != null ? Number(quantityRaw) : undefined,
    neededBy: neededBy ?? undefined,
    limit: limitRaw != null ? Number(limitRaw) : 8,
  });

  return NextResponse.json(payload);
}
