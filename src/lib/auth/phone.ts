/** Normalize Indian mobile to 10 digits (strip +91 / spaces). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/** Country dial codes shown on buyer login (weavers stay +91). */
export const PHONE_COUNTRY_OPTIONS = [
  { dial: "91", label: "India", flag: "IN", nationalLength: 10 },
  { dial: "1", label: "USA / Canada", flag: "US", nationalLength: 10 },
  { dial: "44", label: "United Kingdom", flag: "UK", nationalLength: 10 },
  { dial: "971", label: "UAE", flag: "AE", nationalLength: 9 },
  { dial: "65", label: "Singapore", flag: "SG", nationalLength: 8 },
  { dial: "61", label: "Australia", flag: "AU", nationalLength: 9 },
  { dial: "49", label: "Germany", flag: "DE", nationalLength: 11 },
  { dial: "33", label: "France", flag: "FR", nationalLength: 9 },
] as const;

export type PhoneCountryDial = (typeof PHONE_COUNTRY_OPTIONS)[number]["dial"];

/**
 * Build the phone string stored / matched in auth.
 * India (+91) → 10-digit national. Other countries → dial + national digits.
 */
export function toAuthPhone(nationalRaw: string, dialCode = "91"): string {
  const national = nationalRaw.replace(/\D/g, "").replace(/^0+/, "");
  if (dialCode === "91") {
    return normalizePhone(national);
  }
  return `${dialCode}${national}`;
}

export function isValidAuthPhone(phone: string, dialCode = "91"): boolean {
  if (dialCode === "91") {
    return isValidIndianMobile(phone);
  }
  // dial + national already combined
  return (
    phone.startsWith(dialCode) &&
    phone.length >= dialCode.length + 6 &&
    phone.length <= dialCode.length + 12 &&
    /^\d+$/.test(phone)
  );
}
