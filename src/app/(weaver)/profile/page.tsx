"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ClipboardList,
  IndianRupee,
  UserRound,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { DEMO_WEAVER_LOGINS } from "@/lib/demo/logins";
import type { PaymentOrder } from "@/lib/payments/types";
import { weaverStateLabel } from "@/lib/payments/states";
import { formatDisplayDate } from "@/lib/production-defaults";
import {
  PitchHero,
  PitchOneLiner,
} from "@/components/pitch/PitchExplain";
import { cachedJson } from "@/lib/client-cache";

type MeUser = {
  name: string;
  phone: string;
  weaverId: string | null;
  weaver: {
    name: string;
    region: string;
    primaryLanguage: string;
    categories: string[];
    cooperativeName?: string;
  } | null;
};

/**
 * Weaver profile — who you are + snapshot of orders & earnings for the pitch.
 */
export default function ProfilePage() {
  const { t, lang } = useI18n();
  const [user, setUser] = useState<MeUser | null>(null);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [me, ord] = await Promise.all([
          cachedJson<{ user: MeUser }>("/api/auth/me"),
          cachedJson<{ orders: { order: PaymentOrder }[] }>("/api/orders"),
        ]);
        setUser(me.user);
        setOrders(ord.orders.map((r) => r.order));
      } catch {
        /* keep prior */
      }
    })();
  }, []);

  const demo = DEMO_WEAVER_LOGINS.find(
    (d) => d.weaverId === user?.weaverId || d.phone === user?.phone,
  );

  const settled = orders.filter((o) => o.state === "settlement_released");
  const earned = settled.reduce((s, o) => s + o.amount, 0);
  const open = orders.filter(
    (o) => o.state !== "settlement_released" && o.state !== "resolved",
  );
  const held = open
    .filter((o) =>
      [
        "advance_paid_escrow_held",
        "production_in_progress",
        "dispatched",
        "dispute_opened",
        "under_review",
      ].includes(o.state),
    )
    .reduce((s, o) => s + o.advanceAmount, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow="Your profile"
        title={user?.weaver?.name?.split("(")[0]?.trim() ?? user?.name ?? "…"}
        body={
          demo?.blurb ??
          "Your LoomOS profile — language, craft categories, orders and earnings for this login."
        }
      />

      <PitchOneLiner>
        Switch demo customers from Sign out → login card. Each phone keeps its
        own orders, money story and plan context.
      </PitchOneLiner>

      {user?.weaver ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="mb-3 flex items-center gap-2 text-loom-primary">
            <UserRound className="size-6" aria-hidden />
            <h2 className="text-base font-semibold">Profile details</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-loom-muted">Phone</dt>
              <dd className="font-semibold text-loom-ink">{user.phone}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-loom-muted">Region</dt>
              <dd className="font-semibold text-loom-ink">
                {user.weaver.region}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-loom-muted">Language</dt>
              <dd className="font-semibold text-loom-ink">
                {user.weaver.primaryLanguage} · UI {lang}
              </dd>
            </div>
            <div>
              <dt className="text-loom-muted">What you weave</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {user.weaver.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-loom-primary-soft px-2 py-1 text-xs font-semibold text-loom-primary"
                  >
                    {c}
                  </span>
                ))}
              </dd>
            </div>
            {user.weaver.cooperativeName ? (
              <div className="flex justify-between gap-3">
                <dt className="text-loom-muted">Cluster</dt>
                <dd className="text-right text-xs font-semibold text-loom-ink">
                  {user.weaver.cooperativeName}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="flex items-center gap-1.5 text-sm text-loom-muted">
            <IndianRupee className="size-4" aria-hidden />
            Settled earnings
          </div>
          <p className="mt-1 text-weaver-lg font-semibold text-loom-ink">
            ₹{earned.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-loom-muted">
            {settled.length} settlement{settled.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="flex items-center gap-1.5 text-sm text-loom-muted">
            <Wallet className="size-4" aria-hidden />
            Advance held
          </div>
          <p className="mt-1 text-weaver-lg font-semibold text-loom-ink">
            ₹{held.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-loom-muted">
            {open.length} open order{open.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
        <div className="mb-3 flex items-center gap-2 text-loom-primary">
          <ClipboardList className="size-5" aria-hidden />
          <h2 className="text-base font-semibold">Your orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-loom-muted">No orders on this profile yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders
              .slice()
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((o) => (
                <li
                  key={o.id}
                  className="rounded-xl border border-loom-border/70 bg-loom-bg px-3 py-2"
                >
                  <p className="text-sm font-semibold text-loom-ink">
                    {o.category} · ₹{o.amount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-loom-muted">
                    {weaverStateLabel(o.state)}
                    {o.settledAt
                      ? ` · settled ${formatDisplayDate(o.settledAt.slice(0, 10))}`
                      : ""}
                  </p>
                </li>
              ))}
          </ul>
        )}
        <Link
          href="/money"
          className="mt-3 flex h-11 items-center justify-center rounded-xl border border-loom-border text-sm font-semibold text-loom-primary"
        >
          Open Money story
        </Link>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/orders"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-loom-primary text-sm font-semibold text-white"
        >
          <ClipboardList className="size-4" aria-hidden />
          Orders
        </Link>
        <Link
          href="/plan"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-loom-border text-sm font-semibold text-loom-primary"
        >
          <CalendarClock className="size-4" aria-hidden />
          Plan
        </Link>
      </div>
    </div>
  );
}
