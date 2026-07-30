/**
 * Personal Profile Score — session weaver only.
 *
 * Profile score = STAGE 3 Demand Score (same formula as Home Decision Copilot).
 * Never exposed on public share links or buyer directory.
 * Verified history = STAGE 6 metrics (facts only — not a credit score).
 * Advice comes only from weak score factors + open requirements in the
 * Delhi / IIT cluster already in the store.
 */

import { getWeaverById } from "@/lib/auth/identity";
import { DEMO_CLUSTER } from "@/lib/demo/cluster";
import {
  DEMAND_CATEGORIES,
  type BuyerRequirement,
  type DemandCategoryId,
  type DemandFactorBreakdown,
} from "@/lib/demand/types";
import {
  listOpenRequirements,
  listPaymentOrders,
} from "@/lib/demand/store";
import { PRIMARY_DEMAND, isIitClusterDistrict } from "@/lib/map/hub-geo";
import { getTodaysRecommendation } from "@/lib/recommendations";
import type { Recommendation } from "@/lib/types";
import {
  buildVerifiedTransactionRecord,
  type VerifiedTransactionRecord,
} from "@/lib/verified-record/build";

/** Target raw factor score used when estimating upside (transparent, not a guarantee). */
const ADVICE_TARGET_RAW = 70;

export type ProfileScoreBand = "building" | "fair" | "strong" | "excellent";

export type ProfileMatchTip = {
  id: string;
  title: string;
  detail: string;
  /** Estimated points if this factor rose to ADVICE_TARGET_RAW (formula math only). */
  estimatedGainPts?: number;
  href?: string;
};

export type ProfileMatchPayload = {
  /** Personal viewer only — never for public share */
  personalOnly: true;
  privacyNote: string;
  /** Demo / Simulated honesty for seeded inputs */
  dataNote: string;
  cluster: {
    name: string;
    region: string;
    district: string;
    flavor: string;
    weaverDistrict: string | null;
    cooperativeName: string | null;
  };
  match: {
    label: "Profile score";
    score: number;
    band: ProfileScoreBand;
    bandLabel: string;
    categoryId: DemandCategoryId;
    categoryLabel: string;
    formulaSummary: string;
    factors: Recommendation["factors"];
    reasonFactors: string[];
  };
  tips: ProfileMatchTip[];
  openNearCluster: {
    categoryId: DemandCategoryId;
    categoryLabel: string;
    quantity: number;
    district: string;
    buyerName: string;
  }[];
  verified: Pick<
    VerifiedTransactionRecord["metrics"],
    | "totalVerifiedCompletedOrders"
    | "verifiedIncomeTrailing12Months"
    | "incomeHistoryMonths"
    | "incomeHistoryNote"
    | "onTimeSettlementRate"
    | "onTimeDetail"
    | "tenureDays"
    | "tenureNote"
  >;
  verifiedFraming: string;
};

