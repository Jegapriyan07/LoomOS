import Link from "next/link";
import type { Metadata } from "next";
import { HowLoomOsFits } from "@/components/pitch/HowLoomOsFits";
import { RealVsSimulated } from "@/components/pitch/RealVsSimulated";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { BootstrapPlanNote } from "@/components/demo/BootstrapPlanNote";
import { DEMO_CLUSTER } from "@/lib/demo/cluster";

export const metadata: Metadata = {
  title: "How LoomOS Fits · About",
  description:
    "Positioning: LoomOS as a decision-and-trust layer above ONDC-connected marketplaces — not a competing marketplace, and not an ONDC network integration in this prototype.",
};

/**
 * Pitch-facing About page (Stage 7 + Stage 10 bootstrap + Stage 12 audit).
 */
export default function AboutPage() {
  return (
    <div className="min-h-full bg-[#f3efe6] text-[#1a1f24]">
      <DemoModeBanner />
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
          About · pitch narrative
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-loom-display)] text-3xl font-semibold tracking-tight text-[#1a1f24]">
          How LoomOS fits
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#5c6570]">
          LoomOS is a daily decision copilot for handloom weavers — what to
          weave, when to start, when money arrives — not another place to list
          products.
        </p>

        <section className="mt-8" aria-labelledby="bootstrap-heading">
          <h2
            id="bootstrap-heading"
            className="font-[family-name:var(--font-loom-display)] text-xl font-semibold"
          >
            Day-one bootstrap
          </h2>
          <p className="mt-2 text-sm text-[#5c6570]">
            Seed cluster in this build: <strong>{DEMO_CLUSTER.name}</strong> —{" "}
            {DEMO_CLUSTER.flavor}
          </p>
          <div className="mt-4">
            <BootstrapPlanNote />
          </div>
        </section>

        <HowLoomOsFits />
        <RealVsSimulated />
      </main>
    </div>
  );
}
