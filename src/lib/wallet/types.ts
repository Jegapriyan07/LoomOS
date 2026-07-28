/**
 * Stage 5 — Income Stability Wallet (rule-based, not ML).
 * Income entries come only from Settlement Released orders (Stage 4).
 */

export type WeaverWallet = {
  weaverId: string;
  /** Settled income credited here, minus moves to reserve, plus draws from reserve */
  available: number;
  reserve: number;
  /** Weaver will not draw reserve below this floor (₹) */
  reserveFloor: number;
  /**
   * When a month’s settled income exceeds the trailing average, suggest moving
   * this percent of the surplus into Reserve.
   */
  surplusSavePercent: number;
  updatedAt: string;
};

export type IncomeLogEntry = {
  orderId: string;
  amount: number;
  settledAt: string;
  monthKey: string; // YYYY-MM
};

export type TrailingAverageResult =
  | {
      status: "ready";
      /** Trailing 6-month average settled income (₹) */
      average: number;
      monthsUsed: string[];
      monthlyTotals: { month: string; total: number }[];
      rule: string;
    }
  | {
      status: "not_enough_history";
      monthsOfHistory: number;
      monthsNeeded: number;
      monthKeys: string[];
      rule: string;
    };

export type StabilityPrompt =
  | {
      kind: "save_to_reserve";
      message: string;
      surplus: number;
      suggestedMove: number;
      rule: string;
    }
  | {
      kind: "draw_from_reserve";
      message: string;
      shortfall: number;
      suggestedDraw: number;
      rule: string;
    }
  | {
      kind: "on_track";
      message: string;
      rule: string;
    }
  | {
      kind: "awaiting_history";
      message: string;
      rule: string;
    };

export type ProjectedIncome = {
  label: string;
  amount: number | null;
  isProjected: true;
  available: boolean;
  rule: string;
  detail: string;
};

export type WalletSnapshot = {
  wallet: WeaverWallet;
  incomeLog: IncomeLogEntry[];
  trailing: TrailingAverageResult;
  thisMonthSettled: number;
  thisMonthKey: string;
  prompt: StabilityPrompt;
  projectedNextMonth: ProjectedIncome;
  /** Projected reserve if weaver accepts the current save suggestion (if any) */
  projectedReserveAfterSave: ProjectedIncome | null;
};
