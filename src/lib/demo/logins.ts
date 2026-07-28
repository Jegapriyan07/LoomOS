/**
 * Pitch demo weavers — each phone unlocks a full app story
 * (orders, earnings, plan, advice).
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
};

export const DEMO_WEAVER_LOGINS: DemoWeaverLogin[] = [
  {
    phone: "9000000001",
    weaverId: "weaver-demo-001",
    userId: "user-weaver-001",
    givenName: "Meena",
    name: "Meena (demo weaver — fictional)",
    blurb: "Settled earnings + open order · cotton & silk",
    primaryLanguage: "ta",
    categories: ["cotton saree", "silk saree", "cotton lungi"],
    region: "Tamil Nadu",
  },
  {
    phone: "9000000002",
    weaverId: "weaver-demo-002",
    userId: "user-weaver-002",
    givenName: "Selvi",
    name: "Selvi (demo weaver — fictional)",
    blurb: "In production + advance held · cotton & stoles",
    primaryLanguage: "ta",
    categories: ["cotton saree", "stole / dupatta"],
    region: "Tamil Nadu",
  },
  {
    phone: "9000000003",
    weaverId: "weaver-demo-003",
    userId: "user-weaver-003",
    givenName: "Kamala",
    name: "Kamala (demo weaver — fictional)",
    blurb: "Dispatched silk · settlement projected soon",
    primaryLanguage: "ta",
    categories: ["silk saree", "dhoti / angavastram"],
    region: "Tamil Nadu",
  },
  {
    phone: "9000000004",
    weaverId: "weaver-demo-004",
    userId: "user-weaver-004",
    givenName: "Lakshmi",
    name: "Lakshmi (demo weaver — fictional)",
    blurb: "Fresh pipeline · stoles + dhoti, early earnings",
    primaryLanguage: "hi",
    categories: ["stole / dupatta", "dhoti / angavastram", "cotton saree"],
    region: "Tamil Nadu",
  },
];

export function isDemoWeaverPhone(phone: string): boolean {
  const p = phone.replace(/\D/g, "").slice(-10);
  return DEMO_WEAVER_LOGINS.some((d) => d.phone === p);
}

export function demoWeaverByPhone(phone: string): DemoWeaverLogin | undefined {
  const p = phone.replace(/\D/g, "").slice(-10);
  return DEMO_WEAVER_LOGINS.find((d) => d.phone === p);
}
