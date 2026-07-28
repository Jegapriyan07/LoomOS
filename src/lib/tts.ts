/**
 * Stage 8 — real Web Speech TTS.
 * Kept at this path so Stage 1 call sites keep working.
 */
export {
  speakRecommendation,
  stopSpeaking,
  isSpeechSynthesisAvailable,
  type SpeakOptions,
} from "@/lib/voice/speech";
