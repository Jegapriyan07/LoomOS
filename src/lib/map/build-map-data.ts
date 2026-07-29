import {
  INDIA_STATES,
  STATE_DISTRICTS,
  normalizeState,
  normalizeDistrict,
} from "@/lib/auth/regions";
import { DEMO_CLUSTER } from "@/lib/demo/cluster";
import { defaultStockFor, type WeaverStock } from "@/lib/demand/stock";
import type { BuyerRequirement } from "@/lib/demand/types";
import type { PaymentOrder } from "@/lib/payments/types";
import {
  DISTRICT_GEO,
  STATE_GEO,
  jitterAround,
  resolveHub,
  type HubCoord,
} from "@/lib/map/hub-geo";
import {
  DEMO_WEAVER_DISTRICTS,
  NATIONAL_MAP_DEMO_WEAVERS,
} from "@/lib/map/national-demo-weavers";

export type WeaveMenuItem = {
  key: string;
  label: string;
  count: number;
  unit: string;
};

export type MapWeaverPin = {
  id: string;
  name: string;
  region: string;
  district: string;
  lat: number;
  lng: number;
  categories: string[];
  cooperativeName: string;
  verified: boolean;
  completedSettlements: number;
  /** 0–5 stars derived from settlements + verified (not a live review DB). */
  rating: number;
  ratingLabel: string;
  menu: WeaveMenuItem[];
  yarnNote: string;
  demoDisclaimer: string;
  source: "db" | "map-demo";
};

export type DistrictCluster = {
  key: string;
  region: string;
  district: string;
  lat: number;
  lng: number;
  weaverCount: number;
  avgRating: number;
  verifiedCount: number;
};

export type StateCluster = {
  region: string;
  lat: number;
  lng: number;
  weaverCount: number;
  districtCount: number;
  avgRating: number;
  intensity: number;
};

export type OrderHeatPoint = {
  key: string;
  region: string;
  district?: string;
  lat: number;
  lng: number;
  /** Leaflet.heat intensity weight */
  weight: number;
  orderCount: number;
  pieceDemand: number;
  amountInr: number;
  label: string;
};

function parseDistrictFromCategories(categories: string[]): string | null {
  for (const c of categories) {
    if (c.toLowerCase().startsWith("district:")) {
      return c.slice("district:".length).trim() || null;
    }
  }
  return null;
}

export function cleanCategories(categories: string[]): string[] {
  return categories.filter(
    (c) =>
      !c.toLowerCase().startsWith("district:") &&
      !c.toLowerCase().startsWith("years:"),
  );
}

export function resolveWeaverPlace(
  weaverId: string,
  regionRaw: string,
  categories: string[],
): { region: string; district: string } {
  const region = normalizeState(regionRaw || "Tamil Nadu");
  const fromTag = parseDistrictFromCategories(categories);
  if (fromTag) {
    return { region, district: normalizeDistrict(region, fromTag) };
  }
  const demo = DEMO_WEAVER_DISTRICTS[weaverId];
  if (demo) {
    return {
      region: normalizeState(demo.region),
      district: normalizeDistrict(demo.region, demo.district),
    };
  }
  const list = STATE_DISTRICTS[region] ?? [];
  return { region, district: list[0] ?? region };
}

export function ratingFromSettlements(
  completedSettlements: number,
  verified: boolean,
): { rating: number; ratingLabel: string } {
  if (completedSettlements <= 0 && !verified) {
    return { rating: 0, ratingLabel: "Not rated yet" };
  }
  const raw = 3.2 + Math.min(completedSettlements, 6) * 0.3;
  const rating = Math.min(5, Math.round(raw * 10) / 10);
  return {
    rating,
    ratingLabel: verified
      ? `Verified · ${rating.toFixed(1)} / 5`
      : `${rating.toFixed(1)} / 5`,
  };
}

export function stockToMenu(stock: WeaverStock): WeaveMenuItem[] {
  return [
    {
      key: "cotton-saree",
      label: "Cotton saree (ready)",
      count: stock.finishedCottonSaree,
      unit: "pcs",
    },
    {
      key: "silk-saree",
      label: "Silk saree (ready)",
      count: stock.finishedSilkSaree,
      unit: "pcs",
    },
    {
      key: "stole-dupatta",
      label: "Stole / dupatta (ready)",
      count: stock.finishedStole,
      unit: "pcs",
    },
    {
      key: "dhoti-angavastram",
      label: "Dhoti / angavastram (ready)",
      count: stock.finishedDhoti,
      unit: "pcs",
    },
  ];
}

function yarnNoteFromStock(stock: WeaverStock): string {
  return `Yarn on hand — cotton ${stock.yarnCottonKg} kg · silk ${stock.yarnSilkKg} kg`;
}

function pinCoords(
  id: string,
  region: string,
  district: string,
): HubCoord {
  return jitterAround(resolveHub(region, district), id, 0.05);
}

