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
import {
  DISTRICT_ZOOM,
  INDIA_MAP_CENTER,
  INDIA_MAP_ZOOM,
  STATE_ZOOM,
  resolveHub,
} from "@/lib/map/hub-geo";
import type {
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
      width:28px;height:28px;border-radius:50%;
      background:${verified ? "#2f6b4f" : "#1e3a5f"};
      border:2px solid #fffdf8;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font:700 11px/1 system-ui,sans-serif;
    ">★</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-600" aria-label={`${rating} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < full || (i === full && half)
              ? "fill-amber-500 text-amber-500"
              : "text-slate-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-700">
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
  const [region, setRegion] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapWeaverPin | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const filtered = useMemo(() => {
    return weavers.filter((w) => {
      if (region && w.region.toLowerCase() !== region.toLowerCase()) return false;
      if (district && w.district.toLowerCase() !== district.toLowerCase())
        return false;
      return true;
    });
  }, [weavers, region, district]);

  const viewDistricts = useMemo(() => {
    if (!region) return [];
    return districtClusters.filter(
      (d) => d.region.toLowerCase() === region.toLowerCase(),
    );
  }, [districtClusters, region]);

  const fly = useMemo(() => {
    if (district && region) {
      const hub = resolveHub(region, district);
      return { center: [hub.lat, hub.lng] as [number, number], zoom: DISTRICT_ZOOM };
    }
    if (region) {
      const hub = resolveHub(region);
      return { center: [hub.lat, hub.lng] as [number, number], zoom: STATE_ZOOM };
    }
    return {
      center: [INDIA_MAP_CENTER.lat, INDIA_MAP_CENTER.lng] as [number, number],
      zoom: INDIA_MAP_ZOOM,
    };
  }, [region, district]);

  const heatPoints = useMemo(() => {
    if (region && !district) {
      return viewDistricts.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        weight: Math.min(1, 0.25 + d.weaverCount / 6),
      }));
    }
    if (!region) {
      return stateClusters.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        weight: Math.min(1, 0.2 + s.intensity * 0.8),
      }));
    }
    return filtered.map((w) => ({
      lat: w.lat,
      lng: w.lng,
      weight: 0.55 + w.rating / 10,
    }));
  }, [region, district, stateClusters, viewDistricts, filtered]);

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
  }

  function clearFilter() {
    setRegion(null);
    setDistrict(null);
    setQuery("");
    setSelected(null);
    setSuggestOpen(false);
  }

  const showNationalClusters = !region;
  const showDistrictClusters = Boolean(region && !district);
  const showWeaverPins = Boolean(district) || (region && filtered.length <= 8);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative z-20 border-b border-slate-200 bg-white p-3">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search state or district
        </label>
        <div className="relative mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-10 text-sm"
            placeholder="Tamil Nadu, Kanchipuram…"
            value={query}
            onChange={(e) => void onQueryChange(e.target.value)}
            onFocus={() => {
              setSuggestOpen(true);
              if (suggestions.length === 0) void onQueryChange(query);
            }}
          />
          {(region || query) && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
              onClick={clearFilter}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          {suggestOpen && suggestions.length > 0 ? (
            <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {suggestions.map((s) => (
                <li key={`${s.kind}-${s.label}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => applySuggestion(s)}
                  >
                    <span>{s.label}</span>
                    <span className="text-xs uppercase text-slate-400">
                      {s.kind}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="w-full border-t px-3 py-2 text-left text-sm font-semibold text-[#1e3a5f]"
                  onClick={clearFilter}
                >
                  Nationwide view
                </button>
              </li>
            </ul>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-slate-600">
          {region
            ? district
              ? `District cluster · ${district}, ${region} · ${filtered.length} weavers`
              : `State cluster · ${region} · ${filtered.length} weavers`
            : `Nationwide heatmap · ${weavers.length} weavers across ${stateClusters.length} states`}
        </p>
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
          <HeatLayer points={heatPoints} />

          {showNationalClusters
            ? stateClusters.map((s) => (
                <CircleMarker
                  key={s.region}
                  center={[s.lat, s.lng]}
                  radius={10 + s.weaverCount * 2}
                  pathOptions={{
                    color: "#1e3a5f",
                    fillColor: "#c4920a",
                    fillOpacity: 0.55,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setRegion(s.region);
                      setDistrict(null);
                      setQuery(s.region);
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
                  radius={12 + d.weaverCount * 3}
                  pathOptions={{
                    color: "#2f6b4f",
                    fillColor: "#1e3a5f",
                    fillOpacity: 0.65,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setDistrict(d.district);
                      setQuery(`${d.district}, ${d.region}`);
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

          {(showWeaverPins || district) &&
            filtered.map((w) => (
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
                    className="text-left text-sm font-semibold text-[#1e3a5f] underline"
                    onClick={() => setSelected(w)}
                  >
                    Open {w.name.split("(")[0]?.trim()}
                  </button>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {selected ? (
        <aside className="absolute bottom-3 left-3 right-3 z-30 max-h-[48%] overflow-auto rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:right-3 sm:w-80">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                {selected.district}, {selected.region}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                {selected.name.replace(/ \(demo.*?\)/i, "")}
              </h3>
              <Stars rating={selected.rating} />
            </div>
            <button
              type="button"
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.verified ? (
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                Verified · {selected.completedSettlements} settlements
              </span>
            ) : (
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                Not verified yet
              </span>
            )}
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
              {selected.ratingLabel}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {selected.cooperativeName}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Weaves: {selected.categories.join(", ") || "—"}
          </p>
          <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Viewing menu (ready stock)
          </h4>
          <ul className="mt-1 space-y-1">
            {selected.menu.map((m) => (
              <li
                key={m.key}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm"
              >
                <span>{m.label}</span>
                <span className="font-semibold tabular-nums">
                  {m.count} {m.unit}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">{selected.yarnNote}</p>
          <p className="mt-2 text-[11px] font-medium text-amber-900">
            {selected.demoDisclaimer}
          </p>
        </aside>
      ) : null}

      <p className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-500">
        {disclaimer}
      </p>
    </div>
  );
}
