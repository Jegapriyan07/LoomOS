/**
 * Voice navigation intents — English, Hindi, Tamil (and shared Latin cues).
 * Maps spoken phrases to weaver app routes.
 */

export type VoiceNavRoute =
  | "/"
  | "/orders"
  | "/plan"
  | "/money"
  | "/profile";

export type VoiceNavIntent =
  | { kind: "navigate"; href: VoiceNavRoute; pageKey: VoiceNavPageKey }
  | { kind: "speak_page" }
  | { kind: "stop" }
  | { kind: "unknown" };

export type VoiceNavPageKey =
  | "home"
  | "orders"
  | "plan"
  | "money"
  | "profile";

/** Normalize for matching — lowercase, collapse spaces, strip punctuation. */
function normalize(transcript: string): string {
  return transcript
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type RouteRule = {
  href: VoiceNavRoute;
  pageKey: VoiceNavPageKey;
  /** Substrings — longest / most specific first within a route is preferred via score */
  cues: string[];
};

const ROUTE_RULES: RouteRule[] = [
  {
    href: "/plan",
    pageKey: "plan",
    cues: [
      // English
      "need to plan",
      "production plan",
      "open plan",
      "go to plan",
      "show plan",
      "planning",
      "schedule",
      "planner",
      "stock",
      "yarn",
      "plan page",
      "plan",
      // Hindi
      "योजना बनानी",
      "योजना बना",
      "प्लान चाहिए",
      "प्लान खोलो",
      "योजना",
      "प्लान",
      // Tamil
      "திட்டம் வேண்டும்",
      "திட்டமிட",
      "பிளான் திற",
      "திட்டம்",
      "பிளான்",
    ],
  },
  {
    href: "/orders",
    pageKey: "orders",
    cues: [
      "order details",
      "order detail",
      "buyer orders",
      "open orders",
      "show orders",
      "go to orders",
      "my orders",
      "requirements",
      "orders",
      "order",
      "ऑर्डर विवरण",
      "आर्डर विवरण",
      "ऑर्डर खोलो",
      "आर्डर खोलो",
      "ऑर्डर्स",
      "ऑर्डर",
      "आर्डर",
      "ஆர்டர் விவரம்",
      "ஆர்டர் விவரங்கள்",
      "ஆர்டர்கள்",
      "ஆர்டர்",
      "ஆணைகள்",
    ],
  },
  {
    href: "/money",
    pageKey: "money",
    cues: [
      "show money",
      "go to money",
      "payment",
      "payments",
      "wallet",
      "escrow",
      "get paid",
      "money",
      "पेमेंट",
      "भुगतान",
      "वॉलेट",
      "पैसे दिखाओ",
      "पैसे",
      "கட்டணம்",
      "வாலட்",
      "பணம் காட்டு",
      "பணம்",
    ],
  },
  {
    href: "/profile",
    pageKey: "profile",
    cues: [
      "my profile",
      "show profile",
      "go to profile",
      "account",
      "settings",
      "profile",
      "मेरी प्रोफ़ाइल",
      "प्रोफाइल",
      "प्रोफ़ाइल",
      "खाता",
      "என் சுயவிவரம்",
      "சுயவிவரம்",
      "புரொபைல்",
      "புரோஃபைல்",
    ],
  },
  {
    href: "/",
    pageKey: "home",
    cues: [
      "go home",
      "go to home",
      "show home",
      "today advice",
      "today's advice",
      "todays advice",
      "dashboard",
      "advice",
      "home page",
      "home",
      "होम पेज",
      "होम पर जाओ",
      "सलाह",
      "होम",
      "घर",
      "முகப்பு பக்கம்",
      "முகப்புக்கு",
      "ஆலோசனை",
      "முகப்பு",
      "வீடு",
    ],
  },
];

const SPEAK_CUES = [
  "speak page",
  "read page",
  "read aloud",
  "read this",
  "पेज पढ़ो",
  "पेज पढ़ें",
  "पढ़ो",
  "பக்கத்தைப் படி",
  "படி",
];

const STOP_CUES = [
  "stop speaking",
  "be quiet",
  "shut up",
  "stop",
  "रोको",
  "बंद करो",
  "रोकें",
  "நிறுத்து",
  "நிறுத்துங்கள்",
];

/**
 * Resolve a spoken transcript into a navigation / voice action.
 * Prefers the longest matching cue (more specific phrases win).
 */
export function resolveVoiceNavIntent(transcript: string): VoiceNavIntent {
  const text = normalize(transcript);
  if (!text) return { kind: "unknown" };

  if (STOP_CUES.some((c) => text.includes(normalize(c)))) {
    return { kind: "stop" };
  }

  for (const c of SPEAK_CUES) {
    if (text.includes(normalize(c))) return { kind: "speak_page" };
  }

  let best: { href: VoiceNavRoute; pageKey: VoiceNavPageKey; len: number } | null =
    null;

  for (const rule of ROUTE_RULES) {
    for (const cue of rule.cues) {
      const n = normalize(cue);
      if (n && text.includes(n) && (!best || n.length > best.len)) {
        best = { href: rule.href, pageKey: rule.pageKey, len: n.length };
      }
    }
  }

  if (best) {
    return { kind: "navigate", href: best.href, pageKey: best.pageKey };
  }

  return { kind: "unknown" };
}

/** Short spoken confirmations when opening a page. */
export const NAV_CONFIRM: Record<
  string,
  Record<VoiceNavPageKey, string>
> = {
  en: {
    home: "Opening Home.",
    orders: "Opening Orders.",
    plan: "Opening Plan.",
    money: "Opening Money.",
    profile: "Opening Profile.",
  },
  hi: {
    home: "होम खोल रहा हूँ।",
    orders: "ऑर्डर खोल रहा हूँ।",
    plan: "योजना खोल रहा हूँ।",
    money: "पैसे वाला पेज खोल रहा हूँ।",
    profile: "प्रोफ़ाइल खोल रहा हूँ।",
  },
  ta: {
    home: "முகப்பைத் திறக்கிறேன்.",
    orders: "ஆர்டர்களைத் திறக்கிறேன்.",
    plan: "திட்டப் பக்கத்தைத் திறக்கிறேன்.",
    money: "பணப் பக்கத்தைத் திறக்கிறேன்.",
    profile: "சுயவிவரத்தைத் திறக்கிறேன்.",
  },
};

export function navConfirm(lang: string, pageKey: VoiceNavPageKey): string {
  return (
    NAV_CONFIRM[lang]?.[pageKey] ??
    NAV_CONFIRM.en[pageKey] ??
    "Opening page."
  );
}

export const HELP_HINT: Record<string, string> = {
  en: "Say home, orders, plan, money, or profile — in English, Hindi, or Tamil.",
  hi: "होम, ऑर्डर, योजना, पैसे या प्रोफ़ाइल कहें — अंग्रेज़ी, हिंदी या तमिल में।",
  ta: "முகப்பு, ஆர்டர், திட்டம், பணம் அல்லது சுயவிவரம் என்று சொல்லுங்கள் — ஆங்கிலம், இந்தி அல்லது தமிழில்.",
};

export function helpHint(lang: string): string {
  return HELP_HINT[lang] ?? HELP_HINT.en;
}
