import { cookies } from "next/headers";
import { getWeaverById } from "@/lib/auth/identity";
import type { Recommendation } from "@/lib/types";
import {
  getLedgerOrders,
  getManualTrend,
  getWeaverStock,
  listOpenRequirements,
  listPaymentOrders,
} from "@/lib/demand/store";
import { scoreCategory } from "@/lib/demand/scoring";
import { computeMarketExtraSignal } from "@/lib/demand/market-signals";
import { computeMasterWeaverSignal } from "@/lib/demand/master-weaver";
import {
  stockReadinessScore,
  yarnReadyFor,
} from "@/lib/demand/stock";
import { computeDriftScore } from "@/lib/demand/drift";
import {
  DEMAND_CATEGORIES,
  DEMAND_WEIGHTS,
  type DailyAction,
  type DemandCategoryId,
  type EngineReasonTag,
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

function buildReasonTags(args: {
  seasonalRaw: number;
  buyerRaw: number;
  historicalRaw: number;
  market: ReturnType<typeof computeMarketExtraSignal>;
  masterScore: number;
}): EngineReasonTag[] {
  return [
    {
      id: "festival",
      label: "Festival Approaching",
      active: args.seasonalRaw >= 40,
    },
    {
      id: "local_demand",
      label: "Local Demand Increasing",
      active: args.buyerRaw >= 30,
    },
    {
      id: "yarn",
      label: "Stable Yarn Prices",
      active: args.market.yarnStable,
    },
    {
      id: "historical",
      label: "Historical Demand",
      active: args.historicalRaw >= 20,
    },
    {
      id: "expert",
      label: "Expert Weaver Knowledge",
      active: args.masterScore >= 50,
    },
  ];
}

function buildDailyActions(args: {
  categoryId: string;
  categoryLabel: string;
  startWhen: "ready" | "3days" | "2weeks" | "weeks";
  yarnKg: number;
  yarnReady: boolean;
  hasOpenOrders: boolean;
  pendingPayment: boolean;
}): DailyAction[] {
  const whenEn = {
    ready: "when you are ready",
    "3days": "within the next three days",
    "2weeks": "within the next two weeks",
    weeks: "in the coming weeks",
  }[args.startWhen];
  const silk = args.categoryId === "silk-saree";
  const actions: DailyAction[] = [];
  if (args.hasOpenOrders) {
    actions.push({
      id: "orders",
      label: "Check open buyer requirements in your region (Orders tab)",
      href: "/orders",
    });
  }
  actions.push({
    id: "weave",
    label: `Plan ${args.categoryLabel} — start ${whenEn}`,
    href: "/plan",
    vars: { categoryId: args.categoryId, when: args.startWhen },
  });
  if (silk) {
    actions.push({
      id: args.yarnReady ? "yarn_silk_ok" : "yarn_silk_low",
      label: args.yarnReady
        ? `Silk yarn on hand: ${args.yarnKg} kg`
        : `Silk yarn low (${args.yarnKg} kg) — buy before starting`,
      href: "/plan",
      vars: { kg: args.yarnKg },
    });
  } else {
    actions.push({
      id: args.yarnReady ? "yarn_cotton_ok" : "yarn_cotton_low",
      label: args.yarnReady
        ? `Cotton yarn on hand: ${args.yarnKg} kg`
        : `Cotton yarn low (${args.yarnKg} kg) — buy before starting`,
      href: "/plan",
      vars: { kg: args.yarnKg },
    });
  }
  if (args.pendingPayment) {
    actions.push({
      id: "money",
      label: "Review money coming your way / escrow status",
      href: "/money",
    });
  } else {
    actions.push({
      id: "money_quiet",
      label: "No urgent payment action — keep production on track",
      href: "/money",
    });
  }
  return actions.slice(0, 4);
}

/**
 * Decision Copilot — standee engine: Market + Business + Master Weaver → advice.
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
  const stock = await getWeaverStock(weaverId);
  const orders = await listPaymentOrders({ weaverId });
  const district =
    weaver.categories
      .map((c) => /^district:(.+)$/i.exec(c.trim())?.[1]?.trim())
      .find(Boolean) ?? null;

  const scored: ScoredCategory[] = [];
  for (const categoryId of preferred) {
    const ledgerOrders = await getLedgerOrders(categoryId, weaver.region);
    const manualTrend = await getManualTrend(categoryId, weaver.region);
    const result = scoreCategory({
      categoryId,
      region: weaver.region,
      district,
      requirements: openReqs,
      ledgerOrders,
      manualTrend,
    });
    // Stock readiness soft nudge (±5) — business signal
    const stockBoost = Math.round((stockReadinessScore(stock, categoryId) - 50) / 20);
    const jitter = (salt + categoryId.length * 17) % 13 - 6;
    scored.push({
      ...result,
      demandScore: Math.max(
        0,
        Math.min(100, result.demandScore + jitter + stockBoost),
      ),
    });
  }

  scored.sort((a, b) => b.demandScore - a.demandScore);
  let top = scored[0]!;
  if (scored.length > 1 && Math.abs(scored[0]!.demandScore - scored[1]!.demandScore) <= 8) {
    top = scored[salt % 2]!;
  }

  const seasonal = top.factors.find((f) => f.id === "seasonal");
  const buyer = top.factors.find((f) => f.id === "buyer");
  const historical = top.factors.find((f) => f.id === "historical");
  const festivalName =
    seasonal?.inputs.find((i) => i.name === "Nearest relevant event")?.value ??
    null;
  const daysUntilRaw = seasonal?.inputs.find(
    (i) => i.name === "Days until start",
  )?.value;
  const daysUntil = daysUntilRaw ? Number(daysUntilRaw) : null;

  const hintOpts = ["ready", "3days", "2weeks", "weeks"] as const;
  let startWhen: (typeof hintOpts)[number] = hintOpts[salt % hintOpts.length]!;
  if (daysUntil !== null && Number.isFinite(daysUntil)) {
    if (daysUntil <= 21) startWhen = "3days";
    else if (daysUntil <= 45) startWhen = "2weeks";
    else startWhen = "weeks";
  }

  const startHintEn = {
    ready: "when you are ready",
    "3days": "within the next three days",
    "2weeks": "within the next two weeks",
    weeks: "in the coming weeks",
  }[startWhen];

  const festivalClause =
    festivalName &&
    festivalName !== "None upcoming in seeded public calendar"
      ? ` Demand looks stronger ahead of ${festivalName}.`
      : "";

  const market = computeMarketExtraSignal(top.categoryId, weaver.region);
  const master = computeMasterWeaverSignal(top.categoryId, weaver.region);
  const yarn = yarnReadyFor(stock, top.categoryId);
  const yarnKg =
    top.categoryId === "silk-saree" ? stock.yarnSilkKg : stock.yarnCottonKg;

  const spokenAction = `${top.categoryLabel}s look like your strongest match right now (demand score ${top.demandScore} of 100).${festivalClause} Start production ${startHintEn}.`;

  const reasonTags = buildReasonTags({
    seasonalRaw: seasonal?.rawScore ?? 0,
    buyerRaw: buyer?.rawScore ?? 0,
    historicalRaw: historical?.rawScore ?? 0,
    market,
    masterScore: master.score,
  });

  const activeOrders = orders.filter(
    (o) => o.state !== "settlement_released" && o.state !== "resolved",
  );
  const pendingPayment = activeOrders.some((o) =>
    [
      "advance_paid_escrow_held",
      "dispatched",
      "production_in_progress",
    ].includes(o.state),
  );

  const dailyActions = buildDailyActions({
    categoryId: top.categoryId,
    categoryLabel: top.categoryLabel,
    startWhen,
    yarnKg,
    yarnReady: yarn.ready,
    hasOpenOrders: openReqs.length > 0,
    pendingPayment,
  });

  const reasonFactors = top.factors.map((f) => {
    const weightPct = Math.round(f.weight * 100);
    return `${f.label} (weight ${weightPct}%): raw ${f.rawScore}/100 → contributes ${f.weightedContribution} points. ${f.note ?? ""}`.trim();
  });

  const drift = computeDriftScore({
    weaverId: weaver.id,
    factors: top.factors,
    allCategoryScores: scored.map((s) => ({
      categoryId: s.categoryId,
      demandScore: s.demandScore,
    })),
    topCategoryId: top.categoryId,
    stockReadiness: stockReadinessScore(stock, top.categoryId),
  });

  return {
    weaverId: weaver.id,
    categoryId: top.categoryId,
    categoryLabel: top.categoryLabel,
    action: spokenAction,
    demandScore: top.demandScore,
    factors: top.factors,
    allCategoryScores: scored.map((s) => ({
      categoryId: s.categoryId,
      categoryLabel: s.categoryLabel,
      demandScore: s.demandScore,
    })),
    reasonFactors,
    formulaSummary: `Demand Score = ${DEMAND_WEIGHTS.buyer}×Buyer + ${DEMAND_WEIGHTS.seasonal}×Seasonal + ${DEMAND_WEIGHTS.historical}×Historical + ${DEMAND_WEIGHTS.marketExtra}×Market + ${DEMAND_WEIGHTS.masterWeaver}×MasterWeaver · stock nudge applied`,
    generatedAt: new Date().toISOString(),
    reasonTags,
    dailyActions,
    drift,
  };
}

export function listDemandCategories() {
  return DEMAND_CATEGORIES;
}
