import { promises as fs } from "fs";
import path from "path";
import type {
  BuyerRequirement,
  DemandCategoryId,
  LedgerOrder,
  LoomStore,
  ManualTrendEntry,
} from "@/lib/demand/types";
import type {
  BuyerProfile,
  Dispute,
  OrderState,
  PaymentOrder,
} from "@/lib/payments/types";
import { DEMO_WEAVER } from "@/lib/types";
import {
  DEMO_BUYERS,
  DEMO_CLUSTER,
} from "@/lib/demo/cluster";
import { buyerDisplayName } from "@/lib/demand/order-plan";
import { canTransition } from "@/lib/payments/states";
import { projectedSettlementDate } from "@/lib/payments/trust";
import {
  applySettlementCredit,
  buildWalletSnapshot,
  defaultWallet,
  drawReserveToAvailable,
  moveAvailableToReserve,
} from "@/lib/wallet/stability";
import type { WalletSnapshot, WeaverWallet } from "@/lib/wallet/types";
import {
  buildClusterDemandVisibility,
  buildOrderDistribution,
  clusterMeta,
} from "@/lib/coop/dashboard";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import { defaultStockFor, type WeaverStock } from "@/lib/demand/stock";

/** Bundled seed (read-only on Vercel under /var/task). */
const BUNDLED_STORE_PATH = path.join(process.cwd(), "data", "loomos-store.json");

/**
 * Vercel/Lambda filesystem is read-only except /tmp.
 * Locally we keep writing to data/ for persistence across restarts.
 */
function isServerlessRuntime(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.FUNCTION_NAME,
  );
}

const DATA_DIR = isServerlessRuntime()
  ? path.join("/tmp", "loomos-data")
  : path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "loomos-store.json");

/** Warm-instance cache — survives writes when disk fails; lost on cold start. */
let memoryStore: LoomStore | null = null;

/** Relabel demo buyer names; OTP auth lives in Postgres (no passwords). */
function mergeBuyerProfiles(
  existing: BuyerProfile[],
  seeded: BuyerProfile[],
): BuyerProfile[] {
  return existing.map((b) => {
    const seed = seeded.find((s) => s.id === b.id);
    if (seed) {
      const { passwordDemo: _drop, ...rest } = {
        ...b,
        ...seed,
        name: seed.name,
        email: seed.email ?? b.email,
      };
      return rest;
    }
    const { passwordDemo: _drop, ...rest } = b;
    return rest;
  });
}

/** Fill missing buyerName on payment orders from buyer profiles / demo cluster. */
function enrichPaymentOrders(
  orders: PaymentOrder[],
  buyers: BuyerProfile[],
): PaymentOrder[] {
  return orders.map((o) => {
    if (o.buyerName?.trim()) return o;
    return {
      ...o,
      buyerName: buyerDisplayName(
        o.buyerId,
        buyers.find((b) => b.id === o.buyerId)?.name,
      ),
    };
  });
}

/** Ensure fictional cluster pipeline seed orders exist for Stage 11 dashboard.
 * Skip weavers that already have a fresh per-login `sim-*` pipeline.
 */
function mergeClusterPipelineOrders(
  existing: PaymentOrder[],
  seeded: PaymentOrder[],
): PaymentOrder[] {
  const seedById = new Map(seeded.map((o) => [o.id, o]));
  const patched = existing.map((o) => {
    const seed = seedById.get(o.id);
    if (!seed) return o;
    return {
      ...o,
      buyerName: o.buyerName ?? seed.buyerName,
      requirementId: o.requirementId ?? seed.requirementId,
    };
  });
  const ids = new Set(patched.map((o) => o.id));
  const weaversWithSim = new Set(
    patched
      .filter((o) => o.id.startsWith("sim-"))
      .map((o) => o.weaverId),
  );
  const extras = seeded.filter(
    (o) =>
      !ids.has(o.id) &&
      !weaversWithSim.has(o.weaverId) &&
      (o.id.startsWith("ord-selvi-") ||
        o.id.startsWith("ord-kamala-") ||
        o.id.startsWith("ord-lakshmi-")),
  );
  return [...patched, ...extras];
}

function seedPaymentSlice(): Pick<
  LoomStore,
  "paymentOrders" | "disputes" | "buyers"
