"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HeatLayer } from "@/components/map/HeatLayer";
import { FlyTo } from "@/components/map/FlyTo";
import { MapDetailCard, MapHeatLegend } from "@/components/map/MapChrome";
import {
  DELHI_STATE_ZOOM,
  DISTRICT_ZOOM,
  INDIA_MAP_CENTER,
  INDIA_MAP_ZOOM,
  resolveHub,
} from "@/lib/map/hub-geo";
import {
  type ClusterHeatScope,
  type GovClusterHeatHub,
  type GovClusterHeatPayload,
  type GovClusterStateRollup,
} from "@/lib/map/cluster-heat-bands";
import { bandColor } from "@/lib/map/cluster-heat-bands";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";
import { INDIA_STATES } from "@/lib/auth/regions";
import { ChevronRight, Layers, MapPinned } from "lucide-react";

type SocietyFilter = "all" | "cooperative" | "pc";
type ViewMode = "hubs" | "states";

type Props = {
  /** Optional external focus from Official Cluster Match */
  focusRegion?: string | null;
  focusDistrict?: string | null;
  /** Prefill filters from match form */
  initialRegion?: string | null;
  initialCategoryId?: string | null;
  onHubSelect?: (hub: {
    region: string;
    district: string;
    id: string;
  }) => void;
};

const BAND_META = [
  { id: "hot" as const, label: "Hot", hint: "85–100" },
  { id: "high" as const, label: "High", hint: "70–84" },
  { id: "mid" as const, label: "Mid", hint: "50–69" },
  { id: "low" as const, label: "Low", hint: "<50" },
];

function DensityBar({ value }: { value: number }) {
  const pct = Math.max(4, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3efe6]">
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, #f5e6b8 0%, #e0b45a 35%, #c4920a 65%, #8f2f2f 100%)",
        }}
      />
    </div>
  );
}

