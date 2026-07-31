import Link from "next/link";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { ClusterDashboard } from "@/components/coop/ClusterDashboard";

export const metadata = {
  title: "Cooperative dashboard · LoomOS",
  description:
    "Kanchipuram cluster — order distribution, capacity, demand scores.",
};

export default function CoopPage() {
  return (
    <div className="min-h-full bg-slate-100 text-slate-900">
      <DemoModeBanner />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">Cooperative dashboard</h1>
            <p className="text-xs text-slate-500">
              Cluster staff view · data-dense by design
            </p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin" className="underline text-slate-600">
              Admin
            </Link>
            <Link href="/buyer" className="underline text-slate-600">
              Buyer portal
            </Link>
            <Link href="/" className="underline text-slate-600">
              Weaver app
            </Link>
          </nav>
        </div>
      </header>
      <ClusterDashboard />
    </div>
  );
}