> {
  const now = new Date().toISOString();
  const buyers: BuyerProfile[] = DEMO_BUYERS.map((b) => ({
    id: b.id,
    name: b.name,
    region: b.region,
    email: b.email,
  }));

  // Seed history for Demo Mode trust/wallet clicks — fictional amounts only
  const history: PaymentOrder[] = [
    {
      id: "ord-hist-001",
      weaverId: DEMO_WEAVER.id,
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      category: "cotton-saree",
      amount: 18000,
      advanceAmount: 5000,
      state: "settlement_released",
      createdAt: "2026-05-01T10:00:00.000Z",
      dispatchedAt: "2026-05-20T10:00:00.000Z",
      expectedSettlementAt: "2026-05-21",
      settledAt: "2026-05-21T12:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-05-01T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-05-21T12:00:00.000Z" },
      ],
    },
    {
      id: "ord-hist-002",
      weaverId: DEMO_WEAVER.id,
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      category: "cotton-saree",
      amount: 12000,
      advanceAmount: 4000,
      state: "settlement_released",
      createdAt: "2026-06-01T10:00:00.000Z",
      dispatchedAt: "2026-06-18T10:00:00.000Z",
      expectedSettlementAt: "2026-06-19",
      settledAt: "2026-06-19T09:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-06-01T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-06-19T09:00:00.000Z" },
      ],
    },
    {
      id: "ord-hist-003",
      weaverId: DEMO_WEAVER.id,
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      category: "silk-saree",
      amount: 32000,
      advanceAmount: 10000,
      state: "settlement_released",
      createdAt: "2026-04-10T10:00:00.000Z",
      dispatchedAt: "2026-05-05T10:00:00.000Z",
      expectedSettlementAt: "2026-05-06",
      settledAt: "2026-05-06T11:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-04-10T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-05-06T11:00:00.000Z" },
      ],
    },
  ];

  const walkOrder: PaymentOrder = {
    id: "ord-walk-001",
    weaverId: DEMO_WEAVER.id,
    buyerId: "buyer-demo-001",
    buyerName: DEMO_BUYERS[0].name,
    requirementId: "req-001",
    category: "cotton-saree",
    amount: 15000,
    advanceAmount: 4500,
    state: "order_created",
    createdAt: now,
    stateHistory: [{ state: "order_created", at: now }],
  };

  // Extra fictional pipeline orders so the cluster dashboard shows distribution
  const clusterPipeline: PaymentOrder[] = [
    {
      id: "ord-selvi-001",
      weaverId: "weaver-demo-002",
      buyerId: "buyer-demo-002",
      buyerName: DEMO_BUYERS[1].name,
      requirementId: "req-002",
      category: "cotton-saree",
      amount: 9000,
      advanceAmount: 3000,
      state: "production_in_progress",
      createdAt: now,
      stateHistory: [
        { state: "order_created", at: now },
        { state: "production_in_progress", at: now },
      ],
    },
    {
      id: "ord-selvi-002",
      weaverId: "weaver-demo-002",
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      category: "stole-dupatta",
      amount: 4000,
      advanceAmount: 1000,
      state: "advance_paid_escrow_held",
      createdAt: now,
      stateHistory: [
        { state: "order_created", at: now },
        { state: "advance_paid_escrow_held", at: now },
      ],
    },
    {
      id: "ord-selvi-003",
      weaverId: "weaver-demo-002",
      buyerId: "buyer-demo-002",
      buyerName: DEMO_BUYERS[1].name,
      category: "cotton-saree",
      amount: 16000,
      advanceAmount: 5000,
      state: "settlement_released",
      createdAt: "2026-05-12T10:00:00.000Z",
      dispatchedAt: "2026-05-30T10:00:00.000Z",
      expectedSettlementAt: "2026-05-31",
      settledAt: "2026-05-31T12:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-05-12T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-05-31T12:00:00.000Z" },
      ],
    },
    {
      id: "ord-kamala-001",
      weaverId: "weaver-demo-003",
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      requirementId: "req-003",
      category: "silk-saree",
      amount: 28000,
      advanceAmount: 8000,
      state: "dispatched",
      createdAt: now,
      dispatchedAt: now,
      expectedSettlementAt: projectedSettlementDate(now),
      stateHistory: [
        { state: "order_created", at: now },
        { state: "dispatched", at: now },
      ],
    },
    {
      id: "ord-kamala-002",
      weaverId: "weaver-demo-003",
      buyerId: "buyer-demo-002",
      buyerName: DEMO_BUYERS[1].name,
      requirementId: "req-005",
      category: "dhoti-angavastram",
      amount: 9500,
      advanceAmount: 2800,
      state: "settlement_released",
      createdAt: "2026-04-08T10:00:00.000Z",
      dispatchedAt: "2026-04-22T10:00:00.000Z",
      expectedSettlementAt: "2026-04-23",
      settledAt: "2026-04-23T09:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-04-08T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-04-23T09:00:00.000Z" },
      ],
    },
    {
      id: "ord-lakshmi-001",
      weaverId: "weaver-demo-004",
      buyerId: "buyer-demo-003",
      buyerName: DEMO_BUYERS[2].name,
      requirementId: "req-004",
      category: "stole-dupatta",
      amount: 7200,
      advanceAmount: 2200,
      state: "advance_paid_escrow_held",
      createdAt: now,
      stateHistory: [
        { state: "order_created", at: now },
        { state: "advance_paid_escrow_held", at: now },
      ],
    },
    {
      id: "ord-lakshmi-002",
      weaverId: "weaver-demo-004",
      buyerId: "buyer-demo-002",
      buyerName: DEMO_BUYERS[1].name,
      category: "dhoti-angavastram",
      amount: 11000,
      advanceAmount: 3500,
      state: "settlement_released",
      createdAt: "2026-06-10T10:00:00.000Z",
      dispatchedAt: "2026-06-28T10:00:00.000Z",
      expectedSettlementAt: "2026-06-29",
      settledAt: "2026-06-29T11:00:00.000Z",
      stateHistory: [
        { state: "order_created", at: "2026-06-10T10:00:00.000Z" },
        { state: "settlement_released", at: "2026-06-29T11:00:00.000Z" },
      ],
    },
    {
      id: "ord-lakshmi-003",
      weaverId: "weaver-demo-004",
      buyerId: "buyer-demo-001",
      buyerName: DEMO_BUYERS[0].name,
      category: "cotton-saree",
      amount: 13500,
      advanceAmount: 4000,
      state: "production_in_progress",
      createdAt: now,
      stateHistory: [
        { state: "order_created", at: now },
        { state: "production_in_progress", at: now },
      ],
    },
  ];

  return {
    buyers,
    paymentOrders: [...history, walkOrder, ...clusterPipeline],
    disputes: [],
  };
}

