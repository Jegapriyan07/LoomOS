/**
 * Public festival / wedding-season calendar for demand scoring.
 * Source: public calendar (hardcoded). Not a live festival API.
 *
 * Dates verified where lunar festivals apply for 2026–2027:
 * - Diwali (Lakshmi Puja) 2026: 8 Nov 2026 (timeanddate.com / public holiday lists)
 * - Durga Puja peak / Vijaya Dashami 2026: 20 Oct 2026 (public panchang listings)
 * - Thai Pongal: fixed solar date 14 Jan (annual)
 */

export type PublicCalendarEvent = {
  id: string;
  name: string;
  /** Inclusive start YYYY-MM-DD */
  startDate: string;
  /** Inclusive end YYYY-MM-DD */
  endDate: string;
  /** Regions where this event typically drives festive textile demand */
  regions: string[];
  /** Category ids this event is relevant to */
  categoryIds: string[];
  sourceNote: string;
};

export const PUBLIC_FESTIVAL_CALENDAR: PublicCalendarEvent[] = [
  {
    id: "pongal-2027",
    name: "Thai Pongal",
    startDate: "2027-01-14",
    endDate: "2027-01-17",
    regions: ["Tamil Nadu"],
    categoryIds: ["cotton-saree", "silk-saree", "dhoti-angavastram", "stole-dupatta"],
    sourceNote: "Source: public calendar — Thai Pongal is observed mid-January (solar).",
  },
  {
    id: "ganesh-chaturthi-2026",
    name: "Ganesh Chaturthi",
    startDate: "2026-09-14",
    endDate: "2026-09-24",
    regions: ["Tamil Nadu", "India"],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta", "dhoti-angavastram"],
    sourceNote:
      "Source: public calendar — Ganesh Chaturthi 2026 listed as 14 Sep 2026 (timeanddate.com / public holiday lists).",
  },
  {
    id: "onam-2026",
    name: "Onam (Thiruvonam)",
    startDate: "2026-08-26",
    endDate: "2026-08-26",
    regions: ["Kerala"],
    categoryIds: ["stole-dupatta", "cotton-saree", "dhoti-angavastram"],
    sourceNote:
      "Source: public calendar — Thiruvonam / Onam 2026 listed as 26 Aug 2026 (public panchang listings).",
  },
  {
    id: "diwali-2026",
    name: "Diwali (Lakshmi Puja)",
    startDate: "2026-11-06",
    endDate: "2026-11-10",
    regions: ["Tamil Nadu", "West Bengal", "Assam", "India"],
    categoryIds: ["cotton-saree", "silk-saree", "stole-dupatta"],
    sourceNote:
      "Source: public calendar — Diwali/Deepavali 2026 listed as 8 Nov 2026 (gazetted holiday lists).",
  },
  {
    id: "durga-puja-2026",
    name: "Durga Puja / Vijaya Dashami",
    startDate: "2026-10-16",
    endDate: "2026-10-20",
    regions: ["West Bengal", "Assam", "India"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta"],
    sourceNote:
      "Source: public calendar — Durga Puja 2026 Shashthi ~16 Oct; Vijaya Dashami 20 Oct 2026 (public panchang listings).",
  },
  {
    id: "wedding-season-winter-2026",
    name: "Peak wedding season (winter window)",
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    regions: ["Tamil Nadu", "West Bengal", "Assam", "India"],
    categoryIds: ["silk-saree", "cotton-saree", "stole-dupatta", "dhoti-angavastram"],
    sourceNote:
      "Source: public calendar — commonly cited post-monsoon/winter wedding window (approx. Nov–Feb); not an official government date.",
  },
];
