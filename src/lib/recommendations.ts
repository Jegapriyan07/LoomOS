import { getWeaverById } from "@/lib/auth/identity";
import type { Recommendation } from "@/lib/types";
import {
  getLedgerOrders,
  getManualTrend,
  listOpenRequirements,
} from "@/lib/demand/store";
import { scoreCategory } from "@/lib/demand/scoring";
import {
  DEMAND_CATEGORIES,
  DEMAND_WEIGHTS,
  type DemandCategoryId,
  type ScoredCategory,
} from "@/lib/demand/types";

/**
 * Real Decision Copilot recommendation — Stage 3.
 * Demand Score = 0.5×Buyer + 0.3×Seasonal + 0.2×Historical
 * Every factor carries named raw inputs for the Why? panel.
 */
export async function getTodaysRecommendation(
  weaverId: string,
): Promise<Recommendation> {
  const weaver = await getWeaverById(weaverId);
  if (!weaver) {
    throw new Error("Unknown weaver");
  }

  const categories = DEMAND_CATEGORIES.map((c) => c.id) as DemandCategoryId[];
  const openReqs = await listOpenRequirements({ region: weaver.region });

  const scored: ScoredCategory[] = [];
  for (const categoryId of categories) {
    const ledgerOrders = await getLedgerOrders(categoryId, weaver.region);
    const manualTrend = await getManualTrend(categoryId, weaver.region);
    scored.push(
      scoreCategory({
        categoryId,
        region: weaver.region,
        requirements: openReqs,
        ledgerOrders,
        manualTrend,
      }),
    );
  }

  scored.sort((a, b) => b.demandScore - a.demandScore);
  const top = scored[0];

  const seasonal = top.factors.find((f) => f.id === "seasonal");
  const festivalName =
    seasonal?.inputs.find((i) => i.name === "Nearest relevant event")?.value ??
    null;
  const daysUntilRaw = seasonal?.inputs.find(
    (i) => i.name === "Days until start",
  )?.value;
  const daysUntil = daysUntilRaw ? Number(daysUntilRaw) : null;

  let startHint = "when you are ready";
  if (daysUntil !== null && Number.isFinite(daysUntil)) {
    if (daysUntil <= 21) startHint = "within the next three days";
    else if (daysUntil <= 45) startHint = "within the next two weeks";
    else startHint = "in the coming weeks";
  }

  const festivalClause =
    festivalName &&
    festivalName !== "None upcoming in seeded public calendar"
      ? ` Demand looks stronger ahead of ${festivalName}.`
      : "";

  const action = `${top.categoryLabel}s look like your strongest match right now (demand score ${top.demandScore} of 100).${festivalClause} Start production ${startHint}.`;

  const reasonFactors = top.factors.map((f) => {
    const weightPct = Math.round(f.weight * 100);
    return `${f.label} (weight ${weightPct}%): raw ${f.rawScore}/100 → contributes ${f.weightedContribution} points. ${f.note ?? ""}`.trim();
  });

  return {
    weaverId: weaver.id,
    categoryId: top.categoryId,
    categoryLabel: top.categoryLabel,
    action,
    demandScore: top.demandScore,
    factors: top.factors,
    allCategoryScores: scored.map((s) => ({
      categoryId: s.categoryId,
      categoryLabel: s.categoryLabel,
      demandScore: s.demandScore,
    })),
    reasonFactors,
    formulaSummary: `Demand Score = ${DEMAND_WEIGHTS.buyer}×Buyer + ${DEMAND_WEIGHTS.seasonal}×Seasonal + ${DEMAND_WEIGHTS.historical}×Historical`,
    generatedAt: new Date().toISOString(),
  };
}

export function listDemandCategories() {
  return DEMAND_CATEGORIES;
}