/** Seed open buyer requirements — Delhi-primary (IIT Delhi) + a few national hubs. */
function seedStore(): LoomStore {
  const now = new Date().toISOString();
  return {
    buyerRequirements: [
      {
        id: "req-001",
        buyerId: "buyer-demo-001",
        buyerName: DEMO_BUYERS[0].name,
        categoryId: "cotton-saree",
        region: "Delhi",
        district: "IIT Delhi",
        quantity: 12,
        neededBy: "2026-10-15",
        priceMin: 900,
        priceMax: 1400,
        status: "open",
        notes:
          "Saffron Thread Boutique — cotton sarees for walk-in buyers around IIT Delhi.",
        createdAt: now,
      },
      {
        id: "req-002",
        buyerId: "buyer-demo-002",
        buyerName: DEMO_BUYERS[1].name,
        categoryId: "cotton-saree",
        region: "Delhi",
        district: "Hauz Khas",
        quantity: 8,
        neededBy: "2026-11-01",
        priceMin: 850,
        priceMax: 1200,
        status: "open",
        notes:
          "Festival Cloth Desk — Hauz Khas wholesale fill for early November.",
        createdAt: now,
      },
      {
        id: "req-003",
        buyerId: "buyer-demo-001",
        buyerName: DEMO_BUYERS[0].name,
        categoryId: "silk-saree",
        region: "Delhi",
        district: "South Delhi",
        quantity: 10,
        neededBy: "2026-12-01",
        priceMin: 4500,
        priceMax: 7800,
        status: "open",
        notes:
          "Saffron silk lot for South Delhi wedding retail racks.",
        createdAt: now,
      },
      {
        id: "req-004",
        buyerId: "buyer-demo-003",
        buyerName: DEMO_BUYERS[2].name,
        categoryId: "stole-dupatta",
        region: "Delhi",
        district: "Karol Bagh",
        quantity: 24,
        neededBy: "2026-09-20",
        priceMin: 450,
        priceMax: 750,
        status: "open",
        notes:
          "Loom Link Resellers — Karol Bagh gift-set stoles for Delhi drop.",
        createdAt: now,
      },
      {
        id: "req-005",
        buyerId: "buyer-demo-002",
        buyerName: DEMO_BUYERS[1].name,
        categoryId: "dhoti-angavastram",
        region: "Delhi",
        district: "Saket",
        quantity: 15,
        neededBy: "2026-10-05",
        priceMin: 600,
        priceMax: 950,
        status: "open",
        notes:
          "Festival Cloth Desk — Saket temple-season dhoti set.",
        createdAt: now,
      },
      {
        id: "req-006",
        buyerId: "buyer-demo-001",
        buyerName: DEMO_BUYERS[0].name,
        categoryId: "cotton-saree",
        region: "Delhi",
        district: "New Delhi",
        quantity: 18,
        neededBy: "2026-10-22",
        priceMin: 950,
        priceMax: 1500,
        status: "open",
        notes:
          "New Delhi boutique restock — Connaught Place belt, Delhi district cluster.",
        createdAt: now,
      },
      {
        id: "req-007",
        buyerId: "buyer-demo-003",
        buyerName: DEMO_BUYERS[2].name,
        categoryId: "stole-dupatta",
        region: "Delhi",
        district: "Chandni Chowk",
        quantity: 30,
        neededBy: "2026-09-28",
        priceMin: 400,
        priceMax: 700,
        status: "open",
        notes:
          "Chandni Chowk wholesale stoles — Delhi district cluster hub.",
        createdAt: now,
      },
      // National / other-state demand (visible on National scope)
      {
        id: "req-nat-001",
        buyerId: "buyer-demo-002",
        buyerName: DEMO_BUYERS[1].name,
        categoryId: "cotton-saree",
        region: "Tamil Nadu",
        district: "Kanchipuram",
        quantity: 10,
        neededBy: "2026-11-15",
        priceMin: 800,
        priceMax: 1300,
        status: "open",
        notes: "National signal — Kanchipuram cotton lot (outside Delhi).",
        createdAt: now,
      },
      {
        id: "req-nat-002",
        buyerId: "buyer-demo-003",
        buyerName: DEMO_BUYERS[2].name,
        categoryId: "silk-saree",
        region: "Uttar Pradesh",
        district: "Varanasi",
        quantity: 6,
        neededBy: "2026-12-10",
        priceMin: 5000,
        priceMax: 9000,
        status: "open",
        notes: "National signal — Varanasi silk inquiry.",
        createdAt: now,
      },
      {
        id: "req-nat-003",
        buyerId: "buyer-demo-001",
        buyerName: DEMO_BUYERS[0].name,
        categoryId: "stole-dupatta",
        region: "West Bengal",
        district: "Shantipur",
        quantity: 20,
        neededBy: "2026-10-30",
        priceMin: 420,
        priceMax: 680,
        status: "open",
        notes: "National signal — Shantipur stole fill.",
        createdAt: now,
      },
    ],
    manualTrends: [],
    ledgerOrders: [],
    ...seedPaymentSlice(),
    wallets: [],
    walletCredits: [],
    weaverStock: [
      defaultStockFor("weaver-demo-001"),
      defaultStockFor("weaver-demo-002"),
      defaultStockFor("weaver-demo-003"),
      defaultStockFor("weaver-demo-004"),
    ],
  };
}

