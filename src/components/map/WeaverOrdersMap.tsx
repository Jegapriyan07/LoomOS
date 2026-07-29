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
import {
  INDIA_MAP_CENTER,
  INDIA_MAP_ZOOM,
  STATE_ZOOM,
  resolveHub,
} from "@/lib/map/hub-geo";
import type { OrderHeatPoint } from "@/lib/map/build-map-data";

type Props = {
  points: OrderHeatPoint[];
  focusRegion: string | null;
  disclaimer: string;
  onToggleNational?: (national: boolean) => void;
  national: boolean;
};

export function WeaverOrdersMapInner({
  points,
  focusRegion,
  disclaimer,
  onToggleNational,
  national,
}: Props) {
  const [picked, setPicked] = useState<OrderHeatPoint | null>(null);

  const fly = useMemo(() => {
    if (!national && focusRegion) {
      const hub = resolveHub(focusRegion);
      return {
        center: [hub.lat, hub.lng] as [number, number],
        zoom: STATE_ZOOM,
      };
    }
    return {
      center: [INDIA_MAP_CENTER.lat, INDIA_MAP_CENTER.lng] as [number, number],
      zoom: INDIA_MAP_ZOOM,
    };
  }, [national, focusRegion]);

  const heatPoints = useMemo(
    () =>
      points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        weight: p.weight,
      })),
    [points],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-loom-border bg-loom-surface shadow-[var(--loom-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-loom-border px-3 py-2.5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-loom-primary">
            Orders heatmap
          </p>
          <p className="text-sm text-loom-muted">
            {national
              ? "Nationwide buyer demand & open pipeline"
              : `Demand near ${focusRegion || "your region"}`}
          </p>
        </div>
        {onToggleNational ? (
          <div className="flex rounded-lg border border-loom-border p-0.5 text-xs font-semibold">
            <button
              type="button"
              className={`rounded-md px-2.5 py-1.5 ${
                !national
                  ? "bg-loom-primary text-white"
                  : "text-loom-muted"
              }`}
              onClick={() => onToggleNational(false)}
            >
              My region
            </button>
            <button
              type="button"
              className={`rounded-md px-2.5 py-1.5 ${
                national
                  ? "bg-loom-primary text-white"
                  : "text-loom-muted"
              }`}
              onClick={() => onToggleNational(true)}
            >
              Nationwide
            </button>
          </div>
        ) : null}
      </div>

      <div className="h-[min(52vh,420px)] w-full">
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
          <HeatLayer points={heatPoints} radius={32} blur={24} />
          {points.map((p) => (
            <CircleMarker
              key={p.key}
              center={[p.lat, p.lng]}
              radius={6 + p.weight * 14}
              pathOptions={{
                color: "#1e3a5f",
                fillColor: "#c4920a",
                fillOpacity: 0.35 + p.weight * 0.45,
                weight: 1.5,
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
        <div className="border-t border-loom-border bg-loom-primary-soft/40 px-3 py-3">
          <p className="text-sm font-semibold text-loom-ink">{picked.label}</p>
          <p className="mt-1 text-sm text-loom-muted">
            ~{picked.pieceDemand} pieces demand · {picked.orderCount} order signals
            {picked.amountInr > 0
              ? ` · ₹${picked.amountInr.toLocaleString("en-IN")} in pipeline`
              : ""}
          </p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-loom-primary underline"
            onClick={() => setPicked(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <p className="border-t border-loom-border px-3 py-2 text-[11px] text-loom-muted">
        {disclaimer}
      </p>
    </div>
  );
}
