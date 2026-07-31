/**
 * Indian handloom states + weaving clusters for register dropdowns.
 * Cooperative society name = selected cluster name (1:1).
 */

export type DemoCoopSeed = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  sector: string;
  flavor: string;
  disclaimer: string;
};

/**
 * Handloom clusters by state — State + Cluster dropdowns on Register.
 * Cooperative society is named after the selected cluster.
 */
export const STATE_CLUSTERS: Record<string, string[]> = {
  "Tamil Nadu": [
    "Kanchipuram",
    "Salem",
    "Erode",
    "Coimbatore",
    "Madurai",
    "Chennimalai",
    "Paramakudi",
    "Arani",
    "Kumbakonam",
    "Thanjavur",
    "Tirubhuvanam",
    "Karaikudi",
    "Nagapattinam",
    "Tirunelveli",
    "Virudhunagar",
    "Dindigul",
    "Karur",
  ],
  Karnataka: [
    "Ilkal",
    "Molakalmuru",
    "Guledgudda",
    "Gadag",
    "Hubballi",
    "Bengaluru Rural",
    "Mysuru",
    "Udupi",
    "Dharwad",
    "Belagavi",
  ],
  "Andhra Pradesh": [
    "Mangalagiri",
    "Uppada",
    "Dharmavaram",
    "Venkatagiri",
    "Chirala",
    "Narayanpet",
    "Pochampally Border",
    "Srikakulam",
    "Vizianagaram",
  ],
  Telangana: [
    "Pochampally",
    "Gadwal",
    "Narayanpet",
    "Siddipet",
    "Karimnagar",
    "Warangal",
    "Nalgonda",
  ],
  Kerala: [
    "Balaramapuram",
    "Kannur",
    "Chendamangalam",
    "Kasaragod",
    "Kuthampully",
  ],
  Odisha: [
    "Sambalpur",
    "Nuapatna",
    "Berhampur",
    "Sonepur",
    "Bargarh",
    "Cuttack",
  ],
  "West Bengal": [
    "Shantipur",
    "Phulia",
    "Bishnupur",
    "Murshidabad",
    "Baluchari",
    "Nadia",
    "Hooghly",
  ],
  Assam: ["Sualkuchi", "Barpeta", "Nagaon", "Jorhat", "Dhemaji"],
  Bihar: ["Bhagalpur", "Madhubani", "Gaya", "Nalanda"],
  "Uttar Pradesh": [
    "Varanasi",
    "Mau",
    "Tanda",
    "Mubarakpur",
    "Meerut",
    "Barabanki",
  ],
  "Madhya Pradesh": ["Chanderi", "Maheshwar", "Bhopal", "Gwalior"],
  Gujarat: ["Patan", "Surendranagar", "Jamnagar", "Kutch", "Ahmedabad"],
  Rajasthan: ["Kota", "Bagru", "Jaipur", "Barmer", "Jodhpur"],
  Maharashtra: ["Paithan", "Solapur", "Nagpur", "Yeola", "Aurangabad"],
  Punjab: ["Patiala", "Amritsar"],
  Haryana: ["Panipat"],
  "Himachal Pradesh": ["Kullu"],
  "Jammu and Kashmir": ["Srinagar", "Baramulla"],
  Uttarakhand: ["Almora"],
  Chhattisgarh: ["Bastar", "Raigarh"],
  Jharkhand: ["Ranchi", "Dumka"],
  Goa: ["Margao"],
  /** North-East Special */
  Tripura: ["Agartala"],
  Manipur: ["Imphal"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima"],
  "Arunachal Pradesh": ["Itanagar"],
  Meghalaya: ["Shillong"],
  Sikkim: ["Gangtok"],
  /**
   * Delhi NCT — primary LoomOS demand geography (pitch around IIT Delhi).
   * Kept for demo seed weavers / map focus.
   */
  Delhi: [
    "IIT Delhi",
    "South Delhi",
    "Hauz Khas",
    "Saket",
    "New Delhi",
    "South East Delhi",
    "Central Delhi",
    "Karol Bagh",
    "Chandni Chowk",
    "East Delhi",
    "West Delhi",
    "North Delhi",
    "North West Delhi",
    "South West Delhi",
    "Shahdara",
  ],
};

/** @deprecated use STATE_CLUSTERS — kept for map / festival imports */
export const STATE_DISTRICTS = STATE_CLUSTERS;

/** Stable sorted list for the State dropdown. */
export const INDIA_STATES: string[] = Object.keys(STATE_CLUSTERS).sort(
  (a, b) => a.localeCompare(b),
);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Stable coop id per state+cluster (Narayanpet exists in AP and Telangana). */
export function coopIdForCluster(state: string, cluster: string): string {
  if (state === "Delhi" && cluster === "IIT Delhi") {
    return "demo-cluster-delhi";
  }
  return `cluster-${slugify(state)}-${slugify(cluster)}`;
}

function buildClusterCoop(state: string, cluster: string): DemoCoopSeed {
  return {
    id: coopIdForCluster(state, cluster),
    name: cluster,
    shortName: cluster,
    region: state,
    sector: "Handloom weaving cluster",
    flavor: `${cluster} handloom cooperative society in ${state}.`,
    disclaimer: "",
  };
}

/** One cooperative society per cluster — society name matches cluster name. */
export const DEMO_COOPS: DemoCoopSeed[] = [
  ...Object.entries(STATE_CLUSTERS).flatMap(([state, clusters]) =>
    clusters.map((cluster) => buildClusterCoop(state, cluster)),
  ),
  {
    id: "demo-cluster-national",
    name: "National Handloom Desk",
    shortName: "National Desk",
    region: "India",
    sector: "Mixed handloom (general)",
    flavor:
      "Fallback desk when a state does not have its own seeded cluster.",
    disclaimer: "",
  },
];

export const DEFAULT_COOP_ID = "cluster-tamil-nadu-kanchipuram";

export type CoopAssignment = {
  cooperativeId: string;
  cooperativeName: string;
  shortName: string;
  sector: string;
  region: string;
  district: string;
  disclaimer: string;
};

const STATE_ALIASES: Record<string, string> = {
  "jammu & kashmir": "Jammu and Kashmir",
  "jammu and kashmir": "Jammu and Kashmir",
  "j&k": "Jammu and Kashmir",
  orissa: "Odisha",
  tamilnadu: "Tamil Nadu",
  "west bengal": "West Bengal",
  "new delhi": "Delhi",
  "delhi nct": "Delhi",
  "nct of delhi": "Delhi",
  "nct delhi": "Delhi",
};

export function normalizeState(raw: string): string {
  const cleaned = raw.trim();
  const alias = STATE_ALIASES[cleaned.toLowerCase()];
  if (alias) return alias;
  const hit = INDIA_STATES.find(
    (s) => s.toLowerCase() === cleaned.toLowerCase(),
  );
  return hit ?? cleaned;
}

/** Clusters available for a state (register Cluster dropdown). */
export function clustersForState(stateRaw: string): string[] {
  const state = normalizeState(stateRaw);
  return STATE_CLUSTERS[state] ?? [];
}

/** @deprecated use clustersForState */
export function districtsForState(stateRaw: string): string[] {
  return clustersForState(stateRaw);
}

export function normalizeCluster(
  stateRaw: string,
  clusterRaw: string,
): string {
  const clusters = clustersForState(stateRaw);
  const cleaned = clusterRaw.trim();
  if (!cleaned) return clusters[0] ?? "";
  const hit = clusters.find(
    (c) => c.toLowerCase() === cleaned.toLowerCase(),
  );
  return hit ?? cleaned;
}

/** @deprecated use normalizeCluster */
export function normalizeDistrict(
  stateRaw: string,
  districtRaw: string,
): string {
  return normalizeCluster(stateRaw, districtRaw);
}

function assignmentFromCoop(
  coop: DemoCoopSeed,
  state: string,
  cluster: string,
): CoopAssignment {
  return {
    cooperativeId: coop.id,
    cooperativeName: coop.name,
    shortName: coop.shortName,
    sector: coop.sector,
    region: state || coop.region,
    district: cluster,
    disclaimer: coop.disclaimer,
  };
}

function findCoop(id: string): DemoCoopSeed {
  return (
    DEMO_COOPS.find((c) => c.id === id) ??
    DEMO_COOPS.find((c) => c.id === DEFAULT_COOP_ID)!
  );
}

/** Assign cooperative society from selected state + cluster (names match). */
export function coopForLocation(
  stateRaw: string,
  clusterRaw = "",
): CoopAssignment {
  const state = normalizeState(stateRaw);
  const cluster = normalizeCluster(state, clusterRaw);
  if (!cluster) {
    return assignmentFromCoop(findCoop("demo-cluster-national"), state, "");
  }
  const id = coopIdForCluster(state, cluster);
  const known = DEMO_COOPS.find((c) => c.id === id);
  if (known) return assignmentFromCoop(known, state, cluster);
  return assignmentFromCoop(buildClusterCoop(state, cluster), state, cluster);
}

/** @deprecated use coopForLocation — kept for existing imports */
export function coopForState(stateRaw: string): CoopAssignment {
  return coopForLocation(stateRaw, "");
}