function districtFromCategories(categories: string[]): string | null {
  for (const c of categories) {
    const m = /^district:(.+)$/i.exec(c.trim());
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function inIitCluster(district: string | undefined): boolean {
  if (!district) return false;
  return isIitClusterDistrict(district);
}

function categoryLabel(id: DemandCategoryId): string {
  return DEMAND_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function scoreBand(score: number): { band: ProfileScoreBand; bandLabel: string } {
  if (score >= 80) return { band: "excellent", bandLabel: "Excellent fit" };
  if (score >= 60) return { band: "strong", bandLabel: "Strong fit" };
  if (score >= 40) return { band: "fair", bandLabel: "Fair fit" };
  return { band: "building", bandLabel: "Building fit" };
}

/** Estimated points if raw factor rose to target — weight × delta, rounded. */
function estimatedGainPts(factor: DemandFactorBreakdown): number {
  if (factor.rawScore >= ADVICE_TARGET_RAW) return 0;
  return Math.round(factor.weight * (ADVICE_TARGET_RAW - factor.rawScore));
}

function tipForFactor(
  f: DemandFactorBreakdown,
  recommendation: Recommendation,
): ProfileMatchTip | null {
  const gain = estimatedGainPts(f);
  const gainNote =
    gain > 0
      ? ` Estimated: raising this factor from ${f.rawScore} to ${ADVICE_TARGET_RAW} adds about ${gain} pts (weight ${Math.round(f.weight * 100)}%).`
      : "";

  if (f.id === "buyer") {
    return {
      id: "buyer-weak",
      title: "Strengthen buyer signal",
      detail: `${f.label} is ${f.rawScore}/100.${gainNote} Open Orders filtered to IIT / Delhi and accept posts that match your weave categories.`,
      estimatedGainPts: gain > 0 ? gain : undefined,
      href: "/orders",
    };
  }
  if (f.id === "seasonal") {
    return {
      id: "seasonal-weak",
      title: "Align with the next festival window",
      detail: `${f.label} is ${f.rawScore}/100.${gainNote} Use Plan to set finish dates ahead of the nearest seeded festival for ${recommendation.categoryLabel}.`,
      estimatedGainPts: gain > 0 ? gain : undefined,
      href: "/plan",
    };
  }
  if (f.id === "historical") {
    return {
      id: "historical-weak",
      title: "Build settlement history",
      detail: `${f.label} is ${f.rawScore}/100.${gainNote} Complete open Money orders through Settlement Released so historical signal can rise.`,
      estimatedGainPts: gain > 0 ? gain : undefined,
      href: "/money",
    };
  }
  if (f.id === "marketExtra") {
    return {
      id: "market-weak",
      title: "Watch yarn / market notes",
      detail: `${f.label} is ${f.rawScore}/100.${gainNote} Check Plan stock readiness before starting ${recommendation.categoryLabel}.`,
      estimatedGainPts: gain > 0 ? gain : undefined,
      href: "/plan",
    };
  }
  if (f.id === "masterWeaver") {
    return {
      id: "master-weak",
      title: "Lean on cluster craft focus",
      detail: `${f.label} is ${f.rawScore}/100.${gainNote} Prefer categories your ${DEMO_CLUSTER.name} peers already weave near ${PRIMARY_DEMAND.district}.`,
      estimatedGainPts: gain > 0 ? gain : undefined,
      href: "/orders",
    };
  }
  return null;
}

function buildTips(args: {
  recommendation: Recommendation;
  openNear: BuyerRequirement[];
  weaverCategories: string[];
}): ProfileMatchTip[] {
  const tips: ProfileMatchTip[] = [];
  const weak = [...args.recommendation.factors]
    .filter((f) => f.rawScore < 45)
    .sort((a, b) => a.rawScore - b.rawScore);

  for (const f of weak.slice(0, 2)) {
    const tip = tipForFactor(f, args.recommendation);
    if (tip) tips.push(tip);
  }

  // If nothing is very weak, still advise on the lowest-contributing factor under target
  if (tips.length === 0) {
    const improvable = [...args.recommendation.factors]
      .filter((f) => f.rawScore < ADVICE_TARGET_RAW)
      .sort((a, b) => estimatedGainPts(b) - estimatedGainPts(a));
    const top = improvable[0];
    if (top) {
      const tip = tipForFactor(top, args.recommendation);
      if (tip) tips.push(tip);
    }
  }

  const weaverCatLower = args.weaverCategories.map((c) => c.toLowerCase());
  const unmatchedOpen = args.openNear.filter((r) => {
    const label = categoryLabel(r.categoryId).toLowerCase();
    const firstWord = label.split(" ")[0];
    return !weaverCatLower.some(
      (c) =>
        c.includes(r.categoryId.split("-")[0] ?? "") ||
        (firstWord !== undefined && c.includes(firstWord)),
    );
  });

  if (unmatchedOpen[0]) {
    const r = unmatchedOpen[0];
    tips.push({
      id: "open-cat",
      title: `Open need near ${r.district ?? PRIMARY_DEMAND.district}`,
      detail: `${r.buyerName} wants ${categoryLabel(r.categoryId)} (${r.quantity} pcs) in ${r.district ?? PRIMARY_DEMAND.district}, ${PRIMARY_DEMAND.region}. Consider adding this category if it fits your loom — it can lift Buyer Signal.`,
      href: "/orders",
    });
  } else if (args.openNear[0]) {
    const r = args.openNear[0];
    tips.push({
      id: "open-match",
      title: `Match open post at ${r.district ?? PRIMARY_DEMAND.district}`,
      detail: `${r.buyerName} · ${categoryLabel(r.categoryId)} · ${r.quantity} pcs — open in Orders under IIT / District scope to strengthen your profile score.`,
      href: "/orders",
    });
  }

  if (tips.length === 0) {
    tips.push({
      id: "keep-pace",
      title: "Keep your strongest category moving",
      detail: `${args.recommendation.categoryLabel} leads at ${args.recommendation.demandScore}/100. Check Orders for ${PRIMARY_DEMAND.district} posts and keep settlements on time.`,
      href: "/orders",
    });
  }

  return tips.slice(0, 4);
}

export async function getProfileMatch(
  weaverId: string,
): Promise<ProfileMatchPayload> {
  const weaver = await getWeaverById(weaverId);
  if (!weaver) throw new Error("Unknown weaver");

  const recommendation = await getTodaysRecommendation(weaverId);
  const orders = await listPaymentOrders({ weaverId });
  const record = buildVerifiedTransactionRecord({
    weaverId: weaver.id,
    weaverName: weaver.name,
    region: weaver.region,
    orders,
  });

  const openDelhi = await listOpenRequirements({
    region: PRIMARY_DEMAND.region,
  });
  const openNear = openDelhi.filter(
    (r) =>
      inIitCluster(r.district) ||
      (r.district ?? "").toLowerCase() ===
        PRIMARY_DEMAND.district.toLowerCase(),
  );

  const weaverDistrict =
    districtFromCategories(weaver.categories) ?? DEMO_CLUSTER.district;

  const { band, bandLabel } = scoreBand(recommendation.demandScore);

  return {
    personalOnly: true,
    privacyNote:
      "Only you can see this score while logged in. It is not shown to buyers, co-ops, or on public share links.",
    dataNote:
      "Profile score uses the same STAGE 3 demand formula as Home. Some buyer posts and settlements are Demo / Simulated.",
    cluster: {
      name: weaver.cooperativeName ?? DEMO_CLUSTER.name,
      region: PRIMARY_DEMAND.region,
      district: PRIMARY_DEMAND.district,
      flavor: DEMO_CLUSTER.flavor,
      weaverDistrict,
      cooperativeName: weaver.cooperativeName ?? DEMO_CLUSTER.name,
    },
    match: {
      label: "Profile score",
      score: recommendation.demandScore,
      band,
      bandLabel,
      categoryId: recommendation.categoryId,
      categoryLabel: recommendation.categoryLabel,
      formulaSummary: recommendation.formulaSummary,
      factors: recommendation.factors,
      reasonFactors: recommendation.reasonFactors,
    },
    tips: buildTips({
      recommendation,
      openNear: openNear.length > 0 ? openNear : openDelhi.slice(0, 5),
      weaverCategories: weaver.categories,
    }),
    openNearCluster: (openNear.length > 0 ? openNear : openDelhi)
      .slice(0, 5)
      .map((r) => ({
        categoryId: r.categoryId,
        categoryLabel: categoryLabel(r.categoryId),
        quantity: r.quantity,
        district: r.district ?? PRIMARY_DEMAND.district,
        buyerName: r.buyerName,
      })),
    verified: {
      totalVerifiedCompletedOrders:
        record.metrics.totalVerifiedCompletedOrders,
      verifiedIncomeTrailing12Months:
        record.metrics.verifiedIncomeTrailing12Months,
      incomeHistoryMonths: record.metrics.incomeHistoryMonths,
      incomeHistoryNote: record.metrics.incomeHistoryNote,
      onTimeSettlementRate: record.metrics.onTimeSettlementRate,
      onTimeDetail: record.metrics.onTimeDetail,
      tenureDays: record.metrics.tenureDays,
      tenureNote: record.metrics.tenureNote,
    },
    verifiedFraming: record.framing,
  };
}
