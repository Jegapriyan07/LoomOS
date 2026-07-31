"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  HelpCircle,
  IndianRupee,
  Lightbulb,
  Lock,
  MapPin,
  UserRound,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { DEMO_WEAVER_LOGINS } from "@/lib/demo/logins";
import type { PaymentOrder } from "@/lib/payments/types";
import { weaverStateLabel } from "@/lib/payments/states";
import { formatDisplayDate } from "@/lib/production-defaults";
import { PitchHero } from "@/components/pitch/PitchExplain";
import { cachedJson } from "@/lib/client-cache";
import type { ProfileMatchPayload } from "@/lib/profile/match";
import { localizedCategoryLabel } from "@/lib/i18n/extras";

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

type GovListingPayload = {
  listed: boolean;
  message: string;
  sourceChip: string;
  societyTypeLabel: string | null;
  entry: {
    societyName: string;
    state: string;
    district: string;
    sourceUrl: string;
    sourceNote: string;
  } | null;
  meta: {
    sourceLabel: string;
    disclaimer: string;
  };
};

/**
 * Weaver profile — personal Profile score + cluster tips (session only).
 */
export default function ProfilePage() {
  const { lang } = useI18n();
  const [user, setUser] = useState<MeUser | null>(null);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [match, setMatch] = useState<ProfileMatchPayload | null>(null);
  const [govListing, setGovListing] = useState<GovListingPayload | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const whyId = useId();

  useEffect(() => {
    void (async () => {
      try {
        const [me, ord, profileMatch] = await Promise.all([
          cachedJson<{ user: MeUser }>("/api/auth/me"),
          cachedJson<{ orders: { order: PaymentOrder }[] }>("/api/orders"),
          cachedJson<ProfileMatchPayload>("/api/profile/match"),
        ]);
        setUser(me.user);
        setOrders(ord.orders.map((r) => r.order));
        setMatch(profileMatch);

        const region = me.user.weaver?.region ?? "";
        const districtTag = me.user.weaver?.categories.find((c) =>
          c.startsWith("district:"),
        );
        const cluster =
          districtTag?.replace(/^district:/, "") ||
          me.user.weaver?.cooperativeName ||
          "";
        if (region) {
          const params = new URLSearchParams({
            lookupState: region,
            lookupCluster: cluster,
          });
          const govRes = await fetch(`/api/clusters/match?${params}`, {
            cache: "no-store",
          });
          if (govRes.ok) {
            setGovListing((await govRes.json()) as GovListingPayload);
          }
        }
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

  const displayCategories =
    user?.weaver?.categories.filter((c) => !c.startsWith("district:")) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow="Your profile"
        title={user?.weaver?.name?.split("(")[0]?.trim() ?? user?.name ?? "…"}
        body={
          demo?.blurb ??
          "Your LoomOS profile — personal score, verified settlement history, and past stats for this login only."
        }
      />

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
                {displayCategories.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-loom-primary-soft px-2 py-1 text-xs font-semibold text-loom-primary"
                  >
                    {c}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {govListing?.listed && govListing.entry ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-loom-primary">
            <BadgeCheck className="size-6" aria-hidden />
            <h2 className="text-base font-semibold">Ministry cluster listing</h2>
          </div>
          <p className="text-sm text-loom-ink">{govListing.message}</p>
          <p className="mt-2 text-sm text-loom-muted">
            {govListing.societyTypeLabel} · {govListing.entry.district},{" "}
            {govListing.entry.state}
          </p>
          <p className="mt-2 text-xs font-semibold text-amber-900">
            {govListing.sourceChip} · {govListing.meta.disclaimer}
          </p>
          <a
            href={govListing.entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-loom-primary underline"
          >
            Open {govListing.meta.sourceLabel}
          </a>
          <p className="mt-2 text-xs text-loom-muted">
            This is a cluster listing signal — not a personal identity check or
            verified weaver ID.
          </p>
        </section>
      ) : null}

      {match ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-loom-ink">
              {match.match.label}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-loom-primary-soft px-2 py-0.5 text-xs font-semibold text-loom-primary">
                <Lock className="size-3" aria-hidden />
                Only you
              </span>
            </div>
          </div>
          <p className="text-xs text-loom-muted">{match.privacyNote}</p>
          <p className="mt-1 text-xs text-loom-muted">
            Region demand fit for you — not a credit score or CIBIL.
          </p>
          <p className="mt-3 text-weaver-lg font-semibold text-loom-primary">
            {match.match.score}
            <span className="text-base font-medium text-loom-muted"> / 100</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-loom-ink">
            {match.match.bandLabel}
          </p>
          <p className="mt-1 text-sm text-loom-ink">
            Strongest:{" "}
            {localizedCategoryLabel(lang, match.match.categoryId)} ·{" "}
            {match.match.categoryLabel}
          </p>

          {/* Factor bars — real STAGE 3 inputs */}
          <ul className="mt-3 space-y-2">
            {match.match.factors.map((f) => (
              <li key={f.id}>
                <div className="mb-0.5 flex justify-between gap-2 text-xs">
                  <span className="text-loom-muted">
                    {f.label} ({Math.round(f.weight * 100)}%)
                  </span>
                  <span className="font-semibold text-loom-ink">
                    {f.rawScore}/100
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-loom-bg"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-loom-primary/80"
                    style={{ width: `${Math.min(100, f.rawScore)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setWhyOpen((v) => !v)}
            aria-expanded={whyOpen}
            aria-controls={whyId}
            className="mt-3 flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-loom-border bg-loom-bg px-3 text-left text-sm font-semibold text-loom-primary"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="size-4" aria-hidden />
              Why this score?
            </span>
            <ChevronDown
              className={`size-4 transition-transform ${whyOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          {whyOpen ? (
            <div
              id={whyId}
              className="mt-2 space-y-2 rounded-xl bg-loom-primary-soft/40 px-3 py-3 text-sm"
            >
              <p className="font-semibold text-loom-ink">
                {match.match.formulaSummary}
              </p>
              {match.match.factors.map((f) => (
                <div key={f.id}>
                  <p className="font-semibold text-loom-ink">
                    {f.label} (weight {Math.round(f.weight * 100)}%): raw{" "}
                    {f.rawScore}/100 → {f.weightedContribution} pts
                  </p>
                  <p className="text-loom-muted">{f.note}</p>
                </div>
              ))}
              <p className="text-xs text-loom-muted">{match.dataNote}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {match && match.tips.length > 0 ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="mb-1 flex items-center gap-2 text-loom-primary">
            <Lightbulb className="size-5" aria-hidden />
            <h2 className="text-base font-semibold">
              How to improve your score
            </h2>
          </div>
          <p className="mb-3 text-xs text-loom-muted">
            Advice for your {match.cluster.district} / {match.cluster.region}{" "}
            cluster. Estimated gains use the same STAGE 3 weights — labeled
            estimates, not guarantees.
          </p>
          <ul className="space-y-2">
            {match.tips.map((tip) => (
              <li
                key={tip.id}
                className="rounded-xl border border-loom-border/70 bg-loom-bg px-3 py-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-loom-ink">
                    {tip.title}
                  </p>
                  {tip.estimatedGainPts != null && tip.estimatedGainPts > 0 ? (
                    <span className="rounded-md bg-loom-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-loom-primary">
                      Est. +{tip.estimatedGainPts} pts
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-snug text-loom-muted">
                  {tip.detail}
                </p>
                {tip.href ? (
                  <Link
                    href={tip.href}
                    className="mt-2 inline-block text-xs font-semibold text-loom-primary underline"
                  >
                    Open
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
          {match.openNearCluster.length > 0 ? (
            <div className="mt-3 border-t border-loom-border pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-loom-muted">
                Open near Kanchipuram / Tamil Nadu
              </p>
              <ul className="space-y-1.5">
                {match.openNearCluster.map((r, i) => (
                  <li
                    key={`${r.categoryId}-${i}`}
                    className="text-xs text-loom-ink"
                  >
                    <span className="font-semibold">
                      {localizedCategoryLabel(lang, r.categoryId)}
                    </span>
                    {" · "}
                    {r.quantity} pcs · {r.district} · {r.buyerName}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {match ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-loom-primary">
            <MapPin className="size-5" aria-hidden />
            <h2 className="text-base font-semibold">Your cluster</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-loom-muted">Cluster</dt>
              <dd className="text-right font-semibold text-loom-ink">
                {match.cluster.name}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-loom-muted">Map focus</dt>
              <dd className="text-right font-semibold text-loom-ink">
                {match.cluster.district} · {match.cluster.region}
              </dd>
            </div>
            {match.cluster.weaverDistrict ? (
              <div className="flex justify-between gap-3">
                <dt className="text-loom-muted">Your hub</dt>
                <dd className="text-right font-semibold text-loom-ink">
                  {match.cluster.weaverDistrict}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-2 text-xs leading-snug text-loom-muted">
            {match.cluster.flavor}
          </p>
        </section>
      ) : null}

      {match ? (
        <section className="rounded-2xl border border-loom-border bg-loom-surface p-4">
          <h2 className="mb-1 text-base font-semibold text-loom-ink">
            Verified history
          </h2>
          <p className="mb-3 text-xs text-loom-muted">
            Settlement facts only — not a credit score or CIBIL.
          </p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-loom-muted">Completed orders</dt>
              <dd className="font-semibold text-loom-ink">
                {match.verified.totalVerifiedCompletedOrders}
              </dd>
            </div>
            <div>
              <dt className="text-loom-muted">On-time rate</dt>
              <dd className="font-semibold text-loom-ink">
                {match.verified.onTimeSettlementRate}%
              </dd>
            </div>
            <div>
              <dt className="text-loom-muted">Income (≤12 mo)</dt>
              <dd className="font-semibold text-loom-ink">
                ₹
                {match.verified.verifiedIncomeTrailing12Months.toLocaleString(
                  "en-IN",
                )}
              </dd>
            </div>
            <div>
              <dt className="text-loom-muted">Tenure</dt>
              <dd className="font-semibold text-loom-ink">
                {match.verified.tenureDays} days
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-loom-muted">
            {match.verified.incomeHistoryNote}
          </p>
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
          <h2 className="text-base font-semibold">Recent orders</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-loom-muted">
            No orders on this profile yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {orders
              .slice()
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, 3)
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
          Open Money
        </Link>
      </section>
    </div>
  );
}
