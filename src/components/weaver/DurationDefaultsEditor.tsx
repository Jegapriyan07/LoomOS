"use client";

import { AlertTriangle, RotateCcw, Settings2 } from "lucide-react";
import type {
  CategoryDuration,
  ItemCategoryId,
  PlanBuffers,
  ProductionDefaults,
} from "@/lib/production-defaults";
import { useI18n } from "@/lib/i18n/context";

type DurationDefaultsEditorProps = {
  defaults: ProductionDefaults;
  onUpdateCategory: (id: ItemCategoryId, patch: Partial<CategoryDuration>) => void;
  onUpdateBuffers: (patch: Partial<PlanBuffers>) => void;
  onReset: () => void;
};

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 90,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <label className="flex min-h-12 flex-col gap-1 text-base">
      <span className="font-semibold text-loom-ink">{label}</span>
      {hint ? <span className="text-sm text-loom-muted">{hint}</span> : null}
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
        }}
        className="h-12 w-full rounded-xl border border-loom-border bg-loom-surface px-3 text-base text-loom-ink"
      />
    </label>
  );
}

export function DurationDefaultsEditor({
  defaults,
  onUpdateCategory,
  onUpdateBuffers,
  onReset,
}: DurationDefaultsEditorProps) {
  const { t } = useI18n();
  const { buffers } = defaults;

  return (
    <section
      aria-labelledby="defaults-heading"
      className="rounded-2xl border border-loom-warning bg-loom-warning-soft/40 p-4"
    >
      <div className="mb-2 flex items-start gap-2">
        <Settings2 className="mt-0.5 size-6 shrink-0 text-loom-warning" aria-hidden />
        <div>
          <h2 id="defaults-heading" className="text-base font-semibold text-loom-ink">
            {t("plan.daysHeading")}
          </h2>
          <p className="mt-1 flex items-start gap-2 text-sm leading-snug text-loom-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{t("plan.daysWarning")}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("plan.weavingDays")}
        </p>
        {defaults.categories.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-loom-border bg-loom-surface p-3"
          >
            <p className="mb-2 text-base font-semibold text-loom-ink">{c.label}</p>
            <p className="mb-2 text-sm text-loom-muted">
              {c.weavingDaysMin}–{c.weavingDaysMax}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Min"
                value={c.weavingDaysMin}
                onChange={(n) =>
                  onUpdateCategory(c.id, {
                    weavingDaysMin: n,
                    weavingDaysForPlan: Math.max(n, c.weavingDaysForPlan),
                  })
                }
              />
              <NumberField
                label="Max"
                value={c.weavingDaysMax}
                onChange={(n) =>
                  onUpdateCategory(c.id, {
                    weavingDaysMax: n,
                    weavingDaysForPlan: Math.min(
                      Math.max(c.weavingDaysForPlan, c.weavingDaysMin),
                      Math.max(n, c.weavingDaysMin),
                    ),
                  })
                }
              />
            </div>
            <div className="mt-2">
              <NumberField
                label={t("plan.weavingDays")}
                value={c.weavingDaysForPlan}
                onChange={(n) => onUpdateCategory(c.id, { weavingDaysForPlan: n })}
              />
            </div>
          </div>
        ))}

        <p className="pt-2 text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("plan.yarnDays")} / {t("plan.qcDays")} / {t("plan.shipDays")}
        </p>
        <div className="space-y-3 rounded-xl border border-loom-border bg-loom-surface p-3">
          <NumberField
            label={t("plan.qcDays")}
            value={buffers.qcPackingDays}
            onChange={(n) => onUpdateBuffers({ qcPackingDays: n })}
          />
          <NumberField
            label={t("plan.shipDays")}
            value={buffers.shippingDays}
            onChange={(n) => onUpdateBuffers({ shippingDays: n })}
          />
          <NumberField
            label={`${t("plan.yarnDays")} (min)`}
            value={buffers.yarnProcurementMin}
            onChange={(n) =>
              onUpdateBuffers({
                yarnProcurementMin: n,
                yarnProcurementForPlan: Math.max(n, buffers.yarnProcurementForPlan),
              })
            }
          />
          <NumberField
            label={`${t("plan.yarnDays")} (max)`}
            value={buffers.yarnProcurementMax}
            onChange={(n) => onUpdateBuffers({ yarnProcurementMax: n })}
          />
          <NumberField
            label={t("plan.yarnDays")}
            value={buffers.yarnProcurementForPlan}
            onChange={(n) => onUpdateBuffers({ yarnProcurementForPlan: n })}
          />
          <NumberField
            label={t("plan.settleDays")}
            value={buffers.settlementStubDays}
            onChange={(n) => onUpdateBuffers({ settlementStubDays: n })}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-loom-border bg-loom-surface text-base font-semibold text-loom-ink"
      >
        <RotateCcw className="size-5" aria-hidden />
        {t("plan.resetDefaults")}
      </button>
    </section>
  );
}
