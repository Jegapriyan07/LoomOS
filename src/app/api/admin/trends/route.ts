import { NextResponse } from "next/server";
import { readStore, setManualTrend } from "@/lib/demand/store";
import type { DemandCategoryId, ManualTrendEntry } from "@/lib/demand/types";

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store.manualTrends);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ManualTrendEntry>;
  if (
    !body.categoryId ||
    !body.region ||
    body.interestScore == null ||
    !body.lastRefreshedAt
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const entry: ManualTrendEntry = {
    categoryId: body.categoryId as DemandCategoryId,
    region: body.region,
    interestScore: Math.min(100, Math.max(0, Number(body.interestScore))),
    lastRefreshedAt: body.lastRefreshedAt,
    refreshedBy: body.refreshedBy ?? "team",
  };
  await setManualTrend(entry);
  return NextResponse.json(entry);
}
