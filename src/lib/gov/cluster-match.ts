/**
 * Official Cluster Match — rank DC(HL) Weavers Database clusters for a buyer need.
 * Transparent reasons; every score component labeled.
 * Density / GI / products grounded in campaign PDF seed — not census.
 */

import { normalizeState } from "@/lib/auth/regions";
import { listOpenRequirements } from "@/lib/demand/store";
import {
  DEMAND_CATEGORIES,
  type DemandCategoryId,
} from "@/lib/demand/types";
import {
  GOV_WEAVERS_SOURCE_CHIP,
  coopIdForGovEntry,
  loadGovWeaversClusters,
  societyTypeLabel,
  type GovWeaversClusterEntry,
  type GovWeaversClusterMeta,
} from "@/lib/gov/weavers-database";

export type ClusterMatchInput = {
  categoryId: DemandCategoryId;
  region: string;
  district?: string | null;
  quantity?: number;
  neededBy?: string;
  /** Max results (default 8) */
  limit?: number;
};

export type ClusterMatchReason = {
  id: string;
  label: string;
  points: number;
  detail: string;
};

export type ClusterMatchResult = {
  rank: number;
  score: number;
  entry: GovWeaversClusterEntry;
  cooperativeId: string;
  societyTypeLabel: string;
  reasons: ClusterMatchReason[];
  sourceChip: typeof GOV_WEAVERS_SOURCE_CHIP;
  loomOsOpenRequirements: number;
};

