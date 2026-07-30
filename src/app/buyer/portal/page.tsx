"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMAND_CATEGORIES, type BuyerRequirement } from "@/lib/demand/types";
import { SimulatedBuyerDesk } from "@/components/buyer/SimulatedBuyerDesk";
import { BuyerWeaversMap } from "@/components/map/BuyerWeaversMapLazy";
import { DEMO_BUYERS } from "@/lib/demo/cluster";
import type {
  DistrictCluster,
  MapWeaverPin,
  StateCluster,
} from "@/lib/map/build-map-data";

type Session = {
  id: string;
  name: string;
  email?: string | null;
  region: string;
};

type WeaverRow = {
  id: string;
  name: string;
  region: string;
  categories: string[];
  cooperativeName?: string;
  verified: boolean;
  completedSettlements: number;
  verificationRule: string;
  demoDisclaimer?: string;
};

type OrderRow = {
  id: string;
  weaverName: string;
  category: string;
  amount: number;
  state: string;
  stateLabel: string;
  createdAt: string;
  settledAt?: string;
};

type Tab = "post" | "weavers" | "orders" | "mine" | "desks" | "map";

type MapPayload = {
  weavers: MapWeaverPin[];
  districtClusters: DistrictCluster[];
  stateClusters: StateCluster[];
  disclaimer: string;
};

