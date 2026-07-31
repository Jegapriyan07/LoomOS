"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  formatDisplayDate,
  parseDateOnly,
  toDateOnly,
} from "@/lib/production-defaults";
import { cachedJson } from "@/lib/client-cache";

type FestivalRow = PublicCalendarEvent & {
  matchTier: FestivalMatchTier | null;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function tierLabel(tier: FestivalMatchTier | null): string {
  if (tier === "district") return "Your district";
  if (tier === "state") return "Your state";
  if (tier === "national") return "Pan-India";
  return "";
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function buildMonthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1, 12, 0, 0, 0);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad = first.getDay();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toDateOnly(new Date(year, month, d, 12, 0, 0, 0)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function eventsOnDate(
  events: FestivalRow[],
  dateOnly: string,
): FestivalRow[] {
  return events.filter(
    (e) => e.startDate <= dateOnly && e.endDate >= dateOnly,
  );
}

function FestivalCard({ e }: { e: FestivalRow }) {
  const days = daysUntilEvent(e);
  const status =
    days === null ? "Passed" : days === 0 ? "On now" : `In ${days} days`;

  return (
    <li className="rounded-2xl border border-loom-border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-loom-ink">{e.name}</p>
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
          {e.regions.filter((r) => r !== "India").join(", ") || "India"}
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
}

export function FestivalCalendar({
  initialRegion,
  initialDistrict,
}: {
  initialRegion?: string;
  initialDistrict?: string;
}) {
  const today = useMemo(() => toDateOnly(new Date()), []);
  const todayParts = useMemo(() => {
    const d = parseDateOnly(today);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [today]);

  const states = useMemo(() => festivalCalendarStates(), []);
  const [region, setRegion] = useState(initialRegion ?? "");
  const [district, setDistrict] = useState(initialDistrict ?? "");
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [events, setEvents] = useState<FestivalRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewYear, setViewYear] = useState(todayParts.year);
  const [viewMonth, setViewMonth] = useState(todayParts.month);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [listMode, setListMode] = useState<"day" | "all">("day");

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

    const anchor = rows[0]?.startDate;
    if (anchor) {
      const d = parseDateOnly(anchor);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setSelectedDate(anchor);
      setListMode("day");
    }
  }, [region, district, upcomingOnly, loaded, initialRegion]);

  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, FestivalRow[]>();
    for (const cell of cells) {
      if (!cell) continue;
      const hits = eventsOnDate(events, cell);
      if (hits.length) map.set(cell, hits);
    }
    return map;
  }, [cells, events]);

  const selectedEvents = useMemo(() => {
    if (listMode === "all") return events;
    return eventsOnDate(events, selectedDate);
  }, [events, listMode, selectedDate]);

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1, 12, 0, 0, 0);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function goToday() {
    setViewYear(todayParts.year);
    setViewMonth(todayParts.month);
    setSelectedDate(today);
    setListMode("day");
  }

  return (
    <div className="space-y-4 px-4 pb-10 pt-2">
      <header className="space-y-2">
        <p className="font-display text-2xl font-semibold text-loom-ink">
          Handloom festival calendar
        </p>
        <p className="text-sm text-loom-muted">
          Month view of state and weaving-hub dates that drive festive cloth
          demand — tap a day to plan yarn and loom time.{" "}
          <span className="rounded-md bg-loom-accent-soft px-1.5 py-0.5 text-xs font-medium text-loom-ink">
            Calendar view · curated festival dates
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

      <section
        aria-label="Festival month calendar"
        className="overflow-hidden rounded-2xl border border-loom-border bg-white"
      >
        <div className="flex items-center justify-between gap-2 border-b border-loom-border bg-loom-bg px-3 py-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex size-11 items-center justify-center rounded-xl border border-loom-border bg-white text-loom-ink"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="min-w-0 text-center">
            <p className="font-display text-lg font-semibold text-loom-ink">
              {monthLabel(viewYear, viewMonth)}
            </p>
            <button
              type="button"
              onClick={goToday}
              className="mt-0.5 text-xs font-semibold text-loom-primary underline"
            >
              Today
            </button>
          </div>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex size-11 items-center justify-center rounded-xl border border-loom-border bg-white text-loom-ink"
            aria-label="Next month"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-loom-border bg-loom-surface">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-1 py-2 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-loom-muted"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((dateOnly, idx) => {
            if (!dateOnly) {
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-[3.25rem] border-b border-r border-loom-border/60 bg-loom-bg/40"
                />
              );
            }
            const dayHits = eventsByDate.get(dateOnly) ?? [];
            const isToday = dateOnly === today;
            const isSelected =
              listMode === "day" && selectedDate === dateOnly;
            const dayNum = Number(dateOnly.slice(-2));

            return (
              <button
                key={dateOnly}
                type="button"
                onClick={() => {
                  setSelectedDate(dateOnly);
                  setListMode("day");
                }}
                aria-pressed={isSelected}
                aria-label={`${formatDisplayDate(dateOnly)}${
                  dayHits.length
                    ? `, ${dayHits.length} festival${dayHits.length > 1 ? "s" : ""}`
                    : ""
                }`}
                className={`relative flex min-h-[3.25rem] flex-col items-center gap-1 border-b border-r border-loom-border/60 px-0.5 py-1.5 transition-colors ${
                  isSelected
                    ? "bg-loom-primary-soft"
                    : dayHits.length
                      ? "bg-loom-accent-soft/40 hover:bg-loom-accent-soft/70"
                      : "bg-white hover:bg-loom-bg"
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday
                      ? "bg-loom-primary text-white"
                      : isSelected
                        ? "text-loom-primary"
                        : "text-loom-ink"
                  }`}
                >
                  {dayNum}
                </span>
                {dayHits.length > 0 ? (
                  <span className="flex max-w-full items-center justify-center gap-0.5">
                    {dayHits.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="size-1.5 shrink-0 rounded-full bg-loom-accent"
                        title={e.name}
                      />
                    ))}
                    {dayHits.length > 3 ? (
                      <span className="text-[0.55rem] font-semibold text-loom-muted">
                        +{dayHits.length - 3}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span className="size-1.5" aria-hidden />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-loom-border bg-loom-surface px-3 py-2 text-[0.7rem] text-loom-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-loom-accent" />
            Festival window
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-loom-primary" />
            Today
          </span>
          <span className="ml-auto font-medium text-loom-ink">
            {events.length} in view
          </span>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setListMode("day")}
          className={`min-h-10 flex-1 rounded-xl border px-3 text-sm font-semibold ${
            listMode === "day"
              ? "border-loom-primary bg-loom-primary-soft text-loom-primary"
              : "border-loom-border bg-white text-loom-muted"
          }`}
        >
          Selected day
        </button>
        <button
          type="button"
          onClick={() => setListMode("all")}
          className={`min-h-10 flex-1 rounded-xl border px-3 text-sm font-semibold ${
            listMode === "all"
              ? "border-loom-primary bg-loom-primary-soft text-loom-primary"
              : "border-loom-border bg-white text-loom-muted"
          }`}
        >
          All matching
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-loom-ink">
          {listMode === "all"
            ? "All matching festivals"
            : `Festivals on ${formatDisplayDate(selectedDate)}`}
        </p>
        <ul className="space-y-3">
          {selectedEvents.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-loom-border p-4 text-sm text-loom-muted">
              {listMode === "all"
                ? "No festivals match this filter in the calendar."
                : "No festivals on this day — pick a marked date or switch to All matching."}
            </li>
          ) : (
            selectedEvents.map((e) => <FestivalCard key={e.id} e={e} />)
          )}
        </ul>
      </div>
    </div>
  );
}
