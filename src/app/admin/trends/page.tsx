"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMAND_CATEGORIES, type ManualTrendEntry } from "@/lib/demand/types";

export default function AdminTrendsPage() {
  const [rows, setRows] = useState<ManualTrendEntry[]>([]);
  const [form, setForm] = useState({
    categoryId: "cotton-saree",
    region: "Tamil Nadu",
    interestScore: 55,
    refreshedBy: "demo team",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/trends");
    setRows((await res.json()) as ManualTrendEntry[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        lastRefreshedAt: new Date().toISOString(),
      }),
    });
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Manual regional interest</h1>
      <p className="mt-2 text-sm text-slate-600">
        Google&apos;s Trends API is access-gated — LoomOS does{" "}
        <strong>not</strong> call it. Before a demo, open the public Google
        Trends website, read a 0–100 interest level for a category/region, and
        type it here. The weaver Why? panel labels it{" "}
        <em>Manually updated — last refreshed [date]</em>, never as a live feed.
      </p>
      <p className="mt-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Used only when no cooperative ledger CSV exists for that category +
        region. If a ledger is uploaded, ledger wins for the Historical Signal
        (weight 0.2).
      </p>

      <form
        onSubmit={save}
        className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <label className="block text-sm">
          Category
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {DEMAND_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Region
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Interest score (0–100)
          <input
            type="number"
            min={0}
            max={100}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.interestScore}
            onChange={(e) =>
              setForm({ ...form, interestScore: Number(e.target.value) })
            }
          />
        </label>
        <label className="block text-sm">
          Your name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.refreshedBy}
            onChange={(e) => setForm({ ...form, refreshedBy: e.target.value })}
          />
        </label>
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Save manual interest
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {rows.length === 0 ? (
          <li className="text-sm text-slate-500">
            No manual values yet — Historical Signal stays 0 unless a ledger is
            uploaded.
          </li>
        ) : (
          rows.map((row) => (
            <li
              key={`${row.categoryId}-${row.region}`}
              className="rounded border border-slate-200 bg-white p-3 text-sm"
            >
              <p className="font-semibold">
                {row.categoryId} · {row.region}: {row.interestScore}/100
              </p>
              <p className="text-slate-600">
                Manually updated — last refreshed{" "}
                {new Date(row.lastRefreshedAt).toLocaleString("en-IN")} by{" "}
                {row.refreshedBy}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
