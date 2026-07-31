/**
 * DC (Handlooms) Weavers Database — campaign-enriched loader.
 * Source: https://handlooms.nic.in/weavers_database.php
 * Checked-in seed from public National Handloom Day PDFs — not a live API.
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
  /**
   * Campaign-listed rows matched to this district/hub.
   * Null when the hub has no PDF row match — not a census headcount.
   */
  weaverCount: number | null;
  /**
   * Within-state campaign density rank 0–100 derived from listing-row counts.
   * Always labeled in UI — not an official census headcount.
   */
  densityWeight: number;
  categoryHints: DemandCategoryId[];
  /** Exclusive handloom products from campaign PDF rows */
  products?: string[];
  weaves?: string[];
  techniques?: string[];
  giProductCount?: number;
  awardCount?: number;
  /** Co-op / PC / society names only (no personal contacts) */
  societyNames?: string[];
  listedAgencyRows?: number;
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
    hubsWithListingRows?: number;
    campaignRowsParsed?: number;
    nationalListed?: number;
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

/** Pitch geography labels (e.g. IIT Delhi) — never official DC(HL) heatmap hubs. */
function isPitchOnlyHub(entry: GovWeaversClusterEntry): boolean {
  if (entry.id === "delhi-iit-delhi") return true;
  const label = (
    entry.loomOsCluster ||
    entry.district ||
    entry.societyName ||
    ""
  )
    .toLowerCase()
    .trim();
  return label === "iit delhi" || /^iit\b/.test(label);
}

export async function loadGovWeaversClusters(): Promise<GovWeaversClusterSeed> {
  if (cached) return cached;
  const raw = await fs.readFile(SEED_PATH, "utf8");
  const parsed = JSON.parse(raw) as GovWeaversClusterSeed;
  const entries = parsed.entries.filter((e) => !isPitchOnlyHub(e));
  cached = {
    ...parsed,
    entries,
    meta: {
      ...parsed.meta,
      coverage: parsed.meta.coverage
        ? { ...parsed.meta.coverage, hubs: entries.length }
        : parsed.meta.coverage,
    },
  };
  return cached;
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
  "Source: DC (Handlooms) Weavers Database (campaign PDFs)";
