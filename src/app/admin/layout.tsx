import Link from "next/link";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <DemoModeBanner />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-semibold text-slate-900">
            LoomOS Admin
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin/requirements" className="text-slate-600 underline">
              Requirements
            </Link>
            <Link href="/admin/trends" className="text-slate-600 underline">
              Trends
            </Link>
            <Link href="/admin/ledger" className="text-slate-600 underline">
              Ledger
            </Link>
            <Link href="/admin/payments" className="text-slate-600 underline">
              Payments
            </Link>
            <Link href="/coop" className="text-slate-600 underline">
              Cluster
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
