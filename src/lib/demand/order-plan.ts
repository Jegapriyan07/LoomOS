/**
 * Order ↔ Plan link helpers.
 *
 * LoomOS splits three related concepts (JSON store today — not Prisma):
 *
 * 1. **BuyerRequirement** (`Orders` tab) — open demand from a boutique/buyer.
 *    Keys: `id` (requirement), `buyerId`, `buyerName`.
 * 2. **Plan** (`Plan` tab) — reverse production schedule for one requirement
 *    (or a festival / custom date). Linked via `requirementId` in the URL.
 * 3. **PaymentOrder** (`Money` tab) — accepted work in the payment pipeline.
 *    Keys: `id` (order), `buyerId`, optional `buyerName` + `requirementId`.
 *
 * Boutique identity is always `buyerId` + display `buyerName` (business name).
 */

import type { BuyerRequirement } from "@/lib/demand/types";
import type { PaymentOrder } from "@/lib/payments/types";
import { DEMO_BUYERS } from "@/lib/demo/cluster";

export type PlanSource = {
  requirementId: string;
  buyerId: string;
  buyerName: string;
  categoryId: BuyerRequirement["categoryId"];
  quantity: number;
  neededBy: string;
};

export function buyerDisplayName(
  buyerId: string | undefined,
  fallbackName?: string,
): string {
  if (!buyerId && fallbackName) return fallbackName;
  const demo = DEMO_BUYERS.find((b) => b.id === buyerId);
  if (demo) return demo.name;
  return fallbackName?.trim() || buyerId || "Buyer";
}

/** Build Plan deep-link from an open requirement (Orders → Plan). */
export function planHrefForRequirement(requirementId: string): string {
  return `/plan?requirementId=${encodeURIComponent(requirementId)}`;
}

export function planSourceFromRequirement(
  req: BuyerRequirement,
): PlanSource | null {
  if (!req.buyerId) return null;
  return {
    requirementId: req.id,
    buyerId: req.buyerId,
    buyerName: buyerDisplayName(req.buyerId, req.buyerName),
    categoryId: req.categoryId,
    quantity: req.quantity,
    neededBy: req.neededBy,
  };
}

/** Resolve boutique name on a payment order (id first, then stored name). */
export function paymentOrderBuyerLabel(order: PaymentOrder): string {
  return buyerDisplayName(order.buyerId, order.buyerName);
}
