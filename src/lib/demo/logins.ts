/**
 * Pitch demo weavers — each phone unlocks a full app story
 * (orders, earnings, plan, advice). Primary craft geography: Tamil Nadu / Kanchipuram.
 */

export const DEMO_OTP_CODE = "123456";

export type DemoWeaverLogin = {
  phone: string;
  weaverId: string;
  userId: string;
  givenName: string;
  name: string;
  blurb: string;
  primaryLanguage: "ta" | "te" | "kn" | "hi";
  categories: string[];
  region: string;
  district: string;
};

export const DEMO_WEAVER_LOGINS: DemoWeaverLogin[] = [
  {
    phone: "9876543210",
    weaverId: "weaver-demo-001",
    userId: "user-weaver-001",
    givenName: "Kavita",
    name: "Kavita",
    blurb: "South Indian · high drift ≥90% · cotton & silk · Kanchipuram",
    primaryLanguage: "ta",
    categories: [
      "cotton saree",
      "silk saree",
      "cotton lungi",
      "district:Kanchipuram",
    ],
    region: "Tamil Nadu",
    district: "Kanchipuram",
  },
  {
    phone: "9876543211",
    weaverId: "weaver-demo-002",
    userId: "user-weaver-002",
    givenName: "Selvi",
    name: "Selvi",
    blurb: "South Indian · low drift ~70% · think carefully · Madurai",
    primaryLanguage: "ta",
    categories: ["cotton saree", "stole / dupatta", "district:Madurai"],
    region: "Tamil Nadu",
    district: "Madurai",
  },
  {
    phone: "9876543212",
    weaverId: "weaver-demo-003",
    userId: "user-weaver-003",
    givenName: "Kamala",
    name: "Kamala",
    blurb: "Dispatched silk · settlement projected · Salem",
    primaryLanguage: "ta",
    categories: ["silk saree", "dhoti / angavastram", "district:Salem"],
    region: "Tamil Nadu",
    district: "Salem",
  },
  {
    phone: "9876543213",
    weaverId: "weaver-demo-004",
    userId: "user-weaver-004",
    givenName: "Lakshmi",
    name: "Lakshmi",
    blurb: "Fresh pipeline · stoles & dhoti · Erode",
    primaryLanguage: "ta",
    categories: [
      "stole / dupatta",
      "dhoti / angavastram",
      "cotton saree",
      "district:Erode",
    ],
    region: "Tamil Nadu",
    district: "Erode",
  },
];
