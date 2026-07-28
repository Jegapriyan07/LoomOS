GROUNDING & ANTI-HALLUCINATION RULES — apply to everything in this project:

1. Never invent a statistic, scheme detail, regulation, or API capability. Use
   only what's in the "Verified Facts" list below. If you need a fact that
   isn't there, stop and ask — don't guess.
2. Any number on screen that is calculated, projected, or estimated (not a
   real recorded transaction) must be visibly labeled as such — "Estimated,"
   "Projected," an (i) icon showing the formula behind it. A projection must
   never be allowed to look like a fact.
3. Never say or imply an integration, license, or data feed is "live" unless
   it's actually wired up and working in this codebase right now. Anything
   simulated or seeded (demo escrow, seed cooperative data, a
   manually-refreshed trend value) gets a visible "Demo / Simulated" tag in
   the UI and a code comment.
4. Every scoring formula (demand score, cash-flow projection, trust score,
   credit-identity score) must be implemented exactly as specified in each
   stage's prompt, with a UI element showing the real inputs behind the
   number. No black boxes.
5. Don't add features, screens, or claims beyond what the current prompt asks
   for. If you spot a genuine gap, flag it back instead of filling it with a
   guess.
6. When unsure about a fact, a number, or a scope call — ask. Don't fill the
   gap with something that merely sounds plausible.

VERIFIED FACTS (use these, don't re-derive or invent alternates):
- NHDC (National Handloom Development Corporation, Ministry of Textiles) runs
  the Raw Material Supply Scheme: a 15% price subsidy on yarn, paid via Direct
  Benefit Transfer to the weaver's linked bank account. Open to individual
  weavers and to SHGs/JLGs/cooperative societies. Source: NHDC Citizen
  Charter, nhdc.org.in.
- RBI requires any entity that pools and settles customer payments to
  merchants ("Payment Aggregator") to be RBI-authorised and to hold funds in
  an escrow account with a scheduled commercial bank — never self-held.
  Standard settlement window is T+1 working day. Getting authorised directly
  requires meeting conditions including a substantial minimum net worth
  (commonly cited around ₹25 crore). Source: RBI Master Directions on Payment
  Aggregators / Payment Gateways.
- Bhashini (National Language Translation Mission, under MeitY) offers free
  APIs — for individuals and low-volume developers — for speech-to-text,
  text-to-speech, and translation across all 22 constitutionally scheduled
  Indian languages, including Assamese, Bengali, Tamil, Telugu, Kannada, and
  Hindi. Source: bhashini.gov.in.
- Indiahandmade (Ministry of Textiles' artisan e-commerce platform) is
  integrated with ONDC, connecting handloom sellers into a shared e-commerce
  network rather than requiring separate onboarding per platform. Source:
  indiahandmade.com.
- Per the Fourth All India Handloom Census (2019-20, Ministry of Textiles):
  weaving households concentrate in Assam (10.9 lakh), West Bengal (3.4
  lakh), Manipur (2.1 lakh), and Tamil Nadu (1.7 lakh); about 72% of handloom
  weavers are women; roughly 66% earn under ₹5,000/month.
- Google's official Trends API launched in alpha in mid-2025 but remains
  access-gated with restricted quotas as of now — do NOT build as if it's a
  freely available live data source. Use the manual-refresh approach in
  Stage 3 instead.