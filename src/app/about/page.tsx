import Link from "next/link";
import type { Metadata } from "next";
import { HowLoomOsFits } from "@/components/pitch/HowLoomOsFits";
import { RealVsSimulated } from "@/components/pitch/RealVsSimulated";
import { DEMO_CLUSTER } from "@/lib/demo/cluster";

export const metadata: Metadata = {
  title: "How LoomOS Fits · About",
  description:
    "Positioning: LoomOS as a decision-and-trust layer above ONDC-connected marketplaces — not a competing marketplace, and not an ONDC network integration in this prototype.",
};

/**
 * About page — how LoomOS sits in the stack.
 */
export default function AboutPage() {
  return (
    <div className="min-h-full bg-[#f3efe6] text-[#1a1f24]">
      <header className="border-b border-[#d9d2c4] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-loom-display)] text-2xl font-semibold text-[#1e3a5f]"
          >
            LoomOS
          </Link>
          <nav className="flex gap-4 text-sm font-semibold text-[#5c6570]">
            <Link href="/" className="hover:text-[#1e3a5f]">
              Weaver app
            </Link>
            <Link href="/buyer" className="hover:text-[#1e3a5f]">
              Buyer portal
            </Link>
            <Link href="/about" className="text-[#1e3a5f]">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#5c6570]">
          About
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-loom-display)] text-3xl font-semibold tracking-tight text-[#1a1f24]">
          How LoomOS fits
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#5c6570]">
          LoomOS is a daily decision copilot for handloom weavers — what to
          weave, when to start, when money arrives — not another place to list
          products.
        </p>

        <section className="mt-8" aria-labelledby="cluster-heading">
          <h2
            id="cluster-heading"
            className="font-[family-name:var(--font-loom-display)] text-xl font-semibold"
          >
            Cooperative cluster
          </h2>
          <p className="mt-2 text-sm text-[#5c6570]">
            Seed cluster in this build: <strong>{DEMO_CLUSTER.name}</strong> —{" "}
            Delhi NCT around IIT Delhi ({DEMO_CLUSTER.district} ·{" "}
            {DEMO_CLUSTER.region}).
          </p>
        </section>

        <section className="mt-8" aria-labelledby="gov-data-heading">
          <h2
            id="gov-data-heading"
            className="font-[family-name:var(--font-loom-display)] text-xl font-semibold"
          >
            Official Cluster Match
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5c6570]">
            Buyer Cluster Match is grounded in the{" "}
            <a
              href="https://handlooms.nic.in/weavers_database.php"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1e3a5f] underline"
            >
              Development Commissioner (Handlooms) Weavers Database
            </a>{" "}
            — state-wise cooperative and producer-company coverage published for
            National Handloom Day. This build uses a curated seed from those
            public lists (not a live government API). Weavers whose registered
            cluster appears in the seed see a calm listing signal on Profile —
            not a personal identity verification badge.
          </p>
        </section>

        <HowLoomOsFits />

        <RealVsSimulated />
      </main>
    </div>
  );
}
