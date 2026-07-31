import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LoomOS Admin",
  description: "Team tools for demand inputs — not weaver-facing.",
};

const LINKS = [
  {
    href: "/admin/requirements",
    title: "Buyer requirements",
    body: "Open requirements that feed the Buyer Signal (0.5 weight). Stage 9 portal will post here too.",
  },
  {
    href: "/admin/trends",
    title: "Manual regional interest",
    body: "Hand-enter 0–100 from the public Google Trends website. Never labeled as a live feed.",
  },
  {
    href: "/admin/ledger",
    title: "Cooperative ledger CSV",
    body: "Upload past orders to seed the Historical Signal honestly (Stage 10 bootstrap).",
  },
  {
    href: "/admin/payments",
    title: "Payments state machine",
    body: "Walk escrow payment states for orders.",
  },
  {
    href: "/coop",
    title: "Cooperative / cluster dashboard",
    body: "Order distribution, illustrative capacity, Stage 3 demand scores for the Kanchipuram cluster.",
  },
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Team only
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">LoomOS admin</h1>
      <p className="mt-2 text-base text-slate-600">
        Demand-intelligence inputs. Changes here move the weaver Home demand
        score. This is not the weaver app.
      </p>
      <ul className="mt-6 space-y-3">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400"
            >
              <span className="text-lg font-semibold text-slate-900">
                {link.title}
              </span>
              <p className="mt-1 text-sm text-slate-600">{link.body}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-slate-500">
        <Link href="/" className="underline">
          ← Back to weaver app
        </Link>
      </p>
    </div>
  );
}
