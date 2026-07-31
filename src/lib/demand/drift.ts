/**
 * Drift Score — intelligence accuracy of today's advice (0–100%).
 *
 * Demand score answers "what looks strong." Drift score answers
 * "how much should the weaver trust that advice right now?"
 *
 * Formula (also shown in UI):
 *   Drift% = round(
 *     0.30×SignalAgreement +
 *     0.25×BuyerCoverage +
 *     0.20×HistoricalDepth +
 *     0.15×CategoryClarity +
 *     0.10×StockAlignment
 *   )
 *
 * Below DRIFT_THINK_THRESHOLD (90) → weavers should pause and think
 * before committing yarn / production time.
 *
 * Demo pins (simulated for pitch — tagged Demo / Simulated in UI):
 *   Kavita (weaver-demo-001, South Indian) → ≥90 band
 *   Selvi (weaver-demo-002, South Indian) → ~70 band with explicit why-low + mindfulness
 */

import type { DemandFactorBreakdown, DemandCategoryId } from "@/lib/demand/types";

export const DRIFT_THINK_THRESHOLD = 90;

export const DRIFT_WEIGHTS = {
  signalAgreement: 0.3,
  buyerCoverage: 0.25,
  historicalDepth: 0.2,
  categoryClarity: 0.15,
  stockAlignment: 0.1,
} as const;

export type DriftFactorId = keyof typeof DRIFT_WEIGHTS;

export type DriftFactor = {
  id: DriftFactorId;
  label: string;
  weight: number;
  /** Component score 0–100 before weighting */
  rawScore: number;
  /** weight × rawScore contribution toward 0–100 total */
  weightedContribution: number;
  note: string;
};

