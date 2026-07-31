"use client";

import Link from "next/link";
import {
  CalendarClock,
  Check,
  Circle,
  IndianRupee,
  ListChecks,
  PackageSearch,
  Sparkles,
} from "lucide-react";
import type { DailyAction, EngineReasonTag } from "@/lib/demand/types";
import type { FiveQuestionId } from "@/lib/chat/assistant";
import { useI18n } from "@/lib/i18n/context";
import {
  localizedDailyActionLabel,
  localizedReasonTagLabel,
} from "@/lib/i18n/extras";

export function ReasonTagsRow({ tags }: { tags: EngineReasonTag[] }) {
  const { t, lang } = useI18n();
  if (!tags.length) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-loom-muted">
        {t("engine.whyTags")}
      </p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-semibold ${
              tag.active
                ? "border-loom-accent bg-loom-accent-soft text-loom-ink"
                : "border-loom-border bg-loom-bg text-loom-muted"
            }`}
          >
            {tag.active ? (
              <Check className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <Circle className="size-3.5 shrink-0 opacity-40" aria-hidden />
            )}
            {localizedReasonTagLabel(lang, tag.id, tag.label)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DailyActionPlan({ actions }: { actions: DailyAction[] }) {
  const { t, lang } = useI18n();
  if (!actions.length) return null;
  return (
    <section
      aria-labelledby="daily-plan-heading"
      className="mt-5 rounded-xl border border-loom-border bg-loom-bg/80 p-4"
    >
      <h3
        id="daily-plan-heading"
        className="font-[family-name:var(--font-loom-display)] text-base font-semibold text-loom-ink"
      >
        {t("engine.dailyTitle")}
      </h3>
      <p className="mt-1 text-sm text-loom-muted">{t("engine.dailyHint")}</p>
      <ol className="mt-3 space-y-2">
        {actions.map((a, i) => {
          const label = localizedDailyActionLabel(lang, a);
          return (
            <li key={a.id}>
              {a.href ? (
                <Link
                  href={a.href}
                  className="flex gap-2 rounded-lg border border-transparent px-1 py-1.5 text-base text-loom-ink underline-offset-2 hover:underline"
                >
                  <span className="font-semibold text-loom-primary">{i + 1}.</span>
                  <span>{label}</span>
                </Link>
              ) : (
                <p className="flex gap-2 px-1 py-1.5 text-base text-loom-ink">
                  <span className="font-semibold text-loom-primary">{i + 1}.</span>
                  <span>{label}</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const Q_META: {
  id: FiveQuestionId;
  eyebrowKey: "engine.q1" | "engine.q2" | "engine.q3" | "engine.q4" | "engine.q5";
  askKey: "engine.a1" | "engine.a2" | "engine.a3" | "engine.a4" | "engine.a5";
  Icon: typeof Sparkles;
}[] = [
  { id: "demand", eyebrowKey: "engine.q1", askKey: "engine.a1", Icon: PackageSearch },
  { id: "product", eyebrowKey: "engine.q2", askKey: "engine.a2", Icon: Sparkles },
  { id: "timing", eyebrowKey: "engine.q3", askKey: "engine.a3", Icon: CalendarClock },
  { id: "money", eyebrowKey: "engine.q4", askKey: "engine.a4", Icon: IndianRupee },
  { id: "today", eyebrowKey: "engine.q5", askKey: "engine.a5", Icon: ListChecks },
];

/** Pitch walk order for the bottom nav story (kept next to chip UI). */
export const PITCH_TAB_ORDER = [
  "Home",
  "Orders",
  "Plan",
  "Money",
  "Profile",
] as const;

type FiveProps = {
  onAsk: (id: FiveQuestionId, label: string) => void;
  busy?: boolean;
  activeId?: FiveQuestionId | null;
};

/**
 * Five daily questions — tap to ask Loom assistant (fetches account snapshot).
 */
export function FiveQuestionsStrip({ onAsk, busy, activeId }: FiveProps) {
  const { t } = useI18n();
  return (
    <div className="mb-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-loom-muted">
        {t("engine.fiveLabel")}
      </p>
      <p className="mb-2 text-sm text-loom-muted">{t("engine.chipHint")}</p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Q_META.map(({ id, eyebrowKey, askKey, Icon }) => {
          const label = t(askKey);
          const active = activeId === id;
          return (
            <li key={id} className={id === "today" ? "sm:col-span-2" : undefined}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onAsk(id, label)}
                className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition disabled:opacity-60 ${
                  active
                    ? "border-loom-primary bg-loom-primary-soft shadow-[var(--loom-shadow)]"
                    : "border-loom-border bg-loom-bg hover:border-loom-primary/40 hover:bg-loom-surface"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    active
                      ? "bg-loom-primary text-white"
                      : "bg-loom-primary-soft text-loom-primary"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-loom-muted">
                    {t(eyebrowKey)}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-snug text-loom-ink">
                    {label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
