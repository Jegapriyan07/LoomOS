"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Store } from "lucide-react";
import type { BuyerRequirement } from "@/lib/demand/types";
import {
  buyerDisplayName,
  planHrefForRequirement,
} from "@/lib/demand/order-plan";
import { formatDisplayDate } from "@/lib/production-defaults";
import { useI18n } from "@/lib/i18n/context";
import { localizedCategoryLabel } from "@/lib/i18n/extras";
import { DEMO_BUYERS } from "@/lib/demo/cluster";
import { cachedJson } from "@/lib/client-cache";
import {
  PitchHero,
  PitchOneLiner,
} from "@/components/pitch/PitchExplain";
import { WeaverOrdersMap } from "@/components/map/WeaverOrdersMapLazy";
import type {
  DemandHeatScope,
  OrderHeatPoint,
} from "@/lib/map/build-map-data";
import { PRIMARY_DEMAND, isIitClusterDistrict } from "@/lib/map/hub-geo";

function filterRows(
  all: BuyerRequirement[],
  scope: DemandHeatScope,
  region: string,
  district: string,
): BuyerRequirement[] {
  const open = all.filter((r) => r.status === "open");
  if (scope === "national") return open;
  const state = (region || PRIMARY_DEMAND.region).toLowerCase();
  const inState = open.filter((r) => r.region.toLowerCase() === state);
  if (scope === "state") return inState;
  const d = (district || PRIMARY_DEMAND.district).toLowerCase();
  return inState.filter((r) => {
    const rd = (r.district ?? "").toLowerCase();
    if (rd === d) return true;
    if (isIitClusterDistrict(d) && isIitClusterDistrict(rd)) return true;
    return false;
  });
}

