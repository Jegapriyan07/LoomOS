import { parseDateOnly, toDateOnly } from "@/lib/production-defaults";
import { PUBLIC_FESTIVAL_CALENDAR } from "@/lib/demand/public-festivals";
import {
  DEMAND_CATEGORIES,
  DEMAND_WEIGHTS,
  type BuyerRequirement,
  type DemandCategoryId,
  type DemandFactorBreakdown,
  type LedgerOrder,
  type ManualTrendEntry,
  type ScoredCategory,
} from "@/lib/demand/types";

/**
 * Buyer Signal (0–100) — from open Buyer Portal requirements in our DB.
 *
 * Explicit mapping (visible in Why?):
 *   unitsScore = min(60, totalOpenQuantity)
 *   countScore = min(40, openRequirementCount × 15)
 *   BuyerSignal = min(100, unitsScore + countScore)
 */
export function computeBuyerSignal(
  requirements: BuyerRequirement[],
): { score: number; factor: DemandFactorBreakdown } {
  const open = requirements.filter((r) => r.status === "open");
  const totalQty = open.reduce((sum, r) => sum + r.quantity, 0);
  const count = open.length;
  const unitsScore = Math.min(60, totalQty);
  const countScore = Math.min(40, count * 15);
  const score = Math.min(100, unitsScore + countScore);

  return {
    score,
    factor: {
      id: "buyer",
      label: "Buyer signal",
      weight: DEMAND_WEIGHTS.buyer,
      rawScore: score,
      weightedContribution: round1(DEMAND_WEIGHTS.buyer * score),
      inputs: [
        { name: "Open requirements (this category + region)", value: String(count) },
        { name: "Total units requested", value: String(totalQty) },
        {
          name: "Formula",
          value: `min(100, min(60, units) + min(40, count×15)) = ${score}`,
        },
      ],
      note:
        count === 0
          ? "No open buyer requirements in our database for this category and region."
          : "From LoomOS buyer requirements database (Stage 9 portal posts here).",
    },
  };
}

/**
 * Seasonal Proximity (0–100) — closeness to nearest relevant public calendar event.
 *
 * Explicit mapping:
 *   daysUntil = days until event start (upcoming only)
 *   SeasonalProximity = clamp(0, 100, round(100 × (1 − daysUntil / 90)))
 *   → today/start = 100; 90+ days out = 0
 */
export function computeSeasonalProximity(
  categoryId: DemandCategoryId,
  region: string,
  asOf: Date = new Date(),
): { score: number; factor: DemandFactorBreakdown } {
  const today = parseDateOnly(toDateOnly(asOf));
  const relevant = PUBLIC_FESTIVAL_CALENDAR.filter((e) => {
    const regionOk =
      e.regions.some((r) => r.toLowerCase() === "india") ||
      e.regions.some((r) => r.toLowerCase() === region.toLowerCase());
    return regionOk && e.categoryIds.includes(categoryId);
  });

  let best: {
    name: string;
    daysUntil: number;
    startDate: string;
    sourceNote: string;
  } | null = null;

  for (const event of relevant) {
    const start = parseDateOnly(event.startDate);
    const end = parseDateOnly(event.endDate);
    let daysUntil: number;
    if (today >= start && today <= end) {
      daysUntil = 0;
    } else if (today < start) {
      daysUntil = Math.round((start.getTime() - today.getTime()) / 86_400_000);
    } else {
      continue; // past event
    }
    if (!best || daysUntil < best.daysUntil) {
      best = {
        name: event.name,
        daysUntil,
        startDate: event.startDate,
        sourceNote: event.sourceNote,
      };
    }
  }

  if (!best) {
    return {
      score: 0,
      factor: {
        id: "seasonal",
        label: "Seasonal proximity",
        weight: DEMAND_WEIGHTS.seasonal,
        rawScore: 0,
        weightedContribution: 0,
        inputs: [
          {
            name: "Nearest relevant festival",
            value: "None upcoming in seeded public calendar",
          },
        ],
        note: "Source: public calendar (hardcoded seed).",
      },
    };
  }

  const score = clamp(
    0,
    100,
    Math.round(100 * (1 - best.daysUntil / 90)),
  );

  return {
    score,
    factor: {
      id: "seasonal",
      label: "Seasonal proximity",
      weight: DEMAND_WEIGHTS.seasonal,
      rawScore: score,
      weightedContribution: round1(DEMAND_WEIGHTS.seasonal * score),
      inputs: [
        { name: "Nearest relevant event", value: best.name },
        { name: "Event start", value: best.startDate },
        { name: "Days until start", value: String(best.daysUntil) },
        {
          name: "Formula",
          value: `clamp(0,100, round(100×(1−days/90))) = ${score}`,
        },
        { name: "Calendar source", value: best.sourceNote },
      ],
      note: "Source: public calendar (hardcoded).",
    },
  };
}