function normalizeStore(raw: Partial<LoomStore>): LoomStore {
  const base = seedStore();
  const paymentSlice =
    raw.paymentOrders && raw.buyers
      ? {
          paymentOrders: mergeClusterPipelineOrders(
            raw.paymentOrders,
            seedPaymentSlice().paymentOrders,
          ),
          disputes: raw.disputes ?? [],
          buyers: mergeBuyerProfiles(raw.buyers, seedPaymentSlice().buyers),
        }
      : seedPaymentSlice();

  return {
    buyerRequirements: (() => {
      const mapped: BuyerRequirement[] = (
        raw.buyerRequirements ?? base.buyerRequirements
      ).map((r) => {
          const demoBuyer = DEMO_BUYERS.find((b) => b.id === r.buyerId);
          const seed = base.buyerRequirements.find((s) => s.id === r.id);
          if (demoBuyer) {
            return {
              ...r,
              buyerName: demoBuyer.name,
              region: seed?.region ?? demoBuyer.region ?? r.region,
              district: r.district ?? seed?.district ?? demoBuyer.district,
            };
          }
          if (r.id.startsWith("req-00") && !r.buyerId) {
            const fallback = DEMO_BUYERS[0];
            return {
              ...r,
              buyerId: fallback.id,
              buyerName: fallback.name,
              region: seed?.region ?? "Delhi",
              district: r.district ?? seed?.district ?? "IIT Delhi",
              notes: r.notes?.includes("Demo Mode") || r.notes?.includes("Simulated")
                ? r.notes
                : "Open buyer requirement",
            };
          }
          return {
            ...r,
            region: seed?.region ?? r.region,
            district: r.district ?? seed?.district,
          };
        });
      // Ensure pitch seed posts exist even on older JSON files
      const ids = new Set(mapped.map((r) => r.id));
      for (const seed of base.buyerRequirements) {
        if (!ids.has(seed.id)) mapped.push(seed);
      }
      return mapped;
    })(),
    manualTrends: raw.manualTrends ?? [],
    ledgerOrders: raw.ledgerOrders ?? [],
    paymentOrders: enrichPaymentOrders(
      paymentSlice.paymentOrders,
      paymentSlice.buyers,
    ),
    disputes: paymentSlice.disputes,
    buyers: paymentSlice.buyers,
    wallets: raw.wallets ?? [],
    walletCredits: raw.walletCredits ?? [],
    weaverStock: (() => {
      const existing = raw.weaverStock ?? [];
      const byId = new Map(existing.map((s) => [s.weaverId, s]));
      for (const seed of base.weaverStock) {
        if (!byId.has(seed.weaverId)) byId.set(seed.weaverId, seed);
      }
      return [...byId.values()];
    })(),
  };
}

async function tryReadJson(filePath: string): Promise<Partial<LoomStore> | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Partial<LoomStore>;
  } catch {
    return null;
  }
}

async function persistStore(store: LoomStore): Promise<void> {
  memoryStore = store;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    // EROFS on misconfigured paths — keep serving from memory for this instance
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code?: unknown }).code)
        : "";
    if (code !== "EROFS" && code !== "EACCES") throw err;
    console.warn(
      "[loomos-store] disk write failed; using in-memory store for this instance",
      code,
    );
  }
}