export default function OrdersPage() {
  const { t, lang } = useI18n();
  const [allRows, setAllRows] = useState<BuyerRequirement[]>([]);
  const [region, setRegion] = useState<string>(PRIMARY_DEMAND.region);
  const [district, setDistrict] = useState<string>(PRIMARY_DEMAND.district);
  const [ready, setReady] = useState(false);
  const [scope, setScope] = useState<DemandHeatScope>("district");
  const [heatPoints, setHeatPoints] = useState<OrderHeatPoint[]>([]);
  const [heatDisclaimer, setHeatDisclaimer] = useState("");
  const [heatFocus, setHeatFocus] = useState<string | null>(PRIMARY_DEMAND.region);
  const [heatDistrict, setHeatDistrict] = useState<string | null>(
    PRIMARY_DEMAND.district,
  );

  const loadHeat = useCallback(
    async (
      heatScope: DemandHeatScope,
      weaverRegion: string,
      weaverDistrict: string,
    ) => {
      try {
        const params = new URLSearchParams({ scope: heatScope });
        if (heatScope !== "national") {
          params.set("region", weaverRegion || PRIMARY_DEMAND.region);
        }
        if (heatScope === "district") {
          params.set(
            "district",
            weaverDistrict || PRIMARY_DEMAND.district,
          );
        }
        const data = await cachedJson<{
          points: OrderHeatPoint[];
          focusRegion: string | null;
          focusDistrict?: string | null;
          disclaimer: string;
        }>(`/api/orders/heatmap?${params.toString()}`);
        setHeatPoints(data.points ?? []);
        setHeatFocus(data.focusRegion);
        setHeatDistrict(data.focusDistrict ?? null);
        setHeatDisclaimer(data.disclaimer ?? "");
      } catch {
        /* keep prior */
      }
    },
    [],
  );

  const load = useCallback(async () => {
    try {
      const me = await cachedJson<{
        user?: { weaver?: { region?: string; categories?: string[] } };
      }>("/api/auth/me");
      // Pitch demand geography is Tamil Nadu / Kanchipuram — primary demo cluster
      setRegion(PRIMARY_DEMAND.region);
      const fromCat = (me.user?.weaver?.categories ?? [])
        .find((c) => c.toLowerCase().startsWith("district:"))
        ?.slice("district:".length)
        .trim();
      const delhiHub =
        fromCat &&
        ["iit delhi", "south delhi", "hauz khas", "saket", "new delhi"].includes(
          fromCat.toLowerCase(),
        )
          ? fromCat
          : PRIMARY_DEMAND.district;
      setDistrict(delhiHub);

      const all = await cachedJson<BuyerRequirement[]>(
        "/api/admin/requirements",
      );
      setAllRows(all);
    } catch {
      /* keep prior */
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!ready) return;
    void loadHeat(scope, region, district);
  }, [scope, region, district, ready, loadHeat]);

  const rows = filterRows(allRows, scope, region, district);

  const emptyLabel =
    scope === "national"
      ? "India"
      : scope === "state"
        ? region || "Delhi"
        : `${district || PRIMARY_DEMAND.district}, ${region || "Delhi"}`;

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
      <PitchHero
        eyebrow={t("pitch.ordersEyebrow")}
        title={t("orders.title")}
        body={t("orders.subtitle")}
      />

      <PitchOneLiner>{t("pitch.ordersOneLiner")}</PitchOneLiner>

      <p className="rounded-xl border border-loom-border bg-loom-surface px-3 py-2 text-sm text-loom-muted">
        Primary cluster:{" "}
        <span className="font-semibold text-loom-ink">
          {PRIMARY_DEMAND.region}
        </span>
        {" — "}
        Local / District / Nation.
      </p>

      {ready ? (
        <WeaverOrdersMap
          points={heatPoints}
          focusRegion={heatFocus}
          focusDistrict={heatDistrict}
          disclaimer={heatDisclaimer}
          scope={scope}
          onScopeChange={setScope}
        />
      ) : null}

      <Link
        href="/buyer"
        className="flex items-center gap-3 rounded-2xl border-2 border-loom-primary bg-loom-primary-soft/70 px-4 py-4 text-loom-ink shadow-[var(--loom-shadow)]"
      >
        <Store className="size-8 shrink-0 text-loom-primary" aria-hidden />
        <div className="min-w-0">
          <p className="text-base font-semibold text-loom-primary">
            {t("pitch.openBuyerPortal")}
          </p>
          <p className="text-sm text-loom-muted">
            {t("pitch.openBuyerPortalHint", {
              phone1: DEMO_BUYERS[0].phone,
              phone2: DEMO_BUYERS[1].phone,
            })}
          </p>
        </div>
      </Link>

      {ready && rows.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <ClipboardList className="size-10 text-loom-muted" aria-hidden />
          <p className="mt-3 text-base text-loom-muted">
            {t("orders.empty", { region: emptyLabel })}
          </p>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <ul className="space-y-3">
          {rows.map((r) => {
            const label = localizedCategoryLabel(lang, r.categoryId);
            const boutiqueName = buyerDisplayName(r.buyerId, r.buyerName);
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-loom-border bg-loom-surface p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-loom-primary">
                  Boutique · {r.district || "—"}, {r.region}
                </p>
                <p className="mt-1 text-lg font-semibold text-loom-ink">
                  {boutiqueName}
                </p>
                <p className="mt-0.5 font-mono text-xs text-loom-muted">
                  {r.buyerId
                    ? t("orders.boutiqueId", { id: r.buyerId })
                    : null}
                  {r.buyerId ? " · " : null}
                  {t("orders.needId", { id: r.id })}
                </p>
                <p className="mt-3 text-base font-semibold text-loom-ink">
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
                {r.notes ? (
                  <p className="mt-1 text-xs text-loom-muted">{r.notes}</p>
                ) : null}
                <Link
                  href={planHrefForRequirement(r.id)}
                  className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-loom-primary px-4 text-sm font-semibold text-white"
                >
                  {t("orders.planThis")}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
