/**
 * DC (Handlooms) Weavers Database — curated loader.
 * Source: https://handlooms.nic.in/weavers_database.php
 * Demo / curated seed — not a live government API.
 */

import { promises as fs } from "fs";
import path from "path";
import { coopIdForCluster, normalizeCluster, normalizeState } from "@/lib/auth/regions";
import type { DemandCategoryId } from "@/lib/demand/types";

export type GovSocietyType = "cooperative" | "pc" | "individual_aggregate";

export type GovWeaversClusterEntry = {
  id: string;
  state: string;
  district: string;
  societyName: string;
  societyType: GovSocietyType;
  /** Maps onto STATE_CLUSTERS / register coop name */
  loomOsCluster: string;
  /** Official headcount when known; usually null in this curated seed */
  weaverCount: number | null;
  /**
   * Demo ranking weight 0–100 from campaign list coverage — not a census
   * headcount. Always labeled in UI.
   */
  densityWeight: number;
  categoryHints: DemandCategoryId[];
  sourceUrl: string;
  sourceNote: string;
  asOf: string;
};

export type GovWeaversClusterMeta = {
  title: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceNote: string;
  asOf: string;
  disclaimer: string;
  coverage?: {
    states: number;
    hubs: number;
    note: string;
  };
};

export type GovWeaversClusterSeed = {
  meta: GovWeaversClusterMeta;
  entries: GovWeaversClusterEntry[];
};

const SEED_PATH = path.join(
  process.cwd(),
  "data",
  "gov-weavers-clusters.json",
);

let cached: GovWeaversClusterSeed | null = null;

export async function loadGovWeaversClusters(): Promise<GovWeaversClusterSeed> {
  if (cached) return cached;
  const raw = await fs.readFile(SEED_PATH, "utf8");
  const parsed = JSON.parse(raw) as GovWeaversClusterSeed;
  cached = parsed;
  return parsed;
}

/** Sync access after warm — prefer loadGovWeaversClusters in API routes. */
export function getGovWeaversMeta(
  seed: GovWeaversClusterSeed,
): GovWeaversClusterMeta {
  return seed.meta;
}

export function societyTypeLabel(type: GovSocietyType): string {
  switch (type) {
    case "cooperative":
      return "Co-operative society";
    case "pc":
      return "Producer company";
    case "individual_aggregate":
      return "Individual weavers (aggregate)";
  }
}

export function findGovListingForCluster(
  seed: GovWeaversClusterSeed,
  stateRaw: string,
  clusterRaw: string,
): GovWeaversClusterEntry | null {
  const state = normalizeState(stateRaw);
  const cluster = normalizeCluster(state, clusterRaw);
  const hit = seed.entries.find((e) => {
    const eState = normalizeState(e.state);
    const eCluster = normalizeCluster(
      eState,
      e.loomOsCluster || e.district || e.societyName,
    );
    return (
      eState.toLowerCase() === state.toLowerCase() &&
      eCluster.toLowerCase() === cluster.toLowerCase()
    );
  });
  return hit ?? null;
}

export function coopIdForGovEntry(entry: GovWeaversClusterEntry): string {
  return coopIdForCluster(
    normalizeState(entry.state),
    entry.loomOsCluster || entry.district || entry.societyName,
  );
}

export const GOV_WEAVERS_SOURCE_CHIP =
  "Source: DC (Handlooms) Weavers Database (curated)";