function demoStock(id: string): WeaverStock {
  const stock = defaultStockFor(
    id.startsWith("weaver-demo-") ? id : `weaver-demo-${(id.length % 4) + 1}`,
  );
  return { ...stock, weaverId: id };
}

export type MapDirectoryInput = {
  dbWeavers: {
    id: string;
    name: string;
    region: string;
    categories: string[];
    cooperativeName?: string;
  }[];
  paymentOrders: PaymentOrder[];
  stockByWeaver: Record<string, WeaverStock>;
};

export function buildBuyerMapDirectory(
  input: MapDirectoryInput,
): MapWeaverPin[] {
  const pins: MapWeaverPin[] = [];

  for (const w of input.dbWeavers) {
    const place = resolveWeaverPlace(w.id, w.region, w.categories);
    const completed = input.paymentOrders.filter(
      (o) => o.weaverId === w.id && o.state === "settlement_released",
    ).length;
    const verified = completed >= 1;
    const { rating, ratingLabel } = ratingFromSettlements(completed, verified);
    const stock = input.stockByWeaver[w.id] ?? defaultStockFor(w.id);
    const coords = pinCoords(w.id, place.region, place.district);
    pins.push({
      id: w.id,
      name: w.name,
      region: place.region,
      district: place.district,
      lat: coords.lat,
      lng: coords.lng,
      categories: cleanCategories(w.categories),
      cooperativeName: w.cooperativeName ?? DEMO_CLUSTER.name,
      verified,
      completedSettlements: completed,
      rating,
      ratingLabel,
      menu: stockToMenu(stock),
      yarnNote: yarnNoteFromStock(stock),
      demoDisclaimer: DEMO_CLUSTER.disclaimer,
      source: "db",
    });
  }

  const dbIds = new Set(input.dbWeavers.map((w) => w.id));
  for (const w of NATIONAL_MAP_DEMO_WEAVERS) {
    if (dbIds.has(w.id)) continue;
    const completed = 1 + (w.id.length % 4);
    const verified = true;
    const { rating, ratingLabel } = ratingFromSettlements(completed, verified);
    const stock = demoStock(w.id);
    const coords = pinCoords(w.id, w.region, w.district);
    pins.push({
      id: w.id,
      name: w.name,
      region: w.region,
      district: w.district,
      lat: coords.lat,
      lng: coords.lng,
      categories: w.categories,
      cooperativeName: w.cooperativeName,
      verified,
      completedSettlements: completed,
      rating,
      ratingLabel,
      menu: stockToMenu(stock),
      yarnNote: yarnNoteFromStock(stock),
      demoDisclaimer:
        "Demo Mode — fictional map weaver for nationwide cluster pitch. Not a real person.",
      source: "map-demo",
    });
  }

  return pins;
}

export function clusterByDistrict(pins: MapWeaverPin[]): DistrictCluster[] {
  const map = new Map<string, MapWeaverPin[]>();
  for (const p of pins) {
    const key = `${p.region}::${p.district}`;
    const list = map.get(key) ?? [];
    list.push(p);
    map.set(key, list);
  }
  return [...map.entries()].map(([key, list]) => {
    const first = list[0]!;
    const hub = resolveHub(first.region, first.district);
    const avgRating =
      list.reduce((s, p) => s + p.rating, 0) / Math.max(list.length, 1);
    return {
      key,
      region: first.region,
      district: first.district,
      lat: hub.lat,
      lng: hub.lng,
      weaverCount: list.length,
      avgRating: Math.round(avgRating * 10) / 10,
      verifiedCount: list.filter((p) => p.verified).length,
    };
  });
}

export function clusterByState(pins: MapWeaverPin[]): StateCluster[] {
  const map = new Map<string, MapWeaverPin[]>();
  for (const p of pins) {
    const list = map.get(p.region) ?? [];
    list.push(p);
    map.set(p.region, list);
  }
  const max = Math.max(1, ...[...map.values()].map((l) => l.length));
  return [...map.entries()].map(([region, list]) => {
    const hub = STATE_GEO[region] ?? resolveHub(region);
    const districts = new Set(list.map((p) => p.district));
    const avgRating =
      list.reduce((s, p) => s + p.rating, 0) / Math.max(list.length, 1);
    return {
      region,
      lat: hub.lat,
      lng: hub.lng,
      weaverCount: list.length,
      districtCount: districts.size,
      avgRating: Math.round(avgRating * 10) / 10,
      intensity: list.length / max,
    };
  });
}

/** Buyer-city map for seeded buyers (order heat join). */
const BUYER_PLACE: Record<string, { region: string; district: string }> = {
  "buyer-demo-001": { region: "Tamil Nadu", district: "Kanchipuram" },
  "buyer-demo-002": { region: "Tamil Nadu", district: "Coimbatore" },
  "buyer-demo-003": { region: "Tamil Nadu", district: "Madurai" },
};

