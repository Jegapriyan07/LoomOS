import { BOOTSTRAP_PLAN_NOTE, DEMO_CLUSTER } from "@/lib/demo/cluster";

/** Short in-app note: real bootstrap plan vs fictional seed. */
export function BootstrapPlanNote() {
  return (
    <aside
      role="note"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-snug text-slate-700"
    >
      <p className="font-semibold text-slate-900">
        What weaver #1 sees with no history
      </p>
      <p className="mt-2">{BOOTSTRAP_PLAN_NOTE}</p>
      <p className="mt-2 text-xs text-slate-500">
        Seed cluster in this build: {DEMO_CLUSTER.name}. {DEMO_CLUSTER.flavor}
      </p>
    </aside>
  );
}
