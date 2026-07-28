# STAGE 5 — Income Stability Wallet

**Priority:** Core

## Rules (one sentence each)

- Income log = Settlement Released order amounts only — never invented rows.
- Trailing average = sum of settled amounts in the last 6 calendar months ÷ 6, only after ≥6 distinct months of settled history; otherwise “not enough history yet.”
- Above average → suggest moving the weaver’s chosen % of surplus into Reserve.
- Below average → offer draw from Reserve up to the shortfall without going below the reserve floor.
- Projected next-month income = trailing average when ready; always labeled **Projected** with rule on tap.

## Check before moving on

- [x] Under 6 months of seed data → honest “not enough history” (no fabricated average)
- [x] Every projected number labeled; rule visible on tap
