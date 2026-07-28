/**
 * Stage 12 — honest "What's real vs simulated" for pitch / judges.
 * Keep in sync with STAGE12.md.
 */

const ROWS: { area: string; real: string; simulated: string }[] = [
  {
    area: "Identity & auth",
    real: "PostgreSQL (Prisma) for co-ops/weavers/buyers; phone login + httpOnly session cookie",
    simulated:
      "No SMS — pitch login is phone-only Continue / one-tap demo; seed people remain fictional Demo Mode",
  },
  {
    area: "Demand score & Home advice",
    real: "Formula + Why? panel; Buyer Signal from our requirement store",
    simulated:
      "Festival calendar hardcoded; Trends = manual admin entry (not live Google Trends API)",
  },
  {
    area: "Production plan dates",
    real: "Backward calendar math from target date + editable day counts",
    simulated: "Default weave/yarn days are illustrative; sample festival chips",
  },
  {
    area: "Payments / escrow / trust",
    real: "State machine + transitions; trust score from order/dispute history",
    simulated:
      "No real money; modeled on RBI-authorised PA escrow pattern — Prototype only",
  },
  {
    area: "Wallet & Verified Transaction Record",
    real: "Rules use Settlement Released events only; shareable record framing",
    simulated: "Balances & line items from Demo Mode seed settlements",
  },
  {
    area: "Buyer portal",
    real: "Posts write the same DB that feeds demand scores; phone session auth",
    simulated: "Fictional demo buyers in seed; SMS delivery not wired",
  },
  {
    area: "Voice",
    real: "Browser Web Speech TTS/STT (Chrome)",
    simulated: "Bhashini not integrated — Phase 2 note only",
  },
  {
    area: "ONDC / GeM / NHDC",
    real: "Honest positioning + verified public facts cited correctly",
    simulated: "No LoomOS integration APIs; NHDC = eligibility nudge copy only",
  },
  {
    area: "Coop capacity %",
    real: "Active order counts from Stage 4 pipeline in this app",
    simulated: "Max concurrent capacity = illustrative Demo default of 3",
  },
];

export function RealVsSimulated() {
  return (
    <section
      aria-labelledby="real-vs-sim-heading"
      className="mt-12 rounded-2xl border-2 border-[#1e3a5f] bg-[#fffdf8] p-5"
    >
      <h2
        id="real-vs-sim-heading"
        className="font-[family-name:var(--font-loom-display)] text-xl font-semibold text-[#1a1f24]"
      >
        What&apos;s real vs. simulated
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#5c6570]">
        Stage 12 audit slide — what runs on real logic and data flow in this
        prototype, and what is intentionally mocked so nothing looks more live
        than it is.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#d9d2c4] text-[#5c6570]">
              <th className="py-2 pr-3 font-semibold">Area</th>
              <th className="py-2 pr-3 font-semibold">Real here</th>
              <th className="py-2 font-semibold">Simulated / Demo</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.area}
                className="border-b border-[#d9d2c4]/70 align-top"
              >
                <td className="py-3 pr-3 font-semibold text-[#1a1f24]">
                  {row.area}
                </td>
                <td className="py-3 pr-3 text-[#5c6570]">{row.real}</td>
                <td className="py-3 text-[#5c6570]">{row.simulated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-snug text-[#5c6570]">
        People &amp; orgs in this build (Meena, Selvi, Kamala, Saffron Thread
        Boutique, Nila Loom Circle) are labeled fictional Demo Mode — not real
        persons or cooperatives. Auth uses real PostgreSQL + phone login (no OTP /
        SMS not wired). LoomOS does not claim RBI licensing,
        NHDC/ONDC/Bhashini integration, or a credit score / CIBIL product.
      </p>
    </section>
  );
}
