import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getSessionUser, requireRole } from "@/lib/auth/current-user";
import { getWeaverById } from "@/lib/auth/identity";
import { listPaymentOrders } from "@/lib/demand/store";
import {
  buildVerifiedTransactionRecord,
  shareIdForWeaver,
} from "@/lib/verified-record/build";

/**
 * Authenticated weaver: own record.
 * Public share: ?shareId=vtr-... (read-only, Demo Mode labeled in record).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("shareId");

  if (shareId) {
    const weavers = await import("@/lib/auth/identity").then((m) =>
      m.listWeaversFromDb(),
    );
    const weaver = weavers.find((w) => shareIdForWeaver(w.id) === shareId);
    if (!weaver) {
      return NextResponse.json({ error: "Unknown record" }, { status: 404 });
    }
    const orders = await listPaymentOrders();
    const record = buildVerifiedTransactionRecord({
      weaverId: weaver.id,
      weaverName: weaver.name,
      region: weaver.region,
      orders,
    });
    return NextResponse.json(record);
  }

  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    // Allow session weaver lookup fallback for admin tooling? No — require auth.
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId || !auth.weaver) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }

  const weaver = (await getWeaverById(auth.weaverId)) ?? auth.weaver;
  const orders = await listPaymentOrders();
  const record = buildVerifiedTransactionRecord({
    weaverId: weaver.id,
    weaverName: weaver.name,
    region: weaver.region,
    orders,
  });

  return NextResponse.json(record);
}