export function buildWeaverOrdersHeat(
  requirements: BuyerRequirement[],
  orders: PaymentOrder[],
  buyers: { id: string; region: string }[],
  focusRegion?: string,
): OrderHeatPoint[] {
  const byKey = new Map<
    string,
    {
      region: string;
      district?: string;
      orderCount: number;
      pieceDemand: number;
      amountInr: number;
    }
  >();

  function bump(
    regionRaw: string,
    district: string | undefined,
    pieceDemand: number,
    amountInr: number,
    orderCount: number,
  ) {
    const region = normalizeState(regionRaw);
    if (
      focusRegion &&
      region.toLowerCase() !== normalizeState(focusRegion).toLowerCase()
    ) {
      return;
    }
    const key = district ? `${region}::${district}` : region;
    const cur = byKey.get(key) ?? {
      region,
      district,
      orderCount: 0,
      pieceDemand: 0,
      amountInr: 0,
    };
    cur.orderCount += orderCount;
    cur.pieceDemand += pieceDemand;
    cur.amountInr += amountInr;
    byKey.set(key, cur);
  }

  for (const r of requirements) {
    if (r.status !== "open") continue;
    const districts = STATE_DISTRICTS[normalizeState(r.region)] ?? [];
    // Spread demand across a few hubs in the region for a readable heat surface
    const hubs =
      districts.length > 0
        ? districts.slice(0, Math.min(4, districts.length))
        : [undefined];
    const per = r.quantity / hubs.length;
    for (const d of hubs) {
      bump(r.region, d, per, 0, 1 / hubs.length);
    }
  }

  for (const o of orders) {
    if (o.state === "settlement_released" || o.state === "resolved") continue;
    const buyer = buyers.find((b) => b.id === o.buyerId);
    const place =
      BUYER_PLACE[o.buyerId] ??
      (buyer
        ? {
            region: buyer.region,
            district: (STATE_DISTRICTS[normalizeState(buyer.region)] ?? [])[0],
          }
        : { region: "Tamil Nadu", district: "Kanchipuram" });
    bump(place.region, place.district, 1, o.amount, 1);
  }

  // Seed faint national hubs so the weaver map isn't empty outside TN
  if (!focusRegion) {
    for (const state of INDIA_STATES) {
      if (byKey.has(state)) continue;
      const districts = STATE_DISTRICTS[state] ?? [];
      if (districts.length === 0) continue;
      // tiny baseline so national heat shows weaving geography
      bump(state, districts[0], 0.4, 0, 0.2);
    }
  }

  const points: OrderHeatPoint[] = [];
  let maxW = 1;
  for (const [key, v] of byKey) {
    const weight = v.pieceDemand * 2 + v.orderCount * 3 + v.amountInr / 5000;
    maxW = Math.max(maxW, weight);
    const hub = resolveHub(v.region, v.district);
    points.push({
      key,
      region: v.region,
      district: v.district,
      lat: hub.lat,
      lng: hub.lng,
      weight,
      orderCount: Math.round(v.orderCount * 10) / 10,
      pieceDemand: Math.round(v.pieceDemand),
      amountInr: Math.round(v.amountInr),
      label: v.district
        ? `${v.district}, ${v.region}`
        : v.region,
    });
  }

  return points.map((p) => ({
    ...p,
    weight: Math.max(0.15, p.weight / maxW),
  }));
}

export function searchSuggestions(query: string): {
  label: string;
  region: string;
  district?: string;
  kind: "state" | "district";
}[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return INDIA_STATES.slice(0, 8).map((region) => ({
      label: region,
      region,
      kind: "state" as const,
    }));
  }
  const out: {
    label: string;
    region: string;
    district?: string;
    kind: "state" | "district";
  }[] = [];
  for (const region of INDIA_STATES) {
    if (region.toLowerCase().includes(q)) {
      out.push({ label: region, region, kind: "state" });
    }
    for (const district of STATE_DISTRICTS[region] ?? []) {
      if (
        district.toLowerCase().includes(q) ||
        `${district}, ${region}`.toLowerCase().includes(q)
      ) {
        out.push({
          label: `${district}, ${region}`,
          region,
          district,
          kind: "district",
        });
      }
    }
  }
  return out.slice(0, 12);
}

export function filterPins(
  pins: MapWeaverPin[],
  region?: string | null,
  district?: string | null,
): MapWeaverPin[] {
  return pins.filter((p) => {
    if (region && p.region.toLowerCase() !== region.toLowerCase()) return false;
    if (district && p.district.toLowerCase() !== district.toLowerCase())
      return false;
    return true;
  });
}

export function knownDistricts(): string[] {
  return Object.keys(DISTRICT_GEO).sort((a, b) => a.localeCompare(b));
}