function storeNeedsMigration(parsed: Partial<LoomStore>): boolean {
  return (
    !parsed.paymentOrders ||
    !parsed.buyers ||
    !parsed.wallets ||
    !parsed.walletCredits ||
    Boolean(
      parsed.buyers?.some(
        (b) =>
          (b.id === "buyer-demo-001" && b.email !== DEMO_BUYERS[0].email) ||
          (b.id === "buyer-demo-001" && b.name !== DEMO_BUYERS[0].name),
      ),
    ) ||
    !(parsed.paymentOrders ?? []).some(
      (o) =>
        o.id === "ord-selvi-001" ||
        (o.weaverId === "weaver-demo-002" && o.id.startsWith("sim-")),
    ) ||
    !(parsed.paymentOrders ?? []).some(
      (o) =>
        o.id === "ord-lakshmi-001" ||
        (o.weaverId === "weaver-demo-004" && o.id.startsWith("sim-")),
    ) ||
    !(parsed.buyerRequirements ?? []).some((r) => r.id === "req-004") ||
    !(parsed.buyerRequirements ?? []).some(
      (r) =>
        r.id === "req-001" &&
        normalizeStateName(r.region) === "Delhi" &&
        Boolean(r.district),
    ) ||
    !(parsed.buyerRequirements ?? []).some((r) => r.id === "req-006") ||
    !parsed.weaverStock
  );
}

function normalizeStateName(region: string): string {
  const cleaned = region.trim().toLowerCase();
  if (cleaned === "delhi" || cleaned.includes("delhi")) return "Delhi";
  return region;
}

async function ensureStore(): Promise<LoomStore> {
  if (memoryStore) return memoryStore;

  const fromWritable = await tryReadJson(STORE_PATH);
  if (fromWritable) {
    const normalized = normalizeStore(fromWritable);
    if (storeNeedsMigration(fromWritable)) {
      await persistStore(normalized);
    } else {
      memoryStore = normalized;
    }
    return normalized;
  }

  // First warm start on Vercel: seed from the bundled read-only file if present
  const fromBundled =
    STORE_PATH !== BUNDLED_STORE_PATH
      ? await tryReadJson(BUNDLED_STORE_PATH)
      : null;
  if (fromBundled) {
    const normalized = normalizeStore(fromBundled);
    await persistStore(normalized);
    return normalized;
  }

  const seeded = seedStore();
  await persistStore(seeded);
  return seeded;
}

export async function readStore(): Promise<LoomStore> {
  return ensureStore();
}

export async function writeStore(store: LoomStore): Promise<void> {
  await persistStore(store);
}

export async function listOpenRequirements(filters?: {
  categoryId?: DemandCategoryId;
  region?: string;
}): Promise<BuyerRequirement[]> {
  const store = await readStore();
  return store.buyerRequirements.filter((r) => {
    if (r.status !== "open") return false;
    if (filters?.categoryId && r.categoryId !== filters.categoryId) return false;
    if (
      filters?.region &&
      r.region.toLowerCase() !== filters.region.toLowerCase()
    ) {
      return false;
    }
    return true;
  });
}

export async function upsertRequirement(
  req: BuyerRequirement,
): Promise<BuyerRequirement> {
  const store = await readStore();
  const idx = store.buyerRequirements.findIndex((r) => r.id === req.id);
  if (idx >= 0) store.buyerRequirements[idx] = req;
  else store.buyerRequirements.push(req);
  await writeStore(store);
  return req;
}

export async function deleteRequirement(id: string): Promise<void> {
  const store = await readStore();
  store.buyerRequirements = store.buyerRequirements.filter((r) => r.id !== id);
  await writeStore(store);
}

export async function setManualTrend(
  entry: ManualTrendEntry,
): Promise<ManualTrendEntry> {
  const store = await readStore();
  const idx = store.manualTrends.findIndex(
    (t) =>
      t.categoryId === entry.categoryId &&
      t.region.toLowerCase() === entry.region.toLowerCase(),
  );
  if (idx >= 0) store.manualTrends[idx] = entry;
  else store.manualTrends.push(entry);
  await writeStore(store);
  return entry;
}

export async function getManualTrend(
  categoryId: DemandCategoryId,
  region: string,
): Promise<ManualTrendEntry | null> {
  const store = await readStore();
  return (
    store.manualTrends.find(
      (t) =>
        t.categoryId === categoryId &&
        t.region.toLowerCase() === region.toLowerCase(),
    ) ?? null
  );
}

export async function getWeaverStock(weaverId: string): Promise<WeaverStock> {
  const store = await readStore();
  const existing = store.weaverStock.find((s) => s.weaverId === weaverId);
  if (existing) return existing;
  const created = defaultStockFor(weaverId);
  store.weaverStock.push(created);
  await writeStore(store);
  return created;
}

export async function upsertWeaverStock(
  patch: Partial<WeaverStock> & { weaverId: string },
): Promise<WeaverStock> {
  const store = await readStore();
  const idx = store.weaverStock.findIndex((s) => s.weaverId === patch.weaverId);
  const base =
    idx >= 0 ? store.weaverStock[idx]! : defaultStockFor(patch.weaverId);
  const next: WeaverStock = {
    ...base,
    weaverId: patch.weaverId,
    updatedAt: new Date().toISOString(),
  };
  const keys = [
    "yarnCottonKg",
    "yarnSilkKg",
    "finishedCottonSaree",
    "finishedSilkSaree",
    "finishedStole",
    "finishedDhoti",
  ] as const;
  for (const key of keys) {
    const v = patch[key];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      next[key] = v;
    }
  }
  if (idx >= 0) store.weaverStock[idx] = next;
  else store.weaverStock.push(next);
  await writeStore(store);
  return next;
}

