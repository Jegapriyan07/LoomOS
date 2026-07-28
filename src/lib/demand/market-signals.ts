/**
 * Market Signals beyond festivals — standee input pillar.
 * Seeded demo data (not live GeM / yarn exchange / export APIs).
 */

import { parseDateOnly, toDateOnly } from "@/lib/production-defaults";
import type { DemandCategoryId } from "@/lib/demand/types";

export type YarnPriceSignal = {
  id: string;
  fiber: "cotton" | "silk";
  region: string;
  pricePerKgInr: number;
  /** Week-over-week change % (demo) */
  changePct: number;
  status: "stable" | "up" | "down";
  asOf: string;
  sourceNote: string;
};

export type ExhibitionSignal = {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  categoryIds: DemandCategoryId[];
  sourceNote: string;
};

export type TenderSignal = {
  id: string;
  title: string;
  region: string;
  dueDate: string;
  categoryIds: DemandCategoryId[];
  sourceNote: string;
};

export const YARN_PRICE_SIGNALS: YarnPriceSignal[] = [
  {
    id: "yarn-cotton-tn",
    fiber: "cotton",
    region: "Tamil Nadu",
    pricePerKgInr: 285,
    changePct: 1.2,
    status: "stable",
    asOf: "2026-07-20",
    sourceNote: "Demo seed — illustrative regional yarn desk, not a live feed",
  },
  {
    id: "yarn-silk-tn",
    fiber: "silk",
    region: "Tamil Nadu",
    pricePerKgInr: 4200,
    changePct: 3.5,
    status: "up",
    asOf: "2026-07-20",
    sourceNote: "Demo seed — illustrative regional yarn desk, not a live feed",
  },
];

export const EXHIBITION_SIGNALS: ExhibitionSignal[] = [
  {
    id: "ex-handloom-expo-chennai",
    name: "Regional Handloom Expo (demo)",
    region: "Tamil Nadu",
    startDate: "2026-09-12",
    endDate: "2026-09-18",
    categoryIds: ["cotton-saree", "stole-dupatta", "silk-saree"],
    sourceNote: "Demo seed exhibition — fictional calendar entry",
  },
  {
    id: "ex-temple-fair",
    name: "Temple festival cloth fair (demo)",
    region: "Tamil Nadu",
    startDate: "2026-10-02",
    endDate: "2026-10-06",
    categoryIds: ["dhoti-angavastram", "cotton-saree"],
    sourceNote: "Demo seed exhibition — fictional calendar entry",
  },
];

export const TENDER_SIGNALS: TenderSignal[] = [
  {
    id: "tender-coop-uniforms",
    title: "Co-op school uniform stole lot (demo tender)",
    region: "Tamil Nadu",
    dueDate: "2026-08-25",
    categoryIds: ["stole-dupatta"],
    sourceNote: "Demo seed — not a live GeM / government tender feed",
  },
  {
    id: "tender-festival-saree",
    title: "District festival cotton saree supply (demo tender)",
    region: "Tamil Nadu",
    dueDate: "2026-09-05",
    categoryIds: ["cotton-saree"],
    sourceNote: "Demo seed — not a live GeM / government tender feed",
  },
];

function fiberForCategory(categoryId: DemandCategoryId): "cotton" | "silk" {
  return categoryId === "silk-saree" ? "silk" : "cotton";
}

/**
 * Market-extra signal 0–100 from yarn stability + nearby exhibitions + tenders.
 */
export function computeMarketExtraSignal(
  categoryId: DemandCategoryId,
  region: string,
  asOf: Date = new Date(),
): {
  score: number;
  yarnStable: boolean;
  yarnNote: string;
  exhibitionName: string | null;
  tenderTitle: string | null;
  inputs: { name: string; value: string }[];
} {
  const today = parseDateOnly(toDateOnly(asOf));
  const r = region.toLowerCase();
  const fiber = fiberForCategory(categoryId);

  const yarn =
    YARN_PRICE_SIGNALS.find(
      (y) =>
        y.fiber === fiber &&
        (y.region.toLowerCase() === r || y.region.toLowerCase() === "india"),
    ) ?? null;

  let yarnScore = 40;
  let yarnStable = false;
  let yarnNote = "No yarn price seed for this region/fiber";
  if (yarn) {
    yarnStable = yarn.status === "stable" || Math.abs(yarn.changePct) <= 2;
    yarnScore = yarnStable ? 85 : yarn.status === "down" ? 70 : 45;
    yarnNote = `${yarn.fiber} yarn ≈ ₹${yarn.pricePerKgInr}/kg (${yarn.status}, ${yarn.changePct}% wk) · ${yarn.sourceNote}`;
  }

  let exhibitionScore = 0;
  let exhibitionName: string | null = null;
  let bestDays = Infinity;
  for (const ex of EXHIBITION_SIGNALS) {
    if (!ex.categoryIds.includes(categoryId)) continue;
    if (
      ex.region.toLowerCase() !== r &&
      ex.region.toLowerCase() !== "india"
    ) {
      continue;
    }
    const start = parseDateOnly(ex.startDate);
    const end = parseDateOnly(ex.endDate);
    let days: number;
    if (today >= start && today <= end) days = 0;
    else if (today < start) {
      days = Math.round((start.getTime() - today.getTime()) / 86_400_000);
    } else continue;
    if (days < bestDays && days <= 60) {
      bestDays = days;
      exhibitionName = ex.name;
      exhibitionScore = Math.round(100 * (1 - days / 60));
    }
  }

  let tenderScore = 0;
  let tenderTitle: string | null = null;
  for (const t of TENDER_SIGNALS) {
    if (!t.categoryIds.includes(categoryId)) continue;
    if (t.region.toLowerCase() !== r && t.region.toLowerCase() !== "india") {
      continue;
    }
    const due = parseDateOnly(t.dueDate);
    if (due < today) continue;
    const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
    if (days <= 45) {
      const s = Math.round(100 * (1 - days / 45));
      if (s > tenderScore) {
        tenderScore = s;
        tenderTitle = t.title;
      }
    }
  }

  // Blend: yarn 45% · exhibition 35% · tender 20%
  const score = Math.round(
    0.45 * yarnScore + 0.35 * exhibitionScore + 0.2 * tenderScore,
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    yarnStable,
    yarnNote,
    exhibitionName,
    tenderTitle,
    inputs: [
      { name: "Yarn signal", value: yarnNote },
      {
        name: "Nearest exhibition",
        value: exhibitionName ?? "None in seeded demo calendar (60 days)",
      },
      {
        name: "Open demo tender",
        value: tenderTitle ?? "None matching category in seed",
      },
      {
        name: "Formula",
        value: `0.45×yarn(${yarnScore}) + 0.35×exhibition(${exhibitionScore}) + 0.2×tender(${tenderScore}) = ${score}`,
      },
    ],
  };
}
