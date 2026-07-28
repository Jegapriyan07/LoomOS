"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Package } from "lucide-react";
import { cachedJson, invalidateCached } from "@/lib/client-cache";
import type { WeaverStock } from "@/lib/demand/stock";
import { useI18n } from "@/lib/i18n/context";

/**
 * Stock & Resources — standee business signal the weaver can edit.
 */
export function StockResourcesCard() {
  const { t } = useI18n();
  const [stock, setStock] = useState<WeaverStock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await cachedJson<{ stock: WeaverStock }>("/api/stock");
      setStock(data.stock);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load stock");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveField(key: keyof WeaverStock, value: number) {
    if (!stock) return;
    setSaving(true);
    try {
      const res = await fetch("/api/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [key]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setStock(data.stock);
      invalidateCached("/api/stock");
      invalidateCached("/api/recommendations/today");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const fields: { key: keyof WeaverStock; label: string; step?: number }[] = [
    { key: "yarnCottonKg", label: t("stock.yarnCotton"), step: 0.5 },
    { key: "yarnSilkKg", label: t("stock.yarnSilk"), step: 0.1 },
    { key: "finishedCottonSaree", label: t("stock.finishedCotton") },
    { key: "finishedSilkSaree", label: t("stock.finishedSilk") },
    { key: "finishedStole", label: t("stock.finishedStole") },
    { key: "finishedDhoti", label: t("stock.finishedDhoti") },
  ];

  return (
    <section
      aria-labelledby="stock-heading"
      className="mt-6 rounded-2xl border border-loom-border bg-loom-surface p-4"
    >
      <div className="mb-2 flex items-center gap-2 text-loom-primary">
        <Package className="size-5" aria-hidden />
        <h2
          id="stock-heading"
          className="font-[family-name:var(--font-loom-display)] text-lg font-semibold text-loom-ink"
        >
          {t("stock.title")}
        </h2>
      </div>
      <p className="mb-3 text-sm text-loom-muted">{t("stock.hint")}</p>
      <p className="mb-3 text-xs text-loom-warning">{t("stock.simNote")}</p>

      {error ? (
        <p className="mb-2 text-sm text-loom-danger">{error}</p>
      ) : null}

      {stock ? (
        <ul className="space-y-3">
          {fields.map((f) => (
            <li
              key={f.key}
              className="flex items-center justify-between gap-3"
            >
              <label
                htmlFor={`stock-${f.key}`}
                className="text-sm font-semibold text-loom-ink"
              >
                {f.label}
              </label>
              <input
                id={`stock-${f.key}`}
                type="number"
                min={0}
                step={f.step ?? 1}
                disabled={saving}
                className="h-11 w-24 rounded-xl border border-loom-border bg-loom-bg px-2 text-right text-base font-semibold text-loom-ink"
                value={Number(stock[f.key])}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isFinite(v) || v < 0) return;
                  setStock({ ...stock, [f.key]: v });
                }}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isFinite(v) || v < 0) return;
                  void saveField(f.key, v);
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-loom-muted">{t("home.loading")}</p>
      )}

      {stock ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-loom-muted">
          <Check className="size-3.5" aria-hidden />
          {t("stock.feedsEngine")}
        </p>
      ) : null}
    </section>
  );
}
