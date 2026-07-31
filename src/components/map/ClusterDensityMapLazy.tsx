"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Inner = dynamic(
  () =>
    import("@/components/map/ClusterDensityMap").then(
      (m) => m.ClusterDensityMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(58vh,480px)] items-center justify-center rounded-[1.75rem] border border-[#e8e2d8] bg-[#fffdf8] text-sm text-[#5c6570]">
        Loading cluster heatmap…
      </div>
    ),
  },
);

export function ClusterDensityMap(props: ComponentProps<typeof Inner>) {
  return <Inner {...props} />;
}
