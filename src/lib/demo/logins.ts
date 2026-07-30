/**
 * Pitch demo weavers — each phone unlocks a full app story
 * (orders, earnings, plan, advice). Primary geography: Delhi / IIT Delhi.
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
    blurb: "North Indian · high drift ≥90% · cotton & silk · IIT Delhi",
    primaryLanguage: "hi",
    categories: [
      "cotton saree",
      "silk saree",
      "cotton lungi",
      "district:IIT Delhi",
    ],
    region: "Delhi",
    district: "IIT Delhi",
  },
  {
    phone: "9876543211",
    weaverId: "weaver-demo-002",
    userId: "user-weaver-002",
    givenName: "Selvi",
    name: "Selvi",
    blurb: "South Indian · low drift ~70% · think carefully · South Delhi",
    primaryLanguage: "ta",
    categories: ["cotton saree", "stole / dupatta", "district:South Delhi"],
    region: "Delhi",
    district: "South Delhi",
  },
  {
    phone: "9876543212",
    weaverId: "weaver-demo-003",
    userId: "user-weaver-003",
    givenName: "Kamala",
    name: "Kamala",
    blurb: "Dispatched silk · settlement projected · Hauz Khas",
    primaryLanguage: "hi",
    categories: ["silk saree", "dhoti / angavastram", "district:Hauz Khas"],
    region: "Delhi",
    district: "Hauz Khas",
  },
  {
    phone: "9876543213",
    weaverId: "weaver-demo-004",
    userId: "user-weaver-004",
    givenName: "Lakshmi",
    name: "Lakshmi",
    blurb: "Fresh pipeline · stoles & dhoti · Saket",
    primaryLanguage: "hi",
    categories: [
      "stole / dupatta",
      "dhoti / angavastram",
      "cotton saree",
      "district:Saket",
    ],
    region: "Delhi",
    district: "Saket",
  },
];
