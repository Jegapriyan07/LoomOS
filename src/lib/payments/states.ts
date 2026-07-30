/**
 * Simulated escrow settlement state machine (demo only).
 * Does not move real money. Not a licensed financial product.
 */

import type { OrderState } from "@/lib/payments/types";

const ALLOWED: Record<OrderState, OrderState[]> = {
  order_created: ["advance_requested"],
  advance_requested: ["advance_paid_escrow_held"],
  advance_paid_escrow_held: ["production_in_progress"],
  production_in_progress: ["dispatched"],
  // After Dispatched: settle OR open dispute
  dispatched: ["settlement_released", "dispute_opened"],
  dispute_opened: ["under_review"],
  under_review: ["resolved"],
  settlement_released: [],
  resolved: [],
};

export function canTransition(from: OrderState, to: OrderState): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}

export function nextHappyState(current: OrderState): OrderState | null {
  const next = ALLOWED[current]?.find((s) => s !== "dispute_opened");
  return next ?? null;
}

/** Weaver-facing plain labels — never "dashboard" / finance jargon */
export function weaverStateLabel(state: OrderState): string {
  switch (state) {
    case "order_created":
      return "Order placed";
    case "advance_requested":
      return "Advance asked for";
    case "advance_paid_escrow_held":
      return "Advance held for your order";
    case "production_in_progress":
      return "You are weaving";
    case "dispatched":
      return "Sent to buyer";
    case "settlement_released":
      return "Settlement marked released";
    case "dispute_opened":
      return "Question raised";
    case "under_review":
      return "Under review";
    case "resolved":
      return "Question settled";
  }
}

/** Short compliance-safe status detail for escrow-held state */
export function weaverStateHint(state: OrderState): string {
  switch (state) {
    case "advance_paid_escrow_held":
      return "Modeled on an RBI-authorised payment aggregator's escrow settlement pattern.";
    case "settlement_released":
      return "Settlement released for this order.";
    case "dispute_opened":
    case "under_review":
      return "Dispute path — under review.";
    default:
      return "";
  }
}

export function adminStateLabel(state: OrderState): string {
  const map: Record<OrderState, string> = {
    order_created: "Order Created",
    advance_requested: "Advance Requested",
    advance_paid_escrow_held: "Advance Paid (Escrow Held)",
    production_in_progress: "Production In Progress",
    dispatched: "Dispatched",
    settlement_released: "Settlement Released",
    dispute_opened: "Dispute Opened",
    under_review: "Under Review",
    resolved: "Resolved",
  };
  return map[state];
}
