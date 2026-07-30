/**
 * Master Weaver Knowledge — standee third input pillar.
 * Curated heuristics (not ML). Seeded for Demo Mode; labeled as expert rules.
 */

import type { DemandCategoryId } from "@/lib/demand/types";

export type MasterWeaverRule = {
  id: string;
  categoryId: DemandCategoryId;
  /** Regions this wisdom applies to (or "India") */
  regions: string[];
  /** 0–100 preference score for this category in season context */
  preferenceScore: number;
  tradition: string;
  timingWisdom: string;
  riskAvoidance: string;
};

/** Fictional-but-plausible co-op craft wisdom for the pitch demo. */
export const MASTER_WEAVER_RULES: MasterWeaverRule[] = [
  {
    id: "mw-cotton-fest",
    categoryId: "cotton-saree",
    regions: ["Delhi", "Tamil Nadu", "India"],
    preferenceScore: 78,
    tradition:
      "Cotton sarees move faster before regional festivals when buyers restock everyday wear.",
    timingWisdom:
      "Start cotton lots 3–4 weeks before the nearest festival so finishing and dispatch fit.",
    riskAvoidance:
      "Avoid over-producing heavy zari cotton when yarn prices spike — keep simpler borders.",
  },
  {
    id: "mw-silk-wedding",
    categoryId: "silk-saree",
    regions: ["Delhi", "Tamil Nadu", "India"],
    preferenceScore: 72,
    tradition:
      "Silk with zari holds wedding and gift demand; master weavers pace complex pieces.",
    timingWisdom:
      "Begin silk early — complex pieces need longer loom time than cotton.",
    riskAvoidance:
      "Do not start a second complex silk if one is already mid-loom with escrow held.",
  },
  {
    id: "mw-stole-gift",
    categoryId: "stole-dupatta",
    regions: ["Delhi", "Tamil Nadu", "India"],
    preferenceScore: 70,
    tradition:
      "Stoles and dupattas fill gift-set and exhibition demand with shorter cycles.",
    timingWisdom:
      "Good filler work between saree lots — finish in days, not weeks.",
    riskAvoidance:
      "Keep a small finished stock; do not pile unfinished stoles without a buyer signal.",
  },
  {
    id: "mw-dhoti-temple",
    categoryId: "dhoti-angavastram",
    regions: ["Delhi", "Tamil Nadu", "India"],
    preferenceScore: 68,
    tradition:
      "Temple and ceremonial seasons lift dhoti / angavastram orders in the region.",
    timingWisdom:
      "Align start dates with temple-calendar peaks when buyers post needed-by dates.",
    riskAvoidance:
      "Prefer confirmed buyer quantities over speculative temple stock.",
  },
];

export function masterRulesFor(
  categoryId: DemandCategoryId,
  region: string,
): MasterWeaverRule[] {
  const r = region.toLowerCase();
  return MASTER_WEAVER_RULES.filter(
    (rule) =>
      rule.categoryId === categoryId &&
      rule.regions.some(
        (reg) => reg.toLowerCase() === "india" || reg.toLowerCase() === r,
      ),
  );
}

/**
 * Master Weaver Knowledge signal 0–100 from matching expert rules.
 */
export function computeMasterWeaverSignal(
  categoryId: DemandCategoryId,
  region: string,
): {
  score: number;
  tradition: string | null;
  timingWisdom: string | null;
  riskAvoidance: string | null;
  ruleIds: string[];
} {
  const rules = masterRulesFor(categoryId, region);
  if (rules.length === 0) {
    return {
      score: 0,
      tradition: null,
      timingWisdom: null,
      riskAvoidance: null,
      ruleIds: [],
    };
  }
  const score = Math.round(
    rules.reduce((s, rule) => s + rule.preferenceScore, 0) / rules.length,
  );
  const top = rules.sort((a, b) => b.preferenceScore - a.preferenceScore)[0]!;
  return {
    score,
    tradition: top.tradition,
    timingWisdom: top.timingWisdom,
    riskAvoidance: top.riskAvoidance,
    ruleIds: rules.map((r) => r.id),
  };
}
