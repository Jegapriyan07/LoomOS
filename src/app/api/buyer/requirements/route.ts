import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { upsertRequirement, readStore } from "@/lib/demand/store";
import type { DemandCategoryId } from "@/lib/demand/types";

/** List / create requirements for the signed-in buyer. */
export async function GET() {
  const auth = await requireRole(UserRole.BUYER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.buyerId) {
    return NextResponse.json({ error: "No buyer profile" }, { status: 403 });
  }

  const store = await readStore();
  const rows = store.buyerRequirements.filter(
    (r) => r.buyerId === auth.buyerId,
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.BUYER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.buyer) {
    return NextResponse.json({ error: "No buyer profile" }, { status: 403 });
  }

  const body = await request.json();
  if (!body.categoryId || body.quantity == null || !body.neededBy) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const req = await upsertRequirement({
    id: `req-${Date.now()}`,
    buyerId: auth.buyer.id,
    buyerName: auth.buyer.name,
    categoryId: body.categoryId as DemandCategoryId,
    region: String(body.region ?? auth.buyer.region),
    quantity: Number(body.quantity),
    neededBy: String(body.neededBy),
    priceMin: body.priceMin != null ? Number(body.priceMin) : undefined,
    priceMax: body.priceMax != null ? Number(body.priceMax) : undefined,
    status: "open",
    notes: body.notes ? String(body.notes) : undefined,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    requirement: req,
    feedsBuyerSignal: true,
    note: "This open requirement is in the same store Stage 3 uses for Buyer Signal (weight 0.5).",
  });
}
