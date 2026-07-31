"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Volume2, X } from "lucide-react";
import { LoomAssistantMic } from "@/components/icons/LoomAssistantMic";
import { useI18n } from "@/lib/i18n/context";
import {
  answerChat,
  answerFiveQuestion,
  summarizeOverall,
  type FiveQuestionId,
  type LoomSnapshot,
} from "@/lib/chat/assistant";
import { fetchLoomSnapshot } from "@/lib/chat/snapshot";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  speakRecommendation,
  stopSpeaking,
} from "@/lib/voice/speech";
import { FiveQuestionsStrip } from "@/components/weaver/StandeeEngineUI";
import { LOOM_ASSISTANT_VOICE_EVENT } from "@/components/weaver/LoomAssistantShell";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

type SummaryChatbotProps = {
  /** Sheet mode sits inside the expanding FAB overlay. */
  variant?: "inline" | "sheet";
  onClose?: () => void;
  className?: string;
};

/**
 * Loom assistant — five daily questions reply in-thread from account data.
 * Used as the expanding sheet from the mic FAB (and optionally inline).
 */
export function SummaryChatbot({
  variant = "inline",
  onClose,
  className = "",
}: SummaryChatbotProps) {
  const { t, lang } = useI18n();
  const isSheet = variant === "sheet";
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [snap, setSnap] = useState<LoomSnapshot | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<FiveQuestionId | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<LoomSnapshot | null>(null);

  const loadSnap = useCallback(async (): Promise<LoomSnapshot> => {
    const next = await fetchLoomSnapshot();
    snapRef.current = next;
    setSnap(next);
    return next;
  }, []);

  useEffect(() => {
    void loadSnap();
  }, [loadSnap]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  function speak(text: string) {
    if (!isSpeechSynthesisAvailable()) return;
    setVoiceNote(t("voice.speaking"));
    void speakRecommendation(text, { languageCode: lang })
      .then(() => setVoiceNote(null))
      .catch(() => setVoiceNote(t("voice.speakFailed")));
  }

  function pushAssistant(text: string, alsoSpeak: boolean) {
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role: "assistant", text },
    ]);
    if (alsoSpeak) speak(text);
  }

  async function resolveSnap(): Promise<LoomSnapshot> {
    if (snapRef.current) {
      void loadSnap(); // refresh in background
      return snapRef.current;
    }
    return loadSnap();
  }

  async function handleUserText(text: string, alsoSpeak = true) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setActiveQ(null);
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    setInput("");
    setBusy(true);
    try {
      const current = await resolveSnap();
      const reply = answerChat(trimmed, current, lang);
      pushAssistant(reply, alsoSpeak);
    } catch {
      pushAssistant(t("chat.error"), alsoSpeak);
    } finally {
      setBusy(false);
    }
  }

  async function onFiveQuestion(id: FiveQuestionId, label: string) {
    if (busy) return;
    setActiveQ(id);
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: label },
    ]);
    setBusy(true);
    try {
      const current = await resolveSnap();
      const reply = answerFiveQuestion(id, current, lang);
      pushAssistant(reply, true);
    } catch {
      pushAssistant(t("chat.error"), true);
    } finally {
      setBusy(false);
    }
  }

  async function onSummarize() {
    if (busy) return;
    setBusy(true);
    setActiveQ(null);
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: t("chat.summarize") },
    ]);
    try {
      const current = await resolveSnap();
      pushAssistant(summarizeOverall(current, lang), true);
    } catch {
      pushAssistant(t("chat.error"), true);
    } finally {
      setBusy(false);
    }
  }

  async function onVoiceAsk() {
    if (!isSpeechRecognitionAvailable()) {
      setVoiceNote(t("voice.micUnavailable"));
      return;
    }
    stopSpeaking();
    setListening(true);
    setVoiceNote(t("voice.listeningHint"));
    try {
      const { transcript, supported } = await listenOnce(lang);
      setListening(false);
      if (!supported) {
        setVoiceNote(t("voice.micUnavailable"));
        return;
      }
      if (!transcript.trim()) {
        setVoiceNote(t("voice.didntCatch"));
        return;
      }
      setVoiceNote(t("voice.heard", { transcript }));
      await handleUserText(transcript, true);
    } catch {
      setListening(false);
      setVoiceNote(t("voice.micError"));
    }
  }

  const onVoiceAskRef = useRef(onVoiceAsk);
  onVoiceAskRef.current = onVoiceAsk;

  // FAB Ask mic (while sheet is open) triggers the same voice ask
  useEffect(() => {
    if (!isSheet) return;
    const onVoice = () => {
      void onVoiceAskRef.current();
    };
    window.addEventListener(LOOM_ASSISTANT_VOICE_EVENT, onVoice);
    return () => window.removeEventListener(LOOM_ASSISTANT_VOICE_EVENT, onVoice);
  }, [isSheet]);

  return (
    <section
      aria-label={t("chat.title")}
      className={`mb-5 rounded-2xl border border-loom-border bg-loom-surface p-4 shadow-[var(--loom-shadow)] ${className}`}
    >
      {isSheet ? (
        <div className="mb-3 flex justify-center" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-loom-border" />
        </div>
      ) : null}

      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-loom-primary-soft text-loom-primary">
          <Bot className="size-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-loom-ink">
            {t("chat.title")}
          </h2>
          <p className="text-sm text-loom-muted">{t("chat.subtitle")}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-loom-border text-loom-muted"
            aria-label={t("chat.close")}
          >
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <FiveQuestionsStrip
        onAsk={(id, label) => void onFiveQuestion(id, label)}
        busy={busy}
        activeId={activeQ}
      />

      <div
        ref={listRef}
        className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-xl bg-loom-bg/70 px-3 py-3"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-loom-muted">{t("chat.emptyHint")}</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg px-3 py-2 text-sm leading-snug whitespace-pre-line ${
                msg.role === "user"
                  ? "ml-6 bg-loom-primary text-white"
                  : "mr-4 border border-loom-border bg-loom-surface text-loom-ink"
              }`}
            >
              <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide opacity-80">
                {msg.role === "user" ? t("chat.you") : t("chat.assistant")}
              </p>
              <p>{msg.text}</p>
              {msg.role === "assistant" ? (
                <button
                  type="button"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-loom-primary"
                  onClick={() => speak(msg.text)}
                  aria-label={t("home.hearAgain")}
                >
                  <Volume2 className="size-3.5" aria-hidden />
                  {t("home.hearAgain")}
                </button>
              ) : null}
            </div>
          ))
        )}
        {busy ? (
          <p className="text-sm text-loom-muted">{t("chat.thinking")}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void onSummarize()}
        disabled={busy}
        className="mb-3 flex h-11 w-full items-center justify-center rounded-xl border border-loom-border bg-loom-bg text-sm font-semibold text-loom-primary disabled:opacity-60"
      >
        {t("chat.summarize")}
      </button>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void handleUserText(input, true);
        }}
      >
        <label className="sr-only" htmlFor="loom-chat-input">
          {t("chat.placeholder")}
        </label>
        <input
          id="loom-chat-input"
          className="h-12 min-w-0 flex-1 rounded-xl border border-loom-border bg-loom-bg px-3 text-base text-loom-ink"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chat.placeholder")}
          disabled={busy}
        />
        <button
          type="button"
          onClick={() => void onVoiceAsk()}
          disabled={listening || busy}
          className={`flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 font-semibold text-white ${
            listening ? "bg-loom-warning" : "bg-loom-primary"
          }`}
          aria-label={t("voice.ask")}
        >
          <LoomAssistantMic className="size-5" strokeWidth={2.2} />
          <span className="text-sm">{t("chat.askLabel")}</span>
        </button>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-loom-primary text-white disabled:opacity-50"
          aria-label={t("chat.send")}
        >
          <Send className="size-5" aria-hidden />
        </button>
      </form>

      {voiceNote ? (
        <p className="mt-2 text-xs text-loom-muted" role="status">
          {voiceNote}
        </p>
      ) : null}
    </section>
  );
}