export function ClusterDensityMapInner({
  focusRegion,
  focusDistrict,
  initialRegion,
  initialCategoryId,
  onHubSelect,
}: Props) {
  const [scope, setScope] = useState<ClusterHeatScope>("national");
  const [region, setRegion] = useState<string | null>(initialRegion ?? null);
  const [societyType, setSocietyType] = useState<SocietyFilter>("all");
  const [categoryId, setCategoryId] = useState<string | null>(
    initialCategoryId ?? null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("hubs");
  const [payload, setPayload] = useState<GovClusterHeatPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickedHub, setPickedHub] = useState<GovClusterHeatHub | null>(null);
  const [pickedState, setPickedState] = useState<GovClusterStateRollup | null>(
    null,
  );
  const [bandFilter, setBandFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!focusRegion) return;
    setRegion(focusRegion);
    setScope("state");
    setViewMode("hubs");
  }, [focusRegion, focusDistrict]);

  useEffect(() => {
    if (initialCategoryId !== undefined) {
      setCategoryId(initialCategoryId ?? null);
    }
  }, [initialCategoryId]);

  useEffect(() => {
    if (initialRegion) setRegion((r) => r ?? initialRegion);
  }, [initialRegion]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        scope,
        societyType,
      });
      if (scope === "state" && region) params.set("region", region);
      if (categoryId) params.set("categoryId", categoryId);
      try {
        const res = await fetch(`/api/clusters/heatmap?${params}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setError(data.error ?? "Failed to load heatmap");
            setPayload(null);
          }
          return;
        }
        if (!cancelled) {
          const next = data as GovClusterHeatPayload;
          setPayload(next);
          setPickedHub((prev) =>
            prev ? (next.hubs.find((h) => h.id === prev.id) ?? null) : null,
          );
          setPickedState((prev) =>
            prev
              ? (next.stateRollups.find((s) => s.state === prev.state) ?? null)
              : null,
          );
        }
      } catch {
        if (!cancelled) setError("Could not reach cluster heatmap");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [scope, region, societyType, categoryId]);

  useEffect(() => {
    if (!payload || !focusDistrict || !focusRegion) return;
    const hit = payload.hubs.find(
      (h) =>
        h.state.toLowerCase() === focusRegion.toLowerCase() &&
        (h.loomOsCluster.toLowerCase() === focusDistrict.toLowerCase() ||
          h.district.toLowerCase() === focusDistrict.toLowerCase()),
    );
    if (hit) setPickedHub(hit);
  }, [payload, focusDistrict, focusRegion]);

  const hubs = useMemo(() => {
    if (!payload) return [];
    if (!bandFilter) return payload.hubs;
    return payload.hubs.filter((h) => h.band === bandFilter);
  }, [payload, bandFilter]);

  const bandCounts = useMemo(() => {
    const counts: Record<string, number> = {
      hot: 0,
      high: 0,
      mid: 0,
      low: 0,
    };
    for (const h of payload?.hubs ?? []) counts[h.band] = (counts[h.band] ?? 0) + 1;
    return counts;
  }, [payload]);

  const fly = useMemo(() => {
    if (pickedHub) {
      return {
        center: [pickedHub.lat, pickedHub.lng] as [number, number],
        zoom: DISTRICT_ZOOM - 1,
      };
    }
    if (scope === "state" && region) {
      const hub = resolveHub(region);
      const zoom =
        region.toLowerCase() === "delhi" ? DELHI_STATE_ZOOM : 7;
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom,
      };
    }
    return {
      center: [INDIA_MAP_CENTER.lat, INDIA_MAP_CENTER.lng] as [number, number],
      zoom: INDIA_MAP_ZOOM,
    };
  }, [scope, region, pickedHub]);

  const heatPoints = useMemo(() => {
    if (viewMode === "states" && scope === "national") {
      return (payload?.stateRollups ?? []).map((s) => ({
        lat: s.lat,
        lng: s.lng,
        weight: s.weight,
      }));
    }
    return hubs.map((h) => ({
      lat: h.lat,
      lng: h.lng,
      weight: h.weight,
    }));
  }, [viewMode, scope, payload, hubs]);

  function selectHub(hub: GovClusterHeatHub) {
    setPickedHub(hub);
    setPickedState(null);
    onHubSelect?.({
      region: hub.state,
      district: hub.loomOsCluster,
      id: hub.id,
    });
  }

  function drillIntoState(state: string) {
    setRegion(state);
    setScope("state");
    setViewMode("hubs");
    setPickedState(null);
    setPickedHub(null);
  }

  function goNational() {
    setScope("national");
    setRegion(null);
    setPickedHub(null);
    setPickedState(null);
  }

  const scopeLabel =
    scope === "state" && region
      ? `${region} · ${hubs.length} hubs`
      : `India · ${payload?.stats.hubCount ?? 0} hubs · ${payload?.stats.stateCount ?? 0} states`;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e2d8] bg-[#fffdf8] shadow-[0_16px_48px_rgba(60,36,21,0.12)]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#e8e2d8]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 0% 0%, #f5e6b8 0%, transparent 55%), radial-gradient(ellipse 60% 80% at 100% 0%, #f3e0c4 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8a8070]">
                <Layers className="size-3.5" aria-hidden />
                Official cluster heatmap
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-loom-display)] text-2xl font-semibold leading-tight text-[#1a1f24]">
                Weaver density across India
              </h2>
              <p className="mt-1 max-w-xl text-sm text-[#5c6570]">
                DC (Handlooms) campaign hubs — glow tracks listing density from
                Weavers Database PDFs, not census headcount.
              </p>
            </div>
            <div className="flex flex-wrap rounded-full border border-[#e8e2d8] bg-[#fffdf8]/90 p-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
              <button
                type="button"
                className={`rounded-full px-3.5 py-1.5 transition ${
                  scope === "national"
                    ? "bg-[#3c2415] text-white"
                    : "text-[#5c6570] hover:bg-[#f3efe6]"
                }`}
                onClick={goNational}
              >
                Nation
              </button>
              <button
                type="button"
                className={`rounded-full px-3.5 py-1.5 transition ${
                  scope === "state"
                    ? "bg-[#3c2415] text-white"
                    : "text-[#5c6570] hover:bg-[#f3efe6]"
                }`}
                onClick={() => {
                  setScope("state");
                  if (!region && payload?.stateRollups[0]) {
                    setRegion(payload.stateRollups[0].state);
                  } else if (!region) {
                    setRegion(initialRegion || "Tamil Nadu");
                  }
                  setViewMode("hubs");
                }}
              >
                State
              </button>
            </div>
          </div>

          {/* Stats ribbon */}
          {payload ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                {
                  label: "Hubs",
                  value: String(payload.stats.hubCount),
                },
                {
                  label: "States",
                  value: String(payload.stats.stateCount),
                },
                {
                  label: "Avg density",
                  value: `${payload.stats.avgDensity}`,
                },
                {
                  label: "Top hub",
                  value: payload.stats.topHub ?? "—",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#e8e2d8]/80 bg-[#fffdf8]/75 px-3 py-2.5 backdrop-blur-sm"
                >
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                    {s.label}
                  </p>
                  <p className="mt-0.5 truncate font-[family-name:var(--font-loom-display)] text-lg font-semibold text-[#1a1f24]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                Society
              </span>
              {(
                [
                  ["all", "All"],
                  ["cooperative", "Co-ops"],
                  ["pc", "PCs"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    societyType === id
                      ? "bg-[#1e3a5f] text-white"
                      : "border border-[#e8e2d8] bg-white text-[#5c6570] hover:bg-[#f3efe6]"
                  }`}
                  onClick={() => setSocietyType(id)}
                >
                  {label}
                </button>
              ))}
              {scope === "national" ? (
                <>
                  <span className="mx-1 hidden h-4 w-px bg-[#e8e2d8] sm:block" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                    View
                  </span>
                  {(
                    [
                      ["hubs", "Hubs"],
                      ["states", "States"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        viewMode === id
                          ? "bg-[#c4920a] text-[#1a1f24]"
                          : "border border-[#e8e2d8] bg-white text-[#5c6570] hover:bg-[#f3efe6]"
                      }`}
                      onClick={() => {
                        setViewMode(id);
                        setPickedHub(null);
                        setPickedState(null);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </>
              ) : null}
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <label className="block min-w-[10rem] flex-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                Category affinity
                <select
                  className="mt-1 w-full rounded-xl border border-[#d9d2c4] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1a1f24]"
                  value={categoryId ?? ""}
                  onChange={(e) =>
                    setCategoryId(e.target.value || null)
                  }
                >
                  <option value="">All categories</option>
                  {DEMAND_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              {scope === "state" ? (
                <label className="block min-w-[10rem] flex-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                  State
                  <select
                    className="mt-1 w-full rounded-xl border border-[#d9d2c4] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1a1f24]"
                    value={region ?? ""}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setPickedHub(null);
                    }}
                  >
                    {INDIA_STATES.map((s) => {
                      const rollup = payload?.stateRollups.find(
                        (r) => r.state === s,
                      );
                      return (
                        <option key={s} value={s}>
                          {rollup ? `${s} (${rollup.hubCount})` : s}
                        </option>
                      );
                    })}
                  </select>
                </label>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {BAND_META.map((b) => {
                const active = bandFilter === b.id;
                const colors = bandColor(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-[#3c2415] bg-[#3c2415] text-white"
                        : "border-[#e8e2d8] bg-white text-[#5c6570] hover:bg-[#f3efe6]"
                    }`}
                    onClick={() =>
                      setBandFilter(active ? null : b.id)
                    }
                  >
                    <span
                      className="size-2.5 rounded-full ring-1 ring-black/10"
                      style={{ background: colors.fill }}
                      aria-hidden
                    />
                    {b.label}
                    <span className={active ? "text-white/70" : "text-[#8a8070]"}>
                      {bandCounts[b.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-[#5c6570]">{scopeLabel}</p>
              <div className="min-w-[12rem] max-w-xs flex-1 sm:flex-none">
                <MapHeatLegend label="Density weight" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map + rail */}
      <div className="grid lg:grid-cols-[1.4fr_minmax(17rem,22rem)]">
        <div className="relative h-[min(58vh,480px)] w-full border-b border-[#e8e2d8] lg:border-b-0 lg:border-r">
          {loading && !payload ? (
            <div className="flex h-full items-center justify-center bg-[#f3efe6] text-sm text-[#5c6570]">
              Mapping official clusters…
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center bg-[#f3efe6] px-4 text-center text-sm text-[#8f2f2f]">
              {error}
            </div>
          ) : (
            <MapContainer
              center={fly.center}
              zoom={fly.zoom}
              className="h-full w-full"
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo center={fly.center} zoom={fly.zoom} />
              <HeatLayer
                points={heatPoints}
                radius={
                  viewMode === "states"
                    ? 48
                    : scope === "state"
                      ? 32
                      : 38
                }
                blur={viewMode === "states" ? 32 : scope === "state" ? 20 : 26}
              />

              {viewMode === "states" && scope === "national"
                ? (payload?.stateRollups ?? []).map((s) => {
                    const colors = bandColor(s.band);
                    const selected = pickedState?.state === s.state;
                    return (
                      <CircleMarker
                        key={s.state}
                        center={[s.lat, s.lng]}
                        radius={10 + s.hubCount * 2.2 + s.avgDensity / 18}
                        pathOptions={{
                          color: selected ? "#1a1f24" : colors.stroke,
                          fillColor: colors.fill,
                          fillOpacity: selected ? 0.85 : 0.55,
                          weight: selected ? 3 : 2,
                        }}
                        eventHandlers={{
                          click: () => {
                            setPickedState(s);
                            setPickedHub(null);
                          },
                          dblclick: () => drillIntoState(s.state),
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -6]}>
                          <span className="font-semibold">
                            {s.state}: avg {s.avgDensity} · {s.hubCount} hubs
                          </span>
                        </Tooltip>
                      </CircleMarker>
                    );
                  })
                : hubs.map((h) => {
                    const colors = bandColor(h.band);
                    const selected = pickedHub?.id === h.id;
                    return (
                      <CircleMarker
                        key={h.id}
                        center={[h.lat, h.lng]}
                        radius={
                          7 +
                          h.densityWeight / 12 +
                          (selected ? 4 : 0)
                        }
                        pathOptions={{
                          color: selected ? "#1a1f24" : colors.stroke,
                          fillColor: colors.fill,
                          fillOpacity: selected
                            ? 0.9
                            : 0.35 + h.weight * 0.45,
                          weight: selected ? 3 : 2,
                        }}
                        eventHandlers={{
                          click: () => selectHub(h),
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -4]}>
                          <span className="font-semibold">
                            {h.societyName} · {h.densityWeight}
                          </span>
                        </Tooltip>
                      </CircleMarker>
                    );
                  })}
            </MapContainer>
          )}

          {loading && payload ? (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-[#3c2415]/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Updating…
            </div>
          ) : null}
        </div>

        {/* Ranked rail */}
        <aside className="flex max-h-[min(58vh,480px)] flex-col bg-[#fffdf8]">
          <div className="flex items-center justify-between border-b border-[#e8e2d8] px-4 py-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#8a8070]">
              {viewMode === "states" && scope === "national"
                ? "States by avg density"
                : "Hubs by density"}
            </p>
            <span className="rounded-full bg-[#f3efe6] px-2 py-0.5 text-[0.65rem] font-semibold text-[#5c6570]">
              {viewMode === "states" && scope === "national"
                ? payload?.stateRollups.length ?? 0
                : hubs.length}
            </span>
          </div>
          <ul className="flex-1 space-y-1 overflow-auto p-2">
            {viewMode === "states" && scope === "national"
              ? (payload?.stateRollups ?? []).map((s, i) => {
                  const active = pickedState?.state === s.state;
                  const colors = bandColor(s.band);
                  return (
                    <li key={s.state}>
                      <button
                        type="button"
                        className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                          active
                            ? "bg-[#3c2415] text-white"
                            : "hover:bg-[#f3efe6]"
                        }`}
                        onClick={() => {
                          setPickedState(s);
                          setPickedHub(null);
                        }}
                        onDoubleClick={() => drillIntoState(s.state)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className={`text-[0.65rem] font-semibold uppercase tracking-wide ${
                                active ? "text-white/60" : "text-[#8a8070]"
                              }`}
                            >
                              #{i + 1} · {s.hubCount} hubs
                            </p>
                            <p className="truncate font-semibold">
                              {s.state}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                              active
                                ? "bg-white/15 text-white"
                                : "bg-[#f5e6b8] text-[#3c2415]"
                            }`}
                          >
                            {s.avgDensity}
                          </span>
                        </div>
                        <div className="mt-2">
                          <DensityBar value={s.avgDensity} />
                        </div>
                        <p
                          className={`mt-1.5 flex items-center gap-1 text-[0.65rem] ${
                            active ? "text-white/70" : "text-[#8a8070]"
                          }`}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ background: colors.fill }}
                            aria-hidden
                          />
                          {s.band} · double-click to open
                          <ChevronRight className="size-3" aria-hidden />
                        </p>
                      </button>
                    </li>
                  );
                })
              : hubs.map((h, i) => {
                  const active = pickedHub?.id === h.id;
                  const colors = bandColor(h.band);
                  return (
                    <li key={h.id}>
                      <button
                        type="button"
                        className={`w-full rounded-2xl px-3 py-2.5 text-left transition ${
                          active
                            ? "bg-[#3c2415] text-white"
                            : "hover:bg-[#f3efe6]"
                        }`}
                        onClick={() => selectHub(h)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className={`text-[0.65rem] font-semibold uppercase tracking-wide ${
                                active ? "text-white/60" : "text-[#8a8070]"
                              }`}
                            >
                              #{i + 1} · {h.societyTypeLabel}
                            </p>
                            <p className="truncate font-semibold">
                              {h.societyName}
                            </p>
                            <p
                              className={`truncate text-xs ${
                                active ? "text-white/70" : "text-[#5c6570]"
                              }`}
                            >
                              {h.district}, {h.state}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                              active
                                ? "bg-white/15 text-white"
                                : "bg-[#f5e6b8] text-[#3c2415]"
                            }`}
                          >
                            {h.densityWeight}
                          </span>
                        </div>
                        <div className="mt-2">
                          <DensityBar value={h.densityWeight} />
                        </div>
                        <p
                          className={`mt-1.5 flex items-center gap-1 text-[0.65rem] ${
                            active ? "text-white/70" : "text-[#8a8070]"
                          }`}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ background: colors.fill }}
                            aria-hidden
                          />
                          {h.band} band
                        </p>
                      </button>
                    </li>
                  );
                })}
            {hubs.length === 0 &&
            !(viewMode === "states" && scope === "national") ? (
              <li className="px-3 py-8 text-center text-sm text-[#5c6570]">
                No hubs match these filters.
              </li>
            ) : null}
          </ul>
        </aside>
      </div>

      {/* Detail */}
      {pickedHub ? (
        <div className="border-t border-[#e8e2d8] p-3">
          <MapDetailCard
            eyebrow={`${pickedHub.district} · ${pickedHub.state}`}
            title={pickedHub.societyName}
            subtitle={pickedHub.societyTypeLabel}
            badges={
              <>
                <span className="rounded-full bg-[#f5e6b8] px-2.5 py-1 text-xs font-semibold text-[#9a5b12]">
                  Campaign density {pickedHub.densityWeight}/100
                </span>
                <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold capitalize text-[#3c2415]">
                  {pickedHub.band} band
                </span>
                {pickedHub.weaverCount != null ? (
                  <span className="rounded-full bg-[#d8ebe0] px-2.5 py-1 text-xs font-semibold text-[#2f6b4f]">
                    {pickedHub.weaverCount} listing rows
                  </span>
                ) : null}
                {pickedHub.giProductCount > 0 ? (
                  <span className="rounded-full bg-[#e8f0e4] px-2.5 py-1 text-xs font-semibold text-[#2f5a3c]">
                    GI ×{pickedHub.giProductCount}
                  </span>
                ) : null}
              </>
            }
            onClose={() => setPickedHub(null)}
          >
            <DensityBar value={pickedHub.densityWeight} />
            <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
              Products &amp; weaves
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {pickedHub.products.slice(0, 6).map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-[#efe8d8] px-2.5 py-1 text-xs font-semibold text-[#3c2415]"
                >
                  {p}
                </span>
              ))}
              {pickedHub.weaves.slice(0, 3).map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold text-[#5c6570]"
                >
                  {w}
                </span>
              ))}
              {pickedHub.categoryHints.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[#d9e3f0] px-2.5 py-1 text-xs font-semibold text-[#1e3a5f]"
                >
                  {DEMAND_CATEGORIES.find((d) => d.id === c)?.label ?? c}
                </span>
              ))}
              {!pickedHub.products.length &&
              !pickedHub.weaves.length &&
              !pickedHub.categoryHints.length ? (
                <span className="text-sm text-[#5c6570]">None listed</span>
              ) : null}
            </div>
            {pickedHub.societyNames.length > 0 ? (
              <>
                <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
                  Societies (names only)
                </p>
                <ul className="mt-1.5 list-inside list-disc text-xs text-[#5c6570]">
                  {pickedHub.societyNames.slice(0, 5).map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {scope === "national" || region !== pickedHub.state ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-3 py-1.5 text-xs font-semibold text-white"
                  onClick={() => drillIntoState(pickedHub.state)}
                >
                  <MapPinned className="size-3.5" aria-hidden />
                  Zoom to {pickedHub.state}
                </button>
              ) : null}
              {pickedHub.sourceUrl ? (
                <a
                  href={pickedHub.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d2c4] bg-white px-3 py-1.5 text-xs font-semibold text-[#1e3a5f]"
                >
                  Source PDF
                </a>
              ) : null}
            </div>
            <p className="mt-3 text-[11px] leading-snug text-[#8a8070]">
              {pickedHub.sourceNote}
            </p>
          </MapDetailCard>
        </div>
      ) : pickedState ? (
        <div className="border-t border-[#e8e2d8] p-3">
          <MapDetailCard
            eyebrow="State rollup"
            title={pickedState.state}
            subtitle={`${pickedState.hubCount} official hubs in campaign seed`}
            badges={
              <>
                <span className="rounded-full bg-[#f5e6b8] px-2.5 py-1 text-xs font-semibold text-[#9a5b12]">
                  Avg {pickedState.avgDensity}
                </span>
                <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold text-[#3c2415]">
                  Peak {pickedState.maxDensity}
                </span>
                <span className="rounded-full bg-[#d9e3f0] px-2.5 py-1 text-xs font-semibold text-[#1e3a5f]">
                  {pickedState.cooperativeCount} co-ops
                </span>
                <span className="rounded-full bg-[#d8ebe0] px-2.5 py-1 text-xs font-semibold text-[#2f6b4f]">
                  {pickedState.pcCount} PCs
                </span>
              </>
            }
            onClose={() => setPickedState(null)}
          >
            <DensityBar value={pickedState.avgDensity} />
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#3c2415] px-3 py-1.5 text-xs font-semibold text-white"
              onClick={() => drillIntoState(pickedState.state)}
            >
              Open {pickedState.state} hubs
              <ChevronRight className="size-3.5" aria-hidden />
            </button>
          </MapDetailCard>
        </div>
      ) : null}

      <p className="border-t border-[#e8e2d8] px-4 py-2.5 text-[11px] text-[#8a8070]">
        {payload?.disclaimer ??
          "Campaign listing density — DC (Handlooms) Weavers Database PDFs."}
        {payload?.meta.asOf ? ` As of ${payload.meta.asOf}.` : null}
      </p>
    </div>
  );
}
