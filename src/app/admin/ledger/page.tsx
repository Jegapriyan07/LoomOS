"use client";

import { useCallback, useEffect, useState } from "react";
import type { LedgerOrder } from "@/lib/demand/types";

const SAMPLE_CSV = `order_date,category,region,quantity
2025-11-12,cotton-saree,Tamil Nadu,30
2026-01-08,cotton-saree,Tamil Nadu,18
2025-12-01,silk-saree,Tamil Nadu,8`;

export default function AdminLedgerPage() {
  const [rows, setRows] = useState<LedgerOrder[]>([]);
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/ledger");
    setRows((await res.json()) as LedgerOrder[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Upload failed");
      return;
    }
    setMessage(`Imported ${data.imported} ledger rows (replaces previous upload).`);
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Cooperative ledger CSV</h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload a real cooperative&apos;s past orders to seed the Historical
        Signal (weight 0.2). This is the Stage 10 bootstrap path — honest
        co-op data, not invented history.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Columns: <code>order_date,category,region,quantity</code>. Categories:{" "}
        <code>cotton-saree</code>, <code>silk-saree</code>,{" "}
        <code>stole-dupatta</code>, <code>dhoti-angavastram</code>.
      </p>

      <form onSubmit={upload} className="mt-6 space-y-3">
        <textarea
          className="h-48 w-full rounded border border-slate-300 bg-white p-3 font-mono text-sm"
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Upload CSV (replace)
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}

      <h2 className="mt-8 font-semibold">Current ledger ({rows.length} rows)</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {rows.length === 0 ? (
          <li className="text-slate-500">No ledger uploaded yet.</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="rounded border border-slate-200 bg-white px-3 py-2">
              {row.orderDate} · {row.categoryId} · {row.region} · qty{" "}
              {row.quantity}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
