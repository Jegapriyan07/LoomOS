/**
 * Stage 6 — Verified Transaction Record.
 *
 * FRAMING (do not dilute):
 * This is a factual record of completed, on-time settlements from LoomOS
 * Stage 4 data. It is NOT a credit score, NOT a credit report, and NOT a
 * guarantee that any bank or NBFC will do anything with it.
 * Never use "credit score," "CIBIL," or "loan" in user-facing copy.
 */

import type { PaymentOrder } from "@/lib/payments/types";
import { MODELED_SETTLEMENT_WORKING_DAYS } from "@/lib/payments/types";
import {
  addCalendarDays,
  parseDateOnly,
  toDateOnly,
} from "@/lib/production-defaults";

export type VerifiedTransactionRecord = {
  weaverId: string;
  weaverName: string;
  region: string;
  shareId: string;
  generatedAt: string;
  /** Framing shown on every export */
  framing: string;
  phase2Note: string;
  /** Demo honesty */
  dataNote: string;
  metrics: {
    totalVerifiedCompletedOrders: number;
    verifiedIncomeTrailing12Months: number;
    /** How many calendar months of settlement history exist (≤12) */
    incomeHistoryMonths: number;
    incomeHistoryNote: string;
    onTimeSettlementRate: number;
    onTimeDetail: string;
    tenureDays: number;
    tenureNote: string;
    firstActivityAt: string | null;
  };
  /** Line items — every rupee traces to a Settlement Released order */
  settlements: {
    orderId: string;
    amount: number;
    settledAt: string;
    onTime: boolean;
  }[];
};

export const RECORD_FRAMING =
  "A verified history of completed, on-time orders that a bank or NBFC could choose to review — a factual record, not a financial product or a guarantee of anything.";

export const PHASE2_NOTE =
  "Phase 2 narrative: this record is what LoomOS would bring to bank & insurance partnership conversations — concrete settlement history, not a bullet point.";

export const DEMO_DATA_NOTE =
  "Demo Mode — figures come only from Settlement Released events in the fictional Nila Loom Circle (Demo Cluster) seed. Not a real cooperative’s books. This prototype does not move real money.";

/** Stable share id for demo weaver — not a secret; read-only public summary. */
export function shareIdForWeaver(weaverId: string): string {
  return `vtr-${weaverId.replace(/[^a-z0-9-]/gi, "").toLowerCase()}`;
}

function isOnTime(order: PaymentOrder): boolean {
  if (!order.dispatchedAt || !order.settledAt) return false;
  const expected = order.expectedSettlementAt
    ? parseDateOnly(order.expectedSettlementAt.slice(0, 10))
    : addCalendarDays(
        parseDateOnly(order.dispatchedAt.slice(0, 10)),
        MODELED_SETTLEMENT_WORKING_DAYS,
      );
  const settled = parseDateOnly(order.settledAt.slice(0, 10));
  return settled.getTime() <= expected.getTime();
}

/**
 * Build record from Stage 4 payment orders only.
 */
export function buildVerifiedTransactionRecord(args: {
  weaverId: string;
  weaverName: string;
  region: string;
  orders: PaymentOrder[];
  asOf?: Date;
}): VerifiedTransactionRecord {
  const asOf = args.asOf ?? new Date();
  const settled = args.orders
    .filter(
      (o) =>
        o.weaverId === args.weaverId &&
        o.state === "settlement_released" &&
        o.settledAt,
    )
    .sort((a, b) => (a.settledAt! > b.settledAt! ? 1 : -1));

  const windowStart = new Date(asOf);
  windowStart.setMonth(windowStart.getMonth() - 12);
  const windowStartKey = toDateOnly(windowStart);

  const inTrailing12 = settled.filter(
    (o) => o.settledAt!.slice(0, 10) >= windowStartKey,
  );

  const monthKeys = [
    ...new Set(inTrailing12.map((o) => o.settledAt!.slice(0, 7))),
  ].sort();

  const verifiedIncome = inTrailing12.reduce((s, o) => s + o.amount, 0);

  const onTimeCount = settled.filter(isOnTime).length;
  const onTimeRate =
    settled.length === 0
      ? 0
      : Math.round((onTimeCount / settled.length) * 100);

  const first = settled[0] ?? null;
  const firstActivityAt =
    first?.createdAt ??
    args.orders
      .filter((o) => o.weaverId === args.weaverId)
      .map((o) => o.createdAt)
      .sort()[0] ??
    null;

  let tenureDays = 0;
  if (firstActivityAt) {
    const start = new Date(firstActivityAt);
    tenureDays = Math.max(
      0,
      Math.floor((asOf.getTime() - start.getTime()) / 86_400_000),
    );
  }

  const incomeHistoryNote =
    monthKeys.length < 12
      ? `Verified income uses ${monthKeys.length} month${monthKeys.length === 1 ? "" : "s"} of Settlement Released events recorded in LoomOS in the trailing 12-month window (not a full year yet).`
      : "Verified income covers a full trailing 12 months of Settlement Released events recorded in LoomOS.";

  return {
    weaverId: args.weaverId,
    weaverName: args.weaverName,
    region: args.region,
    shareId: shareIdForWeaver(args.weaverId),
    generatedAt: asOf.toISOString(),
    framing: RECORD_FRAMING,
    phase2Note: PHASE2_NOTE,
    dataNote: DEMO_DATA_NOTE,
    metrics: {
      totalVerifiedCompletedOrders: settled.length,
      verifiedIncomeTrailing12Months: verifiedIncome,
      incomeHistoryMonths: monthKeys.length,
      incomeHistoryNote,
      onTimeSettlementRate: onTimeRate,
      onTimeDetail: `${onTimeCount} of ${settled.length} settlements on or before the modeled T+${MODELED_SETTLEMENT_WORKING_DAYS} window after dispatch.`,
      tenureDays,
      tenureNote: firstActivityAt
        ? `First platform activity ${firstActivityAt.slice(0, 10)}; tenure counted in whole days through today.`
        : "No orders on platform yet — tenure is 0 days.",
      firstActivityAt,
    },
    settlements: settled.map((o) => ({
      orderId: o.id,
      amount: o.amount,
      settledAt: o.settledAt!,
      onTime: isOnTime(o),
    })),
  };
}
