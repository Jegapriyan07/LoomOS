"use client";

import type { VerifiedTransactionRecord } from "@/lib/verified-record/build";
import { formatDisplayDate } from "@/lib/production-defaults";

function rupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

type Props = {
  record: VerifiedTransactionRecord;
  shareable?: boolean;
};

/**
 * Read-only Verified Transaction Record.
 * Print this page (Save as PDF) for a shareable bank/NBFC summary.
 */
export function VerifiedRecordView({ record, shareable }: Props) {
  const m = record.metrics;

  return (
    <main className="mx-auto min-h-full max-w-lg bg-[#f3efe6] px-4 py-8 text-[#1a1f24] print:max-w-none print:bg-white print:px-8">
      <header className="border-b border-[#d9d2c4] pb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#5c6570]">
          LoomOS
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-loom-display)] text-2xl font-semibold tracking-tight">
          Verified Transaction Record
        </h1>
        <p className="mt-1 text-base text-[#5c6570]">
          {record.weaverName} · {record.region}
        </p>
        <p className="mt-1 text-sm text-[#5c6570]">
          Generated {formatDisplayDate(record.generatedAt.slice(0, 10))}
          {shareable ? ` · Share id ${record.shareId}` : null}
        </p>
      </header>

      <aside
        role="note"
        className="mt-4 rounded-xl border-2 border-[#c4920a] bg-[#f5e6b8] px-3 py-3 text-sm leading-snug"
      >
        <p className="font-semibold">What this is</p>
        <p className="mt-1">{record.framing}</p>
      </aside>

      <p className="mt-3 text-sm leading-snug text-[#5c6570]">{record.dataNote}</p>
      <p className="mt-2 text-sm leading-snug text-[#5c6570]">{record.phase2Note}</p>

      <section className="mt-6 space-y-4">
        <Metric
          label="Total verified completed orders"
          value={String(m.totalVerifiedCompletedOrders)}
          hint="Count of Settlement Released events only."
        />
        <Metric
          label="Verified income (trailing 12 months)"
          value={rupees(m.verifiedIncomeTrailing12Months)}
          hint={m.incomeHistoryNote}
        />
        <Metric
          label="On-time settlement rate"
          value={`${m.onTimeSettlementRate}%`}
          hint={m.onTimeDetail}
        />
        <Metric
          label="Tenure on the platform"
          value={`${m.tenureDays} day${m.tenureDays === 1 ? "" : "s"}`}
          hint={m.tenureNote}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Settlement line items</h2>
        <p className="mt-1 text-sm text-[#5c6570]">
          Every amount below is a Settlement Released order from LoomOS payment
          data.
        </p>
        {record.settlements.length === 0 ? (
          <p className="mt-3 text-base text-[#5c6570]">No settlements yet.</p>
        ) : (
          <table className="mt-3 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#d9d2c4]">
                <th className="py-2 pr-2 font-semibold">Date</th>
                <th className="py-2 pr-2 font-semibold">Amount</th>
                <th className="py-2 font-semibold">On time</th>
              </tr>
            </thead>
            <tbody>
              {record.settlements.map((s) => (
                <tr key={s.orderId} className="border-b border-[#d9d2c4]/60">
                  <td className="py-2 pr-2">
                    {formatDisplayDate(s.settledAt.slice(0, 10))}
                  </td>
                  <td className="py-2 pr-2">{rupees(s.amount)}</td>
                  <td className="py-2">{s.onTime ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {shareable ? (
        <div className="mt-8 flex flex-col gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-12 items-center justify-center rounded-xl bg-[#1e3a5f] text-base font-semibold text-white"
          >
            Print / save as PDF
          </button>
          <p className="text-center text-sm text-[#5c6570]">
            Use your browser&apos;s print dialog → Save as PDF for a file you can
            share.
          </p>
        </div>
      ) : null}

      <footer className="mt-10 border-t border-[#d9d2c4] pt-4 text-xs text-[#5c6570]">
        LoomOS Verified Transaction Record — factual settlement history only.
        Not a financial product.
      </footer>
    </main>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3">
      <p className="text-sm text-[#5c6570]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-sm leading-snug text-[#5c6570]">{hint}</p>
    </div>
  );
}
