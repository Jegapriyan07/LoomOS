/**
 * Starter data models for LoomOS weaver-facing flows.
 */

import type {
  DemandCategoryId,
  DemandFactorBreakdown,
  DailyAction,
  EngineReasonTag,
} from "@/lib/demand/types";
import type { DriftScoreResult } from "@/lib/demand/drift";
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
  /** Standee-style checkmark reasons */
  reasonTags: EngineReasonTag[];
  /** Daily Action Plan — What should I do today? */
  dailyActions: DailyAction[];
  /**
   * Drift score — intelligence accuracy of this advice (0–100%).
   * Below 90% → weavers should think carefully before acting.
   */
  drift: DriftScoreResult;
};

/**
 * Demo weaver — fictional profile for IIT Delhi cluster.
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
