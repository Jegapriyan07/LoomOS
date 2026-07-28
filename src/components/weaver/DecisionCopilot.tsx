"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  IndianRupee,
  Mic,
  RefreshCw,
  Volume2,
  Wallet,
} from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { speakRecommendation, stopSpeaking } from "@/lib/tts";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  soundsLikeWeaveQuestion,
} from "@/lib/voice/speech";
import {
  LANGUAGE_CHANGE_EVENT,
  VOICE_DEMO_NOTE,
  readStoredLanguage,
  type LanguageCode,
} from "@/lib/voice/languages";
import { formatDisplayDate } from "@/lib/production-defaults";
import type { PaymentOrder } from "@/lib/payments/types";
import { useI18n } from "@/lib/i18n/context";
import { SummaryChatbot } from "@/components/weaver/SummaryChatbot";

/**
 * Weaver Home — Decision Copilot + summary chatbot + Web Speech voice.
 */
export function DecisionCopilot() {
  const { t } = useI18n();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [whyOpen, setWhyOpen] = useState(false);
  const [lang, setLang] = useState<LanguageCode>("hi");
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [moneyLine, setMoneyLine] = useState<{
    held: number;
    nextDate: string | null;
  }>({ held: 0, nextDate: null });
  const whyPanelId = useId();

  useEffect(() => {
    setLang(readStoredLanguage());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ code: LanguageCode }>).detail;
      if (detail?.code) setLang(detail.code);
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
  }, []);

  const loadMoney = useCallback(async () => {
    const res = await fetch(`/api/orders`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as {
      orders: { order: PaymentOrder }[];
    };
    const active = data.orders.filter(
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
    setMoneyLine({ held, nextDate });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recommendations/today`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Could not load today's advice");
      const data = (await res.json()) as Recommendation;
      setRecommendation(data);
      await loadMoney();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [loadMoney]);

  useEffect(() => {
    void load();
  }, [load]);

  const speakAdvice = useCallback(
    async (text: string, code: LanguageCode) => {
      if (!isSpeechSynthesisAvailable()) {
        setVoiceStatus(t("voice.notSupported"));
        return;
      }
      setVoiceStatus(t("voice.speaking"));
      try {
        await speakRecommendation(text, { languageCode: code });
        setVoiceStatus(null);
      } catch {
        setVoiceStatus(t("voice.speakFailed"));
      }
    },
    [t],
  );

  useEffect(() => {
    if (!recommendation) return;
    void speakAdvice(recommendation.action, lang);
    return () => stopSpeaking();
  }, [recommendation, lang, speakAdvice]);

  async function onHearAgain() {
    if (!recommendation) return;
    await speakAdvice(recommendation.action, lang);
  }

  async function onAskByVoice() {
    if (!isSpeechRecognitionAvailable()) {
      setVoiceStatus(t("voice.micUnavailable"));
      return;
    }
    stopSpeaking();
    setListening(true);
    setVoiceStatus(t("voice.listeningHint"));
    try {
      const { transcript, supported } = await listenOnce(lang);
      setListening(false);
      if (!supported) {
        setVoiceStatus(t("voice.micUnavailable"));
        return;
      }
      if (!transcript.trim()) {
        setVoiceStatus(t("voice.didntCatch"));
        return;
      }
      setVoiceStatus(t("voice.heard", { transcript }));
      if (soundsLikeWeaveQuestion(transcript) && recommendation) {
        await speakAdvice(recommendation.action, lang);
      }
    } catch {
      setListening(false);
      setVoiceStatus(t("voice.micError"));
    }
  }

  return (
    <div className="flex flex-1 flex-col px-4 pb-6 pt-3">
      <SummaryChatbot />

      <div className="flex min-h-[calc(100dvh-8.5rem)] flex-col">
        <p className="mb-3 text-center text-base font-semibold text-loom-muted">
          {t("home.question")}
        </p>

        {loading ? (
          <p className="text-center text-base text-loom-muted">
            {t("home.loading")}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-loom-danger bg-loom-danger-soft px-3 py-3 text-base text-loom-danger">
            {error}
          </p>
        ) : null}

        {recommendation ? (
          <article className="flex flex-1 flex-col rounded-2xl border border-loom-border bg-loom-surface p-5 shadow-[var(--loom-shadow)]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-loom-primary">
                <Volume2 className="size-6 shrink-0" aria-hidden />
                <span className="text-base font-semibold">
                  {t("home.todaysAdvice")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void load()}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-loom-border text-loom-primary"
                aria-label={t("home.refresh")}
              >
                <RefreshCw className="size-5" aria-hidden />
              </button>
            </div>

            <p
              data-voice-advice
              className="font-[family-name:var(--font-loom-display)] text-weaver-lg font-semibold leading-snug text-loom-ink"
            >
              {recommendation.action}
            </p>

            <p className="mt-3 text-base text-loom-muted">
              {t("home.demandScore", {
                category: recommendation.categoryLabel.toLowerCase(),
              })}{" "}
              <span className="font-semibold text-loom-ink">
                {recommendation.demandScore} of 100
              </span>
              .
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void onHearAgain()}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-loom-border bg-loom-bg text-base font-semibold text-loom-primary"
              >
                <Volume2 className="size-5" aria-hidden />
                {t("home.hearAgain")}
              </button>
              <button
                type="button"
                onClick={() => void onAskByVoice()}
                disabled={listening}
                className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-base font-semibold ${
                  listening
                    ? "border-loom-accent bg-loom-accent-soft text-loom-warning"
                    : "border-loom-border bg-loom-bg text-loom-primary"
                }`}
              >
                <Mic className="size-5" aria-hidden />
                {listening ? t("home.listening") : t("home.askByVoice")}
              </button>
            </div>
            {voiceStatus ? (
              <p className="mt-2 text-sm text-loom-muted" role="status">
                {voiceStatus}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-snug text-loom-muted">
              {VOICE_DEMO_NOTE}
            </p>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={() => setWhyOpen((open) => !open)}
                aria-expanded={whyOpen}
                aria-controls={whyPanelId}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-loom-border bg-loom-bg px-4 text-base font-semibold text-loom-primary"
              >
                <HelpCircle className="size-6 shrink-0" aria-hidden />
                <span>{t("home.why")}</span>
                <ChevronDown
                  className={`size-5 shrink-0 transition-transform ${
                    whyOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              {whyOpen ? (
                <div
                  id={whyPanelId}
                  className="mt-3 space-y-4 rounded-xl bg-loom-primary-soft/60 px-4 py-3 text-left"
                >
                  <p className="text-sm font-semibold text-loom-ink">
                    {recommendation.formulaSummary}
                  </p>
                  <p className="mt-1 text-sm text-loom-muted">
                    Total = {recommendation.demandScore}/100
                  </p>

                  {recommendation.factors.map((factor) => (
                    <div
                      key={factor.id}
                      className="rounded-lg border border-loom-border/70 bg-loom-surface/80 p-3"
                    >
                      <p className="text-base font-semibold text-loom-ink">
                        {factor.label}{" "}
                        <span className="font-medium text-loom-muted">
                          (weight {Math.round(factor.weight * 100)}%)
                        </span>
                      </p>
                      <p className="mt-1 text-base text-loom-ink">
                        Raw score{" "}
                        <span className="font-semibold">
                          {factor.rawScore}/100
                        </span>
                        {" → "}
                        contributes{" "}
                        <span className="font-semibold">
                          {factor.weightedContribution}
                        </span>{" "}
                        points
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {factor.inputs.map((input) => (
                          <li
                            key={`${factor.id}-${input.name}`}
                            className="text-sm leading-snug text-loom-muted"
                          >
                            <span className="font-semibold text-loom-ink">
                              {input.name}:
                            </span>{" "}
                            {input.value}
                          </li>
                        ))}
                      </ul>
                      {factor.note ? (
                        <p className="mt-2 text-sm italic text-loom-muted">
                          {factor.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>

      <aside
        aria-label={t("home.moneyTitle")}
        className="mt-8 space-y-3 border-t border-loom-border pt-6"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-loom-muted">
          {t("home.moneyTitle")}
        </p>
        <p className="text-xs text-loom-warning">{t("home.moneySimNote")}</p>

        <div className="flex items-start gap-3 rounded-xl border border-dashed border-loom-border bg-loom-surface/70 px-4 py-3">
          <IndianRupee
            className="mt-0.5 size-6 shrink-0 text-loom-muted"
            aria-hidden
          />
          <p className="text-base leading-snug text-loom-muted">
            {moneyLine.nextDate ? (
              t("home.nextPayment", {
                date: formatDisplayDate(moneyLine.nextDate),
              })
            ) : (
              <>{t("home.noPayment")}</>
            )}
            <span className="mt-1 block text-sm">
              {t("home.demoSimulated")}
            </span>
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-dashed border-loom-border bg-loom-surface/70 px-4 py-3">
          <Wallet
            className="mt-0.5 size-6 shrink-0 text-loom-muted"
            aria-hidden
          />
          <p className="text-base leading-snug text-loom-muted">
            {moneyLine.held > 0
              ? t("home.advanceHeld", {
                  amount: moneyLine.held.toLocaleString("en-IN"),
                })
              : t("home.walletQuiet")}
            <span className="mt-1 block text-sm">
              {t("home.demoSimulated")}
            </span>
          </p>
        </div>
      </aside>
    </div>
  );
}
