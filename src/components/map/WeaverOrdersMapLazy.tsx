"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Inner = dynamic(
  () =>
    import("@/components/map/WeaverOrdersMap").then(
      (m) => m.WeaverOrdersMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(52vh,420px)] items-center justify-center rounded-2xl border border-loom-border bg-loom-surface text-sm text-loom-muted">
        Loading orders map…
      </div>
    ),
  },
);

export function WeaverOrdersMap(
  props: ComponentProps<typeof Inner>,
) {
  return <Inner {...props} />;
}
