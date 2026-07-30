/**
 * Handloom festival / seasonal calendar for demand scoring + weaver reference.
 *
 * Curated public calendar (hardcoded) — NOT a live festival API.
 * Dates cross-checked against Economic Times / DNA / Drik Panchang / timeanddate
 * listings for 2026 where lunar festivals apply. Regional demand windows
 * around peaks are intentional for production planning.
 *
 * District tags map to LoomOS handloom hubs in `STATE_DISTRICTS` (weaving towns),
 * not every revenue district. Empty `districts` = statewide / pan-region demand.
 */

import {
  addCalendarDays,
  parseDateOnly,
  toDateOnly,
} from "@/lib/production-defaults";

export type PublicCalendarEvent = {
  id: string;
  name: string;
  /** Inclusive start YYYY-MM-DD — demand / planning window start */
  startDate: string;
  /** Inclusive end YYYY-MM-DD — peak / close of demand window */
  endDate: string;
  /** States (or "India") where festive textile demand typically rises */
  regions: string[];
  /**
   * Optional weaving hubs / districts with especially strong pull.
   * Empty = treat as statewide for that region list.
   */
  districts: string[];
  /** Category ids this event is relevant to */
  categoryIds: string[];
  /** What handloom goods buyers usually seek for this event */
  handloomDemand: string;
  sourceNote: string;
};

