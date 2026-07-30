"use client";

import { useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HeatLayer } from "@/components/map/HeatLayer";
import { FlyTo } from "@/components/map/FlyTo";
import { MapDetailCard, MapHeatLegend } from "@/components/map/MapChrome";
import {
  DELHI_STATE_ZOOM,
  DISTRICT_ZOOM,
  INDIA_MAP_CENTER,
  INDIA_MAP_ZOOM,
  PRIMARY_DEMAND,
  isIitClusterDistrict,
  resolveHub,
} from "@/lib/map/hub-geo";
import type {
  DemandHeatScope,
  DistrictCluster,
  MapWeaverPin,
  StateCluster,
} from "@/lib/map/build-map-data";
import { Search, Star, X } from "lucide-react";

export type BuyerMapSuggestion = {
  label: string;
  region: string;
  district?: string;
  kind: "state" | "district";
};

type Props = {
  weavers: MapWeaverPin[];
  stateClusters: StateCluster[];
  districtClusters: DistrictCluster[];
  disclaimer: string;
};

function weaverIcon(verified: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:30px;height:30px;border-radius:999px;
      background:${verified ? "#2f6b4f" : "#3c2415"};
      border:2.5px solid #fffdf8;
      box-shadow:0 2px 8px rgba(60,36,21,.35);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font:700 12px/1 system-ui,sans-serif;
    ">★</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-amber-700"
      aria-label={`${rating} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < full || (i === full && half)
              ? "fill-amber-500 text-amber-500"
              : "text-[#d9d2c4]"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-[#1a1f24]">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function BuyerWeaversMapInner({
  weavers,
  stateClusters,
  districtClusters,
  disclaimer,
}: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BuyerMapSuggestion[]>([]);
  /** Default cluster: IIT Delhi micro-hub */
  const [scope, setScope] = useState<DemandHeatScope>("district");
  const [region, setRegion] = useState<string | null>(PRIMARY_DEMAND.region);
  const [district, setDistrict] = useState<string | null>(
    PRIMARY_DEMAND.district,
  );
  const [selected, setSelected] = useState<MapWeaverPin | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const filtered = useMemo(() => {
    return weavers.filter((w) => {
      if (scope === "national") return true;
      if (w.region.toLowerCase() !== (region ?? PRIMARY_DEMAND.region).toLowerCase())
        return false;
      if (scope === "state") return true;
      // IIT micro-cluster
      if (district && isIitClusterDistrict(district)) {
        return isIitClusterDistrict(w.district);
      }
      if (district) {
        return w.district.toLowerCase() === district.toLowerCase();
      }
      return true;
    });
  }, [weavers, region, district, scope]);

  const viewDistricts = useMemo(() => {
    const r = region ?? PRIMARY_DEMAND.region;
    return districtClusters.filter(
      (d) => d.region.toLowerCase() === r.toLowerCase(),
    );
  }, [districtClusters, region]);

  const fly = useMemo(() => {
    if (scope === "district") {
      const hub = resolveHub(
        region || PRIMARY_DEMAND.region,
        district || PRIMARY_DEMAND.district,
      );
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom: DISTRICT_ZOOM,
      };
    }
    if (scope === "state") {
      const hub = resolveHub(region || PRIMARY_DEMAND.region);
      const zoom =
        (region || PRIMARY_DEMAND.region).toLowerCase() === "delhi"
          ? DELHI_STATE_ZOOM
          : 7;
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom,
      };
    }
    return {
      center: [INDIA_MAP_CENTER.lat, INDIA_MAP_CENTER.lng] as [number, number],
      zoom: INDIA_MAP_ZOOM,
    };
  }, [scope, region, district]);

  const heatPoints = useMemo(() => {
    if (scope === "national") {
      return stateClusters.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        weight: Math.min(1, 0.2 + s.intensity * 0.8),
      }));
    }
    if (scope === "state") {
      return viewDistricts.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        weight: Math.min(1, 0.25 + d.weaverCount / 6),
      }));
    }
    return filtered.map((w) => ({
      lat: w.lat,
      lng: w.lng,
      weight: 0.55 + w.rating / 10,
    }));
  }, [scope, stateClusters, viewDistricts, filtered]);

  async function onQueryChange(value: string) {
    setQuery(value);
    setSuggestOpen(true);
    const res = await fetch(
      `/api/buyer/map?q=${encodeURIComponent(value)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return;
    const data = await res.json();
    setSuggestions(data.suggestions as BuyerMapSuggestion[]);
  }

  function applySuggestion(s: BuyerMapSuggestion) {
    setRegion(s.region);
    setDistrict(s.district ?? null);
    setQuery(s.label);
    setSuggestOpen(false);
    setSelected(null);
    if (s.district && isIitClusterDistrict(s.district)) {
      setScope("district");
    } else if (s.district) {
      setScope("district");
    } else {
      setScope("state");
    }
  }

  function setClusterScope(next: DemandHeatScope) {
    setScope(next);
    setSelected(null);
    setSuggestOpen(false);
    if (next === "district") {
      setRegion(PRIMARY_DEMAND.region);
      setDistrict(PRIMARY_DEMAND.district);
      setQuery("");
    } else if (next === "state") {
      setRegion(PRIMARY_DEMAND.region);
      setDistrict(null);
      setQuery(PRIMARY_DEMAND.region);
    } else {
      setRegion(null);
      setDistrict(null);
      setQuery("");
    }
  }

  function clearFilter() {
    setClusterScope("district");
  }

  const showNationalClusters = scope === "national";
  const showDistrictClusters = scope === "state";
  const showWeaverPins = scope === "district";

  const scopeLabel =
    scope === "district"
      ? `IIT cluster · ${district || PRIMARY_DEMAND.district}, ${region || PRIMARY_DEMAND.region} · ${filtered.length} weavers`
      : scope === "state"
        ? `District clusters · ${region || PRIMARY_DEMAND.region} · ${filtered.length} weavers`
        : `Nation clusters · ${weavers.length} weavers across ${stateClusters.length} states`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e8e2d8] bg-[#fffdf8] shadow-[0_12px_40px_rgba(60,36,21,0.12)]">
      <div className="relative z-20 space-y-3 border-b border-[#e8e2d8] bg-[#fffdf8] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#8a8070]">
              Weaver clusters
            </p>
            <p className="mt-0.5 text-sm text-[#5c6570]">
              {PRIMARY_DEMAND.district} · {PRIMARY_DEMAND.region} primary
            </p>
          </div>
          <div className="flex flex-wrap rounded-full border border-[#e8e2d8] bg-[#f3efe6] p-1 text-xs font-semibold">
            {(
              [
                ["district", "IIT"],
                ["state", "District"],
                ["national", "Nation"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`rounded-full px-3 py-1.5 transition ${
                  scope === id
                    ? "bg-[#3c2415] text-white shadow-sm"
                    : "text-[#5c6570]"
                }`}
                onClick={() => setClusterScope(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#8a8070]">
          Search state or district
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a8070]" />
          <input
            className="w-full rounded-2xl border border-[#d9d2c4] bg-[#fffdf8] py-3 pl-10 pr-11 text-sm text-[#1a1f24]"
            placeholder="Delhi, IIT Delhi…"
            value={query}
            onChange={(e) => void onQueryChange(e.target.value)}
            onFocus={() => {
              setSuggestOpen(true);
              if (suggestions.length === 0) void onQueryChange(query);
            }}
          />
          {(region || query) && scope !== "district" ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#5c6570] hover:bg-[#f3efe6]"
              onClick={clearFilter}
              aria-label="Reset to IIT Delhi cluster"
            >
              <X className="size-4" />
            </button>
          ) : null}
          {suggestOpen && suggestions.length > 0 ? (
            <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-auto rounded-2xl border border-[#e8e2d8] bg-white py-1 shadow-[0_12px_32px_rgba(60,36,21,0.14)]">
              {suggestions.map((s) => (
                <li key={`${s.kind}-${s.label}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-[#f3efe6]"
                    onClick={() => applySuggestion(s)}
                  >
                    <span>{s.label}</span>
                    <span className="rounded-full bg-[#f3efe6] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#8a8070]">
                      {s.kind}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="w-full border-t border-[#e8e2d8] px-3.5 py-2.5 text-left text-sm font-semibold text-[#3c2415]"
                  onClick={() => setClusterScope("district")}
                >
                  Reset to IIT Delhi cluster
                </button>
              </li>
            </ul>
          ) : null}
        </div>
        <p className="text-xs text-[#5c6570]">{scopeLabel}</p>
        <MapHeatLegend label="Weaver density" />
      </div>

      <div className="relative z-0 h-[min(62vh,520px)] w-full">
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
            radius={scope === "district" ? 28 : scope === "state" ? 34 : 42}
            blur={scope === "district" ? 18 : 28}
          />

          {showNationalClusters
            ? stateClusters.map((s) => (
                <CircleMarker
                  key={s.region}
                  center={[s.lat, s.lng]}
                  radius={12 + s.weaverCount * 2.5}
                  pathOptions={{
                    color: "#3c2415",
                    fillColor: "#c4920a",
                    fillOpacity: 0.4,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setRegion(s.region);
                      setDistrict(null);
                      setScope("state");
                      setQuery(s.region);
                      setSelected(null);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>
                    <span className="font-semibold">
                      {s.region}: {s.weaverCount} weavers
                    </span>
                  </Tooltip>
                </CircleMarker>
              ))
            : null}

          {showDistrictClusters
            ? viewDistricts.map((d) => (
                <CircleMarker
                  key={d.key}
                  center={[d.lat, d.lng]}
                  radius={14 + d.weaverCount * 3.5}
                  pathOptions={{
                    color: "#2f6b4f",
                    fillColor: "#3c2415",
                    fillOpacity: 0.5,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setDistrict(d.district);
                      setRegion(d.region);
                      setScope("district");
                      setQuery(`${d.district}, ${d.region}`);
                      setSelected(null);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>
                    <span className="font-semibold">
                      {d.district}: {d.weaverCount} · ★ {d.avgRating}
                    </span>
                  </Tooltip>
                </CircleMarker>
              ))
            : null}

          {showWeaverPins
            ? filtered.map((w) => (
                <Marker
                  key={w.id}
                  position={[w.lat, w.lng]}
                  icon={weaverIcon(w.verified)}
                  eventHandlers={{
                    click: () => setSelected(w),
                  }}
                >
                  <Popup>
                    <button
                      type="button"
                      className="text-left text-sm font-semibold text-[#3c2415] underline"
                      onClick={() => setSelected(w)}
                    >
                      Open {w.name.split("(")[0]?.trim()}
                    </button>
                  </Popup>
                </Marker>
              ))
            : null}
        </MapContainer>

        {selected ? (
          <MapDetailCard
            floating
            eyebrow={`${selected.district}, ${selected.region}`}
            title={selected.name.replace(/ \(demo.*?\)/i, "")}
            subtitle={selected.cooperativeName}
            badges={
              <>
                <Stars rating={selected.rating} />
                {selected.verified ? (
                  <span className="rounded-full bg-[#d8ebe0] px-2.5 py-1 text-xs font-semibold text-[#2f6b4f]">
                    Verified · {selected.completedSettlements} settlements
                  </span>
                ) : (
                  <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold text-[#5c6570]">
                    Not verified yet
                  </span>
                )}
                <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs text-[#5c6570]">
                  {selected.ratingLabel}
                </span>
              </>
            }
            onClose={() => setSelected(null)}
          >
            <p className="text-sm text-[#5c6570]">
              Weaves: {selected.categories.join(", ") || "—"}
            </p>
            <h4 className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
              Viewing menu (ready stock)
            </h4>
            <ul className="mt-2 space-y-1.5">
              {selected.menu.map((m) => (
                <li
                  key={m.key}
                  className="flex items-center justify-between rounded-2xl bg-[#f3efe6] px-3 py-2 text-sm"
                >
                  <span>{m.label}</span>
                  <span className="font-semibold tabular-nums text-[#3c2415]">
                    {m.count} {m.unit}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-[#8a8070]">{selected.yarnNote}</p>
            {selected.demoDisclaimer ? (
              <p className="mt-2 text-[11px] font-medium text-[#8a8070]">
                {selected.demoDisclaimer}
              </p>
            ) : null}
          </MapDetailCard>
        ) : null}
      </div>

      <p className="border-t border-[#e8e2d8] px-4 py-2.5 text-[11px] text-[#8a8070]">
        {disclaimer}
      </p>
    </div>
  );
}
