/**
 * Stock & Resources — standee business-signal pillar.
 * Per-weaver inventory in the JSON store (demo quantities).
 */

import type { DemandCategoryId } from "@/lib/demand/types";

export type WeaverStock = {
  weaverId: string;
  yarnCottonKg: number;
  yarnSilkKg: number;
  finishedCottonSaree: number;
  finishedSilkSaree: number;
  finishedStole: number;
  finishedDhoti: number;
  updatedAt: string;
};

export function defaultStockFor(weaverId: string): WeaverStock {
  // Demo weavers get a usable starting kit; new registers get near-empty.
  const isDemo = weaverId.startsWith("weaver-demo-");
  const now = new Date().toISOString();
  if (!isDemo) {
    return {
      weaverId,
      yarnCottonKg: 0,
      yarnSilkKg: 0,
      finishedCottonSaree: 0,
      finishedSilkSaree: 0,
      finishedStole: 0,
      finishedDhoti: 0,
      updatedAt: now,
    };
  }
  const n = Number(weaverId.slice(-1)) || 1;
  return {
    weaverId,
    yarnCottonKg: 8 + n * 2,
    yarnSilkKg: 1 + (n % 3),
    finishedCottonSaree: n % 2,
    finishedSilkSaree: 0,
    finishedStole: 2 + (n % 2),
    finishedDhoti: n === 3 ? 1 : 0,
    updatedAt: now,
  };
}

export function finishedCount(
  stock: WeaverStock,
  categoryId: DemandCategoryId,
): number {
  switch (categoryId) {
    case "cotton-saree":
      return stock.finishedCottonSaree;
    case "silk-saree":
      return stock.finishedSilkSaree;
    case "stole-dupatta":
      return stock.finishedStole;
    case "dhoti-angavastram":
      return stock.finishedDhoti;
  }
}

export function yarnReadyFor(
  stock: WeaverStock,
  categoryId: DemandCategoryId,
): { ready: boolean; note: string } {
  if (categoryId === "silk-saree") {
    const ready = stock.yarnSilkKg >= 0.8;
    return {
      ready,
      note: ready
        ? `Silk yarn on hand: ${stock.yarnSilkKg} kg`
        : `Silk yarn low (${stock.yarnSilkKg} kg) — buy before starting`,
    };
  }
  const ready = stock.yarnCottonKg >= 2;
  return {
    ready,
    note: ready
      ? `Cotton yarn on hand: ${stock.yarnCottonKg} kg`
      : `Cotton yarn low (${stock.yarnCottonKg} kg) — buy before starting`,
  };
}

/** Soft 0–100 readiness from yarn + finished buffer for category. */
export function stockReadinessScore(
  stock: WeaverStock,
  categoryId: DemandCategoryId,
): number {
  const yarn = yarnReadyFor(stock, categoryId);
  const finished = finishedCount(stock, categoryId);
  let score = yarn.ready ? 70 : 25;
  if (finished > 0) score = Math.min(100, score + 15 + finished * 5);
  return score;
}
