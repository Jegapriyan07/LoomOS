import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: user.userId,
        phone: user.phone,
        name: user.name,
        role: user.role,
        weaverId: user.weaverId,
        buyerId: user.buyerId,
        weaver: user.weaver,
        buyer: user.buyer,
      },
    });
  } catch (e) {
    console.error("[auth/me]", e);
    return NextResponse.json(
      { authenticated: false, error: "Auth check failed" },
      { status: 401 },
    );
  }
}
