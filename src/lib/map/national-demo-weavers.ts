/**
 * Extra fictional weavers for nationwide buyer map clusters (Demo Mode).
 * Stable ids — stock/rating derived deterministically; not in Postgres identity.
 */

export type MapDemoWeaver = {
  id: string;
  name: string;
  region: string;
  district: string;
  categories: string[];
  cooperativeName: string;
};

export const NATIONAL_MAP_DEMO_WEAVERS: MapDemoWeaver[] = [
  {
    id: "map-weaver-kanchi-01",
    name: "Revathi (demo weaver — fictional)",
    region: "Tamil Nadu",
    district: "Kanchipuram",
    categories: ["silk saree", "cotton saree"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-kanchi-02",
    name: "Padma (demo weaver — fictional)",
    region: "Tamil Nadu",
    district: "Kanchipuram",
    categories: ["silk saree"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-salem-01",
    name: "Kavitha (demo weaver — fictional)",
    region: "Tamil Nadu",
    district: "Salem",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-erode-01",
    name: "Anitha (demo weaver — fictional)",
    region: "Tamil Nadu",
    district: "Erode",
    categories: ["cotton saree", "cotton lungi"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-madurai-01",
    name: "Thenmozhi (demo weaver — fictional)",
    region: "Tamil Nadu",
    district: "Madurai",
    categories: ["silk saree", "dhoti / angavastram"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-varanasi-01",
    name: "Sunita (demo weaver — fictional)",
    region: "Uttar Pradesh",
    district: "Varanasi",
    categories: ["silk saree"],
    cooperativeName: "Ganga Plains Handloom (Demo)",
  },
  {
    id: "map-weaver-varanasi-02",
    name: "Asha (demo weaver — fictional)",
    region: "Uttar Pradesh",
    district: "Varanasi",
    categories: ["silk saree", "stole / dupatta"],
    cooperativeName: "Ganga Plains Handloom (Demo)",
  },
  {
    id: "map-weaver-mau-01",
    name: "Geeta (demo weaver — fictional)",
    region: "Uttar Pradesh",
    district: "Mau",
    categories: ["cotton saree", "silk saree"],
    cooperativeName: "Ganga Plains Handloom (Demo)",
  },
  {
    id: "map-weaver-pochampally-01",
    name: "Lakshmi Bai (demo weaver — fictional)",
    region: "Telangana",
    district: "Pochampally",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: "Deccan Handloom Desk (Demo)",
  },
  {
    id: "map-weaver-gadwal-01",
    name: "Saraswati (demo weaver — fictional)",
    region: "Telangana",
    district: "Gadwal",
    categories: ["silk saree", "cotton saree"],
    cooperativeName: "Deccan Handloom Desk (Demo)",
  },
  {
    id: "map-weaver-ilkal-01",
    name: "Bhagirathi (demo weaver — fictional)",
    region: "Karnataka",
    district: "Ilkal",
    categories: ["cotton saree", "silk saree"],
    cooperativeName: "Mysore Loom Collective (Demo)",
  },
  {
    id: "map-weaver-mysuru-01",
    name: "Nirmala (demo weaver — fictional)",
    region: "Karnataka",
    district: "Mysuru",
    categories: ["silk saree"],
    cooperativeName: "Mysore Loom Collective (Demo)",
  },
  {
    id: "map-weaver-sualkuchi-01",
    name: "Bina (demo weaver — fictional)",
    region: "Assam",
    district: "Sualkuchi",
    categories: ["silk saree", "stole / dupatta"],
    cooperativeName: "Brahmaputra Loom Circle (Demo)",
  },
  {
    id: "map-weaver-shantipur-01",
    name: "Rina (demo weaver — fictional)",
    region: "West Bengal",
    district: "Shantipur",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: "Ganga Weave Collective (Demo)",
  },
  {
    id: "map-weaver-phulia-01",
    name: "Mala (demo weaver — fictional)",
    region: "West Bengal",
    district: "Phulia",
    categories: ["cotton saree"],
    cooperativeName: "Ganga Weave Collective (Demo)",
  },
  {
    id: "map-weaver-sambalpur-01",
    name: "Priya (demo weaver — fictional)",
    region: "Odisha",
    district: "Sambalpur",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: "Kalinga Loom Circle (Demo)",
  },
  {
    id: "map-weaver-nuapatna-01",
    name: "Smita (demo weaver — fictional)",
    region: "Odisha",
    district: "Nuapatna",
    categories: ["silk saree", "cotton saree"],
    cooperativeName: "Kalinga Loom Circle (Demo)",
  },
  {
    id: "map-weaver-mangalagiri-01",
    name: "Vani (demo weaver — fictional)",
    region: "Andhra Pradesh",
    district: "Mangalagiri",
    categories: ["cotton saree", "cotton lungi"],
    cooperativeName: "Godavari Thread Circle (Demo)",
  },
  {
    id: "map-weaver-dharmavaram-01",
    name: "Jyothi (demo weaver — fictional)",
    region: "Andhra Pradesh",
    district: "Dharmavaram",
    categories: ["silk saree"],
    cooperativeName: "Godavari Thread Circle (Demo)",
  },
  {
    id: "map-weaver-chanderi-01",
    name: "Radha (demo weaver — fictional)",
    region: "Madhya Pradesh",
    district: "Chanderi",
    categories: ["silk saree", "cotton saree"],
    cooperativeName: "Kalinga Loom Circle (Demo)",
  },
  {
    id: "map-weaver-paithan-01",
    name: "Savita (demo weaver — fictional)",
    region: "Maharashtra",
    district: "Paithan",
    categories: ["silk saree"],
    cooperativeName: "Mysore Loom Collective (Demo)",
  },
  {
    id: "map-weaver-patan-01",
    name: "Hetal (demo weaver — fictional)",
    region: "Gujarat",
    district: "Patan",
    categories: ["silk saree", "stole / dupatta"],
    cooperativeName: "Mysore Loom Collective (Demo)",
  },
  {
    id: "map-weaver-kannur-01",
    name: "Latha (demo weaver — fictional)",
    region: "Kerala",
    district: "Kannur",
    categories: ["cotton saree", "dhoti / angavastram"],
    cooperativeName: "Nila Loom Circle (Demo Cluster)",
  },
  {
    id: "map-weaver-bhagalpur-01",
    name: "Poonam (demo weaver — fictional)",
    region: "Bihar",
    district: "Bhagalpur",
    categories: ["silk saree", "cotton saree"],
    cooperativeName: "Ganga Plains Handloom (Demo)",
  },
];

/** Stable district for seeded Postgres demo weavers. */
export const DEMO_WEAVER_DISTRICTS: Record<
  string,
  { region: string; district: string }
> = {
  "weaver-demo-001": { region: "Tamil Nadu", district: "Kanchipuram" },
  "weaver-demo-002": { region: "Tamil Nadu", district: "Salem" },
  "weaver-demo-003": { region: "Tamil Nadu", district: "Kumbakonam" },
  "weaver-demo-004": { region: "Tamil Nadu", district: "Madurai" },
};
