/**
 * Real browser Web Speech API — SpeechSynthesis (TTS) + SpeechRecognition (STT).
 * Demo target: Chrome. Not a Bhashini integration.
 */

import { bcp47For } from "@/lib/voice/languages";

export type SpeakOptions = {
  languageCode?: string;
};

function getRecognitionConstructor():
  | (new () => SpeechRecognition)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionAvailable(): boolean {
  return getRecognitionConstructor() !== null;
}

/** Stop any in-flight utterance. */
export function stopSpeaking(): void {
  if (!isSpeechSynthesisAvailable()) return;
  window.speechSynthesis.cancel();
}

/**
 * Speak text with Web Speech API TTS.
 * Picks a voice matching the BCP-47 language when the OS provides one.
 */
export async function speakRecommendation(
  text: string,
  options: SpeakOptions = {},
): Promise<void> {
  if (!isSpeechSynthesisAvailable()) {
    console.warn("[LoomOS voice] speechSynthesis not available");
    return;
  }

  const lang = bcp47For(options.languageCode ?? "hi");
  stopSpeaking();

  // Chrome sometimes needs voices loaded asynchronously
  await ensureVoices();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const match =
    voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((v) =>
      v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()),
    );
  if (match) utterance.voice = match;

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn("[LoomOS voice] TTS error", e);
      reject(e.error);
    };
    window.speechSynthesis.speak(utterance);
  });
}

function ensureVoices(): Promise<void> {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve();
      return;
    }
    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    // Fallback if event never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      resolve();
    }, 500);
  });
}

export type ListenResult = {
  transcript: string;
  supported: boolean;
};

/**
 * One-shot speech-to-text in the selected language (Chrome / Chromium).
 */
export function listenOnce(languageCode: string): Promise<ListenResult> {
  const Ctor = getRecognitionConstructor();
  if (!Ctor) {
    return Promise.resolve({ transcript: "", supported: false });
  }

  const recognition = new Ctor();
  recognition.lang = bcp47For(languageCode);
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  return new Promise((resolve, reject) => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      resolve({ transcript, supported: true });
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        resolve({ transcript: "", supported: true });
        return;
      }
      reject(new Error(event.error));
    };
    recognition.onend = () => {
      // If no result fired, resolve empty
    };
    try {
      recognition.start();
    } catch (e) {
      reject(e instanceof Error ? e : new Error("Recognition failed to start"));
    }
  });
}

/** Loose intent: user is asking for weaving advice */
export function soundsLikeWeaveQuestion(transcript: string): boolean {
  const t = transcript.toLowerCase();
  const cues = [
    "weave",
    "weaving",
    "what should",
    "advice",
    "recommend",
    "saree",
    "sari",
    "today",
    "this week",
    "क्या",
    "बुनाई",
    "सलाह",
    "बुन",
    "நெசவு",
    "ஆலோசனை",
    "என்ன",
    "నేయ",
    "సలహా",
    "ఏమి",
    "ನೇಯ",
    "ಸಲಹೆ",
    "ಏನು",
    "summar",
    "money",
    "order",
  ];
  return cues.some((c) => t.includes(c)) || t.trim().length > 0;
}
