"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PROTOTYPE_PAYMENT_NOTE } from "@/lib/payments/copy";
import {
  nextHappyState,
  weaverStateHint,
  weaverStateLabel,
} from "@/lib/payments/states";
import type {
  Dispute,
  OrderState,
  PaymentOrder,
  TrustScoreBreakdown,
} from "@/lib/payments/types";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import { formatDisplayDate } from "@/lib/production-defaults";
import { IncomeStabilityWallet } from "@/components/weaver/IncomeStabilityWallet";
import { VerifiedRecordCard } from "@/components/weaver/VerifiedRecordCard";
import { useI18n } from "@/lib/i18n/context";
import {
  PitchHero,
  PitchOneLiner,
  PitchStepBlock,
  PitchSteps,
} from "@/components/pitch/PitchExplain";

type EnrichedOrder = {
  order: PaymentOrder;
  buyer: { id: string; name: string; region: string } | null;
  trust: TrustScoreBreakdown;
  dispute: Dispute | null;
};

function stateIcon(state: OrderState): LucideIcon {
  switch (state) {
    case "settlement_released":
    case "resolved":
      return CheckCircle2;
    case "dispatched":
      return Truck;
    case "advance_paid_escrow_held":
      return Shield;
    case "production_in_progress":
      return Package;
    default:
      return Clock;
  }
}

function statusTone(state: OrderState): string {
  if (state === "settlement_released" || state === "resolved") {
    return "bg-loom-success-soft text-loom-success";
  }
  if (state === "dispute_opened" || state === "under_review") {
    return "bg-loom-warning-soft text-loom-warning";
  }
  if (state === "advance_paid_escrow_held") {
    return "bg-loom-accent-soft text-loom-warning";
  }
  return "bg-loom-primary-soft text-loom-primary";
}

