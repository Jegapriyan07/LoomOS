"use client";

import { useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  speakRecommendation,
  stopSpeaking,
} from "@/lib/voice/speech";

/**
 * Floating voice accessibility controls — speak main content / voice ask / stop.
 */
export function VoiceAccessibilityBar({
  onVoiceCommand,
}: {
  /** Optional handler when user speaks a command transcript */
  onVoiceCommand?: (transcript: string) => void;
}) {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  async function speakMain() {
    if (!isSpeechSynthesisAvailable()) {
      setStatus(t("voice.notSupported"));
      return;
    }
    const main = document.querySelector("main");
    const text =
      main?.innerText?.replace(/\s+/g, " ").trim().slice(0, 1200) ?? "";
    if (!text) {
      setStatus(t("chat.error"));
      return;
    }
    setStatus(t("voice.speaking"));
    try {
      await speakRecommendation(text, { languageCode: lang });
      setStatus(null);
    } catch {
      setStatus(t("voice.speakFailed"));
    }
  }

  async function askVoice() {
    if (!isSpeechRecognitionAvailable()) {
      setStatus(t("voice.micUnavailable"));
      return;
    }
    stopSpeaking();
    setListening(true);
    setStatus(t("voice.listeningHint"));
    try {
      const { transcript, supported } = await listenOnce(lang);
      setListening(false);
      if (!supported) {
        setStatus(t("voice.micUnavailable"));
        return;
      }
      if (!transcript.trim()) {
        setStatus(t("voice.didntCatch"));
        return;
      }
      setStatus(t("voice.heard", { transcript }));
      onVoiceCommand?.(transcript);
      // Default: speak back a short ack by reading advice region if present
      const advice =
        document.querySelector("[data-voice-advice]")?.textContent?.trim() ??
        transcript;
      if (isSpeechSynthesisAvailable()) {
        await speakRecommendation(advice, { languageCode: lang });
      }
    } catch {
      setListening(false);
      setStatus(t("voice.micError"));
    }
  }

  return (
    <div
      className="fixed bottom-[4.75rem] right-3 z-50 flex max-w-[min(100vw-1.5rem,16rem)] flex-col items-end gap-1"
      role="region"
      aria-label={t("voice.a11yLabel")}
    >
      {status ? (
        <p
          className="rounded-lg border border-loom-border bg-loom-surface px-2 py-1 text-xs text-loom-muted shadow-sm"
          role="status"
        >
          {status}
        </p>
      ) : null}
      <div className="flex gap-1 rounded-2xl border border-loom-border bg-loom-surface/95 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={() => void speakMain()}
          className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-loom-primary"
          aria-label={t("voice.speakPage")}
        >
          <Volume2 className="size-4" aria-hidden />
          {t("voice.speakPage")}
        </button>
        <button
          type="button"
          onClick={() => void askVoice()}
          disabled={listening}
          className={`flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold ${
            listening ? "text-loom-warning" : "text-loom-primary"
          }`}
          aria-label={t("voice.ask")}
        >
          <Mic className="size-4" aria-hidden />
          {t("voice.ask")}
        </button>
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            setStatus(null);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-loom-muted"
          aria-label={t("voice.stop")}
        >
          <Square className="size-3.5 fill-current" aria-hidden />
        </button>
      </div>
    </div>
  );
}
