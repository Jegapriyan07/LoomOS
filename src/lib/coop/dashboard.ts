/**
 * Stage 11 — Cooperative / cluster dashboard helpers.
 * Reuses Stage 3 demand scores + Stage 4 order states. No new invented metrics.
 */

import type { PaymentOrder, OrderState } from "@/lib/payments/types";
import { adminStateLabel } from "@/lib/payments/states";
import {
  DEMO_CLUSTER,
  DEMO_CLUSTER_WEAVERS,
  ILLUSTRATIVE_CAPACITY_NOTE,
  ILLUSTRATIVE_MAX_CONCURRENT_ORDERS,
} from "@/lib/demo/cluster";
import { scoreCategory } from "@/lib/demand/scoring";
import {
  DEMAND_CATEGORIES,
  type BuyerRequirement,
  type DemandCategoryId,
  type LedgerOrder,
  type ManualTrendEntry,
} from "@/lib/demand/types";

/** Pipeline orders that consume capacity (not finished / not resolved). */
const ACTIVE_STATES: OrderState[] = [
  "order_created",
  "advance_requested",
  "advance_paid_escrow_held",
  "production_in_progress",
  "dispatched",
  "dispute_opened",
  "under_review",
];

export function isActivePipelineOrder(order: PaymentOrder): boolean {
  return ACTIVE_STATES.includes(order.state);
}

export type WeaverCapacityRow = {
  weaverId: string;
  weaverName: string;
  activeOrders: number;
  settledOrders: number;
  maxConcurrentIllustrative: number;
  utilizationPercent: number;
  status: "has_capacity" | "partially_booked" | "booked_out";
  statusLabel: string;
  ordersByState: { state: OrderState; label: string; count: number }[];
  capacityNote: string;
};

export function buildOrderDistribution(
  orders: PaymentOrder[],
): WeaverCapacityRow[] {
  return DEMO_CLUSTER_WEAVERS.map((w) => {
    const mine = orders.filter((o) => o.weaverId === w.id);
    const active = mine.filter(isActivePipelineOrder);
    const settled = mine.filter((o) => o.state === "settlement_released");
    const max = ILLUSTRATIVE_MAX_CONCURRENT_ORDERS;
    const utilizationPercent = Math.min(
      100,
      Math.round((active.length / max) * 100),
    );

    let status: WeaverCapacityRow["status"] = "has_capacity";
    let statusLabel = "Has capacity";
    if (active.length >= max) {
      status = "booked_out";
      statusLabel = "Booked out";
    } else if (active.length > 0) {
      status = "partially_booked";
      statusLabel = "Partially booked";
    }

    const stateCounts = new Map<OrderState, number>();
    for (const o of mine) {
      stateCounts.set(o.state, (stateCounts.get(o.state) ?? 0) + 1);
    }

    return {
      weaverId: w.id,
      weaverName: w.name,
      activeOrders: active.length,
      settledOrders: settled.length,
      maxConcurrentIllustrative: max,
      utilizationPercent,
      status,
      statusLabel,
      ordersByState: [...stateCounts.entries()].map(([state, count]) => ({
        state,
        label: adminStateLabel(state),
        count,
      })),
      capacityNote: ILLUSTRATIVE_CAPACITY_NOTE,
    };
  });
}

export type ClusterDemandRow = {
  categoryId: DemandCategoryId;
  categoryLabel: string;
  demandScore: number;
  factors: { id: string; label: string; rawScore: number; weight: number }[];
  source: string;
};

export function buildClusterDemandVisibility(args: {
  region: string;
  requirements: BuyerRequirement[];
  ledgerByCategory: Record<string, LedgerOrder[]>;
  trendsByCategory: Record<string, ManualTrendEntry | null>;
}): ClusterDemandRow[] {
  return DEMAND_CATEGORIES.map((cat) => {
    const scored = scoreCategory({
      categoryId: cat.id,
      region: args.region,
      requirements: args.requirements,
      ledgerOrders: args.ledgerByCategory[cat.id] ?? [],
      manualTrend: args.trendsByCategory[cat.id] ?? null,
    });
    return {
      categoryId: cat.id,
      categoryLabel: cat.label,
      demandScore: scored.demandScore,
      factors: scored.factors.map((f) => ({
        id: f.id,
        label: f.label,
        rawScore: f.rawScore,
        weight: f.weight,
      })),
      source:
        "Same decision formula: Buyer + Seasonal + Historical + Market + MasterWeaver — not a separate invented metric.",
    };
  }).sort((a, b) => b.demandScore - a.demandScore);
}

export function clusterMeta() {
  return {
    cluster: DEMO_CLUSTER,
    weaverCount: DEMO_CLUSTER_WEAVERS.length,
    illustrativeCapacityNote: ILLUSTRATIVE_CAPACITY_NOTE,
  };
}