export function MoneyComingYourWay() {
  const { t } = useI18n();
  const [rows, setRows] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders`, { cache: "no-store" });
      if (!res.ok) throw new Error(t("money.loadingError"));
      const data = (await res.json()) as { orders: EnrichedOrder[] };
      setRows(data.orders);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("money.loadingError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const active = rows.filter(
    (r) =>
      r.order.state !== "settlement_released" && r.order.state !== "resolved",
  );
  const nextPay = active.find((r) => r.order.expectedSettlementAt)?.order;

  const heldAdvance = active
    .filter((r) =>
      [
        "advance_paid_escrow_held",
        "production_in_progress",
        "dispatched",
        "dispute_opened",
        "under_review",
      ].includes(r.order.state),
    )
    .reduce((s, r) => s + r.order.advanceAmount, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow="Money · simulated escrow story"
        title={t("money.title")}
        body="See where each payment sits — advance held, next projected settlement, then a steady reserve and a shareable proof record."
      />

      <PitchOneLiner>
        Pitch in one line: escrow-style advance → clear state → projected
        settlement → optional reserve → verified record buyers can trust.
      </PitchOneLiner>

      <PitchSteps
        active={1}
        steps={[
          { n: 1, label: "Snapshot" },
          { n: 2, label: "Orders" },
          { n: 3, label: "Reserve" },
          { n: 4, label: "Proof" },
        ]}
      />

      <div
        role="note"
        className="flex gap-2 rounded-xl border border-loom-warning bg-loom-warning-soft px-3 py-3 text-sm leading-snug text-loom-ink"
      >
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-loom-warning"
          aria-hidden
        />
        <p>
          <span className="font-semibold">{t("money.prototypeLabel")} </span>
          {PROTOTYPE_PAYMENT_NOTE}
        </p>
      </div>

      {loading ? (
        <p className="text-base text-loom-muted">{t("common.loading")}</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-loom-danger-soft px-3 py-2 text-loom-danger">
          {error}
        </p>
      ) : null}

      <PitchStepBlock
        step={1}
        title={t("money.walletSnapshot")}
        hint="The first thing a weaver (or judge) should understand."
      >
        <div className="flex items-start gap-3">
          <Banknote className="mt-0.5 size-7 shrink-0 text-loom-primary" aria-hidden />
          <div>
            <p className="text-base text-loom-ink">
              {heldAdvance > 0
                ? t("money.advanceHeld", {
                    amount: heldAdvance.toLocaleString("en-IN"),
                  })
                : t("money.noAdvance")}
            </p>
            <p className="mt-2 text-base text-loom-muted">
              {nextPay?.expectedSettlementAt
                ? t("money.nextProjected", {
                    date: formatDisplayDate(nextPay.expectedSettlementAt),
                  })
                : t("money.noSettlement")}
            </p>
          </div>
        </div>
      </PitchStepBlock>

      <PitchStepBlock
        step={2}
        title={t("money.yourOrders")}
        hint="Walk each order’s state. Demo button advances the happy path for the pitch."
      >
        <ul className="space-y-3">
          {rows
            .slice()
            .sort((a, b) => b.order.createdAt.localeCompare(a.order.createdAt))
            .map((row) => (
              <OrderMoneyCard key={row.order.id} row={row} onChanged={load} />
            ))}
        </ul>
        {rows.length === 0 && !loading ? (
          <p className="text-sm text-loom-muted">
            No orders yet. Simulated buyer posts live in the{" "}
            <Link href="/buyer" className="font-semibold text-loom-primary underline">
              Buyer Portal
            </Link>
            .
          </p>
        ) : null}
      </PitchStepBlock>

      <div className="rounded-2xl border border-dashed border-loom-border bg-loom-bg/80 p-3">
        <button
          type="button"
          onClick={() => setWalletOpen((v) => !v)}
          className="flex h-12 w-full items-center justify-between px-1 text-left text-base font-semibold text-loom-primary"
          aria-expanded={walletOpen}
        >
          <span>Step 3 · Steady income wallet</span>
          <span className="text-sm">{walletOpen ? "Hide" : "Show"}</span>
        </button>
        {walletOpen ? (
          <div className="mt-2">
            <IncomeStabilityWallet />
          </div>
        ) : (
          <p className="px-1 pb-2 text-sm text-loom-muted">
            Optional for the pitch: rule-based reserve when a month is above
            your usual settlement average.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-loom-border bg-loom-bg/80 p-3">
        <button
          type="button"
          onClick={() => setProofOpen((v) => !v)}
          className="flex h-12 w-full items-center justify-between px-1 text-left text-base font-semibold text-loom-primary"
          aria-expanded={proofOpen}
        >
          <span>Step 4 · Verified transaction record</span>
          <span className="text-sm">{proofOpen ? "Hide" : "Show"}</span>
        </button>
        {proofOpen ? (
          <div className="mt-2">
            <VerifiedRecordCard />
          </div>
        ) : (
          <p className="px-1 pb-2 text-sm text-loom-muted">
            Shareable proof buyers can open — completed settlements, not a
            decorative badge.
          </p>
        )}
      </div>

      <p className="text-sm text-loom-muted">
        Buyers see the same payment story in the{" "}
        <Link href="/buyer" className="font-semibold text-loom-primary underline">
          Buyer Portal
        </Link>
        . {t("money.adminHint")}
      </p>
    </div>
  );
}

function OrderMoneyCard({
  row,
  onChanged,
}: {
  row: EnrichedOrder;
  onChanged: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [trustOpen, setTrustOpen] = useState(false);
  const trustId = useId();
  const Icon = stateIcon(row.order.state);
  const category =
    DEMAND_CATEGORIES.find((c) => c.id === row.order.category)?.label ??
    row.order.category;
  const hint = weaverStateHint(row.order.state);
  const next = nextHappyState(row.order.state);

  async function advance() {
    if (!next) return;
    await fetch(`/api/orders/${row.order.id}/transition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: next }),
    });
    await onChanged();
  }

  return (
    <li className="rounded-2xl border border-loom-border bg-loom-bg p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${statusTone(row.order.state)}`}
          aria-hidden
        >
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-loom-ink">{category}</p>
          <p className="text-sm text-loom-muted">
            {row.buyer?.name ?? t("money.buyerFallback")} · ₹
            {row.order.amount.toLocaleString("en-IN")}
          </p>
          <p className="mt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold ${statusTone(row.order.state)}`}
            >
              <Icon className="size-4" aria-hidden />
              {weaverStateLabel(row.order.state)}
            </span>
          </p>
          {hint ? (
            <p className="mt-2 text-sm leading-snug text-loom-muted">{hint}</p>
          ) : null}

          <TrustChip
            trust={row.trust}
            open={trustOpen}
            onToggle={() => setTrustOpen((v) => !v)}
            panelId={trustId}
          />

          {row.dispute ? (
            <p className="mt-2 text-sm text-loom-warning">
              {t("money.question", {
                reason: row.dispute.reason,
                status: row.dispute.status,
              })}
            </p>
          ) : null}

          {next ? (
            <button
              type="button"
              onClick={() => void advance()}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-loom-border bg-loom-surface text-base font-semibold text-loom-primary"
            >
              {t("money.demoNext", { state: weaverStateLabel(next) })}
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function TrustChip({
  trust,
  open,
  onToggle,
  panelId,
}: {
  trust: TrustScoreBreakdown;
  open: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  const { t } = useI18n();
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-loom-border bg-loom-surface px-3 text-left"
      >
        <span className="flex items-center gap-2 text-base text-loom-ink">
          <HelpCircle className="size-5 text-loom-primary" aria-hidden />
          {t("money.buyerTrust", {
            label: trust.label,
            score: trust.score,
          })}
        </span>
        <ChevronDown
          className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={panelId}
          className="mt-2 space-y-2 rounded-xl bg-loom-primary-soft/50 px-3 py-3 text-sm"
        >
          <p className="font-semibold text-loom-ink">{trust.formulaSummary}</p>
          {trust.components.map((c) => (
            <div key={c.name}>
              <p className="font-semibold text-loom-ink">
                {c.name} (weight {Math.round(c.weight * 100)}%): {c.rawValue} →{" "}
                {c.contribution} pts
              </p>
              <p className="text-loom-muted">{c.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
