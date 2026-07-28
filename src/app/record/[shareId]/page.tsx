import type { Metadata } from "next";
import { DemoModeBanner } from "@/components/demo/DemoModeBanner";
import { VerifiedRecordView } from "@/components/verified/VerifiedRecordView";
import { listWeaversFromDb } from "@/lib/auth/identity";
import { listPaymentOrders } from "@/lib/demand/store";
import {
  buildVerifiedTransactionRecord,
  shareIdForWeaver,
} from "@/lib/verified-record/build";

type Props = { params: Promise<{ shareId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  return {
    title: "Verified Transaction Record · LoomOS",
    description:
      "A verified history of completed, on-time orders — a factual record, not a financial product.",
    robots: shareId ? "noindex" : "noindex",
  };
}

export default async function VerifiedRecordPage({ params }: Props) {
  const { shareId } = await params;
  const weavers = await listWeaversFromDb();
  const weaver = weavers.find((w) => shareIdForWeaver(w.id) === shareId);

  if (!weaver) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Record not found</h1>
        <p className="mt-2 text-slate-600">
          This share link does not match a Verified Transaction Record.
        </p>
      </main>
    );
  }

  const orders = await listPaymentOrders();
  const record = buildVerifiedTransactionRecord({
    weaverId: weaver.id,
    weaverName: weaver.name,
    region: weaver.region,
    orders,
  });

  return (
    <>
      <DemoModeBanner />
      <VerifiedRecordView record={record} shareable />
    </>
  );
}
