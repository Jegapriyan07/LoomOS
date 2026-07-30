import { NextResponse } from "next/server";
import { readStore, upsertRequirement, deleteRequirement } from "@/lib/demand/store";
import type { BuyerRequirement, DemandCategoryId } from "@/lib/demand/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.buyerRequirements);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<BuyerRequirement>;
  if (!body.categoryId || !body.region || body.quantity == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const req: BuyerRequirement = {
    id: body.id ?? `req-${Date.now()}`,
    buyerId: body.buyerId,
    buyerName: body.buyerName ?? "Buyer",
    categoryId: body.categoryId as DemandCategoryId,
    region: body.region,
    district: body.district,
    quantity: Number(body.quantity),
    neededBy: body.neededBy ?? new Date().toISOString().slice(0, 10),
    priceMin:
      body.priceMin !== undefined && body.priceMin !== null
        ? Number(body.priceMin)
        : undefined,
    priceMax:
      body.priceMax !== undefined && body.priceMax !== null
        ? Number(body.priceMax)
        : undefined,
    status: body.status ?? "open",
    notes: body.notes,
    createdAt: body.createdAt ?? new Date().toISOString(),
  };
  await upsertRequirement(req);
  return NextResponse.json(req);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteRequirement(id);
  return NextResponse.json({ ok: true });
}
