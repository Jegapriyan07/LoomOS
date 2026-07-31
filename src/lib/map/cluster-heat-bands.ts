/** Client-safe cluster heat types + band helpers (no Node/fs). */

import type { DemandCategoryId } from "@/lib/demand/types";

export type ClusterHeatBand = "low" | "mid" | "high" | "hot";
export type ClusterHeatScope = "national" | "state";
export type ClusterHeatSocietyType =
  | "cooperative"
  | "pc"
  | "individual_aggregate";

export function densityBand(weight: number): ClusterHeatBand {
  if (weight >= 85) return "hot";
  if (weight >= 70) return "high";
  if (weight >= 50) return "mid";
  return "low";
}

export function bandColor(band: ClusterHeatBand): {
  fill: string;
  stroke: string;
} {
  switch (band) {
    case "hot":
      return { fill: "#8f2f2f", stroke: "#3c2415" };
    case "high":
      return { fill: "#c4920a", stroke: "#3c2415" };
    case "mid":
      return { fill: "#e0b45a", stroke: "#8a6a28" };
    case "low":
      return { fill: "#f5e6b8", stroke: "#a89060" };
  }
}

export type GovClusterHeatHub = {
  id: string;
  state: string;
  district: string;
  societyName: string;
  loomOsCluster: string;
  societyType: ClusterHeatSocietyType;
  societyTypeLabel: string;
  densityWeight: number;
  /** 0–1 for leaflet.heat */
  weight: number;
  band: ClusterHeatBand;
  categoryHints: DemandCategoryId[];
  weaverCount: number | null;
  lat: number;
  lng: number;
  sourceNote: string;
  asOf: string;
};

export type GovClusterStateRollup = {
  state: string;
  lat: number;
  lng: number;
  hubCount: number;
  avgDensity: number;
  maxDensity: number;
  weight: number;
  band: ClusterHeatBand;
  cooperativeCount: number;
  pcCount: number;
};

export type GovClusterHeatPayload = {
  scope: ClusterHeatScope;
  region: string | null;
  hubs: GovClusterHeatHub[];
  stateRollups: GovClusterStateRollup[];
  stats: {
    hubCount: number;
    stateCount: number;
    avgDensity: number;
    maxDensity: number;
    topHub: string | null;
    cooperativeCount: number;
    pcCount: number;
  };
  meta: {
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
  disclaimer: string;
};
