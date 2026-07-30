"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMAND_CATEGORIES, type BuyerRequirement } from "@/lib/demand/types";

export default function AdminRequirementsPage() {
  const [rows, setRows] = useState<BuyerRequirement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    buyerName: "Sample buyer",
    categoryId: "cotton-saree",
    region: "Delhi",
    district: "IIT Delhi",
    quantity: 20,
    neededBy: "2026-11-01",
    status: "open" as const,
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/requirements");
    const data = (await res.json()) as BuyerRequirement[];
    setRows(data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addRequirement(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Could not save requirement");
      return;
    }
    await load();
  }

  async function bumpQuantity(row: BuyerRequirement, delta: number) {
    await fetch("/api/admin/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...row,
        quantity: Math.max(0, row.quantity + delta),
      }),
    });
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/requirements?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Buyer requirements</h1>
      <p className="mt-2 text-sm text-slate-600">
        These are real rows in LoomOS&apos;s own database (JSON file for the
        hackathon). Changing quantity or adding an open requirement moves the
        Buyer Signal (weight 0.5) on Home. Stage 9 will give buyers a portal;
        this screen is the honest bootstrap.
      </p>

      <form
        onSubmit={addRequirement}
        className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <h2 className="font-semibold">Add open requirement</h2>
        <label className="block text-sm">
          Buyer name
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.buyerName}
            onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
          />
        </label>
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
          Region (state / UT)
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          District / hub
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </label>
        <label className="block text-sm">
          Quantity
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
        </label>
        <label className="block text-sm">
          Needed by
          <input
            type="date"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.neededBy}
            onChange={(e) => setForm({ ...form, neededBy: e.target.value })}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Save requirement
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
          >
            <p className="font-semibold">
              {row.buyerName} · {row.categoryId} ·{" "}
              {row.district ? `${row.district}, ` : ""}
              {row.region}
            </p>
            <p className="text-slate-600">
              Qty {row.quantity} · needed {row.neededBy} · {row.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded border border-slate-300 px-3 py-1"
                onClick={() => void bumpQuantity(row, 10)}
              >
                +10 units
              </button>
              <button
                type="button"
                className="rounded border border-slate-300 px-3 py-1"
                onClick={() => void bumpQuantity(row, -10)}
              >
                −10 units
              </button>
              <button
                type="button"
                className="rounded border border-red-300 px-3 py-1 text-red-700"
                onClick={() => void remove(row.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