export async function replaceLedgerOrders(
  orders: LedgerOrder[],
): Promise<number> {
  const store = await readStore();
  store.ledgerOrders = orders;
  await writeStore(store);
  return orders.length;
}

export async function getLedgerOrders(
  categoryId: DemandCategoryId,
  region: string,
): Promise<LedgerOrder[]> {
  const store = await readStore();
  return store.ledgerOrders.filter(
    (o) =>
      o.categoryId === categoryId &&
      o.region.toLowerCase() === region.toLowerCase(),
  );
}

/* ——— Stage 4 payment helpers ——— */

export async function listPaymentOrders(filters?: {
  weaverId?: string;
  buyerId?: string;
}): Promise<PaymentOrder[]> {
  const store = await readStore();
  return store.paymentOrders.filter((o) => {
    if (filters?.weaverId && o.weaverId !== filters.weaverId) return false;
    if (filters?.buyerId && o.buyerId !== filters.buyerId) return false;
    return true;
  });
}

export async function getPaymentOrder(id: string): Promise<PaymentOrder | null> {
  const store = await readStore();
  return store.paymentOrders.find((o) => o.id === id) ?? null;
}

export async function createPaymentOrder(
  input: Omit<PaymentOrder, "state" | "stateHistory" | "createdAt"> & {
    createdAt?: string;
  },
): Promise<PaymentOrder> {
  const store = await readStore();
  const now = input.createdAt ?? new Date().toISOString();
  const order: PaymentOrder = {
    ...input,
    state: "order_created",
    createdAt: now,
    stateHistory: [{ state: "order_created", at: now }],
  };
  store.paymentOrders.push(order);
  await writeStore(store);
  return order;
}

export async function transitionPaymentOrder(
  orderId: string,
  to: OrderState,
): Promise<PaymentOrder> {
  const store = await readStore();
  const order = store.paymentOrders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found");
  if (!canTransition(order.state, to)) {
    throw new Error(`Cannot move from ${order.state} to ${to}`);
  }
  const now = new Date().toISOString();
  order.state = to;
  order.stateHistory.push({ state: to, at: now });

  if (to === "dispatched") {
    order.dispatchedAt = now;
    order.expectedSettlementAt = projectedSettlementDate(now);
  }
  if (to === "settlement_released") {
    order.settledAt = now;
    creditSettlementToWallet(store, order);
  }

  await writeStore(store);
  return order;
}

function creditSettlementToWallet(store: LoomStore, order: PaymentOrder): void {
  const already = store.walletCredits.some(
    (c) => c.orderId === order.id && c.weaverId === order.weaverId,
  );
  if (already) return;
  let wallet = store.wallets.find((w) => w.weaverId === order.weaverId);
  if (!wallet) {
    wallet = defaultWallet(order.weaverId);
    store.wallets.push(wallet);
  }
  const credited = applySettlementCredit(wallet, order.amount);
  const idx = store.wallets.findIndex((w) => w.weaverId === order.weaverId);
  store.wallets[idx] = credited;
  store.walletCredits.push({ weaverId: order.weaverId, orderId: order.id });
}

/**
 * Ensure past Settlement Released seed rows are credited once into Available.
 */
async function syncWalletCredits(weaverId: string): Promise<WeaverWallet> {
  const store = await readStore();
  let wallet = store.wallets.find((w) => w.weaverId === weaverId);
  if (!wallet) {
    wallet = defaultWallet(weaverId);
    store.wallets.push(wallet);
  }
  for (const order of store.paymentOrders) {
    if (
      order.weaverId === weaverId &&
      order.state === "settlement_released" &&
      order.settledAt
    ) {
      creditSettlementToWallet(store, order);
    }
  }
  await writeStore(store);
  return store.wallets.find((w) => w.weaverId === weaverId) ?? wallet;
}

export async function getWalletSnapshot(
  weaverId: string,
): Promise<WalletSnapshot> {
  await syncWalletCredits(weaverId);
  const store = await readStore();
  const wallet =
    store.wallets.find((w) => w.weaverId === weaverId) ?? defaultWallet(weaverId);
  return buildWalletSnapshot(wallet, store.paymentOrders);
}

export async function updateWalletSettings(
  weaverId: string,
  patch: Partial<Pick<WeaverWallet, "reserveFloor" | "surplusSavePercent">>,
): Promise<WalletSnapshot> {
  await syncWalletCredits(weaverId);
  const store = await readStore();
  const idx = store.wallets.findIndex((w) => w.weaverId === weaverId);
  const current =
    idx >= 0 ? store.wallets[idx] : defaultWallet(weaverId);
  const next: WeaverWallet = {
    ...current,
    reserveFloor:
      patch.reserveFloor !== undefined
        ? Math.max(0, patch.reserveFloor)
        : current.reserveFloor,
    surplusSavePercent:
      patch.surplusSavePercent !== undefined
        ? Math.min(100, Math.max(0, patch.surplusSavePercent))
        : current.surplusSavePercent,
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) store.wallets[idx] = next;
  else store.wallets.push(next);
  await writeStore(store);
  return buildWalletSnapshot(next, store.paymentOrders);
}

