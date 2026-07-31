"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Square } from "lucide-react";
import { LoomAssistantMic } from "@/components/icons/LoomAssistantMic";
import { SummaryChatbot } from "@/components/weaver/SummaryChatbot";
import { useI18n } from "@/lib/i18n/context";
import { answerChat } from "@/lib/chat/assistant";
import { fetchLoomSnapshot } from "@/lib/chat/snapshot";
import {
  navConfirm,
  prefersNavigation,
  resolveVoiceNavIntent,
} from "@/lib/voice/navigate";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  speakRecommendation,
  stopSpeaking,
} from "@/lib/voice/speech";

/** Open the Loom assistant sheet from anywhere (e.g. Home “Ask by voice”). */
export const LOOM_ASSISTANT_OPEN_EVENT = "loom:open-assistant";
/** Start voice ask inside the open assistant sheet. */
export const LOOM_ASSISTANT_VOICE_EVENT = "loom:assistant-voice";

const INTRO_KEY = "loomos-assistant-intro-v3";

export function openLoomAssistant() {
  window.dispatchEvent(new CustomEvent(LOOM_ASSISTANT_OPEN_EVENT));
}

export function triggerAssistantVoice() {
  window.dispatchEvent(new CustomEvent(LOOM_ASSISTANT_VOICE_EVENT));
}

const ANIM_MS = 300;
const INTRO_OPEN_MS = 2200;
const HINT_MS = 6000;

/**
 * Mic FAB ↔ large Loom assistant.
 * On sign-in: open large → collapse into icon → show “Ask — Loom assistant is here”.
 */