/**
 * Historical Signal (0–100):
 *   1) Cooperative ledger past orders for category+region, if any
 *   2) Else manual regional interest (hand-refreshed from public Google Trends site)
 *   3) Else 0 — never fabricate
 *
 * Ledger mapping (when present):
 *   Historical = min(100, totalLedgerUnits)
 *   (simple, transparent; co-op can replace via CSV)
 */
export function computeHistoricalSignal(
  ledgerOrders: LedgerOrder[],
  manualTrend: ManualTrendEntry | null,
): { score: number; factor: DemandFactorBreakdown } {
  if (ledgerOrders.length > 0) {
    const totalUnits = ledgerOrders.reduce((s, o) => s + o.quantity, 0);
    const score = Math.min(100, totalUnits);
    return {
      score,
      factor: {
        id: "historical",
        label: "Historical signal",
        weight: DEMAND_WEIGHTS.historical,
        rawScore: score,
        weightedContribution: round1(DEMAND_WEIGHTS.historical * score),
        inputs: [
          { name: "Ledger orders (category + region)", value: String(ledgerOrders.length) },
          { name: "Total units in ledger", value: String(totalUnits) },
          {
            name: "Formula",
            value: `min(100, total ledger units) = ${score}`,
          },
          {
            name: "Manual regional interest on file",
            value: manualTrend
              ? `${manualTrend.interestScore} (not used — ledger takes priority)`
              : "None",
          },
        ],
        note: "From cooperative ledger CSV upload.",
      },
    };
  }

  if (manualTrend) {
    const score = clamp(0, 100, Math.round(manualTrend.interestScore));
    const refreshed = new Date(manualTrend.lastRefreshedAt).toLocaleDateString(
      "en-IN",
      { day: "numeric", month: "short", year: "numeric" },
    );
    return {
      score,
      factor: {
        id: "historical",
        label: "Historical signal",
        weight: DEMAND_WEIGHTS.historical,
        rawScore: score,
        weightedContribution: round1(DEMAND_WEIGHTS.historical * score),
        inputs: [
          {
            name: "Cooperative ledger orders",
            value: "None uploaded — ledger score not used",
          },
          {
            name: "Regional interest (manual)",
            value: String(score),
          },
          {
            name: "Manual update label",
            value: `Manually updated — last refreshed ${refreshed}`,
          },
          {
            name: "Refreshed by",
            value: manualTrend.refreshedBy || "team",
          },
        ],
        note: "Manually updated from the public Google Trends website — not a live Trends API feed.",
      },
    };
  }

  return {
    score: 0,
    factor: {
      id: "historical",
      label: "Historical signal",
      weight: DEMAND_WEIGHTS.historical,
      rawScore: 0,
      weightedContribution: 0,
      inputs: [
        { name: "Cooperative ledger orders", value: "None uploaded" },
        { name: "Manual regional interest", value: "None entered" },
        { name: "Formula result", value: "0 — no historical data on file" },
      ],
      note: "Left at 0 honestly — no ledger CSV and no manual interest value. Not fabricated.",
    },
  };
}

export function scoreCategory(args: {
  categoryId: DemandCategoryId;
  region: string;
  requirements: BuyerRequirement[];
  ledgerOrders: LedgerOrder[];
  manualTrend: ManualTrendEntry | null;
  asOf?: Date;
}): ScoredCategory {
  const { categoryId, region, requirements, ledgerOrders, manualTrend, asOf } =
    args;
  const label =
    DEMAND_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;

  const buyer = computeBuyerSignal(
    requirements.filter(
      (r) =>
        r.categoryId === categoryId &&
        r.region.toLowerCase() === region.toLowerCase(),
    ),
  );
  const seasonal = computeSeasonalProximity(categoryId, region, asOf);
  const historical = computeHistoricalSignal(ledgerOrders, manualTrend);

  const demandScore = Math.round(
    DEMAND_WEIGHTS.buyer * buyer.score +
      DEMAND_WEIGHTS.seasonal * seasonal.score +
      DEMAND_WEIGHTS.historical * historical.score,
  );

  return {
    categoryId,
    categoryLabel: label,
    demandScore: clamp(0, 100, demandScore),
    factors: [buyer.factor, seasonal.factor, historical.factor],
  };
}

function clamp(min: number, max: number, n: number): number {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
