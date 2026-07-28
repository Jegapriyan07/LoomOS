import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import {
  confirmDrawFromReserve,
  confirmSaveToReserve,
  getWalletSnapshot,
  updateWalletSettings,
} from "@/lib/demand/store";

export async function GET() {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }
  const snapshot = await getWalletSnapshot(auth.weaverId);
  return NextResponse.json(snapshot);
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.WEAVER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  if (!auth.weaverId) {
    return NextResponse.json({ error: "No weaver profile" }, { status: 403 });
  }

  const body = await request.json();
  const weaverId = auth.weaverId;

  try {
    if (body.action === "settings") {
      const snapshot = await updateWalletSettings(weaverId, {
        reserveFloor: body.reserveFloor,
        surplusSavePercent: body.surplusSavePercent,
      });
      return NextResponse.json(snapshot);
    }
    if (body.action === "save-to-reserve") {
      const snapshot = await confirmSaveToReserve(
        weaverId,
        Number(body.amount ?? 0),
      );
      return NextResponse.json(snapshot);
    }
    if (body.action === "draw-from-reserve") {
      const snapshot = await confirmDrawFromReserve(
        weaverId,
        Number(body.amount ?? 0),
      );
      return NextResponse.json(snapshot);
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Wallet action failed" },
      { status: 400 },
    );
  }
}
