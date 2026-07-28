"use client";

import { useEffect, useState } from "react";

type DistributionRow = {
  weaverId: string;
  weaverName: string;
  activeOrders: number;
  settledOrders: number;
  maxConcurrentIllustrative: number;
  utilizationPercent: number;
  status: string;
  statusLabel: string;
  ordersByState: { state: string; label: string; count: number }[];
  capacityNote: string;
};

type DemandRow = {
  categoryId: string;
  categoryLabel: string;
  demandScore: number;
  factors: { id: string; label: string; rawScore: number; weight: number }[];
  source: string;
};

type Dashboard = {
  cluster: { name: string; disclaimer: string; region: string; flavor: string };
  weaverCount: number;
  illustrativeCapacityNote: string;
  distribution: DistributionRow[];
  demand: DemandRow[];
  demoMode: boolean;
};

export function ClusterDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/coop/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load dashboard");
        setData((await res.json()) as Dashboard);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    })();
  }, []);

  if (error) {
    return <p className="p-6 text-sm text-red-700">{error}</p>;
  }
  if (!data) {
    return <p className="p-6 text-sm text-slate-600">Loading cluster…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <section>
        <h2 className="text-2xl font-semibold">{data.cluster.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{data.cluster.flavor}</p>
        <p className="mt-2 text-xs font-semibold text-amber-800">
          {data.cluster.disclaimer}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {data.weaverCount} weavers in cluster · region {data.cluster.region}
        </p>
      </section>

      {/* Order distribution + capacity */}
      <section>
        <h3 className="text-lg font-semibold">Order distribution & capacity</h3>
        <p className="mt-1 text-sm text-slate-600">
          Active load comes from Stage 4 payment orders still in the pipeline.
        </p>
        <p className="mt-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Illustrative capacity: {data.illustrativeCapacityNote}
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2">Weaver</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Settled</th>
                <th className="px-3 py-2">Utilization</th>
                <th className="px-3 py-2">States</th>
              </tr>
            </thead>
            <tbody>
              {data.distribution.map((row) => (
                <tr key={row.weaverId} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium">{row.weaverName}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={row.status} label={row.statusLabel} />
                  </td>
                  <td className="px-3 py-2">
                    {row.activeOrders} / {row.maxConcurrentIllustrative}
                    <span className="block text-xs text-slate-500">
                      (max is illustrative)
                    </span>
                  </td>
                  <td className="px-3 py-2">{row.settledOrders}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded bg-slate-200">
                        <div
                          className={`h-full ${
                            row.status === "booked_out"
                              ? "bg-red-600"
                              : row.status === "partially_booked"
                                ? "bg-amber-500"
                                : "bg-emerald-600"
                          }`}
                          style={{ width: `${row.utilizationPercent}%` }}
                        />
                      </div>
                      <span>
                        {row.utilizationPercent}%
                        <span className="block text-xs text-slate-500">
                          Illustrative %
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {row.ordersByState.length === 0
                      ? "No orders"
                      : row.ordersByState
                          .map((s) => `${s.label} (${s.count})`)
                          .join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Demand visibility — Stage 3 */}
      <section>
        <h3 className="text-lg font-semibold">Demand visibility</h3>
        <p className="mt-1 text-sm text-slate-600">
          Reuses Stage 3 demand scores for this cluster&apos;s region — same
          formula as weaver Home Why?
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Demand score</th>
                <th className="px-3 py-2">Components (raw / 100)</th>
              </tr>
            </thead>
            <tbody>
              {data.demand.map((row) => (
                <tr key={row.categoryId} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-medium">{row.categoryLabel}</td>
                  <td className="px-3 py-2 text-lg font-semibold">
                    {row.demandScore}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {row.factors
                      .map(
                        (f) =>
                          `${f.label} ${Math.round(f.weight * 100)}%: ${f.rawScore}`,
                      )
                      .join(" · ")}
                    <span className="mt-1 block text-slate-400">{row.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status, label }: { status: string; label: string }) {
  const cls =
    status === "booked_out"
      ? "bg-red-100 text-red-900"
      : status === "partially_booked"
        ? "bg-amber-100 text-amber-900"
        : "bg-emerald-100 text-emerald-900";
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}
