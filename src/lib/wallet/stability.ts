/**
 * Rule-based cash-flow smoothing — NOT machine-learned.
 * Every number traces to a one-sentence rule.
 */

import type { PaymentOrder } from "@/lib/payments/types";
import type {
  IncomeLogEntry,
  ProjectedIncome,
  StabilityPrompt,
  TrailingAverageResult,
  WeaverWallet,
  WalletSnapshot,
} from "@/lib/wallet/types";

export const TRAILING_MONTHS_REQUIRED = 6;

const TRAILING_AVG_RULE =
  "Trailing average = sum of Settlement Released amounts in the last 6 calendar months that have history, divided by 6 — only after the weaver has settled income in at least 6 different calendar months.";

const PROJECTED_NEXT_MONTH_RULE =
  "Projected next-month income = the trailing 6-month average (same rule) — not a model forecast.";

/**
 * Income log: only Settlement Released events — never invented rows.
 */
export function buildIncomeLog(
  orders: PaymentOrder[],
  weaverId: string,
): IncomeLogEntry[] {
  return orders
    .filter(
      (o) =>
        o.weaverId === weaverId &&
        o.state === "settlement_released" &&
        o.settledAt,
    )
    .map((o) => {
      const settledAt = o.settledAt as string;
      return {
        orderId: o.id,
        amount: o.amount,
        settledAt,
        monthKey: settledAt.slice(0, 7),
      };
    })
    .sort((a, b) => b.settledAt.localeCompare(a.settledAt));
}

export function monthKeyFromDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Distinct calendar months that have at least one Settlement Released.
 */
export function distinctSettledMonths(log: IncomeLogEntry[]): string[] {
  return [...new Set(log.map((e) => e.monthKey))].sort();
}

export function computeTrailingAverage(
  log: IncomeLogEntry[],
  asOf: Date = new Date(),
): TrailingAverageResult {
  const months = distinctSettledMonths(log);
  if (months.length < TRAILING_MONTHS_REQUIRED) {
    return {
      status: "not_enough_history",
      monthsOfHistory: months.length,
      monthsNeeded: TRAILING_MONTHS_REQUIRED,
      monthKeys: months,
      rule: TRAILING_AVG_RULE,
    };
  }

  // Last 6 calendar months ending at asOf (include zeros for empty months in window)
  const windowKeys: string[] = [];
  for (let i = 0; i < TRAILING_MONTHS_REQUIRED; i++) {
    const d = new Date(asOf.getFullYear(), asOf.getMonth() - i, 1);
    windowKeys.push(monthKeyFromDate(d));
  }
  windowKeys.reverse();

  const monthlyTotals = windowKeys.map((month) => ({
    month,
    total: log
      .filter((e) => e.monthKey === month)
      .reduce((s, e) => s + e.amount, 0),
  }));

  // Require 6 distinct months of history overall (already checked); average over the window / 6
  const sum = monthlyTotals.reduce((s, m) => s + m.total, 0);
  const average = Math.round(sum / TRAILING_MONTHS_REQUIRED);

  return {
    status: "ready",
    average,
    monthsUsed: windowKeys,
    monthlyTotals,
    rule: TRAILING_AVG_RULE,
  };
}

export function thisMonthSettledTotal(
  log: IncomeLogEntry[],
  asOf: Date = new Date(),
): number {
  const key = monthKeyFromDate(asOf);
  return log.filter((e) => e.monthKey === key).reduce((s, e) => s + e.amount, 0);
}

/**
 * Reserve rules (one sentence each):
 * - Above average: suggest moving surplusSavePercent of (thisMonth − average) into Reserve.
 * - Below average: suggest drawing min(shortfall, reserve − floor) from Reserve into Available.
 */
