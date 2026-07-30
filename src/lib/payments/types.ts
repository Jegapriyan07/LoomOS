/**
 * Stage 4 — payment / simulated escrow types.
 *
 * COMPLIANCE (not legal advice):
 * This prototype simulates an escrow-style settlement flow for demo only.
 * It does not move real money and is not a licensed financial product.
 * In production, only an RBI-authorised Payment Aggregator may pool customer
 * funds in a scheduled-bank escrow account. Real deployment needs a licensed-
 * aggregator partnership or its own licensing review.
 * Never describe this as "our escrow account" or "we hold your money."
 */

import type { DemandCategoryId } from "@/lib/demand/types";

export const ORDER_STATES = [
  "order_created",
  "advance_requested",
  "advance_paid_escrow_held",
  "production_in_progress",
  "dispatched",
  "settlement_released",
  "dispute_opened",
  "under_review",
  "resolved",
] as const;

export type OrderState = (typeof ORDER_STATES)[number];

/** Happy-path sequence before any dispute branch */
export const HAPPY_PATH_STATES: OrderState[] = [
  "order_created",
  "advance_requested",
  "advance_paid_escrow_held",
  "production_in_progress",
  "dispatched",
  "settlement_released",
];

/**
 * Modeled on an RBI-authorised payment aggregator's typical T+1 working-day
 * settlement window (RBI Master Directions on PAs/PGs — Verified Facts).
 * Simulated timing only — this app does not settle real funds.
 */
export const MODELED_SETTLEMENT_WORKING_DAYS = 1;

/**
 * Accepted work in the payment / Money pipeline.
 * Boutique identity: `buyerId` + `buyerName`. Optional `requirementId` links
 * back to the BuyerRequirement the weaver planned from (Orders → Plan → Money).
 */
export type PaymentOrder = {
  id: string;
  weaverId: string;
  /** Boutique / buyer account id */
  buyerId: string;
  /** Boutique display name — denormalized for UI; resolved from buyers if missing */
  buyerName?: string;
  /** Open demand this order fulfilled, when known */
  requirementId?: string;
  category: DemandCategoryId;
  /** Amount in INR (demo figures) */
  amount: number;
  /** Advance portion held in the simulated escrow pattern */
  advanceAmount: number;
  state: OrderState;
  createdAt: string;
  dispatchedAt?: string;
  settledAt?: string;
  /** Expected settlement date (modeled T+1 after dispatch) — projected */
  expectedSettlementAt?: string;
  stateHistory: { state: OrderState; at: string }[];
};

export type DisputeStatus = "opened" | "under_review" | "resolved";

export type Dispute = {
  orderId: string;
  reason: string;
  status: DisputeStatus;
  openedAt: string;
  resolvedAt?: string;
};

export type BuyerProfile = {
  id: string;
  name: string;
  region: string;
  email?: string;
  /**
   * @deprecated Removed — phone OTP in SQLite. Kept optional for old JSON rows.
   */
  passwordDemo?: string;
};

export type TrustLabel =
  | "Excellent"
  | "Good"
  | "New"
  | "Needs Attention";

export type TrustScoreBreakdown = {
  buyerId: string;
  score: number;
  label: TrustLabel;
  onTimeSettlementRate: number;
  disputeRate: number;
  orderCompletionRate: number;
  components: {
    name: string;
    weight: number;
    rawValue: number;
    contribution: number;
    detail: string;
  }[];
  sampleSize: {
    totalOrders: number;
    settledOrders: number;
    dispatchedOrders: number;
    disputeCount: number;
  };
  formulaSummary: string;
};
