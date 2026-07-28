/**
 * Starter data models for LoomOS weaver-facing flows.
 */

import type {
  DemandCategoryId,
  DemandFactorBreakdown,
} from "@/lib/demand/types";
import { DEMO_WEAVER_PROFILE } from "@/lib/demo/cluster";

export type Weaver = {
  id: string;
  name: string;
  primaryLanguage: "ta" | "te" | "kn" | "hi" | "en" | "bn" | "as";
  region: string;
  categories: string[];
  /** Fictional demo cluster name when in Demo Mode */
  cooperativeName?: string;
};

export type Recommendation = {
  weaverId: string;
  categoryId: DemandCategoryId;
  categoryLabel: string;
  /** Spoken-style guidance */
  action: string;
  demandScore: number;
  factors: DemandFactorBreakdown[];
  allCategoryScores: {
    categoryId: DemandCategoryId;
    categoryLabel: string;
    demandScore: number;
  }[];
  /** Plain-language + numeric summaries for Why? */
  reasonFactors: string[];
  formulaSummary: string;
  generatedAt: string;
};

/**
 * Demo weaver — fictional profile for Nila Loom Circle (Demo Cluster).
 * Not a real person; not a live profile feed.
 */
export const DEMO_WEAVER: Weaver = {
  id: DEMO_WEAVER_PROFILE.id,
  name: DEMO_WEAVER_PROFILE.name,
  primaryLanguage: DEMO_WEAVER_PROFILE.primaryLanguage,
  region: DEMO_WEAVER_PROFILE.region,
  categories: [...DEMO_WEAVER_PROFILE.categories],
  cooperativeName: DEMO_WEAVER_PROFILE.cooperativeName,
};
