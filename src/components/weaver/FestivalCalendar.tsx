"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { STATE_DISTRICTS } from "@/lib/auth/regions";
import {
  daysUntilEvent,
  festivalCalendarStates,
  festivalMatchTier,
  formatPrepHint,
  listFestivalsForPlace,
  type FestivalMatchTier,
  type PublicCalendarEvent,
} from "@/lib/demand/public-festivals";
import { formatDisplayDate } from "@/lib/production-defaults";
import { cachedJson } from "@/lib/client-cache";

type FestivalRow = PublicCalendarEvent & {
  matchTier: FestivalMatchTier | null;
};

function tierLabel(tier: FestivalMatchTier | null): string {
  if (tier === "district") return "Your district";
  if (tier === "state") return "Your state";
  if (tier === "national") return "Pan-India";
  return "";
}

export function FestivalCalendar({
  initialRegion,
  initialDistrict,
}: {
  initialRegion?: string;
  initialDistrict?: string;
}) {
  const states = useMemo(() => festivalCalendarStates(), []);
  const [region, setRegion] = useState(initialRegion ?? "");
  const [district, setDistrict] = useState(initialDistrict ?? "");
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [events, setEvents] = useState<FestivalRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const districtOptions = useMemo(() => {
    if (!region) return [] as string[];
    return STATE_DISTRICTS[region] ?? [];
  }, [region]);

  useEffect(() => {
    void (async () => {
      try {
        const me = await cachedJson<{
          user?: { weaver?: { region?: string; categories?: string[] } };
        }>("/api/auth/me");
        const w = me?.user?.weaver;
        if (w?.region && !initialRegion) setRegion(w.region);
        const fromCat = w?.categories
          ?.map((c) => /^district:(.+)$/i.exec(c.trim())?.[1]?.trim())
          .find(Boolean);
        if (fromCat && !initialDistrict) setDistrict(fromCat);
      } catch {
        /* browse without profile */
      } finally {
        setLoaded(true);
      }
    })();
  }, [initialRegion, initialDistrict]);

  useEffect(() => {
    if (!loaded && !initialRegion) return;
    const rows = listFestivalsForPlace({
      region: region || undefined,
      district: district || null,
      upcomingOnly,
    }).map((e) => ({
      ...e,
      matchTier: region
        ? festivalMatchTier(e, region, district || null)
        : ("national" as FestivalMatchTier),
    }));
    setEvents(rows);
  }, [region, district, upcomingOnly, loaded, initialRegion]);

  return (
    <div className="space-y-4 px-4 pb-10 pt-2">
      <header className="space-y-2">
        <p className="font-display text-2xl font-semibold text-loom-ink">
          Handloom festival calendar
        </p>
        <p className="text-sm text-loom-muted">
          State and weaving-hub dates that drive festive cloth demand — for
          planning yarn and loom time.{" "}
          <span className="rounded-md bg-loom-accent-soft px-1.5 py-0.5 text-xs font-medium text-loom-ink">
            Curated calendar · not a live feed
          </span>
        </p>
        <Link
          href="/plan"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-loom-primary"
        >
          ← Back to Plan
        </Link>
      </header>

      <div className="grid gap-3 rounded-2xl border border-loom-border bg-loom-bg p-3">
        <label className="block text-sm font-semibold text-loom-ink">
          State
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setDistrict("");
            }}
            className="mt-1 flex h-12 w-full rounded-xl border border-loom-border bg-white px-3 text-base text-loom-ink"
          >
            <option value="">All states in calendar</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-loom-ink">
          Weaving hub / district
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!region}
            className="mt-1 flex h-12 w-full rounded-xl border border-loom-border bg-white px-3 text-base text-loom-ink disabled:opacity-50"
          >
            <option value="">Whole state</option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-h-12 items-center gap-2 text-sm font-semibold text-loom-ink">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
            className="size-5 accent-[var(--loom-primary)]"
          />
          Upcoming only
        </label>
      </div>

      <ul className="space-y-3">
        {events.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-loom-border p-4 text-sm text-loom-muted">
            No festivals match this filter in the curated calendar.
          </li>
        ) : (
          events.map((e) => {
            const days = daysUntilEvent(e);
            const status =
              days === null
                ? "Passed"
                : days === 0
                  ? "On now"
                  : `In ${days} days`;
            return (
              <li
                key={e.id}
                className="rounded-2xl border border-loom-border bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold text-loom-ink">
                      {e.name}
                    </p>
                    <p className="text-sm text-loom-muted">
                      {formatDisplayDate(e.startDate)}
                      {e.startDate !== e.endDate
                        ? ` – ${formatDisplayDate(e.endDate)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-md bg-loom-primary-soft px-2 py-0.5 text-xs font-semibold text-loom-primary">
                      {status}
                    </span>
                    {e.matchTier ? (
                      <span className="text-xs text-loom-muted">
                        {tierLabel(e.matchTier)}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-sm text-loom-ink">{e.handloomDemand}</p>

                {(e.districts.length > 0 || e.regions.length > 0) && (
                  <p className="mt-2 text-xs text-loom-muted">
                    <span className="font-semibold text-loom-ink">Where: </span>
                    {e.regions.filter((r) => r !== "India").join(", ") ||
                      "India"}
                    {e.districts.length > 0
                      ? ` · hubs: ${e.districts.join(", ")}`
                      : ""}
                  </p>
                )}

                <p className="mt-2 text-xs font-medium text-loom-primary">
                  {formatPrepHint(e)}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-loom-muted">
                  {e.sourceNote}
                </p>

                <Link
                  href={`/plan?festivalId=${encodeURIComponent(e.id)}`}
                  className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl border border-loom-primary bg-loom-primary-soft px-4 text-sm font-semibold text-loom-primary"
                >
                  Plan for this date
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
