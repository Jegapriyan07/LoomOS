"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PROTOTYPE_PAYMENT_NOTE } from "@/lib/payments/copy";
import { adminStateLabel, canTransition, nextHappyState } from "@/lib/payments/states";
import type { OrderState, PaymentOrder, TrustScoreBreakdown } from "@/lib/payments/types";
import type { Dispute } from "@/lib/payments/types";

type Enriched = {
  order: PaymentOrder;
  buyer: { id: string; name: string } | null;
  trust: TrustScoreBreakdown;
  dispute: Dispute | null;
};

const DISPUTE_PATH: OrderState[] = ["dispute_opened", "under_review", "resolved"];

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<Enriched[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders", { cache: "no-store" });
    const data = (await res.json()) as { orders: Enriched[] };
    setRows(data.orders);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function transition(id: string, to: OrderState) {
    setMessage(null);
    const res = await fetch(`/api/orders/${id}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setMessage(`Moved to ${adminStateLabel(to)}`);
    await load();
  }

  async function openDispute(id: string) {
    const res = await fetch(`/api/orders/${id}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "open-dispute",
        reason: "Demo: packing damage reported",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setMessage("Dispute opened");
    await load();
  }

  async function advanceDispute(id: string, to: "under_review" | "resolved") {
    const res = await fetch(`/api/orders/${id}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance-dispute", to }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed");
      return;
    }
    setMessage(`Dispute → ${to}`);
    await load();
  }

  async function newWalk() {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset-walk" }),
    });
    setMessage("New walk-through order created at Order Created");
    await load();
  }

  const live = rows
    .filter((r) => r.order.id.startsWith("ord-walk") || r.order.id.startsWith("ord-live") || r.order.state !== "settlement_released")
    .sort((a, b) => b.order.createdAt.localeCompare(a.order.createdAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Payments state machine</h1>
      <div className="mt-3 rounded border-2 border-amber-400 bg-amber-50 p-3 text-sm text-amber-950">
        <strong>Prototype / simulated.</strong> {PROTOTYPE_PAYMENT_NOTE}
      </div>
      <p className="mt-3 text-sm text-slate-600">
        Happy path: Order Created → Advance Requested → Advance Paid (Escrow
        Held) → Production In Progress → Dispatched → Settlement Released.
        Dispute branch after Dispatched: Dispute Opened → Under Review →
        Resolved. Language is compliance-safe — never &quot;our escrow&quot; or
        &quot;we hold your money.&quot;
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void newWalk()}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          New walk-through order
        </button>
        <Link href="/money" className="rounded border border-slate-300 px-4 py-2 text-sm">
          Open weaver Money tab
        </Link>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-800">{message}</p> : null}

      <ul className="mt-6 space-y-4">
        {live.map(({ order, buyer, trust, dispute }) => {
          const next = nextHappyState(order.state);
          return (
            <li
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
            >
              <p className="font-semibold">
                {order.id} · {buyer?.name ?? order.buyerId} · ₹{order.amount}
              </p>
              <p className="mt-1">
                State: <strong>{adminStateLabel(order.state)}</strong>
              </p>
              <p className="text-slate-600">
                Buyer trust: {trust.label} ({trust.score}/100) —{" "}
                {trust.formulaSummary}
              </p>
              <ol className="mt-2 list-decimal pl-5 text-slate-600">
                {order.stateHistory.map((h, i) => (
                  <li key={`${h.state}-${i}`}>
                    {adminStateLabel(h.state)} @ {new Date(h.at).toLocaleString("en-IN")}
                  </li>
                ))}
              </ol>
              {dispute ? (
                <p className="mt-2 text-amber-800">
                  Dispute: {dispute.reason} ({dispute.status})
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {next ? (
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-3 py-1.5"
                    onClick={() => void transition(order.id, next)}
                  >
                    → {adminStateLabel(next)}
                  </button>
                ) : null}
                {canTransition(order.state, "dispute_opened") ? (
                  <button
                    type="button"
                    className="rounded border border-amber-400 px-3 py-1.5 text-amber-900"
                    onClick={() => void openDispute(order.id)}
                  >
                    Open dispute
                  </button>
                ) : null}
                {DISPUTE_PATH.includes(order.state) &&
                order.state !== "resolved" ? (
                  <button
                    type="button"
                    className="rounded border border-slate-300 px-3 py-1.5"
                    onClick={() =>
                      void advanceDispute(
                        order.id,
                        order.state === "dispute_opened"
                          ? "under_review"
                          : "resolved",
                      )
                    }
                  >
                    Advance dispute
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
