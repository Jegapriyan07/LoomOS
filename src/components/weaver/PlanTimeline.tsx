"use client";

import {
  Banknote,
  CheckCircle2,
  Package,
  Scissors,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDisplayDate } from "@/lib/production-defaults";
import type { ReverseSchedule } from "@/lib/reverse-schedule";
import { useI18n } from "@/lib/i18n/context";

type TimelineItem = {
  id: string;
  label: string;
  date: string;
  icon: LucideIcon;
  detail?: string;
  highlight?: "yarn" | "payment" | "target";
};

type PlanTimelineProps = {
  schedule: ReverseSchedule;
  categoryLabel: string;
};

export function PlanTimeline({ schedule, categoryLabel }: PlanTimelineProps) {
  const { t } = useI18n();

  const items: TimelineItem[] = [
    {
      id: "yarn",
      label: t("timeline.buyYarn"),
      date: schedule.yarnPurchaseDate,
      icon: ShoppingBag,
      detail: t("timeline.buyYarnDetail", {
        days: schedule.used.yarnProcurementDays,
      }),
      highlight: "yarn",
    },
    {
      id: "start",
      label: t("timeline.startWeaving"),
      date: schedule.startWeavingDate,
      icon: Scissors,
      detail: t("timeline.startWeavingDetail", {
        days: schedule.used.weavingDays,
        category: categoryLabel.toLowerCase(),
      }),
    },
    {
      id: "finish",
      label: t("timeline.finish"),
      date: schedule.finishProductionDate,
      icon: CheckCircle2,
    },
    {
      id: "dispatch",
      label: t("timeline.dispatch"),
      date: schedule.dispatchDate,
      icon: Truck,
      detail: t("timeline.dispatchDetail", {
        days: schedule.used.qcPackingDays,
      }),
    },
    {
      id: "target",
      label: t("timeline.ready"),
      date: schedule.targetDate,
      icon: Sparkles,
      detail: t("timeline.readyDetail", {
        days: schedule.used.shippingDays,
      }),
      highlight: "target",
    },
    {
      id: "pay",
      label: t("timeline.moneyExpected"),
      date: schedule.expectedPaymentDate,
      icon: Banknote,
      detail: t("timeline.moneyDetail", {
        days: schedule.used.settlementStubDays,
      }),
      highlight: "payment",
    },
  ];

  return (
    <section aria-labelledby="timeline-heading" className="rounded-2xl border border-loom-border bg-loom-surface p-4">
      <div className="mb-1 flex items-center gap-2">
        <Package className="size-6 text-loom-primary" aria-hidden />
        <h2 id="timeline-heading" className="text-base font-semibold text-loom-ink">
          {t("timeline.title")}
        </h2>
      </div>
      <p className="mb-1 text-sm font-semibold text-loom-warning">
        {t("timeline.estimatedPlan")}
      </p>
      <p className="mb-4 text-sm text-loom-muted">{t("timeline.estimatedHint")}</p>

      <ol className="relative space-y-0">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;
          return (
            <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-loom-border"
                  aria-hidden
                />
              ) : null}
              <div
                className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  item.highlight === "yarn"
                    ? "bg-loom-accent-soft text-loom-warning"
                    : item.highlight === "target"
                      ? "bg-loom-primary-soft text-loom-primary"
                      : item.highlight === "payment"
                        ? "bg-loom-success-soft text-loom-success"
                        : "bg-loom-bg text-loom-primary"
                }`}
              >
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-base font-semibold text-loom-ink">{item.label}</p>
                <p className="text-weaver-lg font-semibold text-loom-primary">
                  {formatDisplayDate(item.date)}
                </p>
                {item.highlight !== "payment" ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-loom-warning">
                    {t("timeline.estimated")}
                  </p>
                ) : null}
                {item.detail ? (
                  <p className="mt-0.5 text-sm text-loom-muted">{item.detail}</p>
                ) : null}

                {item.highlight === "yarn" ? <NhdcNudge /> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NhdcNudge() {
  const { t } = useI18n();
  return (
    <div
      role="note"
      className="mt-3 rounded-xl border border-loom-accent bg-loom-accent-soft/70 px-3 py-3 text-sm leading-snug text-loom-ink"
    >
      <p className="font-semibold">{t("timeline.nhdcTitle")}</p>
      <p className="mt-1 text-loom-muted">{t("timeline.nhdcBody")}</p>
    </div>
  );
}
