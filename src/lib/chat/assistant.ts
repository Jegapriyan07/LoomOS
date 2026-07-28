/**
 * Rule-based Loom assistant — summarizes advice, money, and orders.
 * No LLM; grounded in live API payloads.
 */

import type { LanguageCode } from "@/lib/voice/languages";
import type { Recommendation } from "@/lib/types";
import type { PaymentOrder } from "@/lib/payments/types";

export type LoomSnapshot = {
  recommendation: Recommendation | null;
  orders: { order: PaymentOrder }[];
  money: { held: number; nextDate: string | null; openCount: number };
  weaverName?: string | null;
};

function moneyFromOrders(orders: { order: PaymentOrder }[]) {
  const active = orders.filter(
    (r) =>
      r.order.state !== "settlement_released" && r.order.state !== "resolved",
  );
  const held = active
    .filter((r) =>
      [
        "advance_paid_escrow_held",
        "production_in_progress",
        "dispatched",
        "dispute_opened",
        "under_review",
      ].includes(r.order.state),
    )
    .reduce((s, r) => s + r.order.advanceAmount, 0);
  const nextDate =
    active.find((r) => r.order.expectedSettlementAt)?.order
      .expectedSettlementAt ?? null;
  return { held, nextDate, openCount: active.length };
}

export function buildSnapshot(
  recommendation: Recommendation | null,
  orders: { order: PaymentOrder }[],
  weaverName?: string | null,
): LoomSnapshot {
  return {
    recommendation,
    orders,
    money: moneyFromOrders(orders),
    weaverName,
  };
}

const OPENERS: Record<LanguageCode, (name: string) => string> = {
  en: (n) => (n ? `Hi ${n}. ` : "Hi. "),
  hi: (n) => (n ? `नमस्ते ${n}. ` : "नमस्ते. "),
  ta: (n) => (n ? `வணக்கம் ${n}. ` : "வணக்கம். "),
  te: (n) => (n ? `నమస్కారం ${n}. ` : "నమస్కారం. "),
  kn: (n) => (n ? `ನಮಸ್ಕಾರ ${n}. ` : "ನಮಸ್ಕಾರ. "),
  bn: (n) => (n ? `নমস্কার ${n}. ` : "নমস্কার. "),
  as: (n) => (n ? `নমস্কাৰ ${n}. ` : "নমস্কাৰ. "),
};

export function summarizeOverall(
  snap: LoomSnapshot,
  lang: LanguageCode,
): string {
  const name = snap.weaverName?.split("(")[0]?.trim() ?? "";
  const open = OPENERS[lang]?.(name) ?? OPENERS.en(name);
  const rec = snap.recommendation;
  const { held, nextDate, openCount } = snap.money;

  if (lang === "hi") {
    const advice = rec
      ? `आज की सलाह: ${rec.categoryLabel} सबसे मजबूत दिख रहा है (माँग स्कोर ${rec.demandScore}/100)। ${rec.action}`
      : "आज की बुनाई सलाह अभी उपलब्ध नहीं है।";
    const money =
      openCount === 0
        ? " अभी कोई खुला ऑर्डर नहीं है।"
        : ` ${openCount} खुले ऑर्डर हैं।` +
          (held > 0
            ? ` लगभग ₹${held.toLocaleString("en-IN")} एडवांस होल्ड में है।`
            : "") +
          (nextDate
            ? ` अगला अनुमानित भुगतान: ${nextDate.slice(0, 10)}।`
            : "");
    return `${open}${advice}${money}`;
  }

  if (lang === "ta") {
    const advice = rec
      ? `இன்றைய ஆலோசனை: ${rec.categoryLabel} வலுவாக உள்ளது (கேள்வி மதிப்பெண் ${rec.demandScore}/100). ${rec.action}`
      : "இன்றைய நெசவு ஆலோசனை இப்போது இல்லை.";
    const money =
      openCount === 0
        ? " திறந்த ஆர்டர் இல்லை."
        : ` ${openCount} திறந்த ஆர்டர்கள்.` +
          (held > 0
            ? ` சுமார் ₹${held.toLocaleString("en-IN")} முன்பணம் பிடிப்பு.`
            : "") +
          (nextDate ? ` அடுத்த கட்டணம்: ${nextDate.slice(0, 10)}.` : "");
    return `${open}${advice}${money}`;
  }

  if (lang === "te") {
    const advice = rec
      ? `నేటి సలహా: ${rec.categoryLabel} బలంగా ఉంది (డిమాండ్ ${rec.demandScore}/100). ${rec.action}`
      : "నేటి నేయడం సలహా ఇప్పుడు లేదు.";
    const money =
      openCount === 0
        ? " ఓపెన్ ఆర్డర్లు లేవు."
        : ` ${openCount} ఓపెన్ ఆర్డర్లు.` +
          (held > 0
            ? ` సుమారు ₹${held.toLocaleString("en-IN")} అడ్వాన్స్ హోల్డ్.`
            : "") +
          (nextDate ? ` తదుపరి చెల్లింపు: ${nextDate.slice(0, 10)}.` : "");
    return `${open}${advice}${money}`;
  }

  if (lang === "kn") {
    const advice = rec
      ? `ಇಂದಿನ ಸಲಹೆ: ${rec.categoryLabel} ಬಲವಾಗಿದೆ (ಬೇಡಿಕೆ ${rec.demandScore}/100). ${rec.action}`
      : "ಇಂದಿನ ನೇಯುವ ಸಲಹೆ ಇಲ್ಲ.";
    const money =
      openCount === 0
        ? " ತೆರೆದ ಆರ್ಡರ್‌ಗಳಿಲ್ಲ."
        : ` ${openCount} ತೆರೆದ ಆರ್ಡರ್‌ಗಳು.` +
          (held > 0
            ? ` ಸುಮಾರು ₹${held.toLocaleString("en-IN")} ಅಡ್ವಾನ್ಸ್ ಹೋಲ್ಡ್.`
            : "") +
          (nextDate ? ` ಮುಂದಿನ ಪಾವತಿ: ${nextDate.slice(0, 10)}.` : "");
    return `${open}${advice}${money}`;
  }

  const advice = rec
    ? `Today's advice: ${rec.categoryLabel} looks strongest (demand score ${rec.demandScore}/100). ${rec.action}`
    : "Today's weaving advice is not available yet.";
  const money =
    openCount === 0
      ? " You have no open orders right now."
      : ` You have ${openCount} open order${openCount === 1 ? "" : "s"}.` +
        (held > 0
          ? ` About ₹${held.toLocaleString("en-IN")} advance is held.`
          : "") +
        (nextDate
          ? ` Next projected payment around ${nextDate.slice(0, 10)}.`
          : "");
  return `${open}${advice}${money}`;
}