export function buildStabilityPrompt(
  wallet: WeaverWallet,
  trailing: TrailingAverageResult,
  thisMonthSettled: number,
): StabilityPrompt {
  if (trailing.status === "not_enough_history") {
    return {
      kind: "awaiting_history",
      message: `Not enough history yet for smoothing — you have settled income in ${trailing.monthsOfHistory} month${trailing.monthsOfHistory === 1 ? "" : "s"}, and we need ${trailing.monthsNeeded} before using a trailing average.`,
      rule: trailing.rule,
    };
  }

  const avg = trailing.average;
  if (thisMonthSettled > avg) {
    const surplus = thisMonthSettled - avg;
    const suggestedMove = Math.round((surplus * wallet.surplusSavePercent) / 100);
    return {
      kind: "save_to_reserve",
      message: `This month you earned more than usual — want to move ₹${suggestedMove.toLocaleString("en-IN")} (${wallet.surplusSavePercent}% of the ₹${surplus.toLocaleString("en-IN")} surplus) into your reserve?`,
      surplus,
      suggestedMove,
      rule: `When this month’s settled income exceeds the trailing 6-month average, suggest moving the weaver’s chosen percent of the surplus into Reserve.`,
    };
  }

  if (thisMonthSettled < avg) {
    const shortfall = avg - thisMonthSettled;
    const drawable = Math.max(0, wallet.reserve - wallet.reserveFloor);
    const suggestedDraw = Math.min(shortfall, drawable);
    return {
      kind: "draw_from_reserve",
      message:
        suggestedDraw > 0
          ? `This month you earned less than usual — want to draw ₹${suggestedDraw.toLocaleString("en-IN")} from your reserve?`
          : `This month you earned less than usual, but reserve is at your floor (₹${wallet.reserveFloor.toLocaleString("en-IN")}) so there is nothing safe to draw.`,
      shortfall,
      suggestedDraw,
      rule: `When this month’s settled income is below the trailing 6-month average, offer to draw from Reserve up to the shortfall without going below the weaver’s reserve floor.`,
    };
  }

  return {
    kind: "on_track",
    message: "This month’s settled income matches your usual average — no reserve move needed.",
    rule: "When this month equals the trailing average, no save or draw prompt is shown.",
  };
}

export function buildProjectedNextMonth(
  trailing: TrailingAverageResult,
): ProjectedIncome {
  if (trailing.status === "not_enough_history") {
    return {
      label: "Expected income next month",
      amount: null,
      isProjected: true,
      available: false,
      rule: PROJECTED_NEXT_MONTH_RULE,
      detail: `Projected figure unavailable — only ${trailing.monthsOfHistory} of ${trailing.monthsNeeded} months of settled history.`,
    };
  }
  return {
    label: "Expected income next month",
    amount: trailing.average,
    isProjected: true,
    available: true,
    rule: PROJECTED_NEXT_MONTH_RULE,
    detail: `Uses trailing average ₹${trailing.average.toLocaleString("en-IN")} from months ${trailing.monthsUsed.join(", ")}.`,
  };
}

export function buildWalletSnapshot(
  wallet: WeaverWallet,
  orders: PaymentOrder[],
  asOf: Date = new Date(),
): WalletSnapshot {
  const incomeLog = buildIncomeLog(orders, wallet.weaverId);
  const trailing = computeTrailingAverage(incomeLog, asOf);
  const thisMonthKey = monthKeyFromDate(asOf);
  const thisMonthSettled = thisMonthSettledTotal(incomeLog, asOf);
  const prompt = buildStabilityPrompt(wallet, trailing, thisMonthSettled);
  const projectedNextMonth = buildProjectedNextMonth(trailing);

  let projectedReserveAfterSave: ProjectedIncome | null = null;
  if (prompt.kind === "save_to_reserve" && prompt.suggestedMove > 0) {
    projectedReserveAfterSave = {
      label: "Reserve if you save the suggested amount",
      amount: wallet.reserve + prompt.suggestedMove,
      isProjected: true,
      available: true,
      rule: "Projected reserve = current reserve + suggested surplus move (only if you confirm).",
      detail: `₹${wallet.reserve.toLocaleString("en-IN")} + ₹${prompt.suggestedMove.toLocaleString("en-IN")} suggested move.`,
    };
  }

  return {
    wallet,
    incomeLog,
    trailing,
    thisMonthSettled,
    thisMonthKey,
    prompt,
    projectedNextMonth,
    projectedReserveAfterSave,
  };
}

/** Credit Available when a settlement releases (idempotent via order tracking left to caller). */
export function applySettlementCredit(
  wallet: WeaverWallet,
  amount: number,
): WeaverWallet {
  return {
    ...wallet,
    available: wallet.available + amount,
    updatedAt: new Date().toISOString(),
  };
}

export function moveAvailableToReserve(
  wallet: WeaverWallet,
  amount: number,
): WeaverWallet {
  const move = Math.min(Math.max(0, amount), wallet.available);
  return {
    ...wallet,
    available: wallet.available - move,
    reserve: wallet.reserve + move,
    updatedAt: new Date().toISOString(),
  };
}

export function drawReserveToAvailable(
  wallet: WeaverWallet,
  amount: number,
): WeaverWallet {
  const maxDraw = Math.max(0, wallet.reserve - wallet.reserveFloor);
  const draw = Math.min(Math.max(0, amount), maxDraw);
  return {
    ...wallet,
    reserve: wallet.reserve - draw,
    available: wallet.available + draw,
    updatedAt: new Date().toISOString(),
  };
}

export function defaultWallet(weaverId: string): WeaverWallet {
  return {
    weaverId,
    available: 0,
    reserve: 0,
    reserveFloor: 2000,
    surplusSavePercent: 40,
    updatedAt: new Date().toISOString(),
  };
}
