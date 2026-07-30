/** Shared heat legend + detail card chrome for Leaflet maps. */

import type { ReactNode } from "react";

export function MapHeatLegend({
  label = "Demand heat",
}: {
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e8e2d8] bg-[#fffdf8] px-3 py-2">
      <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-wide text-[#5c6570]">
        {label}
      </span>
      <div
        className="h-2.5 min-w-0 flex-1 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #f5e6b8 0%, #e0b45a 28%, #c4920a 52%, #3c2415 78%, #8f2f2f 100%)",
        }}
        aria-hidden
      />
      <div className="flex shrink-0 gap-2 text-[0.65rem] font-semibold text-[#5c6570]">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

type MapDetailCardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  children?: ReactNode;
  onClose: () => void;
  /** Floating over map vs inline under map */
  floating?: boolean;
};

export function MapDetailCard({
  eyebrow,
  title,
  subtitle,
  badges,
  children,
  onClose,
  floating = false,
}: MapDetailCardProps) {
  return (
    <aside
      className={
        floating
          ? "absolute bottom-3 left-3 right-3 z-30 max-h-[52%] overflow-auto rounded-3xl border border-[#e8e2d8] bg-[#fffdf8]/97 p-4 shadow-[0_12px_40px_rgba(60,36,21,0.18)] backdrop-blur-sm sm:left-auto sm:right-3 sm:w-[22rem]"
          : "rounded-3xl border border-[#e8e2d8] bg-[#fffdf8] p-4 shadow-[0_8px_24px_rgba(60,36,21,0.1)]"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#8a8070]">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-0.5 font-[family-name:var(--font-loom-display)] text-lg font-semibold leading-snug text-[#1a1f24]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm leading-snug text-[#5c6570]">{subtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e8e2d8] text-[#5c6570] hover:bg-[#f3efe6]"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      {badges ? (
        <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
      ) : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </aside>
  );
}