export type DriftScoreResult = {
  percentage: number;
  belowThreshold: boolean;
  threshold: number;
  factors: DriftFactor[];
  formulaSummary: string;
  /** Empty when ≥ threshold */
  whyLow: string[];
  /** What weavers should keep in mind when below threshold */
  weaverMindfulness: string[];
  /** True when demo login forced a pitch band */
  simulated: boolean;
  simulatedNote?: string;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function factorRaw(
  factors: DemandFactorBreakdown[],
  id: string,
): number {
  return factors.find((f) => f.id === id)?.rawScore ?? 0;
}

/** Low spread across demand factors → high agreement. */
function signalAgreementScore(factors: DemandFactorBreakdown[]): {
  score: number;
  note: string;
} {
  if (factors.length === 0) {
    return { score: 40, note: "No demand factors available yet." };
  }
  const values = factors.map((f) => f.rawScore);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdev = Math.sqrt(variance);
  // stdev 0 → 100; stdev ≥ 40 → ~0
  const score = clamp100(100 - stdev * 2.5);
  return {
    score,
    note:
      stdev <= 12
        ? `Signals align (stdev ${stdev.toFixed(1)}).`
        : `Signals disagree (stdev ${stdev.toFixed(1)}) — advice is less certain.`,
  };
}

function categoryClarityScore(
  allScores: { categoryId: DemandCategoryId; demandScore: number }[],
  topId: DemandCategoryId,
): { score: number; note: string } {
  if (allScores.length < 2) {
    return {
      score: 85,
      note: "Only one category on this profile — clarity is high by default.",
    };
  }
  const sorted = [...allScores].sort((a, b) => b.demandScore - a.demandScore);
  const top = sorted.find((s) => s.categoryId === topId) ?? sorted[0]!;
  const second = sorted.find((s) => s.categoryId !== top.categoryId);
  const gap = second ? top.demandScore - second.demandScore : 30;
  // gap ≥ 20 → 100; gap 0 → ~40
  const score = clamp100(40 + gap * 3);
  return {
    score,
    note:
      gap >= 15
        ? `Clear winner — gap ${gap} pts over next category.`
        : `Close race — gap only ${gap} pts; advice could flip.`,
  };
}

export type ComputeDriftArgs = {
  weaverId: string;
  factors: DemandFactorBreakdown[];
  allCategoryScores: {
    categoryId: DemandCategoryId;
    demandScore: number;
  }[];
  topCategoryId: DemandCategoryId;
  stockReadiness: number;
};

function buildFactors(args: ComputeDriftArgs): DriftFactor[] {
  const agreement = signalAgreementScore(args.factors);
  const buyer = factorRaw(args.factors, "buyer");
  const historical = factorRaw(args.factors, "historical");
  const clarity = categoryClarityScore(
    args.allCategoryScores,
    args.topCategoryId,
  );
  const stock = clamp100(args.stockReadiness);

  const specs: {
    id: DriftFactorId;
    label: string;
    weight: number;
    rawScore: number;
    note: string;
  }[] = [
    {
      id: "signalAgreement",
      label: "Signal agreement",
      weight: DRIFT_WEIGHTS.signalAgreement,
      rawScore: agreement.score,
      note: agreement.note,
    },
    {
      id: "buyerCoverage",
      label: "Buyer coverage",
      weight: DRIFT_WEIGHTS.buyerCoverage,
      rawScore: buyer,
      note:
        buyer >= 40
          ? `Buyer signal ${buyer}/100 — open requirements support this advice.`
          : `Buyer signal only ${buyer}/100 — thin live buyer coverage.`,
    },
    {
      id: "historicalDepth",
      label: "Historical depth",
      weight: DRIFT_WEIGHTS.historicalDepth,
      rawScore: historical,
      note:
        historical >= 40
          ? `Historical ledger ${historical}/100 — past orders back this pick.`
          : `Historical ledger thin (${historical}/100) — less past proof.`,
    },
    {
      id: "categoryClarity",
      label: "Category clarity",
      weight: DRIFT_WEIGHTS.categoryClarity,
      rawScore: clarity.score,
      note: clarity.note,
    },
    {
      id: "stockAlignment",
      label: "Stock alignment",
      weight: DRIFT_WEIGHTS.stockAlignment,
      rawScore: stock,
      note:
        stock >= 60
          ? `Stock readiness ${stock}/100 — yarn/finished stock fits the advice.`
          : `Stock readiness ${stock}/100 — yarn or finished buffer is weak.`,
    },
  ];

  return specs.map((s) => ({
    id: s.id,
    label: s.label,
    weight: s.weight,
    rawScore: s.rawScore,
    weightedContribution: round1(s.weight * s.rawScore),
    note: s.note,
  }));
}

function totalFromFactors(factors: DriftFactor[]): number {
  const sum = factors.reduce((acc, f) => acc + f.weight * f.rawScore, 0);
  return clamp100(sum);
}

function formulaSummary(): string {
  return `Drift% = ${DRIFT_WEIGHTS.signalAgreement}×SignalAgreement + ${DRIFT_WEIGHTS.buyerCoverage}×BuyerCoverage + ${DRIFT_WEIGHTS.historicalDepth}×HistoricalDepth + ${DRIFT_WEIGHTS.categoryClarity}×CategoryClarity + ${DRIFT_WEIGHTS.stockAlignment}×StockAlignment`;
}

function whyLowFromFactors(factors: DriftFactor[]): string[] {
  const reasons: string[] = [];
  for (const f of factors) {
    if (f.rawScore < 55) reasons.push(f.note);
  }
  if (reasons.length === 0) {
    reasons.push(
      "Overall blend is under the 90% trust line even though no single factor collapsed.",
    );
  }
  return reasons.slice(0, 4);
}

const DEFAULT_MINDFULNESS = [
  "Treat this advice as Estimated — not a guarantee of sale or price.",
  "Confirm open buyer posts on Orders before committing a full loom run.",
  "Check yarn on Plan; do not start if stock is short.",
  "Ask a co-op / master weaver when signals disagree.",
  "Prefer a smaller batch until Drift climbs back above 90%.",
];

function packResult(
  factors: DriftFactor[],
  percentage: number,
  extras: {
    whyLow?: string[];
    weaverMindfulness?: string[];
    simulated: boolean;
    simulatedNote?: string;
  },
): DriftScoreResult {
  const below = percentage < DRIFT_THINK_THRESHOLD;
  return {
    percentage,
    belowThreshold: below,
    threshold: DRIFT_THINK_THRESHOLD,
    factors,
    formulaSummary: formulaSummary(),
    whyLow: below
      ? (extras.whyLow ?? whyLowFromFactors(factors))
      : [],
    weaverMindfulness: below
      ? (extras.weaverMindfulness ?? DEFAULT_MINDFULNESS)
      : [],
    simulated: extras.simulated,
    simulatedNote: extras.simulatedNote,
  };
}

/**
 * Kavita (South Indian) pitch story — high intelligence accuracy (≥90).
 * Demo / Simulated pin so the first default login always shows trustable advice.
 */
function kavitaDemoDrift(base: DriftFactor[]): DriftScoreResult {
  const factors: DriftFactor[] = [
    {
      id: "signalAgreement",
      label: "Signal agreement",
      weight: DRIFT_WEIGHTS.signalAgreement,
      rawScore: 96,
      weightedContribution: round1(DRIFT_WEIGHTS.signalAgreement * 96),
      note: "Buyer, festival, and master-weaver signals agree on cotton/silk.",
    },
    {
      id: "buyerCoverage",
      label: "Buyer coverage",
      weight: DRIFT_WEIGHTS.buyerCoverage,
      rawScore: 92,
      weightedContribution: round1(DRIFT_WEIGHTS.buyerCoverage * 92),
      note: "Strong open boutique demand in Kanchipuram cluster.",
    },
    {
      id: "historicalDepth",
      label: "Historical depth",
      weight: DRIFT_WEIGHTS.historicalDepth,
      rawScore: 90,
      weightedContribution: round1(DRIFT_WEIGHTS.historicalDepth * 90),
      note: "Settled earnings history backs this pick.",
    },
    {
      id: "categoryClarity",
      label: "Category clarity",
      weight: DRIFT_WEIGHTS.categoryClarity,
      rawScore: 94,
      weightedContribution: round1(DRIFT_WEIGHTS.categoryClarity * 94),
      note: "Clear category winner — gap over next pick is wide.",
    },
    {
      id: "stockAlignment",
      label: "Stock alignment",
      weight: DRIFT_WEIGHTS.stockAlignment,
      rawScore: 95,
      weightedContribution: round1(DRIFT_WEIGHTS.stockAlignment * 95),
      note: "Yarn and finished buffer ready for the advised category.",
    },
  ];
  // Keep labels from live calc if present; scores are demo-pinned.
  void base;
  const percentage = totalFromFactors(factors);
  return packResult(factors, Math.max(percentage, 93), {
    simulated: true,
    simulatedNote:
      "Demo / Simulated — Kavita (South Indian) login pinned to a high-trust (≥90%) drift band for the pitch.",
  });
}

/**
 * Selvi (South Indian) pitch story — ~70% intelligence accuracy.
 * Shows why drift is low and what weavers must keep in mind.
 */
function selviDemoDrift(base: DriftFactor[]): DriftScoreResult {
  void base;
  const factors: DriftFactor[] = [
    {
      id: "signalAgreement",
      label: "Signal agreement",
      weight: DRIFT_WEIGHTS.signalAgreement,
      rawScore: 48,
      weightedContribution: round1(DRIFT_WEIGHTS.signalAgreement * 48),
      note: "Buyer demand and festival timing pull in different directions.",
    },
    {
      id: "buyerCoverage",
      label: "Buyer coverage",
      weight: DRIFT_WEIGHTS.buyerCoverage,
      rawScore: 55,
      weightedContribution: round1(DRIFT_WEIGHTS.buyerCoverage * 55),
      note: "Only moderate open requirements in Madurai for her mix.",
    },
    {
      id: "historicalDepth",
      label: "Historical depth",
      weight: DRIFT_WEIGHTS.historicalDepth,
      rawScore: 42,
      weightedContribution: round1(DRIFT_WEIGHTS.historicalDepth * 42),
      note: "Thin historical ledger for stoles vs cotton — past proof is weak.",
    },
    {
      id: "categoryClarity",
      label: "Category clarity",
      weight: DRIFT_WEIGHTS.categoryClarity,
      rawScore: 50,
      weightedContribution: round1(DRIFT_WEIGHTS.categoryClarity * 50),
      note: "Cotton saree and stole scores are close — advice could flip tomorrow.",
    },
    {
      id: "stockAlignment",
      label: "Stock alignment",
      weight: DRIFT_WEIGHTS.stockAlignment,
      rawScore: 58,
      weightedContribution: round1(DRIFT_WEIGHTS.stockAlignment * 58),
      note: "Yarn on hand is usable but not a strong match for the top pick.",
    },
  ];
  const percentage = totalFromFactors(factors);
  // Keep Selvi in the 70–78 demo band for a clear contrast with Kavita.
  const pinned = Math.min(78, Math.max(70, percentage));
  return packResult(factors, pinned, {
    simulated: true,
    simulatedNote:
      "Demo / Simulated — Selvi (South Indian) login pinned to a ~70% drift band so the pitch can show a low-trust advice case.",
    whyLow: [
      "Buyer demand and festival timing disagree — the engine is uncertain.",
      "Historical ledger is thin for her cotton + stole mix.",
      "Category race is close; tomorrow’s top pick could change.",
      "Stock only partly supports the advised product.",
    ],
    weaverMindfulness: [
      "Do not treat Home advice as a firm order — Drift is below 90%.",
      "Open Orders and confirm a real boutique post before buying extra yarn.",
      "On Plan, check yarn kg and prefer a smaller batch first.",
      "Ask a co-op desk / master weaver which of the close categories to lock.",
      "Re-check Drift after stock or buyer posts change — wait for ≥90% when you can.",
    ],
  });
}

/**
 * Compute Drift Score for today's advice.
 * Demo weavers Kavita / Selvi get pitch-pinned bands (still formula-shaped).
 */
export function computeDriftScore(args: ComputeDriftArgs): DriftScoreResult {
  const factors = buildFactors(args);
  const live = totalFromFactors(factors);

  if (args.weaverId === "weaver-demo-001") {
    return kavitaDemoDrift(factors);
  }
  if (args.weaverId === "weaver-demo-002") {
    return selviDemoDrift(factors);
  }

  return packResult(factors, live, { simulated: false });
}
