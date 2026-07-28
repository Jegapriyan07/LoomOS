"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Mic, Send, Volume2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  answerChat,
  buildSnapshot,
  summarizeOverall,
  type LoomSnapshot,
} from "@/lib/chat/assistant";
import type { Recommendation } from "@/lib/types";
import type { PaymentOrder } from "@/lib/payments/types";
import {
  isSpeechRecognitionAvailable,
  isSpeechSynthesisAvailable,
  listenOnce,
  speakRecommendation,
  stopSpeaking,
} from "@/lib/voice/speech";
import { cachedJson } from "@/lib/client-cache";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

/**
 * Homepage chatbot — summarizes advice, money, and orders; TTS + voice ask.
 */
export function SummaryChatbot() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [snap, setSnap] = useState<LoomSnapshot | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadSnap = useCallback(async (): Promise<LoomSnapshot> => {
    const [recommendation, ordersData, me] = await Promise.all([
      cachedJson<Recommendation>("/api/recommendations/today").catch(
        () => null,
      ),
      cachedJson<{ orders: { order: PaymentOrder }[] }>("/api/orders").catch(
        () => ({ orders: [] as { order: PaymentOrder }[] }),
      ),
      cachedJson<{
        user?: { name?: string; weaver?: { name?: string } };
      }>("/api/auth/me").catch(() => null),
    ]);
    const next = buildSnapshot(
      recommendation,
      ordersData.orders ?? [],
      me?.user?.name ?? me?.user?.weaver?.name ?? null,
    );
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
  }, [messages]);

  async function speak(text: string) {
    if (!isSpeechSynthesisAvailable()) {
      setVoiceNote(t("voice.notSupported"));
      return;
    }
    setVoiceNote(t("voice.speaking"));
    try {
      await speakRecommendation(text, { languageCode: lang });
      setVoiceNote(null);
    } catch {
      setVoiceNote(t("voice.speakFailed"));
    }
  }

  async function pushAssistant(text: string, alsoSpeak: boolean) {
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: "assistant", text },
    ]);
    if (alsoSpeak) await speak(text);
  }

  async function handleUserText(text: string, alsoSpeak = true) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    setInput("");
    setBusy(true);
    try {
      const current = snap ?? (await loadSnap());
      const reply = answerChat(trimmed, current, lang);
      await pushAssistant(reply, alsoSpeak);
    } catch {
      await pushAssistant(t("chat.error"), alsoSpeak);
    } finally {
      setBusy(false);
    }
  }

  async function onSummarize() {
    setBusy(true);
    try {
      const current = await loadSnap();
      const text = summarizeOverall(current, lang);
      setMessages((m) => [
        ...m,
        {
          id: `u-${Date.now()}`,
          role: "user",
          text: t("chat.summarize"),
        },
      ]);
      await pushAssistant(text, true);
    } catch {
      await pushAssistant(t("chat.error"), true);
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

  return (
    <section
      aria-label={t("chat.title")}
      className="mb-5 rounded-2xl border border-loom-border bg-loom-surface p-4 shadow-[var(--loom-shadow)]"
    >
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
      </div>

      <div
        ref={listRef}
        className="mb-3 max-h-56 space-y-2 overflow-y-auto rounded-xl bg-loom-bg/70 px-3 py-3"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-loom-muted">{t("chat.emptyHint")}</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg px-3 py-2 text-sm leading-snug ${
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
                  onClick={() => void speak(msg.text)}
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
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
            listening
              ? "border-loom-accent bg-loom-accent-soft text-loom-warning"
              : "border-loom-border bg-loom-bg text-loom-primary"
          }`}
          aria-label={t("voice.ask")}
        >
          <Mic className="size-5" aria-hidden />
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
