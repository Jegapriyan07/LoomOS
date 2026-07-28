/** Shared demand / buyer / ledger types for Stage 3 (+ Stage 9 buyer portal). */

import type {
  BuyerProfile,
  Dispute,
  PaymentOrder,
} from "@/lib/payments/types";
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

export type BuyerRequirement = {
  id: string;
  /** Links to BuyerProfile / mock buyer account when posted from portal */
  buyerId?: string;
  buyerName: string;
  categoryId: DemandCategoryId;
  region: string;
  quantity: number;
  neededBy: string; // YYYY-MM-DD — target date
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
};

/** Exact formula weights — Stage 3 */
export const DEMAND_WEIGHTS = {
  buyer: 0.5,
  seasonal: 0.3,
  historical: 0.2,
} as const;

export type NamedInput = {
  name: string;
  value: string;
};

export type DemandFactorBreakdown = {
  id: "buyer" | "seasonal" | "historical";
  label: string;
  weight: number;
  /** Component score 0–100 before weighting */
  rawScore: number;
  /** weight × rawScore contribution toward 0–100 total */
  weightedContribution: number;
  inputs: NamedInput[];
  note?: string;
};

export type ScoredCategory = {
  categoryId: DemandCategoryId;
  categoryLabel: string;
  demandScore: number;
  factors: DemandFactorBreakdown[];
};
