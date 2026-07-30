/**
 * Indian handloom states + weaving districts / towns for register dropdowns.
 * Cooperative / sector is auto-assigned from selected state (+ district).
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
 * Handloom hubs by state — used for State + District dropdowns on Register.
 * Order within each list matches the pitch source list.
 */
export const STATE_DISTRICTS: Record<string, string[]> = {
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
  Assam: ["Sualkuchi", "Barpeta", "Nagaon", "Jorhat", "Dhemaji"],
  "Arunachal Pradesh": ["Itanagar"],
  Bihar: ["Bhagalpur", "Madhubani", "Gaya", "Nalanda"],
  Chhattisgarh: ["Bastar", "Raigarh"],
  Goa: ["Margao"],
  Gujarat: ["Patan", "Surendranagar", "Jamnagar", "Kutch", "Ahmedabad"],
  Haryana: ["Panipat"],
  "Himachal Pradesh": ["Kullu"],
  Jharkhand: ["Ranchi", "Dumka"],
  "Jammu and Kashmir": ["Srinagar", "Baramulla"],
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
  Kerala: [
    "Balaramapuram",
    "Kannur",
    "Chendamangalam",
    "Kasaragod",
    "Kuthampully",
  ],
  "Madhya Pradesh": ["Chanderi", "Maheshwar", "Bhopal", "Gwalior"],
  Maharashtra: ["Paithan", "Solapur", "Nagpur", "Yeola", "Aurangabad"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima"],
  Odisha: [
    "Sambalpur",
    "Nuapatna",
    "Berhampur",
    "Sonepur",
    "Bargarh",
    "Cuttack",
  ],
  Punjab: ["Patiala", "Amritsar"],
  Rajasthan: ["Kota", "Bagru", "Jaipur", "Barmer", "Jodhpur"],
  Sikkim: ["Gangtok"],
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
  Telangana: [
    "Pochampally",
    "Gadwal",
    "Narayanpet",
    "Siddipet",
    "Karimnagar",
    "Warangal",
    "Nalgonda",
  ],
  Tripura: ["Agartala"],
  "Uttar Pradesh": [
    "Varanasi",
    "Mau",
    "Tanda",
    "Mubarakpur",
    "Meerut",
    "Barabanki",
  ],
  Uttarakhand: ["Almora"],
  "West Bengal": [
    "Shantipur",
    "Phulia",
    "Bishnupur",
    "Murshidabad",
    "Baluchari",
    "Nadia",
    "Hooghly",
  ],
  /**
   * Delhi NCT — primary LoomOS demand geography (pitch around IIT Delhi).
   * First hub is the micro-location; remaining are NCT districts / retail belts.
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

/** Stable sorted list for the State dropdown (from STATE_DISTRICTS keys). */
export const INDIA_STATES: string[] = Object.keys(STATE_DISTRICTS).sort(
  (a, b) => a.localeCompare(b),
);

export const DEMO_COOPS: DemoCoopSeed[] = [
  {
    id: "demo-cluster-nila",
    name: "Nila Loom Circle",
    shortName: "Nila Loom Circle",
    region: "Tamil Nadu",
    sector: "Silk & cotton handloom",
    flavor:
      "Kanchipuram-style silk-and-cotton weaving circle in Tamil Nadu.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-godavari",
    name: "Godavari Thread Circle",
    shortName: "Godavari Thread Circle",
    region: "Andhra Pradesh",
    sector: "Cotton & ikat handloom",
    flavor: "Coastal Andhra cotton and ikat weaving circle.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-mysore",
    name: "Mysore Loom Collective",
    shortName: "Mysore Loom Collective",
    region: "Karnataka",
    sector: "Silk & cotton handloom",
    flavor: "Karnataka silk-and-cotton weaving collective.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-telangana",
    name: "Deccan Handloom Desk",
    shortName: "Deccan Handloom Desk",
    region: "Telangana",
    sector: "Cotton handloom & tie-dye",
    flavor: "Telangana cotton handloom desk.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-bengal",
    name: "Ganga Weave Collective",
    shortName: "Ganga Weave Collective",
    region: "West Bengal",
    sector: "Fine cotton & jamdani-style handloom",
    flavor: "Bengal fine-cotton weaving collective.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-assam",
    name: "Brahmaputra Loom Circle",
    shortName: "Brahmaputra Loom Circle",
    region: "Assam",
    sector: "Eri / muga & cotton handloom",
    flavor: "Assam eri-muga and cotton weaving circle.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-up",
    name: "Ganga Plains Handloom",
    shortName: "Ganga Plains Handloom",
    region: "Uttar Pradesh",
    sector: "Banarasi-style silk & cotton",
    flavor: "UP silk-and-cotton handloom circle.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-odisha",
    name: "Kalinga Loom Circle",
    shortName: "Kalinga Loom Circle",
    region: "Odisha",
    sector: "Ikat & cotton handloom",
    flavor: "Odisha ikat and cotton weaving circle.",
    disclaimer:
      "",
  },
  {
    id: "demo-cluster-delhi",
    name: "Yamuna Loom Desk",
    shortName: "Yamuna Loom Desk",
    region: "Delhi",
    sector: "Handloom retail & festival demand",
    flavor:
      "Delhi NCT handloom cluster — primary map focus around IIT Delhi / South Delhi.",
    disclaimer: "",
  },
  {
    id: "demo-cluster-national",
    name: "National Handloom Desk",
    shortName: "National Desk",
    region: "India",
    sector: "Mixed handloom (general)",
    flavor:
      "Fallback desk when a state does not have its own seeded circle.",
    disclaimer:
      "",
  },
];

const STATE_TO_COOP_ID: Record<string, string> = {
  Delhi: "demo-cluster-delhi",
  Haryana: "demo-cluster-delhi",
  "Tamil Nadu": "demo-cluster-nila",
  Kerala: "demo-cluster-nila",
  "Andhra Pradesh": "demo-cluster-godavari",
  Telangana: "demo-cluster-telangana",
  Karnataka: "demo-cluster-mysore",
  Goa: "demo-cluster-mysore",
  Maharashtra: "demo-cluster-mysore",
  Gujarat: "demo-cluster-mysore",
  "West Bengal": "demo-cluster-bengal",
  Sikkim: "demo-cluster-bengal",
  Assam: "demo-cluster-assam",
  Meghalaya: "demo-cluster-assam",
  Manipur: "demo-cluster-assam",
  Mizoram: "demo-cluster-assam",
  Nagaland: "demo-cluster-assam",
  Tripura: "demo-cluster-assam",
  "Arunachal Pradesh": "demo-cluster-assam",
  "Uttar Pradesh": "demo-cluster-up",
  Uttarakhand: "demo-cluster-up",
  Bihar: "demo-cluster-up",
  Jharkhand: "demo-cluster-up",
  Punjab: "demo-cluster-up",
  "Himachal Pradesh": "demo-cluster-up",
  "Jammu and Kashmir": "demo-cluster-up",
  Rajasthan: "demo-cluster-up",
  Odisha: "demo-cluster-odisha",
  Chhattisgarh: "demo-cluster-odisha",
  "Madhya Pradesh": "demo-cluster-odisha",
};

/** District → preferred coop when a hub should override the state default. */
const DISTRICT_TO_COOP_ID: Record<string, string> = {
  // Delhi NCT — primary pitch around IIT Delhi
  "IIT Delhi": "demo-cluster-delhi",
  "South Delhi": "demo-cluster-delhi",
  "Hauz Khas": "demo-cluster-delhi",
  Saket: "demo-cluster-delhi",
  "New Delhi": "demo-cluster-delhi",
  "South East Delhi": "demo-cluster-delhi",
  "Central Delhi": "demo-cluster-delhi",
  "Karol Bagh": "demo-cluster-delhi",
  "Chandni Chowk": "demo-cluster-delhi",
  // Tamil Nadu silk / cotton hubs → Nila
  Kanchipuram: "demo-cluster-nila",
  Arani: "demo-cluster-nila",
  Kumbakonam: "demo-cluster-nila",
  Thanjavur: "demo-cluster-nila",
  Tirubhuvanam: "demo-cluster-nila",
  // AP coastal / ikat
  Mangalagiri: "demo-cluster-godavari",
  Uppada: "demo-cluster-godavari",
  Dharmavaram: "demo-cluster-godavari",
  Venkatagiri: "demo-cluster-godavari",
  Chirala: "demo-cluster-godavari",
  "Pochampally Border": "demo-cluster-godavari",
  // Telangana ikat
  Pochampally: "demo-cluster-telangana",
  Gadwal: "demo-cluster-telangana",
  // Karnataka
  Ilkal: "demo-cluster-mysore",
  Mysuru: "demo-cluster-mysore",
  Molakalmuru: "demo-cluster-mysore",
  // Bengal
  Shantipur: "demo-cluster-bengal",
  Phulia: "demo-cluster-bengal",
  Baluchari: "demo-cluster-bengal",
  Murshidabad: "demo-cluster-bengal",
  Bishnupur: "demo-cluster-bengal",
  // Assam
  Sualkuchi: "demo-cluster-assam",
  // UP Banaras belt
  Varanasi: "demo-cluster-up",
  Mau: "demo-cluster-up",
  Mubarakpur: "demo-cluster-up",
  // Odisha ikat
  Sambalpur: "demo-cluster-odisha",
  Nuapatna: "demo-cluster-odisha",
  Sonepur: "demo-cluster-odisha",
  Bargarh: "demo-cluster-odisha",
  // Chanderi / Maheshwar → Odisha circle is nearest demo desk for Central
  Chanderi: "demo-cluster-odisha",
  Maheshwar: "demo-cluster-odisha",
  // Maharashtra Paithani belt → Mysore circle (south/west demo)
  Paithan: "demo-cluster-mysore",
  Yeola: "demo-cluster-mysore",
  // Gujarat Patola belt
  Patan: "demo-cluster-mysore",
};

export const DEFAULT_COOP_ID = "demo-cluster-delhi";

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

export function districtsForState(stateRaw: string): string[] {
  const state = normalizeState(stateRaw);
  return STATE_DISTRICTS[state] ?? [];
}

export function normalizeDistrict(
  stateRaw: string,
  districtRaw: string,
): string {
  const districts = districtsForState(stateRaw);
  const cleaned = districtRaw.trim();
  if (!cleaned) return districts[0] ?? "";
  const hit = districts.find(
    (d) => d.toLowerCase() === cleaned.toLowerCase(),
  );
  return hit ?? cleaned;
}

function assignmentFromCoop(
  coop: DemoCoopSeed,
  state: string,
  district: string,
): CoopAssignment {
  return {
    cooperativeId: coop.id,
    cooperativeName: coop.name,
    shortName: coop.shortName,
    sector: coop.sector,
    region: state || coop.region,
    district,
    disclaimer: coop.disclaimer,
  };
}

function findCoop(id: string): DemoCoopSeed {
  return (
    DEMO_COOPS.find((c) => c.id === id) ??
    DEMO_COOPS.find((c) => c.id === DEFAULT_COOP_ID)!
  );
}

/** Prefer district hub mapping, then state, then national desk. */
export function coopForLocation(
  stateRaw: string,
  districtRaw = "",
): CoopAssignment {
  const state = normalizeState(stateRaw);
  const district = normalizeDistrict(state, districtRaw);
  const districtId = district
    ? DISTRICT_TO_COOP_ID[district]
    : undefined;
  const stateId = STATE_TO_COOP_ID[state];
  const id = districtId ?? stateId ?? "demo-cluster-national";
  return assignmentFromCoop(findCoop(id), state, district);
}

/** @deprecated use coopForLocation — kept for existing imports */
export function coopForState(stateRaw: string): CoopAssignment {
  return coopForLocation(stateRaw, "");
}