export type ClusterMatchPayload = {
  query: {
    categoryId: DemandCategoryId;
    categoryLabel: string;
    region: string;
    district: string | null;
    quantity: number | null;
    neededBy: string | null;
  };
  meta: GovWeaversClusterMeta;
  sourceChip: typeof GOV_WEAVERS_SOURCE_CHIP;
  formulaNote: string;
  results: ClusterMatchResult[];
};

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function categoryLabel(id: DemandCategoryId): string {
  return DEMAND_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/**
 * Score one official listing against the buyer query.
 *
 * Components (sum → clamp 100):
 * - Geographic fit (0–40): district exact > state exact > other
 * - Official listing (0–15): campaign PDF presence
 * - Campaign density (0–20): listing-row density rank / 100 × 20
 * - Category / product affinity (0–10)
 * - GI product signal (0–7)
 * - Award presence (0–3)
 * - LoomOS soft signal (0–5): open requirements in that state
 */
export function scoreGovCluster(
  entry: GovWeaversClusterEntry,
  input: ClusterMatchInput,
  openInState: number,
): { score: number; reasons: ClusterMatchReason[]; loomOsOpen: number } {
  const reasons: ClusterMatchReason[] = [];
  const wantState = normalizeState(input.region);
  const entryState = normalizeState(entry.state);
  const wantDistrict = (input.district ?? "").trim().toLowerCase();
  const entryDistrict = (
    entry.loomOsCluster ||
    entry.district ||
    entry.societyName
  )
    .trim()
    .toLowerCase();

  let geo = 12;
  let geoDetail = `Other state (${entry.state}) — still listed in DC(HL) Weavers Database.`;
  if (wantState && entryState.toLowerCase() === wantState.toLowerCase()) {
    geo = 28;
    geoDetail = `Same state as requirement (${entry.state}).`;
    if (wantDistrict && entryDistrict === wantDistrict) {
      geo = 40;
      geoDetail = `District / cluster match: ${entry.district}.`;
    } else if (wantDistrict) {
      geo = 30;
      geoDetail = `Same state (${entry.state}); district differs from “${input.district}”.`;
    }
  }
  reasons.push({
    id: "geo",
    label: "Geographic fit",
    points: geo,
    detail: geoDetail,
  });

  const listing = 15;
  const listed = entry.weaverCount ?? 0;
  reasons.push({
    id: "listing",
    label: "Official campaign listing",
    points: listing,
    detail:
      listed > 0
        ? `${societyTypeLabel(entry.societyType)} “${entry.societyName}” — ${listed} district-matched campaign listing row(s) in the Weavers Database PDF.`
        : `${societyTypeLabel(entry.societyType)} “${entry.societyName}” appears in the LoomOS hub seed mapped to DC(HL) Weavers Database coverage.`,
  });

  const density = clamp100((entry.densityWeight / 100) * 20);
  reasons.push({
    id: "density",
    label: "Campaign listing density",
    points: density,
    detail:
      listed > 0
        ? `${listed} matched listing row(s); within-state density rank ${entry.densityWeight}/100 → ${density} pts. Campaign showcase — not a census headcount.`
        : `Soft state-level density floor ${entry.densityWeight}/100 → ${density} pts (no district row match). Not a census headcount.`,
  });

  const hints = entry.categoryHints ?? [];
  const products = entry.products ?? [];
  const catHit = hints.includes(input.categoryId);
  const catPts = catHit ? 10 : products.length > 0 ? 4 : 3;
  reasons.push({
    id: "category",
    label: "Category / product affinity",
    points: catPts,
    detail: catHit
      ? `Cluster products/hints include ${categoryLabel(input.categoryId)}${
          products[0] ? ` (e.g. ${products[0]})` : ""
        }.`
      : products.length > 0
        ? `Listed products (${products.slice(0, 2).join(", ")}) — no strong hint for ${categoryLabel(input.categoryId)}.`
        : `No strong hint for ${categoryLabel(input.categoryId)} — small baseline only.`,
  });

  const giCount = entry.giProductCount ?? 0;
  const giPts = giCount > 0 ? Math.min(7, 4 + Math.min(3, giCount)) : 0;
  if (giPts > 0) {
    reasons.push({
      id: "gi",
      label: "GI product signal",
      points: giPts,
      detail: `${giCount} campaign row(s) marked as GI product for this hub.`,
    });
  }

  const awards = entry.awardCount ?? 0;
  const awardPts = awards > 0 ? Math.min(3, 1 + Math.min(2, awards > 3 ? 2 : 1)) : 0;
  if (awardPts > 0) {
    reasons.push({
      id: "award",
      label: "Award presence",
      points: awardPts,
      detail: `${awards} listing row(s) note National / Sant Kabir / merit awards.`,
    });
  }

  const loomOsOpen = openInState;
  const soft = clamp100(Math.min(5, openInState * 2));
  reasons.push({
    id: "loomos",
    label: "LoomOS open demand (soft)",
    points: soft,
    detail:
      openInState === 0
        ? "No open LoomOS buyer requirements in this state right now."
        : `${openInState} open LoomOS requirement(s) in ${entry.state} (app store — separate from gov list).`,
  });

  const score = clamp100(
    geo + listing + density + catPts + giPts + awardPts + soft,
  );
  return { score, reasons, loomOsOpen };
}

export async function matchOfficialClusters(
  input: ClusterMatchInput,
): Promise<ClusterMatchPayload> {
  const seed = await loadGovWeaversClusters();
  const limit = Math.min(20, Math.max(1, input.limit ?? 8));
  const openReqs = await listOpenRequirements();

  const openByState = new Map<string, number>();
  for (const r of openReqs) {
    if (r.categoryId !== input.categoryId) continue;
    const s = normalizeState(r.region).toLowerCase();
    openByState.set(s, (openByState.get(s) ?? 0) + 1);
  }

  const scored = seed.entries.map((entry) => {
    const openInState =
      openByState.get(normalizeState(entry.state).toLowerCase()) ?? 0;
    const { score, reasons, loomOsOpen } = scoreGovCluster(
      entry,
      input,
      openInState,
    );
    return {
      score,
      reasons,
      loomOsOpen,
      entry,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const bw = (b.entry.weaverCount ?? 0) - (a.entry.weaverCount ?? 0);
    if (bw !== 0) return bw;
    return b.entry.densityWeight - a.entry.densityWeight;
  });

  const results: ClusterMatchResult[] = scored.slice(0, limit).map((row, i) => ({
    rank: i + 1,
    score: row.score,
    entry: row.entry,
    cooperativeId: coopIdForGovEntry(row.entry),
    societyTypeLabel: societyTypeLabel(row.entry.societyType),
    reasons: row.reasons,
    sourceChip: GOV_WEAVERS_SOURCE_CHIP,
    loomOsOpenRequirements: row.loomOsOpen,
  }));

  return {
    query: {
      categoryId: input.categoryId,
      categoryLabel: categoryLabel(input.categoryId),
      region: normalizeState(input.region),
      district: input.district ? String(input.district) : null,
      quantity: input.quantity != null ? Number(input.quantity) : null,
      neededBy: input.neededBy ? String(input.neededBy) : null,
    },
    meta: seed.meta,
    sourceChip: GOV_WEAVERS_SOURCE_CHIP,
    formulaNote:
      "Score = Geographic fit (≤40) + Official campaign listing (15) + Campaign listing density (≤20) + Category/product (≤10) + GI (≤7) + Awards (≤3) + LoomOS soft signal (≤5), clamped to 100.",
    results,
  };
}
