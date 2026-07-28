"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Store } from "lucide-react";
import { DEMAND_CATEGORIES, type BuyerRequirement } from "@/lib/demand/types";
import { formatDisplayDate } from "@/lib/production-defaults";
import { useI18n } from "@/lib/i18n/context";
import { DEMO_BUYERS } from "@/lib/demo/cluster";
import {
  PitchHero,
  PitchOneLiner,
} from "@/components/pitch/PitchExplain";

export default function OrdersPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<BuyerRequirement[]>([]);
  const [region, setRegion] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const meRes = await fetch("/api/auth/me", { cache: "no-store" });
    if (!meRes.ok) {
      setLoading(false);
      return;
    }
    const me = await meRes.json();
    const weaverRegion = me.user?.weaver?.region ?? "";
    setRegion(weaverRegion);

    const res = await fetch("/api/admin/requirements", { cache: "no-store" });
    const all = (await res.json()) as BuyerRequirement[];
    setRows(
      all.filter(
        (r) =>
          r.status === "open" &&
          r.region.toLowerCase() === weaverRegion.toLowerCase(),
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow="Orders · buyer demand feed"
        title={t("orders.title")}
        body={t("orders.subtitle")}
      />

      <PitchOneLiner>
        Same simulated buyer posts the Buyer Portal publishes — they also move
        today&apos;s advice on Home.
      </PitchOneLiner>

      <Link
        href="/buyer"
        className="flex items-center gap-3 rounded-2xl border-2 border-loom-primary bg-loom-primary-soft/70 px-4 py-4 text-loom-ink shadow-[var(--loom-shadow)]"
      >
        <Store className="size-8 shrink-0 text-loom-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-base font-semibold text-loom-primary">
            Open Buyer Portal
          </p>
          <p className="text-sm text-loom-muted">
            Login as Saffron ({DEMO_BUYERS[0].phone}) or Festival (
            {DEMO_BUYERS[1].phone}) — simulated desks.
          </p>
        </div>
      </Link>

      <p className="rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
        {t("orders.demoNote")}
      </p>

      {loading ? (
        <p className="text-loom-muted">{t("common.loading")}</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <ClipboardList className="size-10 text-loom-muted" aria-hidden />
          <p className="mt-3 text-base text-loom-muted">
            {t("orders.empty", { region: region || "—" })}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const label =
              DEMAND_CATEGORIES.find((c) => c.id === r.categoryId)?.label ??
              r.categoryId;
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-loom-border bg-loom-surface p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-loom-primary">
                  Simulated buyer
                </p>
                <p className="mt-1 text-base font-semibold text-loom-ink">
                  {label}
                </p>
                <p className="mt-1 text-base text-loom-muted">
                  {t("orders.piecesNeeded", {
                    qty: r.quantity,
                    date: formatDisplayDate(r.neededBy),
                  })}
                </p>
                {r.priceMin != null || r.priceMax != null ? (
                  <p className="mt-1 text-sm text-loom-muted">
                    {t("orders.priceRange", {
                      min: r.priceMin ?? "—",
                      max: r.priceMax ?? "—",
                    })}
                  </p>
                ) : null}
                <p className="mt-2 text-sm font-semibold text-loom-ink">
                  {t("orders.fromBuyer", { name: r.buyerName })}
                </p>
                {r.notes ? (
                  <p className="mt-1 text-xs text-loom-muted">{r.notes}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