export const PUBLIC_FESTIVAL_CALENDAR: PublicCalendarEvent[] = [
  // —— Early 2026 (kept for full-year weaver reference) ——
  {
    id: "pongal-sankranti-2026",
    name: "Thai Pongal / Makar Sankranti",
    startDate: "2026-01-14",
    endDate: "2026-01-17",
    regions: ["Tamil Nadu", "Andhra Pradesh", "Telangana", "Karnataka", "India"],
    districts: [
      "Kanchipuram",
      "Salem",
      "Madurai",
      "Mangalagiri",
      "Dharmavaram",
      "Pochampally",
      "Ilkal",
    ],
    categoryIds: ["cotton-saree", "silk-saree", "dhoti-angavastram", "stole-dupatta"],
    handloomDemand:
      "Cotton & silk sarees, veshti/dhoti sets, and gift stoles for harvest / new-year gifting.",
    sourceNote:
      "Source: public calendar — Pongal / Makar Sankranti 14 Jan 2026 (Economic Times / Drik Panchang).",
  },
  {
    id: "magh-bihu-2026",
    name: "Magh Bihu (Bhogali Bihu)",
    startDate: "2026-01-14",
    endDate: "2026-01-15",
    regions: ["Assam"],
    districts: ["Sualkuchi", "Barpeta", "Jorhat", "Nagaon"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Assam silk (muga/pat/eri) mekhela-chador sets and stoles for Magh Bihu gatherings.",
    sourceNote:
      "Source: public calendar — Magh Bihu aligns with mid-January Sankranti window (public Assam holiday lists).",
  },
  {
    id: "holi-2026",
    name: "Holi",
    startDate: "2026-03-03",
    endDate: "2026-03-04",
    regions: ["Uttar Pradesh", "Rajasthan", "Delhi", "Bihar", "Maharashtra", "India"],
    districts: ["Varanasi", "Jaipur", "Paithan", "Bhagalpur"],
    categoryIds: ["cotton-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Lightweight cotton sarees, dupattas, and festive kurtas — colour-play season restock.",
    sourceNote:
      "Source: public calendar — Holika Dahan 3 Mar / Holi 4 Mar 2026 (Economic Times / Drik Panchang).",
  },
  {
    id: "ugadi-gudi-padwa-2026",
    name: "Ugadi / Gudi Padwa",
    startDate: "2026-03-19",
    endDate: "2026-03-19",
    regions: ["Andhra Pradesh", "Telangana", "Karnataka", "Maharashtra"],
    districts: [
      "Dharmavaram",
      "Mangalagiri",
      "Pochampally",
      "Gadwal",
      "Ilkal",
      "Mysuru",
      "Paithan",
      "Yeola",
    ],
    categoryIds: ["silk-saree", "cotton-saree", "dhoti-angavastram"],
    handloomDemand:
      "New-year silk and cotton sarees; Paithani and Ilkal/Gadwal festive wear.",
    sourceNote:
      "Source: public calendar — Ugadi / Gudi Padwa 19 Mar 2026 (Economic Times / Drik Panchang).",
  },
  {
    id: "puthandu-vishu-2026",
    name: "Puthandu / Vishu",
    startDate: "2026-04-14",
    endDate: "2026-04-14",
    regions: ["Tamil Nadu", "Kerala"],
    districts: [
      "Kanchipuram",
      "Madurai",
      "Salem",
      "Balaramapuram",
      "Kannur",
      "Chendamangalam",
    ],
    categoryIds: ["silk-saree", "cotton-saree", "dhoti-angavastram", "stole-dupatta"],
    handloomDemand:
      "Tamil New Year silk/cotton sarees; Kerala kasavu mundu and set-mundu for Vishu.",
    sourceNote:
      "Source: public calendar — Puthandu / Vishu 14 Apr 2026 (solar; public holiday lists).",
  },
  {
    id: "bohag-bihu-2026",
    name: "Bohag Bihu (Rongali Bihu)",
    startDate: "2026-04-14",
    endDate: "2026-04-16",
    regions: ["Assam"],
    districts: ["Sualkuchi", "Barpeta", "Jorhat", "Nagaon", "Dhemaji"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Peak Assam handloom season — new mekhela-chador, gamusa, and silk stoles.",
    sourceNote:
      "Source: public calendar — Bohag Bihu mid-April 2026 (Economic Times lists 15 Apr).",
  },
  {
    id: "poila-boishakh-2026",
    name: "Poila Boishakh (Bengali New Year)",
    startDate: "2026-04-14",
    endDate: "2026-04-15",
    regions: ["West Bengal"],
    districts: ["Shantipur", "Phulia", "Murshidabad", "Baluchari", "Nadia"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Tangail, Jamdani, Baluchari and cotton handloom sarees for New Year visits.",
    sourceNote:
      "Source: public calendar — Bengali New Year mid-April (solar; public WB holiday lists).",
  },
  {
    id: "rath-yatra-2026",
    name: "Jagannath Rath Yatra",
    startDate: "2026-07-14",
    endDate: "2026-07-16",
    regions: ["Odisha"],
    districts: ["Cuttack", "Berhampur", "Sambalpur", "Nuapatna"],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Temple cloth, gamucha, and Odisha handloom sarees around Puri Rath Yatra.",
    sourceNote:
      "Source: public calendar — Rath Yatra 16 Jul 2026 (Economic Times / public panchang).",
  },
  {
    id: "aadi-shopping-2026",
    name: "Aadi textile shopping season (Tamil Nadu)",
    startDate: "2026-07-17",
    endDate: "2026-08-16",
    regions: ["Tamil Nadu"],
    districts: [
      "Kanchipuram",
      "Salem",
      "Erode",
      "Madurai",
      "Coimbatore",
      "Kumbakonam",
      "Thanjavur",
    ],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Traditional mid-year saree sales — Kanchipuram silk and cotton handlooms move heavily.",
    sourceNote:
      "Source: traditional Tamil month Aadi retail season (approx. mid-Jul–mid-Aug); not a single gazetted holiday — demand window for weavers.",
  },

  // —— Upcoming from late July 2026 ——
  {
    id: "onam-2026",
    name: "Onam (Thiruvonam)",
    startDate: "2026-08-20",
    endDate: "2026-08-26",
    regions: ["Kerala"],
    districts: ["Balaramapuram", "Kannur", "Chendamangalam", "Kasaragod", "Kuthampully"],
    categoryIds: ["stole-dupatta", "cotton-saree", "dhoti-angavastram", "silk-saree"],
    handloomDemand:
      "Kasavu sarees, set-mundu, and cream-gold border cloth — strongest Kerala handloom peak.",
    sourceNote:
      "Source: public calendar — Thiruvonam / Onam 26 Aug 2026 (Economic Times / Drik Panchang); window starts ~1 week earlier for stock.",
  },
  {
    id: "raksha-bandhan-2026",
    name: "Raksha Bandhan",
    startDate: "2026-08-28",
    endDate: "2026-08-28",
    regions: ["Uttar Pradesh", "Rajasthan", "Delhi", "Bihar", "Madhya Pradesh", "India"],
    districts: ["Varanasi", "Jaipur", "Chanderi", "Bhagalpur"],
    categoryIds: ["stole-dupatta", "cotton-saree"],
    handloomDemand: "Gift dupattas, stoles, and lightweight cotton festive wear.",
    sourceNote:
      "Source: public calendar — Raksha Bandhan 28 Aug 2026 (Economic Times / public panchang).",
  },
  {
    id: "ganesh-chaturthi-2026",
    name: "Ganesh Chaturthi",
    startDate: "2026-09-14",
    endDate: "2026-09-24",
    regions: ["Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Delhi", "India"],
    districts: ["Paithan", "Yeola", "Solapur", "Ilkal", "Mysuru", "Kanchipuram"],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Paithani and festive silk/cotton sarees; dhoti sets for visarjan processions.",
    sourceNote:
      "Source: public calendar — Ganesh Chaturthi 14 Sep 2026; ~10-day immersion window (timeanddate / Economic Times).",
  },
  {
    id: "nuakhai-2026",
    name: "Nuakhai",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    regions: ["Odisha"],
    districts: ["Sambalpur", "Bargarh", "Sonepur", "Nuapatna"],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta"],
    handloomDemand:
      "Western Odisha harvest wear — Sambalpuri / Bomkai handloom sarees for new-rice puja.",
    sourceNote:
      "Source: public calendar — Nuakhai traditionally the day after Ganesh Chaturthi in western Odisha (15 Sep 2026 if Chaturthi is 14 Sep); confirm local panchang.",
  },
  {
    id: "sharad-navratri-2026",
    name: "Sharad Navratri (Garba / Kolu season)",
    startDate: "2026-10-11",
    endDate: "2026-10-20",
    regions: ["Gujarat", "Tamil Nadu", "Maharashtra", "Rajasthan", "India"],
    districts: ["Patan", "Surendranagar", "Ahmedabad", "Kutch", "Kanchipuram", "Jaipur"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Garba/Navratri outfits and silk sarees; Patola and bandhani demand rises in Gujarat.",
    sourceNote:
      "Source: public calendar — Sharad Navratri 11–20 Oct 2026 (timeanddate.com / ShubhPanchang).",
  },
  {
    id: "durga-puja-2026",
    name: "Durga Puja / Vijaya Dashami",
    startDate: "2026-10-16",
    endDate: "2026-10-20",
    regions: ["West Bengal", "Assam", "Odisha", "Bihar", "Delhi", "India"],
    districts: [
      "Shantipur",
      "Phulia",
      "Murshidabad",
      "Baluchari",
      "Nadia",
      "Sualkuchi",
      "Cuttack",
      "Bhagalpur",
    ],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Peak silk & cotton saree demand — new pandal wear; Baluchari, Tangail, Assam silk.",
    sourceNote:
      "Source: public calendar — Durga Puja peak ~16–20 Oct; Vijaya Dashami / Dussehra 20 Oct 2026 (public panchang / Economic Times).",
  },
  {
    id: "mysuru-dasara-2026",
    name: "Mysuru Dasara",
    startDate: "2026-10-11",
    endDate: "2026-10-21",
    regions: ["Karnataka"],
    districts: ["Mysuru", "Ilkal", "Molakalmuru", "Guledgudda", "Hubballi"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Mysore silk and Ilkal sarees for Nada Habba / Dasara court and public festivities.",
    sourceNote:
      "Source: Karnataka CM schedule — Dasara inauguration 11 Oct 2026; Jumboo Savari 21 Oct 2026 (Star of Mysore / New Kerala).",
  },
  {
    id: "diwali-2026",
    name: "Diwali (Lakshmi Puja)",
    startDate: "2026-11-06",
    endDate: "2026-11-10",
    regions: [
      "Delhi",
      "Uttar Pradesh",
      "Rajasthan",
      "Madhya Pradesh",
      "Maharashtra",
      "Gujarat",
      "Tamil Nadu",
      "Karnataka",
      "Andhra Pradesh",
      "Telangana",
      "West Bengal",
      "Assam",
      "India",
    ],
    districts: [
      "Varanasi",
      "Kanchipuram",
      "Paithan",
      "Chanderi",
      "Patan",
      "Pochampally",
      "Dharmavaram",
      "Shantipur",
      "Sualkuchi",
      "Jaipur",
    ],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta"],
    handloomDemand:
      "Pan-India festive silk/cotton sarees and gift stoles — strongest national handloom peak.",
    sourceNote:
      "Source: public calendar — Dhanteras 6 Nov / Diwali (Lakshmi Puja) 8 Nov 2026 (Economic Times / Drik Panchang).",
  },
  {
    id: "chhath-2026",
    name: "Chhath Puja",
    startDate: "2026-11-13",
    endDate: "2026-11-16",
    regions: ["Bihar", "Uttar Pradesh", "Delhi", "Jharkhand", "India"],
    districts: ["Bhagalpur", "Madhubani", "Varanasi", "Mau"],
    categoryIds: ["cotton-saree", "dhoti-angavastram", "stole-dupatta"],
    handloomDemand:
      "New cotton sarees and dhoti sets for riverbank rituals — strong Bihar/Purvanchal pull.",
    sourceNote:
      "Source: public calendar — Chhath window mid-Nov 2026; Economic Times lists 15 Nov 2026.",
  },
  {
    id: "dev-deepawali-2026",
    name: "Dev Deepawali (Varanasi)",
    startDate: "2026-11-24",
    endDate: "2026-11-24",
    regions: ["Uttar Pradesh"],
    districts: ["Varanasi"],
    categoryIds: ["silk-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Banarasi silk peak for Kartik Purnima ghat celebrations — district-specific demand.",
    sourceNote:
      "Source: public calendar — Kartik Purnima / Dev Deepawali 24 Nov 2026 (Economic Times / public panchang).",
  },
  {
    id: "wedding-season-winter-2026",
    name: "Peak wedding season (winter window)",
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    regions: [
      "Delhi",
      "Uttar Pradesh",
      "Rajasthan",
      "Punjab",
      "Maharashtra",
      "Gujarat",
      "Tamil Nadu",
      "West Bengal",
      "Assam",
      "Karnataka",
      "India",
    ],
    districts: [
      "Varanasi",
      "Kanchipuram",
      "Paithan",
      "Yeola",
      "Jaipur",
      "Patan",
      "Chanderi",
      "Pochampally",
      "Shantipur",
      "Sualkuchi",
    ],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta", "dhoti-angavastram"],
    handloomDemand:
      "Bridal and trousseau silk (Banarasi, Kanchipuram, Paithani, Patola) plus cotton dailywear lots.",
    sourceNote:
      "Source: commonly cited post-monsoon/winter wedding window (approx. Nov–Feb); not an official government date — planning estimate.",
  },

  // —— Early 2027 ——
  {
    id: "pongal-sankranti-2027",
    name: "Thai Pongal / Makar Sankranti",
    startDate: "2027-01-14",
    endDate: "2027-01-17",
    regions: ["Tamil Nadu", "Andhra Pradesh", "Telangana", "Karnataka", "India"],
    districts: [
      "Kanchipuram",
      "Salem",
      "Madurai",
      "Mangalagiri",
      "Dharmavaram",
      "Pochampally",
      "Ilkal",
    ],
    categoryIds: ["cotton-saree", "silk-saree", "dhoti-angavastram", "stole-dupatta"],
    handloomDemand:
      "Cotton & silk sarees, veshti/dhoti sets, and gift stoles for harvest / new-year gifting.",
    sourceNote:
      "Source: public calendar — Thai Pongal / Makar Sankranti is observed mid-January (solar).",
  },
  {
    id: "magh-bihu-2027",
    name: "Magh Bihu (Bhogali Bihu)",
    startDate: "2027-01-14",
    endDate: "2027-01-15",
    regions: ["Assam"],
    districts: ["Sualkuchi", "Barpeta", "Jorhat", "Nagaon"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    handloomDemand:
      "Assam silk mekhela-chador sets and stoles for Magh Bihu gatherings.",
    sourceNote:
      "Source: public calendar — Magh Bihu aligns with mid-January Sankranti window.",
  },
];

export type FestivalMatchTier = "district" | "state" | "national";

export function festivalMatchTier(
  event: PublicCalendarEvent,
  region: string,
  district?: string | null,
): FestivalMatchTier | null {
  const regionLc = region.trim().toLowerCase();
  const districtLc = district?.trim().toLowerCase() ?? "";
  const regionsLc = event.regions.map((r) => r.toLowerCase());
  const isIndia = regionsLc.includes("india");
  const isState = regionsLc.includes(regionLc);

  if (!isIndia && !isState) return null;

  if (
    districtLc &&
    event.districts.some((d) => d.toLowerCase() === districtLc)
  ) {
    return "district";
  }
  if (isState) return "state";
  if (isIndia) return "national";
  return null;
}

export function listFestivalsForPlace(args: {
  region?: string;
  district?: string | null;
  categoryId?: string;
  /** If true, only events whose endDate is on/after asOf */
  upcomingOnly?: boolean;
  asOf?: Date;
  limit?: number;
}): PublicCalendarEvent[] {
  const {
    region,
    district,
    categoryId,
    upcomingOnly = false,
    asOf = new Date(),
    limit,
  } = args;
  const today = parseDateOnly(toDateOnly(asOf));

  const rows = PUBLIC_FESTIVAL_CALENDAR.filter((e) => {
    if (categoryId && !e.categoryIds.includes(categoryId)) return false;
    if (upcomingOnly && parseDateOnly(e.endDate) < today) return false;
    if (!region || region.toLowerCase() === "india") return true;
    return festivalMatchTier(e, region, district) !== null;
  }).sort((a, b) => {
    const dateCmp = a.startDate.localeCompare(b.startDate);
    if (dateCmp !== 0) return dateCmp;
    if (!region) return 0;
    const tierRank = (t: FestivalMatchTier | null) =>
      t === "district" ? 0 : t === "state" ? 1 : t === "national" ? 2 : 3;
    return (
      tierRank(festivalMatchTier(a, region, district)) -
      tierRank(festivalMatchTier(b, region, district))
    );
  });

  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

/** Plan chips: nearest upcoming festivals for a weaver's place + optional category. */
export function getPlanFestivalChips(args: {
  region?: string;
  district?: string | null;
  categoryId?: string;
  asOf?: Date;
  limit?: number;
}): { id: string; name: string; date: string; tier: FestivalMatchTier }[] {
  const asOf = args.asOf ?? new Date();
  const limit = args.limit ?? 5;
  const upcoming = listFestivalsForPlace({
    ...args,
    upcomingOnly: true,
    asOf,
  });

  const chips: { id: string; name: string; date: string; tier: FestivalMatchTier }[] =
    [];
  for (const e of upcoming) {
    const tier =
      args.region && args.region.toLowerCase() !== "india"
        ? festivalMatchTier(e, args.region, args.district)
        : ("national" as FestivalMatchTier);
    if (!tier) continue;
    // Target the start of the demand window for reverse planning
    chips.push({ id: e.id, name: e.name, date: e.startDate, tier });
    if (chips.length >= limit) break;
  }
  return chips;
}

/** Unique states present in the calendar (for filter UI). */
export function festivalCalendarStates(): string[] {
  const set = new Set<string>();
  for (const e of PUBLIC_FESTIVAL_CALENDAR) {
    for (const r of e.regions) {
      if (r.toLowerCase() !== "india") set.add(r);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/** Districts tagged for a state in the calendar (may be a subset of STATE_DISTRICTS). */
export function festivalCalendarDistricts(region: string): string[] {
  const regionLc = region.toLowerCase();
  const set = new Set<string>();
  for (const e of PUBLIC_FESTIVAL_CALENDAR) {
    if (!e.regions.some((r) => r.toLowerCase() === regionLc)) continue;
    for (const d of e.districts) set.add(d);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function daysUntilEvent(
  event: PublicCalendarEvent,
  asOf: Date = new Date(),
): number | null {
  const today = parseDateOnly(toDateOnly(asOf));
  const start = parseDateOnly(event.startDate);
  const end = parseDateOnly(event.endDate);
  if (today >= start && today <= end) return 0;
  if (today < start) {
    return Math.round((start.getTime() - today.getTime()) / 86_400_000);
  }
  return null;
}

/** Suggest yarn/start lead from target: keep Plan math elsewhere; helper for copy. */
export function suggestPrepWindowDays(weavingDays: number): {
  startByOffset: number;
  label: string;
} {
  const startByOffset = weavingDays + 10;
  return {
    startByOffset,
    label: `Start ~${startByOffset} days before festival (weave + yarn/QC buffer — illustrative)`,
  };
}

export function formatPrepHint(
  event: PublicCalendarEvent,
  weavingDays = 6,
  asOf: Date = new Date(),
): string {
  const days = daysUntilEvent(event, asOf);
  const { startByOffset } = suggestPrepWindowDays(weavingDays);
  if (days === null) return "Festival window has passed.";
  if (days === 0) return "Festival window is on now — finish & dispatch remaining lots.";
  const startBy = toDateOnly(addCalendarDays(asOf, Math.max(0, days - startByOffset)));
  return `Estimated start-by ${startBy} (illustrative — ${startByOffset}d before ${event.startDate}).`;
}