export default function BuyerPortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("desks");
  const [message, setMessage] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [weavers, setWeavers] = useState<WeaverRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [mapData, setMapData] = useState<MapPayload | null>(null);
  const [form, setForm] = useState({
    categoryId: "cotton-saree",
    quantity: 25,
    neededBy: "2026-10-15",
    priceMin: 800,
    priceMax: 1200,
    region: "Delhi",
    district: "IIT Delhi",
    notes: "",
  });

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/buyer");
        return;
      }
      const data = await res.json();
      if (data.user?.role !== "BUYER" || !data.user.buyer) {
        router.replace("/buyer");
        return;
      }
      const s: Session = {
        id: data.user.buyer.id,
        name: data.user.buyer.name,
        email: data.user.buyer.email,
        region: data.user.buyer.region,
      };
      setSession(s);
      setForm((f) => ({ ...f, region: s.region || f.region }));
    })();
  }, [router]);

  const loadMine = useCallback(async () => {
    const res = await fetch("/api/buyer/requirements", { cache: "no-store" });
    if (!res.ok) return;
    setRequirements((await res.json()) as BuyerRequirement[]);
  }, []);

  const loadWeavers = useCallback(async () => {
    const res = await fetch("/api/buyer/weavers", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setWeavers(data.weavers as WeaverRow[]);
  }, []);

  const loadOrders = useCallback(async () => {
    const res = await fetch("/api/buyer/orders", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setOrders(data.orders as OrderRow[]);
  }, []);

  const loadMap = useCallback(async () => {
    const res = await fetch("/api/buyer/map", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setMapData({
      weavers: data.weavers as MapWeaverPin[],
      districtClusters: data.districtClusters as DistrictCluster[],
      stateClusters: data.stateClusters as StateCluster[],
      disclaimer: String(data.disclaimer ?? ""),
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    void loadMine();
    void loadWeavers();
    void loadOrders();
    void loadMap();
  }, [session, loadMine, loadWeavers, loadOrders, loadMap]);

  async function postRequirement(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setMessage(null);
    const res = await fetch("/api/buyer/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Could not post");
      return;
    }
    setMessage(
      "Requirement posted — it now feeds the weaver Home Buyer Signal. Refresh the weaver app to see demand move.",
    );
    await loadMine();
    setTab("mine");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/buyer");
  }

  async function goWeaverApp() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  if (!session) {
    return <p className="p-8 text-sm text-slate-600">Loading session…</p>;
  }

  const matchedDemo = DEMO_BUYERS.find(
    (b) => b.id === session.id || b.name === session.name,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Buyer Portal
          </p>
          <h1 className="font-[family-name:var(--font-loom-display)] text-3xl font-semibold text-[#1e3a5f]">
            {session.name}
          </h1>
          <p className="text-sm text-slate-600">
            {session.email ? `${session.email} · ` : ""}
            {session.region}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void goWeaverApp()}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#1e3a5f]"
          >
            Weaver app
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>

      <p className="mt-4 rounded-xl border-l-4 border-[#1e3a5f] bg-white px-4 py-3 text-sm font-semibold text-slate-800">
        Post a requirement here → weaver Orders / Plan / Home update from the
        same store → Money shows escrow status for orders.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {(
          [
            ["desks", "Sample desks"],
            ["map", "Weaver map"],
            ["post", "Post requirement"],
            ["mine", "My requirements"],
            ["weavers", "Verified weavers"],
            ["orders", "Order tracking"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded px-3 py-2 text-sm font-medium ${
              tab === id
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message ? (
        <p className="mt-4 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
          {message}{" "}
          <button
            type="button"
            onClick={() => void goWeaverApp()}
            className="underline"
          >
            Open weaver Home
          </button>
        </p>
      ) : null}

      {tab === "desks" ? (
        <div className="mt-6 space-y-4">
          <SimulatedBuyerDesk highlightPhone={matchedDemo?.phone} />
          <p className="text-sm text-slate-600">
            You are signed in as <strong>{session.name}</strong>. Switch to{" "}
            <button
              type="button"
              className="font-semibold text-[#1e3a5f] underline"
              onClick={() => setTab("post")}
            >
              Post requirement
            </button>{" "}
            to publish a need weavers can plan from, or open{" "}
            <button
              type="button"
              className="font-semibold text-[#1e3a5f] underline"
              onClick={() => setTab("map")}
            >
              Weaver map
            </button>{" "}
            for Delhi clusters (IIT → District → Nation).
          </p>
        </div>
      ) : null}

      {tab === "map" ? (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-slate-600">
            Default cluster is IIT Delhi. Use IIT / District / Nation to zoom
            out — tap a district hub or weaver for rating and ready-stock menu.
          </p>
          {mapData ? (
            <BuyerWeaversMap
              weavers={mapData.weavers}
              stateClusters={mapData.stateClusters}
              districtClusters={mapData.districtClusters}
              disclaimer={mapData.disclaimer}
            />
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
              Loading map data…
            </p>
          )}
        </div>
      ) : null}

      {tab === "post" ? (
        <form
          onSubmit={postRequirement}
          className="mt-6 max-w-lg space-y-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 className="font-semibold">Post a buying requirement</h2>
          <p className="text-sm text-slate-600">
            Saves into the same requirement database Stage 3 reads for Buyer
            Signal (weight 0.5) — not a disconnected form.
          </p>
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
            Quantity
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              required
            />
          </label>
          <label className="block text-sm">
            Target date
            <input
              type="date"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.neededBy}
              onChange={(e) => setForm({ ...form, neededBy: e.target.value })}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Price min (₹ / unit)
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={form.priceMin}
                onChange={(e) =>
                  setForm({ ...form, priceMin: Number(e.target.value) })
                }
              />
            </label>
            <label className="block text-sm">
              Price max (₹ / unit)
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={form.priceMax}
                onChange={(e) =>
                  setForm({ ...form, priceMax: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <label className="block text-sm">
            Region (state / UT)
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            District / hub (e.g. IIT Delhi, South Delhi)
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Notes
            <textarea
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <button
            type="submit"
            className="rounded bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Publish requirement
          </button>
        </form>
      ) : null}

      {tab === "mine" ? (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Target</th>
                <th className="px-3 py-2">Price range</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-slate-500">
                    No requirements yet — post one to feed Buyer Signal.
                  </td>
                </tr>
              ) : (
                requirements.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      {DEMAND_CATEGORIES.find((c) => c.id === r.categoryId)
                        ?.label ?? r.categoryId}
                    </td>
                    <td className="px-3 py-2">{r.quantity}</td>
                    <td className="px-3 py-2">{r.neededBy}</td>
                    <td className="px-3 py-2">
                      {r.priceMin != null || r.priceMax != null
                        ? `₹${r.priceMin ?? "—"}–₹${r.priceMax ?? "—"}`
                        : "—"}
                    </td>
                    <td className="px-3 py-2">{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "weavers" ? (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-slate-600">
            <strong>Verified</strong> means the weaver has at least one{" "}
            <em>Settlement Released</em> order in Stage 4 payment data — not a
            decorative badge.
          </p>
          {weavers.map((w) => (
            <article
              key={w.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{w.name}</h3>
                {w.verified ? (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                    Verified · {w.completedSettlements} settlement
                    {w.completedSettlements === 1 ? "" : "s"}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    Not verified yet
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {w.cooperativeName ? `${w.cooperativeName} · ` : null}
                {w.region} · {w.categories.join(", ")}
              </p>
              {w.demoDisclaimer ? (
                <p className="mt-1 text-xs font-semibold text-amber-800">
                  {w.demoDisclaimer}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">{w.verificationRule}</p>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <p className="border-b px-3 py-2 text-sm text-slate-600">
            Same payment states as the weaver Money tab.
          </p>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Weaver</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">State</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-slate-500">
                    No orders for this buyer yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-2">{o.weaverName}</td>
                    <td className="px-3 py-2">{o.category}</td>
                    <td className="px-3 py-2">
                      ₹{o.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2 font-medium">{o.stateLabel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
