/**
 * Stage 8 — voice / language helpers.
 * Web Speech API in Chrome is the live demo path.
 * Bhashini is NOT integrated (honest Phase 2 path for stronger ASR/TTS).
 */

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "EN", name: "English", bcp47: "en-IN" },
  { code: "hi", label: "हिन्दी", name: "Hindi", bcp47: "hi-IN" },
  { code: "ta", label: "தமிழ்", name: "Tamil", bcp47: "ta-IN" },
  { code: "te", label: "తెలుగు", name: "Telugu", bcp47: "te-IN" },
  { code: "kn", label: "ಕನ್ನಡ", name: "Kannada", bcp47: "kn-IN" },
  { code: "bn", label: "বাংলা", name: "Bengali", bcp47: "bn-IN" },
  { code: "as", label: "অসমীয়া", name: "Assamese", bcp47: "as-IN" },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

export const LANGUAGE_STORAGE_KEY = "loomos-ui-lang-v2";
export const LANGUAGE_CHANGE_EVENT = "loomos-language-change";

/** Demo tip: Web Speech is most reliable in Chrome. */
export const VOICE_DEMO_NOTE =
  "English is the default UI language. Switch Hindi, Tamil, Telugu, Kannada, Bengali, or Assamese from the language menu. Voice works best in Chrome; availability depends on voices installed on the device.";

/**
 * Census context — Assam & West Bengal handloom household counts
 * (Fourth All India Handloom Census 2019-20).
 */
export const CENSUS_LANGUAGE_NOTE =
  "Assamese and Bengali are available in the UI. Assam (~10.9 lakh weaving households) and West Bengal (~3.4 lakh) have more handloom households than Kannada- or Telugu-speaking regions by household count (Fourth All India Handloom Census 2019-20).";

export const BHASHINI_STATUS_NOTE =
  "Bhashini’s free ASR/TTS APIs are a real Phase 2 path for stronger Assamese/Bengali voice — not integrated in this prototype (browser Web Speech is used today).";

/** @deprecated use CENSUS_LANGUAGE_NOTE — kept for any legacy imports */
export const COMING_NEXT_LANGUAGES = CENSUS_LANGUAGE_NOTE;

export function bcp47For(code: string): string {
  const found = LANGUAGE_OPTIONS.find((o) => o.code === code);
  return found?.bcp47 ?? "en-IN";
}

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_OPTIONS.some((o) => o.code === value);
}

export function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && isLanguageCode(saved)) return saved;
  return "en";
}

export function writeStoredLanguage(code: LanguageCode): void {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  window.dispatchEvent(
    new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { code } }),
  );
}
