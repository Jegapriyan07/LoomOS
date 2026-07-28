import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getWeaverById } from "@/lib/auth/identity";
import { listPaymentOrders } from "@/lib/demand/store";
import { adminStateLabel, weaverStateLabel } from "@/lib/payments/states";

export async function GET() {
  const auth = await requireRole(UserRole.BUYER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.buyerId) {
    return NextResponse.json({ error: "No buyer profile" }, { status: 403 });
  }

  const orders = await listPaymentOrders({ buyerId: auth.buyerId });
  const enriched = await Promise.all(
    orders.map(async (o) => {
      const weaver = await getWeaverById(o.weaverId);
      return {
        ...o,
        stateLabel: adminStateLabel(o.state),
        weaverLabel: weaverStateLabel(o.state),
        weaverName: weaver?.name ?? o.weaverId,
      };
    }),
  );

  return NextResponse.json({ orders: enriched });
}
