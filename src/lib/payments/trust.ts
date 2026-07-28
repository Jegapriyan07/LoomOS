/**
 * Buyer Trust Score — rule-based, transparent (Stage 4).
 *
 * Trust Score (0–100) =
 *   0.5 × OnTimeSettlementRate
 * + 0.3 × (1 − DisputeRate)
 * + 0.2 × OrderCompletionRate
 *
 * Rates are 0–100. New buyers (few orders) get the "New" label.
 */

import type {
  Dispute,
  PaymentOrder,
  TrustLabel,
  TrustScoreBreakdown,
} from "@/lib/payments/types";
import { MODELED_SETTLEMENT_WORKING_DAYS } from "@/lib/payments/types";
import { addCalendarDays, parseDateOnly, toDateOnly } from "@/lib/production-defaults";

const WEIGHTS = {
  onTime: 0.5,
  disputeFree: 0.3,
  completion: 0.2,
} as const;

export function computeBuyerTrustScore(
  buyerId: string,
  orders: PaymentOrder[],
  disputes: Dispute[],
): TrustScoreBreakdown {
  const buyerOrders = orders.filter((o) => o.buyerId === buyerId);
  const totalOrders = buyerOrders.length;
  const settledOrders = buyerOrders.filter((o) => o.state === "settlement_released");
  const dispatchedOrders = buyerOrders.filter(
    (o) =>
      o.dispatchedAt ||
      [
        "dispatched",
        "settlement_released",
        "dispute_opened",
        "under_review",
        "resolved",
      ].includes(o.state),
  );

  const disputeOrderIds = new Set(
    disputes.filter((d) => buyerOrders.some((o) => o.id === d.orderId)).map((d) => d.orderId),
  );
  const disputeCount = disputeOrderIds.size;

  const onTimeCount = settledOrders.filter((o) => {
    if (!o.dispatchedAt || !o.settledAt) return false;
    const expected = o.expectedSettlementAt
      ? parseDateOnly(o.expectedSettlementAt.slice(0, 10))
      : addCalendarDays(
          parseDateOnly(o.dispatchedAt.slice(0, 10)),
          MODELED_SETTLEMENT_WORKING_DAYS,
        );
    const settled = parseDateOnly(o.settledAt.slice(0, 10));
    return settled.getTime() <= expected.getTime();
  }).length;

  const onTimeSettlementRate =
    settledOrders.length === 0
      ? 100 // no late settlements on record yet
      : Math.round((onTimeCount / settledOrders.length) * 100);

  const disputeRate =
    dispatchedOrders.length === 0
      ? 0
      : Math.round((disputeCount / dispatchedOrders.length) * 100);

  const orderCompletionRate =
    totalOrders === 0
      ? 0
      : Math.round((settledOrders.length / totalOrders) * 100);

  const disputeFreeScore = 100 - disputeRate;

  const score = Math.round(
    WEIGHTS.onTime * onTimeSettlementRate +
      WEIGHTS.disputeFree * disputeFreeScore +
      WEIGHTS.completion * orderCompletionRate,
  );

  const label = trustLabel(score, totalOrders);

  return {
    buyerId,
    score: Math.min(100, Math.max(0, score)),
    label,
    onTimeSettlementRate,
    disputeRate,
    orderCompletionRate,
    components: [
      {
        name: "On-time settlement rate",
        weight: WEIGHTS.onTime,
        rawValue: onTimeSettlementRate,
        contribution: round1(WEIGHTS.onTime * onTimeSettlementRate),
        detail: `${onTimeCount} of ${settledOrders.length} settlements on or before modeled T+${MODELED_SETTLEMENT_WORKING_DAYS} window`,
      },
      {
        name: "1 − dispute rate",
        weight: WEIGHTS.disputeFree,
        rawValue: disputeFreeScore,
        contribution: round1(WEIGHTS.disputeFree * disputeFreeScore),
        detail: `${disputeCount} disputes across ${dispatchedOrders.length} dispatched orders (dispute rate ${disputeRate}%)`,
      },
      {
        name: "Order completion rate",
        weight: WEIGHTS.completion,
        rawValue: orderCompletionRate,
        contribution: round1(WEIGHTS.completion * orderCompletionRate),
        detail: `${settledOrders.length} settled of ${totalOrders} total orders`,
      },
    ],
    sampleSize: {
      totalOrders,
      settledOrders: settledOrders.length,
      dispatchedOrders: dispatchedOrders.length,
      disputeCount,
    },
    formulaSummary:
      "Trust Score = 0.5×OnTimeSettlementRate + 0.3×(1−DisputeRate) + 0.2×OrderCompletionRate",
  };
}

function trustLabel(score: number, totalOrders: number): TrustLabel {
  if (totalOrders < 3) return "New";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Attention";
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Projected settlement date after dispatch (modeled T+1). Labeled projected in UI. */
export function projectedSettlementDate(dispatchedAt: string): string {
  const d = addCalendarDays(
    parseDateOnly(dispatchedAt.slice(0, 10)),
    MODELED_SETTLEMENT_WORKING_DAYS,
  );
  return toDateOnly(d);
}
