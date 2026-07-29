"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Inner = dynamic(
  () =>
    import("@/components/map/BuyerWeaversMap").then(
      (m) => m.BuyerWeaversMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(62vh,520px)] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">
        Loading India map…
      </div>
    ),
  },
);

export function BuyerWeaversMap(
  props: ComponentProps<typeof Inner>,
) {
  return <Inner {...props} />;
}
