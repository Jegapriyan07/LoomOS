# STAGE 2 — Reverse Production Planner

**Priority:** Core

## Logic (calendar days)

- Dispatch = Target − shipping buffer
- Finish Production = Dispatch − QC/packing buffer
- Start Weaving = Finish − category weaving days
- Yarn Purchase = Start Weaving − yarn procurement lead time
- Expected Payment = Dispatch + settlement stub (default 2 days until Stage 4)

## Delivered

- Plan tab: category + target date (sample festival calendar) + vertical timeline
- Editable duration/buffer table (localStorage) — illustrative defaults, not verified facts
- NHDC 15% yarn subsidy via DBT as eligibility nudge only (no API)

## Check before moving on

- [x] Changing target date recalculates downstream dates
- [x] Duration table editable in-app
- [x] NHDC line is a nudge, not an integration claim
