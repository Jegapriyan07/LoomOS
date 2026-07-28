/**
 * Stage 7 — ONDC / GeM positioning (narrative only).
 * Indiahandmade ↔ ONDC is a verified public fact (RULESBOOK).
 * LoomOS itself is NOT ONDC-integrated or GeM-integrated in this codebase.
 */

export function HowLoomOsFits() {
  return (
    <section aria-labelledby="fits-heading" className="mt-10">
      <h2 id="fits-heading" className="sr-only">
        How LoomOS Fits
      </h2>

      {/* Explicit positioning vs integration */}
      <aside
        role="note"
        className="rounded-xl border-2 border-[#c4920a] bg-[#f5e6b8] px-4 py-3 text-sm leading-snug text-[#1a1f24]"
      >
        <p className="font-semibold">Positioning — not a live integration</p>
        <p className="mt-1 text-[#5c6570]">
          This section explains where LoomOS would sit in the stack. It does{" "}
          <strong className="text-[#1a1f24]">not</strong> mean LoomOS is
          connected to the ONDC network or to GeM in this prototype. No ONDC or
          GeM API calls exist in this codebase.
        </p>
      </aside>

      {/* Pitch-ready sentence */}
      <blockquote className="mt-8 border-l-4 border-[#1e3a5f] bg-[#fffdf8] px-5 py-4 font-[family-name:var(--font-loom-display)] text-xl font-semibold leading-snug text-[#1e3a5f]">
        LoomOS isn&apos;t a competing marketplace — it&apos;s the
        decision-and-trust layer that could sit on top of ONDC-connected
        platforms like Indiahandmade.
      </blockquote>

      {/* Layered diagram */}
      <div className="mt-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#5c6570]">
          Stack diagram (conceptual)
        </p>
        <LayerDiagram />
      </div>

      {/* Informed ONDC / GeM copy */}
      <div className="mt-10 space-y-4 text-base leading-relaxed text-[#1a1f24]">
        <h3 className="font-[family-name:var(--font-loom-display)] text-xl font-semibold">
          Why this is informed, not name-dropping
        </h3>
        <p>
          <strong>ONDC</strong> (Open Network for Digital Commerce) is shared
          open e-commerce infrastructure: sellers can reach buyers across
          connected apps without onboarding separately to every storefront.
        </p>
        <p>
          <strong>Indiahandmade</strong> — the Ministry of Textiles&apos;
          artisan e-commerce platform — is genuinely integrated with ONDC, so
          handloom sellers on that pathway plug into the network rather than
          building a private marketplace island. Source: indiahandmade.com
          (Verified Facts).
        </p>
        <p>
          <strong>GeM</strong> (Government e-Marketplace) is existing public
          procurement infrastructure for institutional buying. LoomOS does not
          claim GeM integration here. The positioning point is the same: LoomOS
          would help weavers decide and prove settlement trust{" "}
          <em>before</em> goods move through whatever channel already exists —
          ONDC-connected retail (e.g. Indiahandmade) or, later, institutional
          routes — instead of inventing a competing checkout.
        </p>
        <p className="rounded-lg border border-[#d9d2c4] bg-[#fffdf8] px-4 py-3 text-[#5c6570]">
          <strong className="text-[#1a1f24]">In this prototype:</strong> LoomOS
          builds the decision, plan, payment-simulation, and verified
          transaction-record layers. Marketplace reach stays with networks and
          platforms that already exist. Wiring an actual ONDC network
          participant role is out of scope for this build.
        </p>
      </div>

      <p className="mt-8 text-sm text-[#5c6570]">
        <a href="/" className="font-semibold text-[#1e3a5f] underline">
          ← Back to the weaver app
        </a>
      </p>
    </section>
  );
}

function LayerDiagram() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[#d9d2c4] bg-[#fffdf8]">
      <figcaption className="sr-only">
        Three layers: LoomOS decision and trust on top, ONDC-connected
        marketplaces such as Indiahandmade in the middle, buyers at the bottom.
        Conceptual positioning only.
      </figcaption>

      <div className="space-y-0 p-4 sm:p-6">
        {/* Layer 1 — LoomOS */}
        <div className="relative rounded-xl border-2 border-[#1e3a5f] bg-[#d9e3f0] px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1e3a5f]">
            Layer 1 · LoomOS
          </p>
          <p className="mt-1 text-lg font-semibold text-[#1e3a5f]">
            Decision + trust layer
          </p>
          <p className="mt-1 text-sm text-[#5c6570]">
            What to weave · when to start · money timing · verified settlement
            record
          </p>
          <p className="mt-2 text-xs font-semibold text-[#9a5b12]">
            Positioning in this deck — not an ONDC/GeM network hookup
          </p>
        </div>

        <ArrowDown label="informs weavers who then sell through →" />

        {/* Layer 2 — ONDC marketplaces */}
        <div className="relative rounded-xl border-2 border-[#2f6b4f] bg-[#d8ebe0] px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2f6b4f]">
            Layer 2 · Existing commerce rails
          </p>
          <p className="mt-1 text-lg font-semibold text-[#2f6b4f]">
            ONDC-connected marketplaces
          </p>
          <p className="mt-1 text-sm text-[#5c6570]">
            Example: <strong>Indiahandmade</strong> (Ministry of Textiles) —{" "}
            <em>actually</em> ONDC-integrated today. LoomOS is not claiming that
            integration for itself.
          </p>
          <p className="mt-2 text-sm text-[#5c6570]">
            Nearby public infrastructure (context only): <strong>GeM</strong>{" "}
            for institutional procurement — cited as an existing channel type,
            not as a LoomOS integration.
          </p>
        </div>

        <ArrowDown label="reaches →" />

        {/* Layer 3 — Buyers */}
        <div className="relative rounded-xl border-2 border-[#5c6570] bg-[#f3efe6] px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6570]">
            Layer 3 · Demand
          </p>
          <p className="mt-1 text-lg font-semibold text-[#1a1f24]">Buyers</p>
          <p className="mt-1 text-sm text-[#5c6570]">
            Household and institutional purchasers reached via networks and
            marketplaces that already exist — not via a LoomOS storefront.
          </p>
        </div>
      </div>

      <p className="border-t border-[#d9d2c4] px-4 py-3 text-xs text-[#5c6570] sm:px-6">
        Diagram = architecture story for judges. Integration status = only what
        is true today (Indiahandmade on ONDC; LoomOS not on ONDC/GeM in this
        repo).
      </p>
    </figure>
  );
}

function ArrowDown({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-[#5c6570]" aria-hidden>
      <span className="text-xs">{label}</span>
      <svg width="24" height="28" viewBox="0 0 24 28" className="mt-0.5">
        <path
          d="M12 2 v18 M12 20 l-5 -5 M12 20 l5 -5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
