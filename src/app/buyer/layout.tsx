import Link from "next/link";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";

/**
 * Buyer portal chrome — B2B / pitch-facing, denser than weaver UI.
 */
export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-100 text-slate-900">
      <DemoModeBanner />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <Link href="/buyer" className="text-lg font-semibold text-slate-900">
              LoomOS Buyer Portal
            </Link>
            <p className="text-xs text-slate-500">
              Boutique / exporter tools · mocked auth (hackathon) · Demo Mode
              seed cluster
            </p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-medium">
            <Link href="/buyer/portal" className="text-slate-700 underline">
              Portal
            </Link>
            <Link href="/about" className="text-slate-500 underline">
              About
            </Link>
            <Link href="/" className="text-slate-500 underline">
              Weaver app
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
