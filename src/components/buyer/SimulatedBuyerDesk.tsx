import { DEMO_BUYERS } from "@/lib/demo/cluster";

/**
 * Visible simulated buyer desks for the Buyer Portal pitch.
 */
export function SimulatedBuyerDesk({ highlightPhone }: { highlightPhone?: string }) {
  return (
    <section
      aria-labelledby="sim-buyers-heading"
      className="rounded-2xl border-2 border-amber-500/60 bg-amber-50 px-4 py-4"
    >
      <h2
        id="sim-buyers-heading"
        className="font-[family-name:var(--font-loom-display)] text-xl font-semibold text-amber-950"
      >
        Simulated buyer data
      </h2>
      <p className="mt-1 text-sm leading-snug text-amber-900/90">
        Three fictional buyer desks ship with the demo. Login with their phone +
        Dev OTP, or Register a new number. Posts feed the same store weavers see
        on Home / Plan / Orders.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {DEMO_BUYERS.map((b) => {
          const on = highlightPhone === b.phone;
          return (
            <li
              key={b.id}
              className={`rounded-xl border bg-white px-3 py-3 ${
                on ? "border-amber-600 ring-2 ring-amber-300" : "border-amber-200"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{b.shortName}</p>
              <p className="mt-1 text-xs text-slate-600">{b.businessType}</p>
              <p className="mt-2 text-xs text-slate-700">
                <span className="font-semibold">Phone:</span>{" "}
                <code className="rounded bg-slate-100 px-1">{b.phone}</code>
              </p>
              <p className="mt-1 text-xs text-slate-600">{b.focus}</p>
              <p className="mt-1 text-xs text-slate-500">{b.typicalOrder}</p>
              <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-800">
                Simulated · {b.city}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