export async function confirmSaveToReserve(
  weaverId: string,
  amount: number,
): Promise<WalletSnapshot> {
  await syncWalletCredits(weaverId);
  const store = await readStore();
  const idx = store.wallets.findIndex((w) => w.weaverId === weaverId);
  if (idx < 0) throw new Error("Wallet not found");
  store.wallets[idx] = moveAvailableToReserve(store.wallets[idx], amount);
  await writeStore(store);
  return buildWalletSnapshot(store.wallets[idx], store.paymentOrders);
}

export async function confirmDrawFromReserve(
  weaverId: string,
  amount: number,
): Promise<WalletSnapshot> {
  await syncWalletCredits(weaverId);
  const store = await readStore();
  const idx = store.wallets.findIndex((w) => w.weaverId === weaverId);
  if (idx < 0) throw new Error("Wallet not found");
  store.wallets[idx] = drawReserveToAvailable(store.wallets[idx], amount);
  await writeStore(store);
  return buildWalletSnapshot(store.wallets[idx], store.paymentOrders);
}

export async function openDispute(
  orderId: string,
  reason: string,
): Promise<{ order: PaymentOrder; dispute: Dispute }> {
  const store = await readStore();
  const order = store.paymentOrders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found");
  if (!canTransition(order.state, "dispute_opened")) {
    throw new Error(`Cannot open dispute from ${order.state}`);
  }
  const now = new Date().toISOString();
  order.state = "dispute_opened";
  order.stateHistory.push({ state: "dispute_opened", at: now });
  const dispute: Dispute = {
    orderId,
    reason,
    status: "opened",
    openedAt: now,
  };
  store.disputes = store.disputes.filter((d) => d.orderId !== orderId);
  store.disputes.push(dispute);
  await writeStore(store);
  return { order, dispute };
}

export async function advanceDispute(
  orderId: string,
  to: "under_review" | "resolved",
): Promise<{ order: PaymentOrder; dispute: Dispute }> {
  const store = await readStore();
  const order = store.paymentOrders.find((o) => o.id === orderId);
  const dispute = store.disputes.find((d) => d.orderId === orderId);
  if (!order || !dispute) throw new Error("Order or dispute not found");
  if (!canTransition(order.state, to)) {
    throw new Error(`Cannot move dispute from ${order.state} to ${to}`);
  }
  const now = new Date().toISOString();
  order.state = to;
  order.stateHistory.push({ state: to, at: now });
  dispute.status = to === "under_review" ? "under_review" : "resolved";
  if (to === "resolved") dispute.resolvedAt = now;
  await writeStore(store);
  return { order, dispute };
}

export async function listBuyers(): Promise<BuyerProfile[]> {
  const store = await readStore();
  return store.buyers;
}

export async function listDisputes(): Promise<Dispute[]> {
  const store = await readStore();
  return store.disputes;
}

export async function resetWalkOrder(): Promise<PaymentOrder> {
  const store = await readStore();
  const now = new Date().toISOString();
  const fresh: PaymentOrder = {
    id: `ord-walk-${Date.now()}`,
    weaverId: DEMO_WEAVER.id,
    buyerId: "buyer-demo-001",
    buyerName: DEMO_BUYERS[0].name,
    requirementId: "req-001",
    category: "cotton-saree",
    amount: 15000,
    advanceAmount: 4500,
    state: "order_created",
    createdAt: now,
    stateHistory: [{ state: "order_created", at: now }],
  };
  store.paymentOrders.push(fresh);
  await writeStore(store);
  return fresh;
}

/**
 * Verified weaver rule (Stage 9): at least one Settlement Released order.
 * Not a decorative badge — computed from Stage 4 payment data.
 */
export function isWeaverVerified(
  weaverId: string,
  orders: PaymentOrder[],
): boolean {
  return orders.some(
    (o) => o.weaverId === weaverId && o.state === "settlement_released",
  );
}

export async function listVerifiedWeaverDirectory(): Promise<
  {
    id: string;
    name: string;
    region: string;
    categories: string[];
    cooperativeName: string;
    verified: boolean;
    completedSettlements: number;
    verificationRule: string;
    demoMode: true;
    demoDisclaimer: string;
  }[]
> {
  const { listWeaversFromDb } = await import("@/lib/auth/identity");
  const store = await readStore();
  const weavers = await listWeaversFromDb();
  return weavers.map((w) => {
    const completed = store.paymentOrders.filter(
      (o) => o.weaverId === w.id && o.state === "settlement_released",
    ).length;
    const verified = completed >= 1;
    return {
      id: w.id,
      name: w.name,
      region: w.region,
      categories: w.categories,
      cooperativeName: w.cooperativeName ?? DEMO_CLUSTER.name,
      verified,
      completedSettlements: completed,
      verificationRule:
        "Verified = at least one Settlement Released order in LoomOS payment data (Stage 4). Not a decorative badge.",
      demoMode: true as const,
      demoDisclaimer: DEMO_CLUSTER.disclaimer,
    };
  });
}

