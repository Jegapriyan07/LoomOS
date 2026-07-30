"use client";

import { useMemo, useState } from "react";
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
  PRIMARY_DEMAND,
  resolveHub,
} from "@/lib/map/hub-geo";
import type {
  DemandHeatScope,
  OrderHeatPoint,
} from "@/lib/map/build-map-data";

type Props = {
  points: OrderHeatPoint[];
  focusRegion: string | null;
  focusDistrict?: string | null;
  disclaimer: string;
  scope: DemandHeatScope;
  onScopeChange?: (scope: DemandHeatScope) => void;
};

export function WeaverOrdersMapInner({
  points,
  focusRegion,
  focusDistrict,
  disclaimer,
  scope,
  onScopeChange,
}: Props) {
  const [picked, setPicked] = useState<OrderHeatPoint | null>(null);

  const fly = useMemo(() => {
    if (scope === "district") {
      const hub = resolveHub(
        focusRegion || PRIMARY_DEMAND.region,
        focusDistrict || PRIMARY_DEMAND.district,
      );
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom: DISTRICT_ZOOM,
      };
    }
    if (scope === "state" && focusRegion) {
      const hub = resolveHub(focusRegion);
      const zoom =
        focusRegion.toLowerCase() === "delhi" ? DELHI_STATE_ZOOM : 7;
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom,
      };
    }
    return {
      center: [INDIA_MAP_CENTER.lat, INDIA_MAP_CENTER.lng] as [number, number],
      zoom: INDIA_MAP_ZOOM,
    };
  }, [scope, focusRegion, focusDistrict]);

  const heatPoints = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        weight: p.weight,
      })),
    [points],
  );

  const scopeLabel =
    scope === "district"
      ? `IIT · ${focusDistrict || PRIMARY_DEMAND.district}`
      : scope === "state"
        ? `District · ${focusRegion || "Delhi"}`
        : "Nation · India";

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e8e2d8] bg-[#fffdf8] shadow-[0_12px_40px_rgba(60,36,21,0.12)]">
      <div className="space-y-3 border-b border-[#e8e2d8] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#8a8070]">
              Cluster heatmap
            </p>
            <p className="mt-0.5 text-sm text-[#5c6570]">{scopeLabel}</p>
          </div>
          {onScopeChange ? (
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
                  onClick={() => onScopeChange(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <MapHeatLegend label="Cluster density" />
      </div>

      <div className="relative h-[min(52vh,420px)] w-full">
        <MapContainer
          center={fly.center}
          zoom={fly.zoom}
          className="h-full w-full rounded-none"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo center={fly.center} zoom={fly.zoom} />
          <HeatLayer
            points={heatPoints}
            radius={scope === "district" ? 28 : scope === "state" ? 34 : 40}
            blur={scope === "district" ? 18 : 28}
          />
          {points.map((p) => (
            <CircleMarker
              key={p.key}
              center={[p.lat, p.lng]}
              radius={8 + p.weight * 16}
              pathOptions={{
                color: "#3c2415",
                fillColor: "#c4920a",
                fillOpacity: 0.28 + p.weight * 0.35,
                weight: 2,
              }}
              eventHandlers={{ click: () => setPicked(p) }}
            >
              <Tooltip direction="top" offset={[0, -4]}>
                {p.label}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {picked ? (
        <div className="border-t border-[#e8e2d8] p-3">
          <MapDetailCard
            eyebrow={
              picked.district
                ? `${picked.district} · ${picked.region}`
                : picked.region
            }
            title={picked.label}
            subtitle="Buyer hub from open requirements and pipeline orders."
            badges={
              <>
                <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold text-[#3c2415]">
                  ~{picked.pieceDemand} pieces
                </span>
                <span className="rounded-full bg-[#f3efe6] px-2.5 py-1 text-xs font-semibold text-[#3c2415]">
                  {picked.orderCount} order signals
                </span>
                {picked.amountInr > 0 ? (
                  <span className="rounded-full bg-[#f5e6b8] px-2.5 py-1 text-xs font-semibold text-[#9a5b12]">
                    ₹{picked.amountInr.toLocaleString("en-IN")} pipeline
                  </span>
                ) : null}
              </>
            }
            onClose={() => setPicked(null)}
          >
            <p className="text-sm leading-snug text-[#5c6570]">
              Heat weight {(picked.weight * 100).toFixed(0)}% at this hub —
              stronger glow means more open requirements near this place.
            </p>
          </MapDetailCard>
        </div>
      ) : null}

      <p className="border-t border-[#e8e2d8] px-4 py-2.5 text-[11px] text-[#8a8070]">
        {disclaimer}
      </p>
    </div>
  );
}
