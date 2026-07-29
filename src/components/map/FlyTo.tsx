"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export function FlyTo({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.85 });
  }, [map, center, zoom]);
  return null;
}
