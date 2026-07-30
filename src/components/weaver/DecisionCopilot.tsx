"use client";

import { useCallback, useEffect, useState } from "react";
import { Mic, RefreshCw, Volume2 } from "lucide-react";
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
  readStoredLanguage,
  type LanguageCode,
} from "@/lib/voice/languages";
import { useI18n } from "@/lib/i18n/context";
import {
  localizedAdvice,
  localizedCategoryLabel,
} from "@/lib/i18n/extras";
import { cachedJson, invalidateCached } from "@/lib/client-cache";
import { SummaryChatbot } from "@/components/weaver/SummaryChatbot";
import {
  DailyActionPlan,
  ReasonTagsRow,
} from "@/components/weaver/StandeeEngineUI";
import { DriftScorePanel } from "@/components/weaver/DriftScorePanel";

/**
 * Weaver Home — Decision Copilot + summary chatbot + Web Speech voice.
 */
export function DecisionCopilot() {
  const { t, lang: uiLang } = useI18n();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<LanguageCode>("en");
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);

  useEffect(() => {
    setLang(uiLang);
  }, [uiLang]);

  useEffect(() => {
    setLang(readStoredLanguage());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ code: LanguageCode }>).detail;
      if (detail?.code) setLang(detail.code);
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
  }, []);

  const adviceText = recommendation
    ? localizedAdvice(lang, {
        categoryId: recommendation.categoryId,
        categoryLabel: recommendation.categoryLabel,
        demandScore: recommendation.demandScore,
        factors: recommendation.factors,
      })
    : "";

  const load = useCallback(async () => {
    setError(null);
    const fetchRec = () =>
      cachedJson<Recommendation>("/api/recommendations/today");

    try {
      const data = await fetchRec();
      setRecommendation(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      // Login rotates the session cookie; an in-flight call can 401 once.
      if (msg.includes("401")) {
        invalidateCached("/api/recommendations/today");
        try {
          await new Promise((r) => setTimeout(r, 200));
          const data = await fetchRec();
          setRecommendation(data);
          return;
        } catch (retryErr) {
          setError(
            retryErr instanceof Error
              ? retryErr.message
              : "Session expired — sign out and sign in again",
          );
          return;
        }
      }
      setError(msg);
    }
  }, []);

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

  // Auto-speak removed — Loom assistant owns voice replies on Home.
  // Tap "Hear again" below for today's advice TTS.

  async function onHearAgain() {
    if (!adviceText) return;
    await speakAdvice(adviceText, lang);
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
      if (soundsLikeWeaveQuestion(transcript) && adviceText) {
        await speakAdvice(adviceText, lang);
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
              {adviceText}
            </p>

            <p className="mt-3 text-base text-loom-muted">
              {t("home.demandScore", {
                category: localizedCategoryLabel(
                  lang,
                  recommendation.categoryId || recommendation.categoryLabel,
                ),
              })}{" "}
              <span className="font-semibold text-loom-ink">
                {t("home.scoreOf", { score: recommendation.demandScore })}
              </span>
              .
            </p>

            {recommendation.drift ? (
              <DriftScorePanel drift={recommendation.drift} />
            ) : null}

            {recommendation.reasonTags?.length ? (
              <ReasonTagsRow tags={recommendation.reasonTags} />
            ) : null}

            {recommendation.dailyActions?.length ? (
              <DailyActionPlan actions={recommendation.dailyActions} />
            ) : null}

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
              {t("home.voiceNote")}
            </p>
          </article>
        ) : null}
      </div>
    </div>
  );
}
