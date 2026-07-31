/**
 * Stage 10 — Day-one bootstrap / Demo Mode.
 *
 * ONE fictional demo cluster only. Not a real cooperative, not real people,
 * not live ledger numbers. Primary craft cluster is Tamil Nadu / Kanchipuram.
 */

export const DEMO_MODE = true;

/** Primary demo cluster — society name matches cluster name. */
export const DEMO_CLUSTER = {
  id: "cluster-tamil-nadu-kanchipuram",
  name: "Kanchipuram",
  shortName: "Kanchipuram",
  /** Primary craft cluster — Kanchipuram → Tamil Nadu → nation */
  flavor:
    "Tamil Nadu handloom cluster centered on Kanchipuram silk and cotton sarees.",
  region: "Tamil Nadu",
  district: "Kanchipuram",
  disclaimer: "",
} as const;

/**
 * Illustrative concurrent-order capacity per weaver (Demo Mode default).
 * Not researched production capacity — cooperatives should replace.
 * Utilization numerator = Stage 4 pipeline orders still open in this app.
 */
export const ILLUSTRATIVE_MAX_CONCURRENT_ORDERS = 3;

export const ILLUSTRATIVE_CAPACITY_NOTE =
  `Denominator is an illustrative default of ${ILLUSTRATIVE_MAX_CONCURRENT_ORDERS} concurrent orders per weaver — not verified loom capacity. Numerator = orders still in the pipeline in this app (not Settlement Released / Resolved).`;

export type DemoWeaverProfile = {
  id: string;
  name: string;
  givenName: string;
  primaryLanguage: "ta" | "te" | "kn" | "hi";
  region: string;
  district: string;
  categories: string[];
  cooperativeName: string;
};

export const DEMO_CLUSTER_WEAVERS: DemoWeaverProfile[] = [
  {
    id: "weaver-demo-001",
    name: "Kavita",
    givenName: "Kavita",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    district: "Kanchipuram",
    categories: ["cotton saree", "silk saree", "cotton lungi"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-002",
    name: "Selvi",
    givenName: "Selvi",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    district: "Madurai",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-003",
    name: "Kamala",
    givenName: "Kamala",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    district: "Salem",
    categories: ["silk saree", "dhoti / angavastram"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-004",
    name: "Lakshmi",
    givenName: "Lakshmi",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    district: "Erode",
    categories: ["stole / dupatta", "dhoti / angavastram", "cotton saree"],
    cooperativeName: DEMO_CLUSTER.name,
  },
];

/** Primary demo weaver (Home / Money shell). */
export const DEMO_WEAVER_PROFILE = DEMO_CLUSTER_WEAVERS[0];

export const DEMO_BUYERS = [
  {
    id: "buyer-demo-001",
    name: "Saffron Thread Boutique",
    shortName: "Saffron Thread Boutique",
    region: DEMO_CLUSTER.region,
    district: "Kanchipuram",
    email: "saffron@demo.loom",
    phone: "9840010001",
    businessType: "Festival retail boutique",
    focus: "Cotton & silk sarees for walk-in festive shoppers near Kanchipuram",
    typicalOrder: "10–25 pieces per post",
    city: "Kanchipuram",
    simulatedNote: "",
  },
  {
    id: "buyer-demo-002",
    name: "Festival Cloth Desk",
    shortName: "Festival Cloth Desk",
    region: DEMO_CLUSTER.region,
    district: "Madurai",
    email: "festival@demo.loom",
    phone: "9840010002",
    businessType: "Seasonal wholesale desk",
    focus: "Bulk cotton sarees ahead of festival windows across Tamil Nadu",
    typicalOrder: "8–40 pieces per post",
    city: "Madurai",
    simulatedNote: "",
  },
  {
    id: "buyer-demo-003",
    name: "Loom Link Resellers",
    shortName: "Loom Link Resellers",
    region: DEMO_CLUSTER.region,
    district: "Salem",
    email: "loomlink@demo.loom",
    phone: "9840010003",
    businessType: "Online reseller aggregator",
    focus: "Stoles / dupattas and ready gift sets for South Indian buyers",
    typicalOrder: "15–30 pieces per post",
    city: "Salem",
    simulatedNote: "",
  },
] as const;

/**
 * Narrative bootstrap plan — not a feature to build.
 * Answers: what does weaver #1 see with no history?
 */
export const BOOTSTRAP_PLAN_NOTE =
  "Before LoomOS has enough live settlements, the first buyer requirements are sourced by hand around Kanchipuram / Tamil Nadu — calls, co-op visits, WhatsApp — and entered so weaver #1 still gets a useful Buyer Signal.";

export const DEMO_MODE_BANNER_TEXT = "";
