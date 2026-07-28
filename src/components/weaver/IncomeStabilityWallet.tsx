"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ChevronDown, Info, PiggyBank, Wallet } from "lucide-react";
import type { WalletSnapshot } from "@/lib/wallet/types";
import { formatDisplayDate } from "@/lib/production-defaults";
import { useI18n } from "@/lib/i18n/context";

function rupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function RuleTap({
  label,
  rule,
  detail,
}: {
  label: string;
  rule: string;
  detail?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex h-11 items-center gap-1.5 text-left text-sm font-semibold text-loom-primary"
      >
        <Info className="size-4 shrink-0" aria-hidden />
        {label}
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={id}
          className="mt-1 rounded-lg bg-loom-primary-soft/50 px-3 py-2 text-sm leading-snug text-loom-muted"
        >
          <p>{rule}</p>
          {detail ? <p className="mt-1">{detail}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function IncomeStabilityWallet() {
  const { t } = useI18n();
  const [snap, setSnap] = useState<WalletSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [floor, setFloor] = useState(2000);
  const [savePct, setSavePct] = useState(40);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/wallet`, { cache: "no-store" });
    if (!res.ok) {
      setError(t("chat.error"));
      return;
    }
    const data = (await res.json()) as WalletSnapshot;
    setSnap(data);
    setFloor(data.wallet.reserveFloor);
    setSavePct(data.wallet.surplusSavePercent);
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function post(action: string, extra: Record<string, unknown> = {}) {
    const res = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...extra,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Action failed");
      return;
    }
    const data = (await res.json()) as WalletSnapshot;
    setSnap(data);
  }

  if (!snap) {
    return (
      <p className="text-base text-loom-muted">
        {error ?? t("wallet.loading")}
      </p>
    );
  }

  const {
    wallet,
    trailing,
    prompt,
    projectedNextMonth,
    incomeLog,
    thisMonthSettled,
  } = snap;

  return (
    <section
      aria-labelledby="stability-heading"
      className="rounded-2xl border border-loom-border bg-loom-surface p-4"
    >
      <div className="mb-1 flex items-center gap-2 text-loom-primary">
        <PiggyBank className="size-6" aria-hidden />
        <h2
          id="stability-heading"
          className="text-base font-semibold text-loom-ink"
        >
          {t("wallet.title")}
        </h2>
      </div>
      <p className="mb-2 text-sm text-loom-muted">{t("wallet.subtitle")}</p>
      <p className="mb-4 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
        {t("wallet.demoNote")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-loom-bg px-3 py-3">
          <div className="flex items-center gap-1.5 text-sm text-loom-muted">
            <Wallet className="size-4" aria-hidden />
            {t("wallet.available")}
          </div>
          <p className="mt-1 text-weaver-lg font-semibold text-loom-ink">
            {rupees(wallet.available)}
          </p>
        </div>
        <div className="rounded-xl bg-loom-accent-soft/60 px-3 py-3">
          <div className="flex items-center gap-1.5 text-sm text-loom-muted">
            <PiggyBank className="size-4" aria-hidden />
            {t("wallet.reserve")}
          </div>
          <p className="mt-1 text-weaver-lg font-semibold text-loom-ink">
            {rupees(wallet.reserve)}
          </p>
          <p className="mt-0.5 text-xs text-loom-muted">
            {t("wallet.floor", { amount: rupees(wallet.reserveFloor) })}
          </p>
        </div>
      </div>

      <p className="mt-4 text-base leading-snug text-loom-ink">{prompt.message}</p>
      <RuleTap label={t("wallet.showRule")} rule={prompt.rule} />

      {prompt.kind === "save_to_reserve" && prompt.suggestedMove > 0 ? (
        <button
          type="button"
          onClick={() =>
            void post("save-to-reserve", { amount: prompt.suggestedMove })
          }
          className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-loom-primary text-base font-semibold text-white"
        >
          {t("wallet.moveToReserve", {
            amount: rupees(prompt.suggestedMove),
          })}
        </button>
      ) : null}

      {prompt.kind === "draw_from_reserve" && prompt.suggestedDraw > 0 ? (
        <button
          type="button"
          onClick={() =>
            void post("draw-from-reserve", { amount: prompt.suggestedDraw })
          }
          className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-loom-primary text-base font-semibold text-white"
        >
          {t("wallet.drawFromReserve", {
            amount: rupees(prompt.suggestedDraw),
          })}
        </button>
      ) : null}

      <div className="mt-5 border-t border-loom-border pt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("wallet.trailingAvg")}
        </p>
        {trailing.status === "not_enough_history" ? (
          <p className="mt-2 text-base text-loom-ink">
            {t("wallet.notEnoughHistory", {
              have: trailing.monthsOfHistory,
              need: trailing.monthsNeeded,
            })}
          </p>
        ) : (
          <p className="mt-2 text-base text-loom-ink">
            {t("wallet.usualMonth", { amount: rupees(trailing.average) })}
          </p>
        )}
        <RuleTap label={t("wallet.howAverage")} rule={trailing.rule} />
        <p className="mt-2 text-sm text-loom-muted">
          {t("wallet.thisMonthSettled")}:{" "}
          <span className="font-semibold text-loom-ink">
            {rupees(thisMonthSettled)}
          </span>
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-loom-border bg-loom-bg/80 px-3 py-3">
        <p className="text-sm font-semibold text-loom-warning">
          {t("wallet.projected")}
        </p>
        <p className="mt-1 text-base text-loom-ink">
          {projectedNextMonth.label}:{" "}
          {projectedNextMonth.available &&
          projectedNextMonth.amount !== null ? (
            <span className="font-semibold">
              {rupees(projectedNextMonth.amount)}
            </span>
          ) : (
            <span className="font-semibold">{t("wallet.notAvailableYet")}</span>
          )}
        </p>
        <RuleTap
          label={t("wallet.showProjection")}
          rule={projectedNextMonth.rule}
          detail={projectedNextMonth.detail}
        />
        {snap.projectedReserveAfterSave ? (
          <div className="mt-3 border-t border-loom-border/60 pt-3">
            <p className="text-sm font-semibold text-loom-warning">
              {t("wallet.projected")}
            </p>
            <p className="mt-1 text-base text-loom-ink">
              {snap.projectedReserveAfterSave.label}:{" "}
              <span className="font-semibold">
                {rupees(snap.projectedReserveAfterSave.amount ?? 0)}
              </span>
            </p>
            <RuleTap
              label={t("wallet.showProjection")}
              rule={snap.projectedReserveAfterSave.rule}
              detail={snap.projectedReserveAfterSave.detail}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-3 border-t border-loom-border pt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("wallet.reserveRules")}
        </p>
        <label className="block text-base">
          <span className="font-semibold text-loom-ink">
            {t("wallet.reserveFloor")}
          </span>
          <input
            type="number"
            min={0}
            value={floor}
            onChange={(e) => setFloor(Number(e.target.value))}
            className="mt-1 h-12 w-full rounded-xl border border-loom-border bg-loom-bg px-3"
          />
        </label>
        <label className="block text-base">
          <span className="font-semibold text-loom-ink">{t("wallet.savePct")}</span>
          <input
            type="number"
            min={0}
            max={100}
            value={savePct}
            onChange={(e) => setSavePct(Number(e.target.value))}
            className="mt-1 h-12 w-full rounded-xl border border-loom-border bg-loom-bg px-3"
          />
        </label>
        <button
          type="button"
          onClick={() =>
            void post("settings", {
              reserveFloor: floor,
              surplusSavePercent: savePct,
            })
          }
          className="flex h-12 w-full items-center justify-center rounded-xl border border-loom-border text-base font-semibold text-loom-primary"
        >
          {t("wallet.saveRules")}
        </button>
      </div>

      <div className="mt-5 border-t border-loom-border pt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("wallet.incomeLog")}
        </p>
        {incomeLog.length === 0 ? (
          <p className="mt-2 text-base text-loom-muted">
            {t("wallet.noSettlements")}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {incomeLog.map((entry) => (
              <li
                key={entry.orderId}
                className="flex items-center justify-between gap-2 text-base text-loom-ink"
              >
                <span className="text-loom-muted">
                  {formatDisplayDate(entry.settledAt.slice(0, 10))}
                </span>
                <span className="font-semibold">{rupees(entry.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-loom-danger">{error}</p>
      ) : null}
    </section>
  );
}
