/**
 * Approximate lat/lng for Indian handloom hubs (demo map — not surveyed GPS).
 * Used for nationwide / district cluster heatmaps.
 */

export type HubCoord = { lat: number; lng: number };

/** State capitals / geographic centers for nationwide zoom. */
export const STATE_GEO: Record<string, HubCoord> = {
  "Andhra Pradesh": { lat: 15.9129, lng: 79.74 },
  Assam: { lat: 26.2006, lng: 92.9376 },
  "Arunachal Pradesh": { lat: 28.218, lng: 94.7278 },
  Bihar: { lat: 25.0961, lng: 85.3131 },
  Chhattisgarh: { lat: 21.2787, lng: 81.8661 },
  Goa: { lat: 15.2993, lng: 74.124 },
  Gujarat: { lat: 22.2587, lng: 71.1924 },
  Haryana: { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  Jharkhand: { lat: 23.6102, lng: 85.2799 },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 },
  Karnataka: { lat: 15.3173, lng: 75.7139 },
  Kerala: { lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  Maharashtra: { lat: 19.7515, lng: 75.7139 },
  Manipur: { lat: 24.6637, lng: 93.9063 },
  Meghalaya: { lat: 25.467, lng: 91.3662 },
  Mizoram: { lat: 23.1645, lng: 92.9376 },
  Nagaland: { lat: 26.1584, lng: 94.5624 },
  Odisha: { lat: 20.9517, lng: 85.0985 },
  Punjab: { lat: 31.1471, lng: 75.3412 },
  Rajasthan: { lat: 27.0238, lng: 74.2179 },
  Sikkim: { lat: 27.533, lng: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  Telangana: { lat: 18.1124, lng: 79.0193 },
  Tripura: { lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  Uttarakhand: { lat: 30.0668, lng: 79.0193 },
  "West Bengal": { lat: 22.9868, lng: 87.855 },
  /** NCT — primary demand geography; center near IIT Delhi / South Delhi */
  Delhi: { lat: 28.5454, lng: 77.1926 },
};

/** District / town hubs used in register dropdowns. */
export const DISTRICT_GEO: Record<string, HubCoord> = {
  // Andhra Pradesh
  Mangalagiri: { lat: 16.4308, lng: 80.5685 },
  Uppada: { lat: 17.078, lng: 82.38 },
  Dharmavaram: { lat: 14.4144, lng: 77.7203 },
  Venkatagiri: { lat: 13.9604, lng: 79.5833 },
  Chirala: { lat: 15.8246, lng: 80.352 },
  Narayanpet: { lat: 16.748, lng: 77.495 },
  "Pochampally Border": { lat: 17.38, lng: 78.92 },
  Srikakulam: { lat: 18.2969, lng: 83.896 },
  Vizianagaram: { lat: 18.1067, lng: 83.3956 },
  // Assam
  Sualkuchi: { lat: 26.168, lng: 91.571 },
  Barpeta: { lat: 26.322, lng: 91.006 },
  Nagaon: { lat: 26.346, lng: 92.684 },
  Jorhat: { lat: 26.75, lng: 94.203 },
  Dhemaji: { lat: 27.483, lng: 94.583 },
  // Arunachal / small
  Itanagar: { lat: 27.0844, lng: 93.6053 },
  // Bihar
  Bhagalpur: { lat: 25.2425, lng: 86.9842 },
  Madhubani: { lat: 26.368, lng: 86.077 },
  Gaya: { lat: 24.796, lng: 85.007 },
  Nalanda: { lat: 25.136, lng: 85.444 },
  // Chhattisgarh
  Bastar: { lat: 19.107, lng: 81.953 },
  Raigarh: { lat: 21.897, lng: 83.395 },
  // Goa
  Margao: { lat: 15.273, lng: 73.958 },
  // Gujarat
  Patan: { lat: 23.849, lng: 72.127 },
  Surendranagar: { lat: 22.72, lng: 71.636 },
  Jamnagar: { lat: 22.4707, lng: 70.0577 },
  Kutch: { lat: 23.7337, lng: 69.8597 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  // Haryana / HP / JK
  Panipat: { lat: 29.3909, lng: 76.9635 },
  Kullu: { lat: 31.9578, lng: 77.1095 },
  Srinagar: { lat: 34.0837, lng: 74.7973 },
  Baramulla: { lat: 34.209, lng: 74.343 },
  // Jharkhand
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Dumka: { lat: 24.268, lng: 87.249 },
  // Karnataka
  Ilkal: { lat: 15.959, lng: 76.11 },
  Molakalmuru: { lat: 14.72, lng: 76.74 },
  Guledgudda: { lat: 16.05, lng: 75.8 },
  Gadag: { lat: 15.431, lng: 75.635 },
  Hubballi: { lat: 15.3647, lng: 75.124 },
  "Bengaluru Rural": { lat: 13.2846, lng: 77.596 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Dharwad: { lat: 15.4589, lng: 75.0078 },
  Belagavi: { lat: 15.8497, lng: 74.4977 },
  // Kerala
  Balaramapuram: { lat: 8.426, lng: 77.042 },
  Kannur: { lat: 11.8745, lng: 75.3704 },
  Chendamangalam: { lat: 10.179, lng: 76.242 },
  Kasaragod: { lat: 12.4984, lng: 74.9896 },
  Kuthampully: { lat: 10.74, lng: 76.43 },
  // MP
  Chanderi: { lat: 24.713, lng: 78.138 },
  Maheshwar: { lat: 22.176, lng: 75.587 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Gwalior: { lat: 26.2183, lng: 78.1828 },
  // Maharashtra
  Paithan: { lat: 19.478, lng: 75.385 },
  Solapur: { lat: 17.6599, lng: 75.9064 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Yeola: { lat: 20.042, lng: 74.489 },
  Aurangabad: { lat: 19.8762, lng: 75.3433 },
  // NE capitals
  Imphal: { lat: 24.817, lng: 93.9368 },
  Shillong: { lat: 25.5788, lng: 91.8933 },
  Aizawl: { lat: 23.7271, lng: 92.7176 },
  Kohima: { lat: 25.6751, lng: 94.1086 },
  // Odisha
  Sambalpur: { lat: 21.4669, lng: 83.9812 },
  Nuapatna: { lat: 20.42, lng: 85.58 },
  Berhampur: { lat: 19.315, lng: 84.794 },
  Sonepur: { lat: 20.84, lng: 83.92 },
  Bargarh: { lat: 21.333, lng: 83.616 },
  Cuttack: { lat: 20.4625, lng: 85.883 },
  // Punjab
  Patiala: { lat: 30.3398, lng: 76.3869 },
  Amritsar: { lat: 31.634, lng: 74.8723 },
  // Rajasthan
  Kota: { lat: 25.2138, lng: 75.8648 },
  Bagru: { lat: 26.81, lng: 75.55 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Barmer: { lat: 25.752, lng: 71.396 },
  Jodhpur: { lat: 26.2389, lng: 73.0243 },
  // Sikkim
  Gangtok: { lat: 27.3389, lng: 88.6065 },
  // Tamil Nadu
  Kanchipuram: { lat: 12.8342, lng: 79.7036 },
  Salem: { lat: 11.6643, lng: 78.146 },
  Erode: { lat: 11.341, lng: 77.7172 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Chennimalai: { lat: 11.168, lng: 77.605 },
  Paramakudi: { lat: 9.546, lng: 78.59 },
  Arani: { lat: 12.67, lng: 79.285 },
  Kumbakonam: { lat: 10.9617, lng: 79.3881 },
  Thanjavur: { lat: 10.787, lng: 79.1378 },
  Tirubhuvanam: { lat: 10.99, lng: 79.43 },
  Karaikudi: { lat: 10.073, lng: 78.773 },
  Nagapattinam: { lat: 10.7672, lng: 79.8449 },
  Tirunelveli: { lat: 8.7139, lng: 77.7567 },
  Virudhunagar: { lat: 9.568, lng: 77.9624 },
  Dindigul: { lat: 10.3673, lng: 77.9803 },
  Karur: { lat: 10.9601, lng: 78.0766 },
  // Telangana
  Pochampally: { lat: 17.3805, lng: 78.912 },
  Gadwal: { lat: 16.23, lng: 77.8 },
  Siddipet: { lat: 18.102, lng: 78.852 },
  Karimnagar: { lat: 18.4386, lng: 79.1288 },
  Warangal: { lat: 17.9689, lng: 79.5941 },
  Nalgonda: { lat: 17.0575, lng: 79.267 },
  // Tripura
  Agartala: { lat: 23.8315, lng: 91.2868 },
  // UP
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Mau: { lat: 25.9417, lng: 83.5611 },
  Tanda: { lat: 26.55, lng: 82.66 },
  Mubarakpur: { lat: 26.09, lng: 83.29 },
  Meerut: { lat: 28.9845, lng: 77.7064 },
  Barabanki: { lat: 26.94, lng: 81.19 },
  // Uttarakhand
  Almora: { lat: 29.5892, lng: 79.6467 },
  // West Bengal
  Shantipur: { lat: 23.248, lng: 88.432 },
  Phulia: { lat: 23.23, lng: 88.48 },
  Bishnupur: { lat: 23.075, lng: 87.32 },
  Murshidabad: { lat: 24.175, lng: 88.28 },
  Baluchari: { lat: 23.24, lng: 88.43 },
  Nadia: { lat: 23.47, lng: 88.56 },
  Hooghly: { lat: 22.9, lng: 88.39 },
  // Delhi NCT — IIT Delhi is the primary pitch pin
  "IIT Delhi": { lat: 28.5454, lng: 77.1926 },
  "South Delhi": { lat: 28.5245, lng: 77.2066 },
  "Hauz Khas": { lat: 28.5494, lng: 77.2001 },
  Saket: { lat: 28.5244, lng: 77.2065 },
  "New Delhi": { lat: 28.6139, lng: 77.209 },
  "South East Delhi": { lat: 28.5621, lng: 77.2505 },
  "Central Delhi": { lat: 28.6448, lng: 77.2167 },
  "Karol Bagh": { lat: 28.6517, lng: 77.1909 },
  "Chandni Chowk": { lat: 28.6506, lng: 77.2303 },
  "East Delhi": { lat: 28.628, lng: 77.295 },
  "West Delhi": { lat: 28.6663, lng: 77.068 },
  "North Delhi": { lat: 28.7041, lng: 77.1025 },
  "North West Delhi": { lat: 28.7186, lng: 77.068 },
  "South West Delhi": { lat: 28.5324, lng: 77.088 },
  Shahdara: { lat: 28.673, lng: 77.289 },
};

export const INDIA_MAP_CENTER: HubCoord = { lat: 22.5, lng: 82.0 };
export const INDIA_MAP_ZOOM = 5;
export const STATE_ZOOM = 7;
/** Tight zoom for district / primary micro-hub view */
export const DISTRICT_ZOOM = 12;
/** Delhi NCT overview (between district and full state zoom) */
export const DELHI_STATE_ZOOM = 11;

/** Primary LoomOS map cluster pin — Kanchipuram */
export const PRIMARY_DEMAND = {
  region: "Tamil Nadu",
  district: "Kanchipuram",
  lat: 12.8342,
  lng: 79.7036,
} as const;

/** Micro-hubs treated as one primary Tamil Nadu cluster on the map */
export const IIT_CLUSTER = new Set([
  "kanchipuram",
  "madurai",
  "salem",
  "erode",
]);

export function isIitClusterDistrict(district: string): boolean {
  return IIT_CLUSTER.has(district.trim().toLowerCase());
}

export function jitterAround(
  hub: HubCoord,
  seed: string,
  radiusDeg = 0.045,
): HubCoord {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = ((h % 360) * Math.PI) / 180;
  const r = ((h % 1000) / 1000) * radiusDeg;
  return {
    lat: hub.lat + Math.sin(a) * r,
    lng: hub.lng + Math.cos(a) * r,
  };
}

export function resolveHub(
  state: string,
  district?: string | null,
): HubCoord {
  if (district && DISTRICT_GEO[district]) return DISTRICT_GEO[district]!;
  if (STATE_GEO[state]) return STATE_GEO[state]!;
  return INDIA_MAP_CENTER;
}
