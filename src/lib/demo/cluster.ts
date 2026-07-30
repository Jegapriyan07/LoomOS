/**
 * Stage 10 — Day-one bootstrap / Demo Mode.
 *
 * ONE fictional demo cluster only. Not a real cooperative, not real people,
 * not live ledger numbers. Primary map cluster is Delhi NCT around
 * IIT Delhi — craft tradition may still reference classic handloom styles.
 */

export const DEMO_MODE = true;

/** Invented co-op name for the hackathon shell — fictional. */
export const DEMO_CLUSTER = {
  id: "demo-cluster-delhi",
  name: "Yamuna Loom Desk",
  shortName: "Yamuna Loom Desk",
  /** Primary map cluster — IIT Delhi → Delhi NCT → nation */
  flavor:
    "Delhi NCT handloom cluster centered on IIT Delhi and South Delhi retail.",
  region: "Delhi",
  district: "IIT Delhi",
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
    primaryLanguage: "hi",
    region: DEMO_CLUSTER.region,
    district: "IIT Delhi",
    categories: ["cotton saree", "silk saree", "cotton lungi"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-002",
    name: "Selvi",
    givenName: "Selvi",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    district: "South Delhi",
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-003",
    name: "Kamala",
    givenName: "Kamala",
    primaryLanguage: "hi",
    region: DEMO_CLUSTER.region,
    district: "Hauz Khas",
    categories: ["silk saree", "dhoti / angavastram"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-004",
    name: "Lakshmi",
    givenName: "Lakshmi",
    primaryLanguage: "hi",
    region: DEMO_CLUSTER.region,
    district: "Saket",
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
    district: "IIT Delhi",
    email: "saffron@demo.loom",
    phone: "9840010001",
    businessType: "Festival retail boutique",
    focus: "Cotton & silk sarees for walk-in festive shoppers near IIT Delhi",
    typicalOrder: "10–25 pieces per post",
    city: "South Delhi",
    simulatedNote: "",
  },
  {
    id: "buyer-demo-002",
    name: "Festival Cloth Desk",
    shortName: "Festival Cloth Desk",
    region: DEMO_CLUSTER.region,
    district: "Hauz Khas",
    email: "festival@demo.loom",
    phone: "9840010002",
    businessType: "Seasonal wholesale desk",
    focus: "Bulk cotton sarees ahead of festival windows across South Delhi",
    typicalOrder: "8–40 pieces per post",
    city: "Hauz Khas",
    simulatedNote: "",
  },
  {
    id: "buyer-demo-003",
    name: "Loom Link Resellers",
    shortName: "Loom Link Resellers",
    region: DEMO_CLUSTER.region,
    district: "Karol Bagh",
    email: "loomlink@demo.loom",
    phone: "9840010003",
    businessType: "Online reseller aggregator",
    focus: "Stoles / dupattas and ready gift sets for Delhi buyers",
    typicalOrder: "15–30 pieces per post",
    city: "Karol Bagh",
    simulatedNote: "",
  },
] as const;

/**
 * Narrative bootstrap plan — not a feature to build.
 * Answers: what does weaver #1 see with no history?
 */
export const BOOTSTRAP_PLAN_NOTE =
  "Before LoomOS has enough live settlements, the first buyer requirements are sourced by hand around IIT Delhi / South Delhi — calls, co-op visits, WhatsApp — and entered so weaver #1 still gets a useful Buyer Signal.";

export const DEMO_MODE_BANNER_TEXT = "";