export function LoomAssistantShell() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const busyRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const openRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const expand = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openRef.current = true;
    setShowHint(false);
    setVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
  }, []);

  const collapse = useCallback((opts?: { showHereHint?: boolean }) => {
    stopSpeaking();
    setListening(false);
    busyRef.current = false;
    setStatus(null);
    openRef.current = false;
    setOpen(false);
    closeTimer.current = window.setTimeout(() => {
      setVisible(false);
      closeTimer.current = null;
      if (opts?.showHereHint) {
        setShowHint(true);
        const hide = window.setTimeout(() => setShowHint(false), HINT_MS);
        timers.current.push(hide);
      }
    }, ANIM_MS);
  }, []);

  useEffect(() => {
    for (const href of ["/", "/orders", "/plan", "/money", "/profile"]) {
      router.prefetch(href);
    }
  }, [router]);

  useEffect(() => {
    const onOpen = () => {
      clearTimers();
      setIntroPlaying(false);
      expand();
    };
    window.addEventListener(LOOM_ASSISTANT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(LOOM_ASSISTANT_OPEN_EVENT, onOpen);
  }, [expand, clearTimers]);

  /**
   * Sign-in intro (once per session):
   * 1) open large
   * 2) auto-close into the mic
   * 3) show “Ask — Loom assistant is here”
   */
  useEffect(() => {
    let cancelled = false;
    try {
      sessionStorage.removeItem("loomos-assistant-session-opened");
      sessionStorage.removeItem("loomos-assistant-auto-open-v2");
      if (sessionStorage.getItem(INTRO_KEY) === "1") return;
    } catch {
      /* private mode */
    }

    const start = window.setTimeout(() => {
      if (cancelled) return;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* ignore */
      }
      setIntroPlaying(true);
      expand();

      const closeId = window.setTimeout(() => {
        if (cancelled) return;
        setIntroPlaying(false);
        collapse({ showHereHint: true });
      }, INTRO_OPEN_MS);
      timers.current.push(closeId);
    }, 450);
    timers.current.push(start);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [expand, collapse, clearTimers]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIntroPlaying(false);
        clearTimers();
        collapse({ showHereHint: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, collapse, clearTimers]);

  async function speakAck(text: string) {
    if (!isSpeechSynthesisAvailable()) return;
    try {
      await speakRecommendation(text, { languageCode: lang });
    } catch {
      /* ignore */
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

  async function askAssistant(transcript: string) {
    setStatus(t("chat.thinking"));
    try {
      const snap = await fetchLoomSnapshot();
      const reply = answerChat(transcript, snap, lang);
      setStatus(reply.slice(0, 220) + (reply.length > 220 ? "…" : ""));
      await speakAck(reply);
      window.setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus(t("chat.error"));
    }
  }

  async function handleQuickMic() {
    if (busyRef.current) return;
    if (!isSpeechRecognitionAvailable()) {
      setStatus(t("voice.micUnavailable"));
      expand();
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
      if (intent.kind === "navigate" && prefersNavigation(transcript, intent)) {
        router.push(intent.href);
        await speakAck(navConfirm(lang, intent.pageKey));
        window.setTimeout(() => setStatus(null), 2200);
        return;
      }

      expand();
      await askAssistant(transcript);
    } catch {
      setListening(false);
      setStatus(t("voice.micError"));
    } finally {
      busyRef.current = false;
      setListening(false);
    }
  }

  function handleFabClick() {
    clearTimers();
    setIntroPlaying(false);
    setShowHint(false);
    // Closed → open sheet. Open → keep Ask mic and start voice (do not hide mic).
    if (openRef.current || open) {
      triggerAssistantVoice();
      return;
    }
    expand();
  }

  function handleUserClose() {
    clearTimers();
    setIntroPlaying(false);
    collapse({ showHereHint: true });
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[60]"
        role="region"
        aria-label={t("voice.navA11yLabel")}
      >
        {visible ? (
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            aria-label={t("chat.close")}
            onClick={handleUserClose}
            className={`absolute inset-0 bg-loom-ink/45 transition-opacity duration-300 ease-out ${
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          />
        ) : null}

        {visible ? (
          <div
            className={`absolute inset-x-0 top-0 bottom-[8.5rem] flex justify-center px-3 pt-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-[40%] translate-x-[28%] scale-[0.08] opacity-0"
            }`}
            style={{ transformOrigin: "right bottom" }}
            aria-hidden={!open}
          >
            <div className="relative flex h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-loom-border bg-loom-surface shadow-[0_16px_48px_rgba(30,58,95,0.3)]">
              <SummaryChatbot
                variant="sheet"
                onClose={handleUserClose}
                className="mb-0 h-full overflow-y-auto rounded-none border-0 shadow-none"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Ask mic — fixed bottom-right, always above the open sheet */}
      <div className="pointer-events-none fixed bottom-[4.5rem] right-3 z-[80] flex flex-col items-end gap-1.5 sm:right-4">
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {showHint && !open ? (
            <div
              className="relative mb-1 mr-1 max-w-[15rem] rounded-2xl border border-loom-primary bg-loom-primary px-3 py-2 text-right shadow-lg"
              role="status"
            >
              <p className="text-sm font-semibold text-white">
                {t("chat.askLabel")}
              </p>
              <p className="text-xs leading-snug text-white/90">
                {t("chat.hereHint")}
              </p>
              <span
                className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b border-r border-loom-primary bg-loom-primary"
                aria-hidden
              />
            </div>
          ) : null}

          {status && !open && !showHint ? (
            <p
              className="max-w-[14rem] rounded-xl border border-loom-border bg-loom-surface px-3 py-1.5 text-right text-xs leading-snug text-loom-ink shadow-md"
              role="status"
            >
              {status}
            </p>
          ) : null}

          {introPlaying && open ? (
            <p
              className="mb-1 rounded-xl border border-loom-border bg-loom-surface px-3 py-1.5 text-xs font-semibold text-loom-primary shadow-md"
              role="status"
            >
              {t("chat.title")}
            </p>
          ) : null}

          <div className="flex flex-row-reverse items-end gap-2">
            <button
              type="button"
              onClick={handleFabClick}
              onContextMenu={(e) => {
                e.preventDefault();
                void handleQuickMic();
              }}
              disabled={listening}
              aria-pressed={listening || open}
              aria-expanded={open}
              aria-label={t("chat.askLabel")}
              className={`relative flex size-14 items-center justify-center rounded-full border-[3px] border-loom-surface shadow-[0_8px_24px_rgba(30,58,95,0.45)] transition sm:size-16 ${
                listening
                  ? "bg-loom-warning text-white"
                  : "bg-loom-primary text-white"
              } ${open || showHint ? "ring-4 ring-loom-accent/80" : ""}`}
            >
              {listening || showHint ? (
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-loom-accent/35"
                  aria-hidden
                />
              ) : null}
              <LoomAssistantMic
                className="relative size-6 sm:size-7"
                strokeWidth={2.4}
              />
            </button>

            {listening || (status && !open) ? (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setStatus(null);
                  setListening(false);
                  busyRef.current = false;
                }}
                className="mb-1 flex size-10 items-center justify-center rounded-full border border-loom-border bg-loom-surface text-loom-muted shadow-sm"
                aria-label={t("voice.stop")}
              >
                <Square className="size-3.5 fill-current" aria-hidden />
              </button>
            ) : null}
          </div>

          <span className="mr-1 rounded-full bg-loom-surface px-2.5 py-0.5 text-[0.65rem] font-semibold text-loom-primary shadow-sm">
            {t("chat.askLabel")}
          </span>
        </div>
      </div>
    </>
  );
}
