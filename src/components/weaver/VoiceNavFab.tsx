"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  helpHint,
  navConfirm,
  resolveVoiceNavIntent,
} from "@/lib/voice/navigate";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  speakRecommendation,
  stopSpeaking,
} from "@/lib/voice/speech";

type VoiceNavFabProps = {
  /** Compact control for TopBar (before language). Default: raised center FAB. */
  variant?: "fab" | "topbar";
};

/**
 * Voice tab navigation (English / Hindi / Tamil).
 * Separate from the Ask / Loom assistant chat card.
 */
export function VoiceNavFab({ variant = "fab" }: VoiceNavFabProps) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const busyRef = useRef(false);
  const isTopbar = variant === "topbar";

  useEffect(() => {
    for (const href of ["/", "/orders", "/plan", "/money", "/profile"]) {
      router.prefetch(href);
    }
  }, [router]);

  async function speakAck(text: string) {
    if (!isSpeechSynthesisAvailable()) return;
    try {
      await speakRecommendation(text, { languageCode: lang });
    } catch {
      /* ignore TTS failures — navigation still happened */
    }
  }

  async function speakMainPage() {
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

  async function handleMic() {
    if (busyRef.current) return;
    if (!isSpeechRecognitionAvailable()) {
      setStatus(t("voice.micUnavailable"));
      return;
    }

    busyRef.current = true;
    stopSpeaking();
    setListening(true);
    setStatus(t("voice.navListening"));

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

      const intent = resolveVoiceNavIntent(transcript);
      setStatus(t("voice.heard", { transcript }));

      if (intent.kind === "stop") {
        stopSpeaking();
        setStatus(null);
        return;
      }

      if (intent.kind === "speak_page") {
        await speakMainPage();
        return;
      }

      if (intent.kind === "navigate") {
        router.push(intent.href);
        await speakAck(navConfirm(lang, intent.pageKey));
        window.setTimeout(() => setStatus(null), 2200);
        return;
      }

      const hint = helpHint(lang);
      setStatus(hint);
      await speakAck(hint);
      window.setTimeout(() => setStatus(null), 4500);
    } catch {
      setListening(false);
      setStatus(t("voice.micError"));
    } finally {
      busyRef.current = false;
      setListening(false);
    }
  }

  function handleStop() {
    stopSpeaking();
    setStatus(null);
    setListening(false);
    busyRef.current = false;
  }

  if (isTopbar) {
    return (
      <div className="relative flex items-center gap-1">
        {status ? (
          <p
            className="absolute right-0 top-full z-50 mt-2 max-w-[min(100vw-2rem,16rem)] rounded-xl border border-loom-border bg-loom-surface px-3 py-1.5 text-xs leading-snug text-loom-ink shadow-lg"
            role="status"
          >
            {status}
          </p>
        ) : null}
        {listening || status ? (
          <button
            type="button"
            onClick={handleStop}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-loom-border bg-loom-surface text-loom-muted"
            aria-label={t("voice.stop")}
          >
            <Square className="size-3.5 fill-current" aria-hidden />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void handleMic()}
          disabled={listening}
          aria-pressed={listening}
          aria-label={t("voice.navMic")}
          title={t("voice.navMic")}
          className={`relative flex h-12 min-w-12 items-center justify-center gap-1.5 rounded-xl border px-3 shadow-[var(--loom-shadow)] transition ${
            listening
              ? "border-loom-warning bg-loom-warning text-white"
              : "border-loom-border bg-loom-surface text-loom-primary"
          }`}
        >
          {listening ? (
            <span
              className="absolute inset-0 animate-ping rounded-xl bg-loom-warning/30"
              aria-hidden
            />
          ) : null}
          <Mic className="relative size-5" strokeWidth={2.4} aria-hidden />
          <span className="relative text-sm font-semibold">
            {t("voice.navLabel")}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[4.25rem] z-[55] flex justify-center px-3"
      role="region"
      aria-label={t("voice.navA11yLabel")}
    >
      <div className="pointer-events-auto flex max-w-[min(100vw-1.5rem,20rem)] flex-col items-center gap-1.5">
        {status ? (
          <p
            className="rounded-xl border border-loom-border bg-loom-surface px-3 py-1.5 text-center text-xs leading-snug text-loom-ink shadow-md"
            role="status"
          >
            {status}
          </p>
        ) : null}

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => void handleMic()}
            disabled={listening}
            aria-pressed={listening}
            aria-label={t("voice.navMic")}
            className={`relative -mt-6 flex size-16 items-center justify-center rounded-full border-[3px] border-loom-surface shadow-[0_8px_24px_rgba(30,58,95,0.35)] transition ${
              listening
                ? "bg-loom-warning text-white"
                : "bg-loom-primary text-white"
            }`}
          >
            {listening ? (
              <span
                className="absolute inset-0 animate-ping rounded-full bg-loom-warning/40"
                aria-hidden
              />
            ) : null}
            <Mic className="relative size-7" strokeWidth={2.4} aria-hidden />
          </button>

          {listening || status ? (
            <button
              type="button"
              onClick={handleStop}
              className="mb-1 flex size-10 items-center justify-center rounded-full border border-loom-border bg-loom-surface text-loom-muted shadow-sm"
              aria-label={t("voice.stop")}
            >
              <Square className="size-3.5 fill-current" aria-hidden />
            </button>
          ) : null}
        </div>

        <span className="rounded-full bg-loom-surface/90 px-2 py-0.5 text-[0.65rem] font-semibold text-loom-primary shadow-sm">
          {t("voice.navLabel")}
        </span>
      </div>
    </div>
  );
}
