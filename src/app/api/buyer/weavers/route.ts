import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/current-user";
import { listVerifiedWeaverDirectory } from "@/lib/demand/store";

export async function GET() {
  const auth = await requireRole(UserRole.BUYER);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const weavers = await listVerifiedWeaverDirectory();
  return NextResponse.json({
    weavers,
    verificationRule:
      "Verified = at least one Settlement Released order (Stage 4). Not a decorative badge.",
  });
}
