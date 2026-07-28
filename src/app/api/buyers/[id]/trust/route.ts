import { NextResponse } from "next/server";
import { listDisputes, listPaymentOrders } from "@/lib/demand/store";
import { computeBuyerTrustScore } from "@/lib/payments/trust";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const orders = await listPaymentOrders();
  const disputes = await listDisputes();
  const trust = computeBuyerTrustScore(id, orders, disputes);
  return NextResponse.json(trust);
}
