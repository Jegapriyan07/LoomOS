/**
 * Official DC(HL) cluster density heat — geo-joins campaign seed to hub coords.
 * densityWeight = within-state campaign listing density rank — not census.
 */

import {
  loadGovWeaversClusters,
  societyTypeLabel,
  type GovSocietyType,
  type GovWeaversClusterEntry,
} from "@/lib/gov/weavers-database";
import {
  INDIA_MAP_CENTER,
  resolveHub,
  STATE_GEO,
} from "@/lib/map/hub-geo";
import type { DemandCategoryId } from "@/lib/demand/types";
import {
  densityBand,
  type ClusterHeatScope,
  type GovClusterHeatHub,
  type GovClusterHeatPayload,
  type GovClusterStateRollup,
} from "@/lib/map/cluster-heat-bands";

export type {
  ClusterHeatScope,
  GovClusterHeatHub,
  GovClusterHeatPayload,
  GovClusterStateRollup,
} from "@/lib/map/cluster-heat-bands";

function toHub(entry: GovWeaversClusterEntry): GovClusterHeatHub {
  const cluster = entry.loomOsCluster || entry.district || entry.societyName;
  const hub = resolveHub(entry.state, cluster);
  const densityWeight = Math.max(0, Math.min(100, entry.densityWeight));
  return {
    id: entry.id,
    state: entry.state,
    district: entry.district,
    societyName: entry.societyName,
    loomOsCluster: cluster,
    societyType: entry.societyType,
    societyTypeLabel: societyTypeLabel(entry.societyType),
    densityWeight,
    weight: Math.max(0.12, densityWeight / 100),
    band: densityBand(densityWeight),
    categoryHints: entry.categoryHints,
    weaverCount: entry.weaverCount,
    products: entry.products ?? [],
    weaves: entry.weaves ?? [],
    giProductCount: entry.giProductCount ?? 0,
    awardCount: entry.awardCount ?? 0,
    societyNames: entry.societyNames ?? [],
    sourceUrl: entry.sourceUrl,
    lat: hub.lat,
    lng: hub.lng,
    sourceNote: entry.sourceNote,
    asOf: entry.asOf,
  };
}

function rollupStates(hubs: GovClusterHeatHub[]): GovClusterStateRollup[] {
  const byState = new Map<string, GovClusterHeatHub[]>();
  for (const h of hubs) {
    const list = byState.get(h.state) ?? [];
    list.push(h);
    byState.set(h.state, list);
  }

  return [...byState.entries()]
    .map(([state, list]) => {
      const avg =
        list.reduce((s, h) => s + h.densityWeight, 0) / Math.max(1, list.length);
      const maxDensity = Math.max(...list.map((h) => h.densityWeight));
      const geo = STATE_GEO[state] ?? INDIA_MAP_CENTER;
      return {
        state,
        lat: geo.lat,
        lng: geo.lng,
        hubCount: list.length,
        avgDensity: Math.round(avg),
        maxDensity,
        weight: Math.max(0.15, Math.min(1, avg / 100)),
        band: densityBand(avg),
        cooperativeCount: list.filter((h) => h.societyType === "cooperative")
          .length,
        pcCount: list.filter((h) => h.societyType === "pc").length,
      };
    })
    .sort((a, b) => b.avgDensity - a.avgDensity || b.hubCount - a.hubCount);
}

export async function buildGovClusterHeat(opts?: {
  scope?: ClusterHeatScope;
  region?: string | null;
  societyType?: GovSocietyType | "all";
  categoryId?: DemandCategoryId | null;
}): Promise<GovClusterHeatPayload> {
  const seed = await loadGovWeaversClusters();
  const scope: ClusterHeatScope = opts?.scope === "state" ? "state" : "national";
  const region = opts?.region?.trim() || null;
  const societyType = opts?.societyType ?? "all";
  const categoryId = opts?.categoryId ?? null;

  let hubs = seed.entries.map(toHub);

  if (societyType !== "all") {
    hubs = hubs.filter((h) => h.societyType === societyType);
  }
  if (categoryId) {
    hubs = hubs.filter((h) => h.categoryHints.includes(categoryId));
  }
  if (scope === "state" && region) {
    hubs = hubs.filter(
      (h) => h.state.toLowerCase() === region.toLowerCase(),
    );
  }

  hubs = [...hubs].sort(
    (a, b) =>
      b.densityWeight - a.densityWeight ||
      a.societyName.localeCompare(b.societyName),
  );

  /** Always nation-wide rollups (respecting society/category filters) for the state picker. */
  const rollupSource = seed.entries.map(toHub).filter((h) => {
    if (societyType !== "all" && h.societyType !== societyType) return false;
    if (categoryId && !h.categoryHints.includes(categoryId)) return false;
    return true;
  });
  const stateRollups = rollupStates(rollupSource);

  const avgDensity =
    hubs.length === 0
      ? 0
      : Math.round(
          hubs.reduce((s, h) => s + h.densityWeight, 0) / hubs.length,
        );
  const maxDensity =
    hubs.length === 0 ? 0 : Math.max(...hubs.map((h) => h.densityWeight));
  const states = new Set(hubs.map((h) => h.state));

  return {
    scope,
    region: scope === "state" ? region : null,
    hubs,
    stateRollups,
    stats: {
      hubCount: hubs.length,
      stateCount: states.size,
      avgDensity,
      maxDensity,
      topHub: hubs[0]?.societyName ?? null,
      cooperativeCount: hubs.filter((h) => h.societyType === "cooperative")
        .length,
      pcCount: hubs.filter((h) => h.societyType === "pc").length,
    },
    meta: seed.meta,
    disclaimer:
      "Campaign listing density heatmap from DC (Handlooms) Weavers Database PDFs — within-state ranks from matched listing rows, not Fourth Handloom Census headcounts.",
  };
}
