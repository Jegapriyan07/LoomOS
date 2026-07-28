# STAGE 3 — Transparent Demand Intelligence Engine

**Priority:** Core

## Formula

Demand Score (0–100) =
`0.5 × Buyer Signal + 0.3 × Seasonal Proximity + 0.2 × Historical Signal`

## Data honesty

- Buyer requirements: LoomOS DB (`data/loomos-store.json`) + `/admin/requirements`
- Festival calendar: hardcoded public calendar with source notes
- Trends: manual admin entry only — never a live Google Trends API
- Ledger: CSV upload at `/admin/ledger`; Historical = 0 if empty and no manual trend

## Check before moving on

- [x] Changing a buyer requirement moves the demand score
- [x] Why? shows real weights + named raw inputs
- [x] Manual trend labeled “Manually updated — last refreshed [date]”
