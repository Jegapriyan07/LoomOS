# LoomOS — Build Blueprint

A step-by-step set of copy-paste prompts for turning the LoomOS pitch into a working prototype, with grounding rules baked in so whatever coding agent executes these doesn't invent facts, features, or fake integrations along the way.

## How to use this

Start every coding session (Claude Code, Cursor, v0, bolt.new, or plain chat) by pasting **Stage 0** in full. It's your persistent project brief — keep it loaded for the whole build, not just the first message.

If your tool supports a persistent rules file (e.g. `CLAUDE.md`, a `.cursorrules` file, a system prompt), put the **"Grounding & Anti-Hallucination Rules"** block there once.

> In this repo that block lives in [`RULESBOOK.MD`](./RULESBOOK.MD).

Run **Stages 1 → 12** in order, **one prompt per turn**. Read **"check before moving on"** before starting the next stage — that's where you catch a problem before it compounds into three more.

## Priority tags

Protect these first if you run short on time:

| Tag | Meaning |
|-----|---------|
| 🔴 Core | The demo doesn't hold together without these |
| 🟡 Strengthens the story | Do these once Core is solid |
| ⚪ Cut first | Good to have, not what judges are weighing |

## Rough time budget

- **3 days:** Day 1 = Stages 0–3 · Day 2 = Stages 4–7 · Day 3 = Stages 8–12 + rehearsal
- **2 days:** Skip straight to 🔴 only, then Stage 12
- **Stage 12 (the audit) is 🔴** regardless of how much time is left — it's short, and it's what turns "we simulated this" into a credibility line instead of a caught-out gap

## Suggested stack (an assumption — swap freely)

| Layer | Suggestion |
|-------|------------|
| **Frontend** | Next.js + React + Tailwind CSS, mobile-first. Most AI coding tools default to this well, and it gets you a PWA — installable on a weaver's phone, usable offline for cached screens — without extra setup. |
| **Backend/data** | Next.js API routes + SQLite (Prisma is fine, or a plain JSON file if you're truly pressed for time). Enough for a hackathon demo — every stage prompt says so explicitly, so the agent doesn't quietly treat it as production infrastructure. |
| **Voice** | Browser Web Speech API (`SpeechRecognition` / `SpeechSynthesis`) for the live demo — free, no key, works reliably in Chrome. **Bhashini** is the honest Phase 2 answer (Stage 8) — real and free, but more setup than a few hackathon days can absorb for every language at once. |

If your team already has a stack in mind (Flutter for a native demo, plain HTML/JS, whatever), just swap the framework name in Stage 0 — the flows, formulas, and grounding rules in every other stage are framework-agnostic.

## Stage index

Paste each stage prompt into the coding agent **one at a time**. Keep this file + `RULESBOOK.MD` loaded for the whole build.

| Stage | Focus | Priority note |
|-------|--------|---------------|
| 0 | Persistent project brief + design shell | Done — see [`STAGE0.md`](./STAGE0.md) |
| 1–12 | Build sequence | One prompt per turn; gate on “check before moving on” |

Keep [`RULESBOOK.MD`](./RULESBOOK.MD) + [`STAGE0.md`](./STAGE0.md) loaded for the whole build.