export function answerChat(
  message: string,
  snap: LoomSnapshot,
  lang: LanguageCode,
): string {
  const t = message.toLowerCase();
  const moneyCues = [
    "money",
    "pay",
    "payment",
    "wallet",
    "rupee",
    "₹",
    "पैसे",
    "भुगतान",
    "பணம்",
    "డబ్బు",
    "ಹಣ",
  ];
  const orderCues = [
    "order",
    "orders",
    "ऑर्डर",
    "ஆர்டர்",
    "ఆర్డర్",
    "ಆರ್ಡರ್",
  ];
  const weaveCues = [
    "weave",
    "weaving",
    "advice",
    "today",
    "what should",
    "बुन",
    "सलाह",
    "நெசவு",
    "నేయ",
    "ನೇಯ",
  ];
  const summaryCues = [
    "summar",
    "overall",
    "everything",
    "status",
    "सारांश",
    "சுருக்கம்",
    "సారాంశం",
    "ಸಾರಾಂಶ",
    "सब",
    "அனைத்து",
  ];

  if (summaryCues.some((c) => t.includes(c)) || !t.trim()) {
    return summarizeOverall(snap, lang);
  }
  if (moneyCues.some((c) => t.includes(c))) {
    const { held, nextDate, openCount } = snap.money;
    if (lang === "hi") {
      return openCount === 0
        ? "अभी कोई खुला ऑर्डर नहीं। वॉलेट शांत है।"
        : `${openCount} खुले ऑर्डर। होल्ड एडवांस: ₹${held.toLocaleString("en-IN")}.${nextDate ? ` अगला अनुमानित भुगतान ${nextDate.slice(0, 10)}।` : ""} यह सिम्युलेटेड प्रोटोटाइप है।`;
    }
    return openCount === 0
      ? "No open orders — wallet looks quiet (simulated)."
      : `${openCount} open order(s). Advance held: ₹${held.toLocaleString("en-IN")}.${nextDate ? ` Next projected payment ${nextDate.slice(0, 10)}.` : ""} This is a simulated prototype.`;
  }
  if (orderCues.some((c) => t.includes(c))) {
    const open = snap.orders.filter(
      (r) =>
        r.order.state !== "settlement_released" &&
        r.order.state !== "resolved",
    );
    if (lang === "hi") {
      return open.length === 0
        ? "कोई सक्रिय ऑर्डर नहीं।"
        : `सक्रिय ऑर्डर: ${open.length}। स्थितियाँ: ${open.map((o) => o.order.state.replaceAll("_", " ")).join(", ")}।`;
    }
    return open.length === 0
      ? "You have no active orders."
      : `Active orders: ${open.length}. States: ${open.map((o) => o.order.state.replaceAll("_", " ")).join(", ")}.`;
  }
  if (weaveCues.some((c) => t.includes(c)) && snap.recommendation) {
    return snap.recommendation.action;
  }
  return summarizeOverall(snap, lang);
}
