/**
 * Rule-based Loom assistant — summarizes advice, money, and orders.
 * No LLM; grounded in live API payloads + five daily standee questions.
 */

import type { LanguageCode } from "@/lib/voice/languages";
import type { Recommendation } from "@/lib/types";
import type { PaymentOrder } from "@/lib/payments/types";
import type { WeaverStock } from "@/lib/demand/stock";
import { yarnReadyFor } from "@/lib/demand/stock";

export type FiveQuestionId =
  | "demand"
  | "product"
  | "timing"
  | "money"
  | "today";

export type LoomSnapshot = {
  recommendation: Recommendation | null;
  orders: { order: PaymentOrder }[];
  money: { held: number; nextDate: string | null; openCount: number };
  weaverName?: string | null;
  stock: WeaverStock | null;
  /** Open buyer requirements in region (count) */
  openRequirementCount: number;
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
  stock?: WeaverStock | null,
  openRequirementCount = 0,
): LoomSnapshot {
  return {
    recommendation,
    orders,
    money: moneyFromOrders(orders),
    weaverName,
    stock: stock ?? null,
    openRequirementCount,
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

function factorRaw(
  rec: Recommendation | null,
  id: string,
): number | null {
  const f = rec?.factors.find((x) => x.id === id);
  return f ? f.rawScore : null;
}

function festivalName(rec: Recommendation | null): string | null {
  const seasonal = rec?.factors.find((f) => f.id === "seasonal");
  const name = seasonal?.inputs.find(
    (i) => i.name === "Nearest relevant event",
  )?.value;
  if (!name || name.includes("None upcoming")) return null;
  return name;
}

function daysUntilFestival(rec: Recommendation | null): number | null {
  const seasonal = rec?.factors.find((f) => f.id === "seasonal");
  const raw = seasonal?.inputs.find((i) => i.name === "Days until start")
    ?.value;
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Answers for the five standee chips — always from this weaver's snapshot. */
export function answerFiveQuestion(
  id: FiveQuestionId,
  snap: LoomSnapshot,
  _lang: LanguageCode,
): string {
  const rec = snap.recommendation;
  const name = snap.weaverName?.split("(")[0]?.trim() ?? "there";

  if (id === "demand") {
    const buyer = factorRaw(rec, "buyer") ?? 0;
    const seasonal = factorRaw(rec, "seasonal") ?? 0;
    const fest = festivalName(rec);
    const days = daysUntilFestival(rec);
    const reqs = snap.openRequirementCount;
    const score = rec?.demandScore ?? 0;
    const lines = [
      `${name}, here's your demand picture from your account:`,
      `• Top match demand score: ${score}/100${rec ? ` (${rec.categoryLabel})` : ""}.`,
      `• Open buyer requirements in your region: ${reqs}.`,
      `• Buyer signal strength: ${buyer}/100.`,
      seasonal > 0
        ? `• Festival signal: ${seasonal}/100${fest ? ` — ${fest}${days != null ? ` in ~${days} days` : ""}` : ""}.`
        : "• No nearby festival lift in the seeded calendar.",
      snap.money.openCount > 0
        ? `• You already have ${snap.money.openCount} open order(s) in the pipeline.`
        : "• No open production orders yet — demand is mostly from buyer posts + season.",
    ];
    return lines.join("\n");
  }

  if (id === "product") {
    if (!rec) {
      return "I don't have today's product pick yet. Refresh Home advice, then ask again.";
    }
    const tags = (rec.reasonTags ?? [])
      .filter((t) => t.active)
      .map((t) => t.label);
    const others = (rec.allCategoryScores ?? [])
      .filter((c) => c.categoryId !== rec.categoryId)
      .slice(0, 2)
      .map((c) => `${c.categoryLabel} (${c.demandScore})`)
      .join("; ");
    return [
      `What you should weave next (from your profile + live signals):`,
      `→ ${rec.categoryLabel} — demand score ${rec.demandScore}/100.`,
      rec.action,
      tags.length ? `Why: ${tags.join(" · ")}.` : "",
      others ? `Also ranked: ${others}.` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (id === "timing") {
    if (!rec) {
      return "Timing needs today's recommendation. Open Home and refresh advice first.";
    }
    const fest = festivalName(rec);
    const days = daysUntilFestival(rec);
    const startHint =
      rec.dailyActions?.find((a) => a.id === "weave")?.label ??
      rec.action;
    const yarn =
      snap.stock && rec
        ? yarnReadyFor(snap.stock, rec.categoryId)
        : null;
    return [
      `When should you start (from your account):`,
      `→ ${startHint}`,
      fest && days != null
        ? `• Nearest relevant event: ${fest} (~${days} days). Plan backward on the Plan tab.`
        : "• No urgent festival deadline in the seed calendar — use Plan to set your own ready date.",
      yarn
        ? `• Yarn check: ${yarn.note}${yarn.ready ? "" : " Fix stock on Plan before you start."}`
        : "• Open Plan → Stock & resources to confirm yarn on hand.",
    ].join("\n");
  }

  if (id === "money") {
    const { held, nextDate, openCount } = snap.money;
    const states = snap.orders
      .filter(
        (r) =>
          r.order.state !== "settlement_released" &&
          r.order.state !== "resolved",
      )
      .map((o) => o.order.state.replaceAll("_", " "))
      .slice(0, 4);
    if (openCount === 0) {
      return [
        `When will you get paid (from your Money pipeline):`,
        `• No open orders right now — nothing in escrow.`,
        `• Check Orders for new buyer requirements, or Money after a buyer places work.`,
        `• Reminder: amounts here are simulated Demo Mode — not real bank transfers.`,
      ].join("\n");
    }
    return [
      `When will you get paid (from your account):`,
      `• ${openCount} open order(s) in the pipeline.`,
      held > 0
        ? `• About ₹${held.toLocaleString("en-IN")} advance held (simulated escrow).`
        : "• No advance held yet on open orders.",
      nextDate
        ? `• Next projected settlement: ${nextDate.slice(0, 10)}.`
        : "• No settlement date projected yet — advance / dispatch may still be pending.",
      states.length ? `• States: ${states.join("; ")}.` : "",
      `• Open Money for the full escrow walk and wallet. Demo / Simulated only.`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // today
  const actions = rec?.dailyActions ?? [];
  if (actions.length === 0) {
    return summarizeOverall(snap, "en");
  }
  return [
    `What you should do today (pulled from your advice, stock, and orders):`,
    ...actions.map((a, i) => `${i + 1}. ${a.label}`),
    `Tap Plan, Money, or Orders when a step needs that screen.`,
  ].join("\n");
}

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

  // Match five-question phrasing even when typed
  if (
    t.includes("work coming") ||
    t.includes("do i have work") ||
    t.includes("demand")
  ) {
    return answerFiveQuestion("demand", snap, lang);
  }
  if (
    t.includes("what should i weave") ||
    t.includes("weave next") ||
    (t.includes("product") && t.includes("recommend"))
  ) {
    return answerFiveQuestion("product", snap, lang);
  }
  if (
    t.includes("when should i start") ||
    t.includes("production timing") ||
    (t.includes("when") && t.includes("start"))
  ) {
    return answerFiveQuestion("timing", snap, lang);
  }
  if (
    t.includes("when will i get paid") ||
    t.includes("get paid") ||
    (t.includes("when") && t.includes("paid"))
  ) {
    return answerFiveQuestion("money", snap, lang);
  }
  if (
    t.includes("what should i do today") ||
    t.includes("do today") ||
    t.includes("daily action")
  ) {
    return answerFiveQuestion("today", snap, lang);
  }

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
    return answerFiveQuestion("money", snap, lang);
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
    return answerFiveQuestion("product", snap, lang);
  }
  return summarizeOverall(snap, lang);
}
