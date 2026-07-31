/**
 * Shared demand / buyer / ledger types for Stage 3 (+ Stage 9 buyer portal).
 *
 * Structure (Orders ↔ Plan ↔ Money):
 * - BuyerRequirement = open boutique demand shown on Orders; Plan opens with
 *   `?requirementId=` and uses buyerId + buyerName as the boutique identity.
 * - PaymentOrder = accepted pipeline work on Money (see payments/types);
 *   may carry the same buyerId / buyerName and optional requirementId.
 * See also `src/lib/demand/order-plan.ts`.
 */

import type {
  BuyerProfile,
  Dispute,
  PaymentOrder,
} from "@/lib/payments/types";
import type { WeaverStock } from "@/lib/demand/stock";
import type { WeaverWallet } from "@/lib/wallet/types";

export type DemandCategoryId =
  | "cotton-saree"
  | "silk-saree"
  | "stole-dupatta"
  | "dhoti-angavastram";

export const DEMAND_CATEGORIES: {
  id: DemandCategoryId;
  label: string;
}[] = [
  { id: "cotton-saree", label: "Cotton saree" },
  { id: "silk-saree", label: "Silk saree (complex / zari)" },
  { id: "stole-dupatta", label: "Stole / dupatta" },
  { id: "dhoti-angavastram", label: "Dhoti / angavastram" },
];

/**
 * Open buyer / boutique demand — what the Orders tab lists.
 * Plan links here via `id` (requirementId); boutique via `buyerId` + `buyerName`.
 * Geography: `region` = state/UT (e.g. Delhi), optional `district` for
 * district-level heat (e.g. IIT Delhi / South Delhi).
 */
export type BuyerRequirement = {
  /** Requirement id — Plan deep-link: `/plan?requirementId={id}` */
  id: string;
  /** Boutique / buyer account id (e.g. buyer-demo-001) */
  buyerId?: string;
  /** Boutique display name (e.g. "Saffron Thread Boutique") */
  buyerName: string;
  categoryId: DemandCategoryId;
  /** State / UT — primary demo region is Delhi */
  region: string;
  /** District / micro-hub within the state (e.g. IIT Delhi, South Delhi) */
  district?: string;
  quantity: number;
  neededBy: string; // YYYY-MM-DD — target date / Plan ready date
  /** Optional INR price range — Stage 9 buyer portal */
  priceMin?: number;
  priceMax?: number;
  status: "open" | "filled" | "cancelled";
  notes?: string;
  createdAt: string;
};

export type ManualTrendEntry = {
  categoryId: DemandCategoryId;
  region: string;
  /** 0–100 regional interest, hand-copied from public Google Trends website */
  interestScore: number;
  lastRefreshedAt: string; // ISO
  refreshedBy: string;
};

export type LedgerOrder = {
  id: string;
  orderDate: string; // YYYY-MM-DD
  categoryId: DemandCategoryId;
  region: string;
  quantity: number;
};

export type LoomStore = {
  buyerRequirements: BuyerRequirement[];
  manualTrends: ManualTrendEntry[];
  ledgerOrders: LedgerOrder[];
  /** Stage 4 — simulated payment orders (demo only; no real money) */
  paymentOrders: PaymentOrder[];
  disputes: Dispute[];
  buyers: BuyerProfile[];
  /** Stage 5 — income stability wallets by weaverId */
  wallets: WeaverWallet[];
  /** Settlement order ids already credited into Available (idempotent) */
  walletCredits: { weaverId: string; orderId: string }[];
  /** Standee business signal — yarn & finished stock per weaver */
  weaverStock: WeaverStock[];
};

/**
 * Decision engine weights — standee pillars mapped into one transparent score.
 * Buyer + seasonal + historical remain core; market-extra + master-weaver
 * inject the standee Market / Master Weaver inputs.
 */
export const DEMAND_WEIGHTS = {
  buyer: 0.35,
  seasonal: 0.2,
  historical: 0.15,
  marketExtra: 0.15,
  masterWeaver: 0.15,
} as const;

export type NamedInput = {
  name: string;
  value: string;
};

export type DemandFactorId =
  | "buyer"
  | "seasonal"
  | "historical"
  | "marketExtra"
  | "masterWeaver";

export type DemandFactorBreakdown = {
  id: DemandFactorId;
  label: string;
  weight: number;
  /** Component score 0–100 before weighting */
  rawScore: number;
  /** weight × rawScore contribution toward 0–100 total */
  weightedContribution: number;
  inputs: NamedInput[];
  note?: string;
};

/** Standee-style reason chips on Home advice */
export type EngineReasonTag = {
  id: string;
  label: string;
  active: boolean;
};

export type DailyAction = {
  id: string;
  /** English fallback label */
  label: string;
  href?: string;
  /** Template vars for i18n (e.g. kg, categoryId, when) */
  vars?: Record<string, string | number>;
};

export type ScoredCategory = {
  categoryId: DemandCategoryId;
  categoryLabel: string;
  demandScore: number;
  factors: DemandFactorBreakdown[];
};
