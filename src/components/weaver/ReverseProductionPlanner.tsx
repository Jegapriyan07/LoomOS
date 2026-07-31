"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PRODUCTION,
  formatDisplayDate,
  toDateOnly,
  type CategoryDuration,
  type ItemCategoryId,
  type PlanBuffers,
  type ProductionDefaults,
} from "@/lib/production-defaults";
import {
  getPlanFestivalChips,
  PUBLIC_FESTIVAL_CALENDAR,
} from "@/lib/demand/public-festivals";
import { calculateReverseSchedule } from "@/lib/reverse-schedule";
import { DurationDefaultsEditor } from "@/components/weaver/DurationDefaultsEditor";
import { PlanTimeline } from "@/components/weaver/PlanTimeline";
import { useI18n } from "@/lib/i18n/context";
import { localizedCategoryLabel } from "@/lib/i18n/extras";
import {
  PitchHero,
  PitchOneLiner,
  PitchStepBlock,
  PitchSteps,
} from "@/components/pitch/PitchExplain";
import type { BuyerRequirement } from "@/lib/demand/types";
import {
  buyerDisplayName,
  planSourceFromRequirement,
  type PlanSource,
} from "@/lib/demand/order-plan";
import { cachedJson } from "@/lib/client-cache";

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

export function ReverseProductionPlanner({
  initialRequirementId,
  initialFestivalId,
}: {
  initialRequirementId?: string;
  initialFestivalId?: string;
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [weaverPlace, setWeaverPlace] = useState<{
    region: string;
    district: string | null;
  }>({ region: "", district: null });
  const [defaults, setDefaults] = useState<ProductionDefaults>(DEFAULT_PRODUCTION);
  const [hydrated, setHydrated] = useState(false);
  const [categoryId, setCategoryId] = useState<ItemCategoryId>("cotton-saree");
  const festivals = useMemo(
    () =>
      getPlanFestivalChips({
        region: weaverPlace.region || undefined,
        district: weaverPlace.district,
        categoryId,
        limit: 5,
      }),
    [weaverPlace.region, weaverPlace.district, categoryId],
  );
  const [targetDate, setTargetDate] = useState(toDateOnly(new Date()));
  const [selectedFestivalId, setSelectedFestivalId] = useState("");
  const [tuneOpen, setTuneOpen] = useState(false);
  const [buyerNeeds, setBuyerNeeds] = useState<BuyerRequirement[]>([]);
  const [linked, setLinked] = useState<PlanSource | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  function goToStep(n: number) {
    setActiveStep(n);
    if (n === 4) setTuneOpen(true);
    const el = document.getElementById(`plan-step-${n}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
      try {
        const me = await cachedJson<{
          user?: { weaver?: { region?: string; categories?: string[] } };
        }>("/api/auth/me");
        const region = me?.user?.weaver?.region ?? "";
        const district =
          me?.user?.weaver?.categories
            ?.map((c) => /^district:(.+)$/i.exec(c.trim())?.[1]?.trim())
            .find(Boolean) ?? null;
        setWeaverPlace({ region, district });

        const all = await cachedJson<BuyerRequirement[]>(
          "/api/admin/requirements",
        );
        const open = all.filter(
          (r) =>
            r.status === "open" &&
            (!region || r.region.toLowerCase() === region.toLowerCase()),
        );
        setBuyerNeeds(open.slice(0, 4));

        const fromUrl = initialRequirementId
          ? open.find((r) => r.id === initialRequirementId) ??
            all.find((r) => r.id === initialRequirementId)
          : undefined;
        if (fromUrl) {
          applyBuyerNeed(fromUrl, true);
          return;
        }

        if (initialFestivalId) {
          const fest = PUBLIC_FESTIVAL_CALENDAR.find(
            (f) => f.id === initialFestivalId,
          );
          if (fest) {
            setSelectedFestivalId(fest.id);
            setTargetDate(fest.startDate);
          }
        }
      } catch {
        /* keep empty */
      }
    })();
    // initialRequirementId / festivalId from server; apply once when list loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRequirementId, initialFestivalId]);

  // Once place + chips resolve, default to nearest festival if nothing selected
  useEffect(() => {
    if (initialRequirementId || initialFestivalId || selectedFestivalId) return;
    if (festivals.length === 0) return;
    setSelectedFestivalId(festivals[0].id);
    setTargetDate(festivals[0].date);
  }, [
    festivals,
    initialRequirementId,
    initialFestivalId,
    selectedFestivalId,
  ]);

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
    const fest =
      festivals.find((f) => f.id === id) ??
      (() => {
        const full = PUBLIC_FESTIVAL_CALENDAR.find((f) => f.id === id);
        return full
          ? { id: full.id, name: full.name, date: full.startDate, tier: "state" as const }
          : undefined;
      })();
    if (!fest) return;
    setSelectedFestivalId(id);
    setTargetDate(fest.date);
    if (linked) {
      setLinked(null);
      router.replace("/plan", { scroll: false });
    }
  }

  function applyBuyerNeed(req: BuyerRequirement, keepUrl = false) {
    setTargetDate(req.neededBy);
    setSelectedFestivalId("");
    const match = defaults.categories.find(
      (c) => c.id === (req.categoryId as ItemCategoryId),
    );
    if (match) setCategoryId(match.id);
    const source = planSourceFromRequirement({
      ...req,
      buyerName: buyerDisplayName(req.buyerId, req.buyerName),
    });
    setLinked(
      source ?? {
        requirementId: req.id,
        buyerId: req.buyerId ?? "unknown",
        buyerName: buyerDisplayName(req.buyerId, req.buyerName),
        categoryId: req.categoryId,
        quantity: req.quantity,
        neededBy: req.neededBy,
      },
    );
    if (!keepUrl && typeof window !== "undefined") {
      router.replace(`/plan?requirementId=${encodeURIComponent(req.id)}`, {
        scroll: false,
      });
    }
  }

  function clearLinked() {
    setLinked(null);
    router.replace("/plan", { scroll: false });
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow={t("pitch.planEyebrow")}
        title={t("plan.title")}
        body={t("pitch.planBody")}
      />

      <PitchOneLiner>{t("pitch.planOneLiner")}</PitchOneLiner>

      <PitchSteps
        active={activeStep}
        onSelect={goToStep}
        steps={[
          { n: 1, label: t("pitch.stepWhat") },
          { n: 2, label: t("pitch.stepWhen") },
          { n: 3, label: t("pitch.stepDates") },
          { n: 4, label: t("pitch.stepTune") },
        ]}
      />

      {linked ? (
        <div className="rounded-2xl border border-loom-accent bg-loom-accent-soft/50 px-4 py-3">
          <p className="text-base font-semibold text-loom-ink">
            {t("pitch.planLinked", { name: linked.buyerName })}
          </p>
          <p className="mt-1 font-mono text-xs text-loom-muted">
            {t("pitch.planLinkedMeta", {
              buyerId: linked.buyerId,
              requirementId: linked.requirementId,
            })}
          </p>
          <button
            type="button"
            onClick={clearLinked}
            className="mt-2 text-sm font-semibold text-loom-primary underline"
          >
            {t("pitch.planClearLink")}
          </button>
        </div>
      ) : null}

      {buyerNeeds.length > 0 ? (
        <PitchStepBlock
          title={t("pitch.buyerNeeds")}
          hint={t("pitch.buyerNeedsHint")}
        >
          <ul className="space-y-2">
            {buyerNeeds.map((r) => {
              const label = localizedCategoryLabel(lang, r.categoryId);
              const name = buyerDisplayName(r.buyerId, r.buyerName);
              const selected = linked?.requirementId === r.id;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => applyBuyerNeed(r)}
                    aria-pressed={selected}
                    className={`flex w-full flex-col items-start rounded-xl border border-dashed px-3 py-3 text-left ${
                      selected
                        ? "border-loom-primary bg-loom-primary-soft/60"
                        : "border-loom-accent bg-loom-accent-soft/40"
                    }`}
                  >
                    <span className="text-sm font-semibold text-loom-ink">
                      {name}
                    </span>
                    <span className="font-mono text-[11px] text-loom-muted">
                      {r.buyerId ?? "—"} · {r.id}
                    </span>
                    <span className="mt-1 text-sm text-loom-muted">
                      {t("pitch.buyerNeedsLine", {
                        category: label,
                        qty: r.quantity,
                        date: formatDisplayDate(r.neededBy),
                      })}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-loom-muted">
            <Link href="/orders" className="font-semibold text-loom-primary underline">
              {t("nav.orders")}
            </Link>
            {" · "}
            <Link href="/buyer" className="font-semibold text-loom-primary underline">
              {t("pitch.buyerPortal")}
            </Link>
          </p>
        </PitchStepBlock>
      ) : null}

      <PitchStepBlock
        id="plan-step-1"
        step={1}
        title={t("plan.whatWeave")}
        hint={t("pitch.whatHint")}
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
                {localizedCategoryLabel(lang, c.id)}
              </button>
            );
          })}
        </div>
      </PitchStepBlock>

      <PitchStepBlock
        id="plan-step-2"
        step={2}
        title={t("plan.whenReady")}
        hint={t("plan.festivalNote")}
      >
        <div className="mb-3 flex flex-col gap-2">
          {festivals.map((f) => {
            const selected =
              selectedFestivalId === f.id && targetDate === f.date;
            const tierNote =
              f.tier === "district"
                ? "Your hub"
                : f.tier === "state"
                  ? "Your state"
                  : "India";
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
                  {formatDisplayDate(f.date)} · {tierNote}
                </span>
              </button>
            );
          })}
        </div>
        <Link
          href="/plan/festivals"
          className="mb-3 flex w-full min-h-[4.5rem] items-center justify-between gap-3 rounded-xl border border-loom-primary bg-loom-primary-soft px-4 py-3 text-left transition-colors hover:bg-loom-primary/15 active:scale-[0.99]"
        >
          <span className="min-w-0">
            <span className="block text-base font-semibold text-loom-ink">
              Browse full state / cluster calendar
            </span>
            <span className="mt-0.5 block text-sm text-loom-muted">
              All festivals by state and weaving hub — plan yarn & loom time
            </span>
          </span>
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-loom-primary text-lg font-bold text-white"
          >
            →
          </span>
        </Link>
        <label className="block text-base font-semibold text-loom-ink">
          {t("plan.ownDate")}
          <input
            type="date"
            value={targetDate}
            onChange={(e) => {
              setTargetDate(e.target.value);
              setSelectedFestivalId("");
              if (linked) {
                setLinked(null);
                router.replace("/plan", { scroll: false });
              }
            }}
            className="mt-2 flex h-12 w-full rounded-xl border border-loom-border bg-loom-bg px-3 text-base text-loom-ink"
          />
        </label>
      </PitchStepBlock>

      <PitchStepBlock
        id="plan-step-3"
        step={3}
        title={t("pitch.datesTitle")}
        hint={t("pitch.datesBody")}
      >
        <PlanTimeline
          schedule={schedule}
          categoryLabel={localizedCategoryLabel(lang, category.id)}
        />
      </PitchStepBlock>

      <div
        id="plan-step-4"
        className="scroll-mt-20 rounded-2xl border border-dashed border-loom-border bg-loom-bg/80 p-3"
      >
        <button
          type="button"
          onClick={() => {
            setActiveStep(4);
            setTuneOpen((v) => !v);
          }}
          className="flex h-12 w-full items-center justify-between px-1 text-left text-base font-semibold text-loom-primary"
          aria-expanded={tuneOpen}
        >
          <span>
            {t("pitch.stepTune")} · {t("plan.daysHeading")}
          </span>
          <span className="text-sm">
            {tuneOpen ? t("pitch.hide") : t("pitch.show")}
          </span>
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
