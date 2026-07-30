"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

type HeatPoint = { lat: number; lng: number; weight: number };

type HeatFactory = (
  latlngs: Array<[number, number, number?]>,
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    gradient?: Record<number, string>;
  },
) => L.Layer;

function getHeatLayer(): HeatFactory {
  const factory = (L as unknown as { heatLayer?: HeatFactory }).heatLayer;
  if (!factory) {
    throw new Error("leaflet.heat failed to attach L.heatLayer");
  }
  return factory.bind(L) as HeatFactory;
}

/** LoomOS heat — cream → amber → brown → rust (no blue). */
export const LOOM_HEAT_GRADIENT: Record<number, string> = {
  0.15: "#f5e6b8",
  0.35: "#e0b45a",
  0.55: "#c4920a",
  0.75: "#3c2415",
  1: "#8f2f2f",
};

export function HeatLayer({
  points,
  radius = 36,
  blur = 28,
}: {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
}) {
  const map = useMap();
  const signature = points
    .map((p) => `${p.lat.toFixed(3)},${p.lng.toFixed(3)},${p.weight.toFixed(2)}`)
    .join("|");

  useEffect(() => {
    const heatLayer = getHeatLayer();
    const latlngs: Array<[number, number, number]> = points.map((p) => [
      p.lat,
      p.lng,
      Math.max(0.15, Math.min(1, p.weight)),
    ]);
    const layer = heatLayer(latlngs, {
      radius,
      blur,
      maxZoom: 14,
      max: 1,
      gradient: LOOM_HEAT_GRADIENT,
    });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
    // signature captures points content without new-array churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature, radius, blur]);

  return null;
}
