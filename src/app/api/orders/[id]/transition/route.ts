import { NextResponse } from "next/server";
import {
  advanceDispute,
  openDispute,
  transitionPaymentOrder,
} from "@/lib/demand/store";
import type { OrderState } from "@/lib/payments/types";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  try {
    if (body.action === "open-dispute") {
      const result = await openDispute(id, body.reason ?? "Demo dispute");
      return NextResponse.json(result);
    }
    if (body.action === "advance-dispute") {
      const to = body.to as "under_review" | "resolved";
      const result = await advanceDispute(id, to);
      return NextResponse.json(result);
    }
    if (body.to) {
      const order = await transitionPaymentOrder(id, body.to as OrderState);
      return NextResponse.json({ order });
    }
    return NextResponse.json({ error: "Missing action or to" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Transition failed" },
      { status: 400 },
    );
  }
}
