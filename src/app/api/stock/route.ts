import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { getWeaverStock, upsertWeaverStock } from "@/lib/demand/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }
  const stock = await getWeaverStock(auth.weaverId);
  return NextResponse.json({
    stock,
    simulated: true,
    note: "Demo stock & resources — not a live warehouse feed",
  });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const num = (key: string) =>
    body[key] !== undefined ? Number(body[key]) : undefined;

  const stock = await upsertWeaverStock({
    weaverId: auth.weaverId,
    yarnCottonKg: num("yarnCottonKg"),
    yarnSilkKg: num("yarnSilkKg"),
    finishedCottonSaree: num("finishedCottonSaree"),
    finishedSilkSaree: num("finishedSilkSaree"),
    finishedStole: num("finishedStole"),
    finishedDhoti: num("finishedDhoti"),
  });
  return NextResponse.json({ stock, simulated: true });
}
