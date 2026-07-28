# STAGE 0 — Master Project Brief & Design System

**Priority:** Core  
**Status:** Keep loaded for the whole session

## Project

LoomOS — a voice-first business operating system for Indian handloom weavers. Not a marketplace, not a forecasting dashboard — a daily decision copilot that tells a weaver what to weave, when to start, when they'll get paid, and where their next order is coming from.

## Who this is for

- A handloom weaver, more likely a woman than not (~72% of handloom weavers are women nationally — Fourth All India Handloom Census 2019-20).
- Comfortable with a phone for calls/voice notes; not necessarily comfortable typing long text or reading dense screens. Some have limited formal education.
- Uses a budget Android phone, patchy/limited mobile data.
- Native language is more likely Tamil, Telugu, Kannada, Hindi, Bengali, or Assamese than English.
- Money is often tight and irregular — many weavers earn under ₹5,000/month — so every money screen needs to be calm and honest, never game-like or falsely optimistic.

## Weaver-facing UI rules (non-negotiable)

- One primary action per screen. A second decision means a second screen.
- Icon + voice first, text second. Every action has an icon; text is a label, never the only signal.
- No jargon. Never show "dashboard," "analytics," or "trend detection" in weaver-facing copy — say "What to weave," "Money coming your way," "When to start" instead.
- Tap targets at least 48×48px. Generous spacing over dense layouts.
- Status is always color AND icon together, never color alone.
- Design for low bandwidth: no heavy images/video in the weaver app; cache the last-loaded state so it's still useful with no signal.
- Buyer portal and cooperative dashboard (Stages 9, 11) can be more conventional — those are business users.

## Navigation shell

Bottom tab bar, 4 tabs max, icon + one word:

- Home (Decision Copilot — Stage 1)
- Plan (Reverse Production Planner — Stage 2)
- Money (Wallet + escrow status — Stages 4–5)
- Orders (buyer requirements — feeds Stage 9)

## Design tokens — palette choice (pick one)

Exact hex codes were not specified in the brief. Two options are implemented as CSS themes; **Option A is the default**.

### Option A — Indigo vat & turmeric (default)

Classic dye-vat: deep indigo primary, turmeric accent, charcoal on linen paper. Calm, high contrast, not SaaS-blue.

### Option B — Lac red & forest green

Natural-dye story: lac/crimson primary, forest green secondary, charcoal on cool stone. Switch with `data-palette="lac-forest"` on `<html>`.

## Check before moving on

- [ ] Shell runs and navigates between all 4 tabs
- [ ] Every tap target comfortably large on a ~360px-wide screen
- [ ] No "dashboard" (or analytics / trend detection) in weaver-facing copy
