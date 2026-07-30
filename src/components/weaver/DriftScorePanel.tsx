"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { DriftScoreResult } from "@/lib/demand/drift";
import { useI18n } from "@/lib/i18n/context";

/**
 * Drift score panel — intelligence accuracy for today's advice.
 * Below 90%: why-low + weaver mindfulness. Inputs + formula always visible.
 */
export function DriftScorePanel({ drift }: { drift: DriftScoreResult }) {
  const { t } = useI18n();
  const [showInputs, setShowInputs] = useState(drift.belowThreshold);

  const tone = drift.belowThreshold
    ? "border-loom-warning bg-loom-accent-soft"
    : "border-loom-accent bg-loom-accent-soft";

  return (
    <section
      aria-labelledby="drift-heading"
      className={`mt-4 rounded-xl border p-4 ${tone}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id="drift-heading"
              className="font-[family-name:var(--font-loom-display)] text-base font-semibold text-loom-ink"
            >
              {t("drift.title")}
            </h3>
            <span className="rounded-md border border-loom-border bg-loom-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-loom-muted">
              {t("drift.estimated")}
            </span>
            {drift.simulated ? (
              <span className="rounded-md border border-loom-border bg-loom-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-loom-muted">
                {t("drift.demoTag")}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-sm text-loom-muted">{t("drift.subtitle")}</p>
        </div>
        <p
          className={`font-[family-name:var(--font-loom-display)] text-3xl font-semibold tabular-nums ${
            drift.belowThreshold ? "text-loom-warning" : "text-loom-primary"
          }`}
          aria-label={t("drift.pctOf", { pct: drift.percentage })}
        >
          {t("drift.pctOf", { pct: drift.percentage })}
        </p>
      </div>

      {drift.simulated && drift.simulatedNote ? (
        <p className="mt-2 text-xs leading-snug text-loom-muted">
          {drift.simulatedNote}
        </p>
      ) : null}

      {drift.belowThreshold ? (
        <div className="mt-3 rounded-lg border border-loom-warning/40 bg-loom-bg/70 p-3">
          <p className="flex items-start gap-2 text-base font-semibold text-loom-ink">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-loom-warning"
              aria-hidden
            />
            <span>{t("drift.thinkTitle")}</span>
          </p>
          <p className="mt-1 text-sm text-loom-muted">
            {t("drift.thresholdNote")}
          </p>

          {drift.whyLow.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-loom-muted">
                {t("drift.whyLow")}
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-loom-ink">
                {drift.whyLow.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {drift.weaverMindfulness.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-loom-muted">
                {t("drift.mindfulness")}
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-loom-ink">
                {drift.weaverMindfulness.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 flex items-start gap-2 text-sm text-loom-ink">
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-loom-primary"
            aria-hidden
          />
          <span>{t("drift.highTrust")}</span>
        </p>
      )}

      <button
        type="button"
        onClick={() => setShowInputs((v) => !v)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-loom-primary underline-offset-2 hover:underline"
        aria-expanded={showInputs}
      >
        <Info className="size-4" aria-hidden />
        {showInputs ? t("pitch.hide") : t("pitch.show")} {t("drift.inputs")}
      </button>

      {showInputs ? (
        <div className="mt-2 space-y-2 rounded-lg border border-loom-border bg-loom-bg/80 p-3">
          <p className="text-xs text-loom-muted">
            <span className="font-semibold text-loom-ink">
              {t("drift.formula")}:{" "}
            </span>
            {drift.formulaSummary}
          </p>
          <ul className="space-y-2">
            {drift.factors.map((f) => (
              <li key={f.id} className="text-sm text-loom-ink">
                <span className="font-semibold">
                  {f.label} ({Math.round(f.weight * 100)}%)
                </span>
                : {f.rawScore}/100 → {f.weightedContribution} pts
                <span className="mt-0.5 block text-xs text-loom-muted">
                  {f.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
