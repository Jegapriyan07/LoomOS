import { DEMO_MODE_BANNER_TEXT } from "@/lib/demo/cluster";

/** Persistent Demo Mode tag — show wherever seed/demo data appears. */
export function DemoModeBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p
        role="status"
        className="bg-amber-500 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-amber-950"
      >
        Demo Mode
      </p>
    );
  }

  return (
    <div
      role="status"
      className="border-b-2 border-amber-600 bg-amber-400 px-3 py-2 text-center text-sm font-semibold leading-snug text-amber-950"
    >
      {DEMO_MODE_BANNER_TEXT}
    </div>
  );
}