export async function getClusterDashboard() {
  const store = await readStore();
  const distribution = buildOrderDistribution(store.paymentOrders);

  const ledgerByCategory: Record<string, typeof store.ledgerOrders> = {};
  const trendsByCategory: Record<
    string,
    (typeof store.manualTrends)[number] | null
  > = {};
  for (const cat of DEMAND_CATEGORIES) {
    ledgerByCategory[cat.id] = store.ledgerOrders.filter(
      (o) =>
        o.categoryId === cat.id &&
        o.region.toLowerCase() === DEMO_CLUSTER.region.toLowerCase(),
    );
    trendsByCategory[cat.id] =
      store.manualTrends.find(
        (t) =>
          t.categoryId === cat.id &&
          t.region.toLowerCase() === DEMO_CLUSTER.region.toLowerCase(),
      ) ?? null;
  }

  const demand = buildClusterDemandVisibility({
    region: DEMO_CLUSTER.region,
    requirements: store.buyerRequirements.filter(
      (r) => r.region.toLowerCase() === DEMO_CLUSTER.region.toLowerCase(),
    ),
    ledgerByCategory,
    trendsByCategory,
  });

  return {
    ...clusterMeta(),
    distribution,
    demand,
    demoMode: true,
  };
}

/**
 * Ensure Prisma buyer identity exists in JSON domain store (payments / requirements).
 * No passwords — OTP auth lives in SQLite.
 */
export async function ensureBuyerInJsonStore(buyer: {
  id: string;
  name: string;
  region: string;
  email?: string | null;
}): Promise<BuyerProfile> {
  const store = await readStore();
  const idx = store.buyers.findIndex((b) => b.id === buyer.id);
  const row: BuyerProfile = {
    id: buyer.id,
    name: buyer.name,
    region: buyer.region,
    email: buyer.email ?? undefined,
  };
  if (idx >= 0) {
    store.buyers[idx] = { ...store.buyers[idx], ...row };
    delete store.buyers[idx].passwordDemo;
  } else {
    store.buyers.push(row);
  }
  await writeStore(store);
  return row;
}

export async function getBuyerById(id: string): Promise<BuyerProfile | null> {
  const store = await readStore();
  return store.buyers.find((b) => b.id === id) ?? null;
}

/** Buyer weaver map — Delhi-primary clusters (IIT → District → Nation). */
export async function getBuyerWeaverMapData() {
  const { listWeaversFromDb } = await import("@/lib/auth/identity");
  const {
    buildBuyerMapDirectory,
    clusterByDistrict,
    clusterByState,
  } = await import("@/lib/map/build-map-data");
  const store = await readStore();
  const weavers = await listWeaversFromDb();
  const stockByWeaver: Record<string, (typeof store.weaverStock)[number]> = {};
  for (const s of store.weaverStock) {
    stockByWeaver[s.weaverId] = s;
  }
  const pins = buildBuyerMapDirectory({
    dbWeavers: weavers,
    paymentOrders: store.paymentOrders,
    stockByWeaver,
  });
  return {
    weavers: pins,
    districtClusters: clusterByDistrict(pins),
    stateClusters: clusterByState(pins),
    demoMode: true as const,
    disclaimer:
      "Default cluster: IIT Delhi · Delhi. Hub coordinates are approximate. Ratings from Settlement Released counts + verified badge.",
  };
}

/** Weaver order-demand heatmap (requirements + open pipeline orders). */
export async function getWeaverOrdersHeatmap(opts?: {
  scope?: "district" | "state" | "national";
  region?: string;
  district?: string;
}) {
  const { buildWeaverOrdersHeat } = await import("@/lib/map/build-map-data");
  const { PRIMARY_DEMAND } = await import("@/lib/map/hub-geo");
  const store = await readStore();

  const scope = opts?.scope ?? "district";
  const region =
    opts?.region ??
    (scope === "national" ? undefined : PRIMARY_DEMAND.region);
  const district =
    opts?.district ??
    (scope === "district" ? PRIMARY_DEMAND.district : undefined);

  const heat = buildWeaverOrdersHeat(
    store.buyerRequirements,
    store.paymentOrders,
    store.buyers,
    { scope, region, district },
  );
  return {
    points: heat,
    scope,
    focusRegion: region ?? null,
    focusDistrict: district ?? null,
    demoMode: true as const,
    disclaimer:
      scope === "district"
        ? `IIT cluster — hubs near ${district ?? "IIT Delhi"}, Delhi (open requirements + pipeline).`
        : scope === "state"
          ? `District cluster — Delhi NCT hubs (open requirements + pipeline).`
          : "Nation cluster — hubs across India (open requirements + pipeline).",
  };
}
