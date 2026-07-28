export const SIM_EPOCH_COOKIE = "loomos_sim_epoch";

/**
 * Per-login simulated weaver pipeline for the pitch.
 * Demo logins get a fresh set of orders/production each login.
 * New registers stay empty (tour guides them).
 */
import { randomInt } from "node:crypto";
import { DEMO_WEAVER_LOGINS } from "@/lib/demo/logins";
import { readStore, writeStore } from "@/lib/demand/store";
import type { DemandCategoryId } from "@/lib/demand/types";
import type { OrderState, PaymentOrder } from "@/lib/payments/types";
import { defaultWallet } from "@/lib/wallet/stability";

const BUYERS = ["buyer-demo-001", "buyer-demo-002", "buyer-demo-003"] as const;

const CATEGORIES: DemandCategoryId[] = [
  "cotton-saree",
  "silk-saree",
  "stole-dupatta",
  "dhoti-angavastram",
];

export function isDemoWeaverId(weaverId: string): boolean {
  return DEMO_WEAVER_LOGINS.some((d) => d.weaverId === weaverId);
}

function pickCategory(i: number): DemandCategoryId {
  return CATEGORIES[i % CATEGORIES.length]!;
}

function orderStub(args: {
  id: string;
  weaverId: string;
  buyerId: string;
  category: DemandCategoryId;
  amount: number;
  advanceAmount: number;
  state: OrderState;
  createdAt: string;
  dispatchedAt?: string;
  expectedSettlementAt?: string;
  settledAt?: string;
}): PaymentOrder {
  return {
    id: args.id,
    weaverId: args.weaverId,
    buyerId: args.buyerId,
    category: args.category,
    amount: args.amount,
    advanceAmount: args.advanceAmount,
    state: args.state,
    createdAt: args.createdAt,
    dispatchedAt: args.dispatchedAt,
    expectedSettlementAt: args.expectedSettlementAt,
    settledAt: args.settledAt,
    stateHistory: [{ state: args.state, at: args.createdAt }],
  };
}

/** Build a varied production + money story for this login. */
function buildFreshPipeline(weaverId: string, epoch: string): PaymentOrder[] {
  const now = new Date();
  const iso = now.toISOString();
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  const amt = (base: number) => base + randomInt(0, 8) * 500;
  const prefix = `sim-${weaverId}-${epoch}`;

  const stories: OrderState[] = [
    "production_in_progress",
    "advance_paid_escrow_held",
    "dispatched",
    "settlement_released",
    "order_created",
  ];

  return stories.map((state, i) => {
    const amount = amt(8000 + i * 3000);
    const advanceAmount = Math.round(amount * 0.3);
    const createdAt = new Date(now.getTime() - (i + 1) * 86400000 * 3).toISOString();
    const base = {
      id: `${prefix}-${i + 1}`,
      weaverId,
      buyerId: BUYERS[i % BUYERS.length]!,
      category: pickCategory(i + randomInt(0, 3)),
      amount,
      advanceAmount,
      state,
      createdAt,
    };

    if (state === "dispatched") {
      return orderStub({
        ...base,
        dispatchedAt: iso,
        expectedSettlementAt: day(1),
      });
    }
    if (state === "settlement_released") {
      const settled = new Date(now.getTime() - 86400000 * 5).toISOString();
      return orderStub({
        ...base,
        createdAt: new Date(now.getTime() - 86400000 * 40).toISOString(),
        dispatchedAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
        expectedSettlementAt: day(-5),
        settledAt: settled,
      });
    }
    return orderStub(base);
  });
}

/**
 * Call after weaver login/register.
 * - register / non-demo: clear this weaver's sim-* rows → empty Money/Orders
 * - demo login: replace with a fresh simulated pipeline (orders + production)
 */
export async function bootstrapWeaverSimulation(args: {
  weaverId: string;
  mode: "login" | "register";
}): Promise<{ isNew: boolean; simEpoch: string; hasPipeline: boolean }> {
  const simEpoch = Date.now().toString(36);
  const store = await readStore();
  const isDemo = isDemoWeaverId(args.weaverId);

  // Drop this weaver's prior payment rows so each login gets a fresh story
  store.paymentOrders = store.paymentOrders.filter(
    (o) => o.weaverId !== args.weaverId,
  );

  if (args.mode === "register" || !isDemo) {
    // New / non-demo weavers: keep identity only — empty simulated money story
    if (!store.wallets.some((w) => w.weaverId === args.weaverId)) {
      store.wallets.push(defaultWallet(args.weaverId));
    }
    await writeStore(store);
    return {
      isNew: args.mode === "register" || !isDemo,
      simEpoch,
      hasPipeline: false,
    };
  }

  const fresh = buildFreshPipeline(args.weaverId, simEpoch);
  store.paymentOrders.push(...fresh);
  if (!store.wallets.some((w) => w.weaverId === args.weaverId)) {
    store.wallets.push(defaultWallet(args.weaverId));
  }
  await writeStore(store);

  return { isNew: false, simEpoch, hasPipeline: true };
}
