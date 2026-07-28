import { NextResponse } from "next/server";
import { readStore, replaceLedgerOrders } from "@/lib/demand/store";
import type { DemandCategoryId, LedgerOrder } from "@/lib/demand/types";
import { DEMAND_CATEGORIES } from "@/lib/demand/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.ledgerOrders);
}

/**
 * Expects CSV text:
 * order_date,category,region,quantity
 * 2025-11-01,cotton-saree,Tamil Nadu,12
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let csvText = "";
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    csvText = await request.text();
  } else {
    const body = (await request.json()) as { csv?: string };
    csvText = body.csv ?? "";
  }

  if (!csvText.trim()) {
    return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  }

  const validIds = new Set(DEMAND_CATEGORIES.map((c) => c.id));
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const start = lines[0]?.toLowerCase().includes("order_date") ? 1 : 0;
  const orders: LedgerOrder[] = [];

  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim());
    if (parts.length < 4) continue;
    const [orderDate, category, region, qtyStr] = parts;
    if (!validIds.has(category as DemandCategoryId)) {
      return NextResponse.json(
        {
          error: `Unknown category "${category}". Use: ${[...validIds].join(", ")}`,
        },
        { status: 400 },
      );
    }
    const quantity = Number(qtyStr);
    if (!orderDate || !region || !Number.isFinite(quantity)) {
      return NextResponse.json(
        { error: `Bad row ${i + 1}: ${lines[i]}` },
        { status: 400 },
      );
    }
    orders.push({
      id: `ledger-${i}-${orderDate}`,
      orderDate,
      categoryId: category as DemandCategoryId,
      region,
      quantity,
    });
  }

  const count = await replaceLedgerOrders(orders);
  return NextResponse.json({ imported: count, orders });
}
