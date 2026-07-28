import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { getSessionUser } from "@/lib/auth/current-user";
import {
  createPaymentOrder,
  listBuyers,
  listDisputes,
  listPaymentOrders,
  resetWalkOrder,
} from "@/lib/demand/store";
import { computeBuyerTrustScore } from "@/lib/payments/trust";
import type { DemandCategoryId } from "@/lib/demand/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getSessionUser();

  let weaverId = searchParams.get("weaverId") ?? undefined;
  let buyerId = searchParams.get("buyerId") ?? undefined;

  // Prefer session identity over client-supplied ids
  if (session?.role === UserRole.WEAVER && session.weaverId) {
    weaverId = session.weaverId;
    buyerId = undefined;
  } else if (session?.role === UserRole.BUYER && session.buyerId) {
    buyerId = session.buyerId;
    // admin-style list without session still works for /admin/payments
  }

  const orders = await listPaymentOrders({ weaverId, buyerId });
  const allOrders = await listPaymentOrders();
  const buyers = await listBuyers();
  const disputes = await listDisputes();

  const enriched = orders.map((order) => {
    const buyer = buyers.find((b) => b.id === order.buyerId) ?? null;
    const trust = computeBuyerTrustScore(order.buyerId, allOrders, disputes);
    const dispute = disputes.find((d) => d.orderId === order.id) ?? null;
    return { order, buyer, trust, dispute };
  });

  return NextResponse.json({
    orders: enriched,
    prototype: true,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.action === "reset-walk") {
    const order = await resetWalkOrder();
    return NextResponse.json(order);
  }

  const session = await getSessionUser();
  const weaverId =
    session?.role === UserRole.WEAVER && session.weaverId
      ? session.weaverId
      : (body.weaverId as string | undefined);

  if (!weaverId) {
    return NextResponse.json(
      { error: "weaverId required (sign in as weaver or pass weaverId for admin)" },
      { status: 400 },
    );
  }

  const order = await createPaymentOrder({
    id: body.id ?? `ord-${Date.now()}`,
    weaverId,
    buyerId: body.buyerId ?? "buyer-demo-001",
    category: (body.category ?? "cotton-saree") as DemandCategoryId,
    amount: Number(body.amount ?? 15000),
    advanceAmount: Number(body.advanceAmount ?? 4500),
  });
  return NextResponse.json(order);
}
