import { cookies } from "next/headers";
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
import { SIM_EPOCH_COOKIE } from "@/lib/demo/simulate-session";

function hashEpoch(epoch: string): number {
  let h = 0;
  for (let i = 0; i < epoch.length; i++) h = (h * 31 + epoch.charCodeAt(i)) >>> 0;
  return h;
}

/** Map free-text weaver categories → demand ids */
function preferredCategoryIds(labels: string[]): DemandCategoryId[] {
  const ids = new Set<DemandCategoryId>();
  for (const raw of labels) {
    const s = raw.toLowerCase();
    if (s.includes("cotton") && s.includes("saree")) ids.add("cotton-saree");
    else if (s.includes("silk")) ids.add("silk-saree");
    else if (s.includes("stole") || s.includes("dupatta")) ids.add("stole-dupatta");
    else if (s.includes("dhoti") || s.includes("angavastram"))
      ids.add("dhoti-angavastram");
    else if (s.includes("cotton")) ids.add("cotton-saree");
  }
  return ids.size > 0 ? [...ids] : DEMAND_CATEGORIES.map((c) => c.id);
}

/**
 * Decision Copilot — personalized + per-login variation via sim epoch cookie.
 */
export async function getTodaysRecommendation(
  weaverId: string,
): Promise<Recommendation> {
  const weaver = await getWeaverById(weaverId);
  if (!weaver) {
    throw new Error("Unknown weaver");
  }

  const jar = await cookies();
  const epoch = jar.get(SIM_EPOCH_COOKIE)?.value ?? "0";
  const salt = hashEpoch(epoch);

  const preferred = preferredCategoryIds(weaver.categories);
  const openReqs = await listOpenRequirements({ region: weaver.region });

  const scored: ScoredCategory[] = [];
  for (const categoryId of preferred) {
    const ledgerOrders = await getLedgerOrders(categoryId, weaver.region);
    const manualTrend = await getManualTrend(categoryId, weaver.region);
    const result = scoreCategory({
      categoryId,
      region: weaver.region,
      requirements: openReqs,
      ledgerOrders,
      manualTrend,
    });
    // Per-login jitter so advice feels fresh each sign-in (±6 points, stable for epoch)
    const jitter = (salt + categoryId.length * 17) % 13 - 6;
    scored.push({
      ...result,
      demandScore: Math.max(0, Math.min(100, result.demandScore + jitter)),
    });
  }

  scored.sort((a, b) => b.demandScore - a.demandScore);
  // Rotate top pick among close scores using epoch
  let top = scored[0]!;
  if (scored.length > 1 && Math.abs(scored[0]!.demandScore - scored[1]!.demandScore) <= 8) {
    top = scored[salt % 2]!;
  }

  const seasonal = top.factors.find((f) => f.id === "seasonal");
  const festivalName =
    seasonal?.inputs.find((i) => i.name === "Nearest relevant event")?.value ??
    null;
  const daysUntilRaw = seasonal?.inputs.find(
    (i) => i.name === "Days until start",
  )?.value;
  const daysUntil = daysUntilRaw ? Number(daysUntilRaw) : null;

  const hintOpts = [
    "when you are ready",
    "within the next three days",
    "within the next two weeks",
    "in the coming weeks",
  ];
  let startHint = hintOpts[salt % hintOpts.length]!;
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
    formulaSummary: `Demand Score = ${DEMAND_WEIGHTS.buyer}×Buyer + ${DEMAND_WEIGHTS.seasonal}×Seasonal + ${DEMAND_WEIGHTS.historical}×Historical · refreshed for this login`,
    generatedAt: new Date().toISOString(),
  };
}

export function listDemandCategories() {
  return DEMAND_CATEGORIES;
}
