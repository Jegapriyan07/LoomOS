# STAGE 12 — Final Hallucination & Compliance Audit

**Priority:** Core (🔴) — always run

## Audit checklist

| Check | Result |
|-------|--------|
| Unlabeled hardcoded / estimated numbers | Fixed Plan timeline **Estimated** labels; wallet Demo tag; coop utilization **Illustrative %**; walk-order ids (`ord-walk-*`) |
| False license / integration claims | None found for LoomOS (no RBI-licensed, NHDC/ONDC/Bhashini-integrated). Indiahandmade ONDC = external verified fact only |
| Credit score / CIBIL near Stage 6 | Absent — framing is Verified Transaction Record only |
| Scores / projections without Why? / info | Demand, trust, wallet rules have expanders; plan dates now Estimated |
| Seed data mistaken for real people/orgs | Demo Mode banner + fictional name suffixes; VTR share page + print footer |

## What's real vs. simulated (pitch slide)

Also rendered on `/about` as `RealVsSimulated`.

| Area | Real in this codebase | Simulated / Demo Mode |
|------|----------------------|------------------------|
| Identity & auth | SQLite + phone OTP + httpOnly cookie | SMS not wired (Dev OTP); seed people fictional |
| Demand score & Home advice | Formula + Why?; Buyer Signal from requirement store | Hardcoded festival calendar; Trends = manual admin (not live Trends API) |
| Production plan dates | Backward calendar math + editable days | Illustrative default durations; sample festival chips |
| Payments / escrow / trust | State machine; trust from order/dispute history | No real money; modeled on RBI-authorised PA escrow pattern |
| Wallet & Verified Transaction Record | Settlement Released–only rules | Seed settlement amounts |
| Buyer portal | Posts feed demand DB; phone OTP session | Fictional demo buyers; SMS not wired |
| Voice | Web Speech TTS/STT in Chrome | Bhashini not wired |
| ONDC / GeM / NHDC | Honest positioning + verified facts cited | No LoomOS APIs; NHDC = eligibility nudge only |
| Coop capacity % | Active Stage 4 pipeline counts | Max capacity illustrative (3) |

**People/orgs:** Meena, Selvi, Kamala, Saffron Thread Boutique, Nila Loom Circle — all labeled fictional Demo Mode.
