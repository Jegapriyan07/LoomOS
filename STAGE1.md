# STAGE 1 — Weaver Home / Decision Copilot

**Priority:** Core

## Delivered

- One primary recommendation card (spoken-style text)
- TTS stub on load (`speakRecommendation`) — Stage 8 wires real voice
- “Why?” expands 2–3 plain-language factors from `getTodaysRecommendation(weaverId)`
- Below-fold stubs: next payment date + wallet status (Stages 4–5)
- Visible banner: **Sample — not yet calculated**
- Models: `Weaver`, `Recommendation` in `src/lib/types.ts`

## Check before moving on

- [x] Exactly one primary recommendation focus above the fold
- [x] “Why?” expands with placeholder factors
- [x] Placeholder clearly marked as sample / not calculated
