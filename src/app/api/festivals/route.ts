import { NextResponse } from "next/server";
import {
  festivalCalendarDistricts,
  festivalCalendarStates,
  festivalMatchTier,
  getPlanFestivalChips,
  listFestivalsForPlace,
} from "@/lib/demand/public-festivals";

export const dynamic = "force-dynamic";

/**
 * Curated handloom festival calendar (hardcoded seed — not a live feed).
 * GET ?region=&district=&categoryId=&upcomingOnly=1&chips=1
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? undefined;
  const district = searchParams.get("district") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const upcomingOnly = searchParams.get("upcomingOnly") === "1";
  const chips = searchParams.get("chips") === "1";
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : undefined;

  if (chips) {
    return NextResponse.json({
      demo: true,
      label: "Curated public calendar — not a live festival API",
      chips: getPlanFestivalChips({
        region,
        district,
        categoryId,
        limit: limit ?? 5,
      }),
      states: festivalCalendarStates(),
    });
  }

  const events = listFestivalsForPlace({
    region,
    district,
    categoryId,
    upcomingOnly,
    limit,
  }).map((e) => ({
    ...e,
    matchTier: region
      ? festivalMatchTier(e, region, district)
      : ("national" as const),
  }));

  return NextResponse.json({
    demo: true,
    label: "Curated public calendar — not a live festival API",
    events,
    states: festivalCalendarStates(),
    districts: region ? festivalCalendarDistricts(region) : [],
  });
}
