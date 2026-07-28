import { NextResponse } from "next/server";
import { getClusterDashboard } from "@/lib/demand/store";

export async function GET() {
  const dashboard = await getClusterDashboard();
  return NextResponse.json(dashboard);
}
