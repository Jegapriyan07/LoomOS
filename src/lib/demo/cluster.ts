/**
 * Stage 10 — Day-one bootstrap / Demo Mode.
 *
 * ONE fictional demo cluster only. Not a real cooperative, not real people,
 * not live ledger numbers. General craft-tradition flavor (Kanchipuram-style
 * silk/cotton circle) is intentional; do not pin invented figures to a real
 * organization's name.
 */

export const DEMO_MODE = true;

/** Invented co-op name for the hackathon shell — fictional. */
export const DEMO_CLUSTER = {
  id: "demo-cluster-nila",
  name: "Nila Loom Circle (Demo Cluster)",
  shortName: "Nila Loom Circle",
  /** Craft-tradition flavor only — not a claim about any real Kanchipuram co-op */
  flavor:
    "Fictional Kanchipuram-style silk-and-cotton weaving circle in Tamil Nadu, invented for this prototype.",
  region: "Tamil Nadu",
  disclaimer:
    "Demo Mode — fictional seed cluster. Not a real cooperative, not live data, not attributed to any real organization or person.",
} as const;

/**
 * Illustrative concurrent-order capacity per weaver (Demo Mode default).
 * Not researched production capacity — cooperatives should replace.
 * Utilization numerator = Stage 4 pipeline orders still open in this app.
 */
export const ILLUSTRATIVE_MAX_CONCURRENT_ORDERS = 3;

export const ILLUSTRATIVE_CAPACITY_NOTE =
  `Denominator is an illustrative Demo Mode default of ${ILLUSTRATIVE_MAX_CONCURRENT_ORDERS} concurrent orders per weaver — not verified loom capacity. Numerator = Stage 4 orders still in the pipeline in this app (not Settlement Released / Resolved).`;

export type DemoWeaverProfile = {
  id: string;
  name: string;
  givenName: string;
  primaryLanguage: "ta" | "te" | "kn" | "hi";
  region: string;
  categories: string[];
  cooperativeName: string;
};

export const DEMO_CLUSTER_WEAVERS: DemoWeaverProfile[] = [
  {
    id: "weaver-demo-001",
    name: "Meena (demo weaver — fictional)",
    givenName: "Meena",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    categories: ["cotton saree", "silk saree", "cotton lungi"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-002",
    name: "Selvi (demo weaver — fictional)",
    givenName: "Selvi",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    categories: ["cotton saree", "stole / dupatta"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-003",
    name: "Kamala (demo weaver — fictional)",
    givenName: "Kamala",
    primaryLanguage: "ta",
    region: DEMO_CLUSTER.region,
    categories: ["silk saree", "dhoti / angavastram"],
    cooperativeName: DEMO_CLUSTER.name,
  },
  {
    id: "weaver-demo-004",
    name: "Lakshmi (demo weaver — fictional)",
    givenName: "Lakshmi",
    primaryLanguage: "hi",
    region: DEMO_CLUSTER.region,
    categories: ["stole / dupatta", "dhoti / angavastram", "cotton saree"],
    cooperativeName: DEMO_CLUSTER.name,
  },
];

/** Primary demo weaver (Home / Money shell). */
export const DEMO_WEAVER_PROFILE = DEMO_CLUSTER_WEAVERS[0];

export const DEMO_BUYERS = [
  {
    id: "buyer-demo-001",
    name: "Saffron Thread Boutique (demo — fictional)",
    shortName: "Saffron Thread Boutique",
    region: DEMO_CLUSTER.region,
    email: "saffron@demo.loom",
    phone: "9100000001",
    businessType: "Festival retail boutique",
    focus: "Cotton & silk sarees for walk-in festive shoppers",
    typicalOrder: "10–25 pieces per post",
    city: "Kanchipuram (demo)",
    simulatedNote:
      "Simulated buyer desk — invented for Nila Loom Circle demos. Not a real shop.",
  },
  {
    id: "buyer-demo-002",
    name: "Festival Cloth Desk (demo — fictional)",
    shortName: "Festival Cloth Desk",
    region: DEMO_CLUSTER.region,
    email: "festival@demo.loom",
    phone: "9100000002",
    businessType: "Seasonal wholesale desk",
    focus: "Bulk cotton sarees ahead of festival windows",
    typicalOrder: "8–40 pieces per post",
    city: "Chennai (demo)",
    simulatedNote:
      "Simulated buyer desk — invented for Nila Loom Circle demos. Not a real wholesaler.",
  },
  {
    id: "buyer-demo-003",
    name: "Loom Link Resellers (demo — fictional)",
    shortName: "Loom Link Resellers",
    region: DEMO_CLUSTER.region,
    email: "loomlink@demo.loom",
    phone: "9100000003",
    businessType: "Online reseller aggregator",
    focus: "Stoles / dupattas and ready gift sets",
    typicalOrder: "15–30 pieces per post",
    city: "Coimbatore (demo)",
    simulatedNote:
      "Simulated buyer desk — third fictional buyer so the portal never looks empty.",
  },
] as const;

/**
 * Narrative bootstrap plan — not a feature to build.
 * Answers: what does weaver #1 see with no history?
 */
export const BOOTSTRAP_PLAN_NOTE =
  "Day-one bootstrap (real plan, not this seed): before LoomOS has enough live settlements, the team manually sources the first handful of real buyer requirements by hand — calls, co-op visits, WhatsApp — and enters them so weaver #1 still gets a useful Buyer Signal. The Nila Loom Circle data in this app is only a fictional practice cluster so judges can click through empty-history edges; it is not a live co-op’s books.";

export const DEMO_MODE_BANNER_TEXT =
  "Demo Mode — fictional seed data (Nila Loom Circle). Not live. Not a real cooperative.";
