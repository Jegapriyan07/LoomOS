"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_PRODUCTION,
  formatDisplayDate,
  getSampleFestivalCalendar,
  toDateOnly,
  type CategoryDuration,
  type ItemCategoryId,
  type PlanBuffers,
  type ProductionDefaults,
} from "@/lib/production-defaults";
import { calculateReverseSchedule } from "@/lib/reverse-schedule";
import { DurationDefaultsEditor } from "@/components/weaver/DurationDefaultsEditor";
import { PlanTimeline } from "@/components/weaver/PlanTimeline";
import { useI18n } from "@/lib/i18n/context";
import {
  PitchHero,
  PitchOneLiner,
  PitchStepBlock,
  PitchSteps,
} from "@/components/pitch/PitchExplain";
import type { BuyerRequirement } from "@/lib/demand/types";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";

const STORAGE_KEY = "loomos-production-defaults";

function loadDefaults(): ProductionDefaults {
  if (typeof window === "undefined") return DEFAULT_PRODUCTION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTION;
    const parsed = JSON.parse(raw) as ProductionDefaults;
    if (!parsed?.categories?.length || !parsed?.buffers) return DEFAULT_PRODUCTION;
    return parsed;
  } catch {
    return DEFAULT_PRODUCTION;
  }
}

export function ReverseProductionPlanner() {
  const { t } = useI18n();
  const festivals = useMemo(() => getSampleFestivalCalendar(), []);
  const [defaults, setDefaults] = useState<ProductionDefaults>(DEFAULT_PRODUCTION);
  const [hydrated, setHydrated] = useState(false);
  const [categoryId, setCategoryId] = useState<ItemCategoryId>("cotton-saree");
  const [targetDate, setTargetDate] = useState(
    festivals[0]?.date ?? toDateOnly(new Date()),
  );
  const [selectedFestivalId, setSelectedFestivalId] = useState(
    festivals[0]?.id ?? "",
  );
  const [tuneOpen, setTuneOpen] = useState(false);
  const [buyerNeeds, setBuyerNeeds] = useState<BuyerRequirement[]>([]);

  useEffect(() => {
    setDefaults(loadDefaults());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }, [defaults, hydrated]);

  useEffect(() => {
    void (async () => {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const me = meRes.ok ? await meRes.json() : null;
      const region = (me?.user?.weaver?.region as string | undefined) ?? "";
      const res = await fetch("/api/admin/requirements", { cache: "no-store" });
      if (!res.ok) return;
      const all = (await res.json()) as BuyerRequirement[];
      setBuyerNeeds(
        all
          .filter(
            (r) =>
              r.status === "open" &&
              (!region ||
                r.region.toLowerCase() === region.toLowerCase()),
          )
          .slice(0, 4),
      );
    })();
  }, []);

  const category =
    defaults.categories.find((c) => c.id === categoryId) ??
    defaults.categories[0];

  const schedule = calculateReverseSchedule({
    targetDate,
    category,
    buffers: defaults.buffers,
  });

  function updateCategory(id: ItemCategoryId, patch: Partial<CategoryDuration>) {
    setDefaults((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    }));
  }

  function updateBuffers(patch: Partial<PlanBuffers>) {
    setDefaults((prev) => ({
      ...prev,
      buffers: { ...prev.buffers, ...patch },
    }));
  }

  function applyFestival(id: string) {
    const fest = festivals.find((f) => f.id === id);
    if (!fest) return;
    setSelectedFestivalId(id);
    setTargetDate(fest.date);
  }

  function applyBuyerNeed(req: BuyerRequirement) {
    setTargetDate(req.neededBy);
    setSelectedFestivalId("");
    const match = defaults.categories.find((c) =>
      c.id === (req.categoryId as ItemCategoryId),
    );
    if (match) setCategoryId(match.id);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow="Plan · reverse production"
        title={t("plan.title")}
        body="Pick what you will weave and when it must be ready. LoomOS works the calendar backward so you know when to buy yarn and when money is projected."
      />

      <PitchOneLiner>
        Pitch in one line: buyer/festival date → start date → yarn date →
        projected payment — not a to-do list, a decision timeline.
      </PitchOneLiner>

      <PitchSteps
        active={3}
        steps={[
          { n: 1, label: "What" },
          { n: 2, label: "When" },
          { n: 3, label: "Your dates" },
          { n: 4, label: "Tune" },
        ]}
      />

      {buyerNeeds.length > 0 ? (
        <PitchStepBlock
          title="Simulated buyer needs (optional)"
          hint="Tap a buyer post to set your ready date — same data as the Buyer Portal."
        >
          <ul className="space-y-2">
            {buyerNeeds.map((r) => {
              const label =
                DEMAND_CATEGORIES.find((c) => c.id === r.categoryId)?.label ??
                r.categoryId;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => applyBuyerNeed(r)}
                    className="flex w-full flex-col items-start rounded-xl border border-dashed border-loom-accent bg-loom-accent-soft/40 px-3 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-loom-ink">
                      {r.buyerName}
                    </span>
                    <span className="text-sm text-loom-muted">
                      {label} · {r.quantity} pcs · ready{" "}
                      {formatDisplayDate(r.neededBy)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-loom-muted">
            Buyers post these in the{" "}
            <Link href="/buyer" className="font-semibold text-loom-primary underline">
              Buyer Portal
            </Link>
            .
          </p>
        </PitchStepBlock>
      ) : null}

      <PitchStepBlock
        step={1}
        title={t("plan.whatWeave")}
        hint="One choice — the days below use this item’s weaving length."
      >
        <div className="grid grid-cols-1 gap-2">
          {defaults.categories.map((c) => {
            const selected = c.id === categoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                aria-pressed={selected}
                className={`flex min-h-12 items-center rounded-xl border px-4 py-3 text-left text-base font-semibold ${
                  selected
                    ? "border-loom-primary bg-loom-primary-soft text-loom-primary"
                    : "border-loom-border bg-loom-bg text-loom-ink"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </PitchStepBlock>

      <PitchStepBlock
        step={2}
        title={t("plan.whenReady")}
        hint={`${t("plan.festivalNote")} ${t("common.demoSimulated")}`}
      >
        <div className="mb-3 flex flex-col gap-2">
          {festivals.map((f) => {
            const selected =
              selectedFestivalId === f.id && targetDate === f.date;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFestival(f.id)}
                aria-pressed={selected}
                className={`flex min-h-12 flex-col items-start justify-center rounded-xl border px-4 py-2 text-left ${
                  selected
                    ? "border-loom-accent bg-loom-accent-soft"
                    : "border-loom-border bg-loom-bg"
                }`}
              >
                <span className="text-base font-semibold text-loom-ink">
                  {f.name}
                </span>
                <span className="text-sm text-loom-muted">
                  {formatDisplayDate(f.date)}
                </span>
              </button>
            );
          })}
        </div>
        <label className="block text-base font-semibold text-loom-ink">
          {t("plan.ownDate")}
          <input
            type="date"
            value={targetDate}
            onChange={(e) => {
              setTargetDate(e.target.value);
              setSelectedFestivalId("");
            }}
            className="mt-2 flex h-12 w-full rounded-xl border border-loom-border bg-loom-bg px-3 text-base text-loom-ink"
          />
        </label>
      </PitchStepBlock>

      <PitchStepBlock
        step={3}
        title="Your dates — the pitch moment"
        hint="This is the explainable answer: when to buy yarn, start, finish, and when money is projected."
      >
        <PlanTimeline schedule={schedule} categoryLabel={category.label} />
      </PitchStepBlock>

      <div className="rounded-2xl border border-dashed border-loom-border bg-loom-bg/80 p-3">
        <button
          type="button"
          onClick={() => setTuneOpen((v) => !v)}
          className="flex h-12 w-full items-center justify-between px-1 text-left text-base font-semibold text-loom-primary"
          aria-expanded={tuneOpen}
        >
          <span>
            Step 4 · {t("plan.daysHeading")}{" "}
            <span className="font-normal text-loom-muted">(optional)</span>
          </span>
          <span className="text-sm">{tuneOpen ? "Hide" : "Show"}</span>
        </button>
        {tuneOpen ? (
          <div className="mt-2">
            <DurationDefaultsEditor
              defaults={defaults}
              onUpdateCategory={updateCategory}
              onUpdateBuffers={updateBuffers}
              onReset={() => setDefaults(DEFAULT_PRODUCTION)}
            />
          </div>
        ) : (
          <p className="px-1 pb-2 text-sm text-loom-muted">
            {t("plan.daysWarning")}
          </p>
        )}
      </div>
    </div>
  );
}
