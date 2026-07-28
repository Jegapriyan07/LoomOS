# STAGE 4 — Smart Payment & Escrow System

**Priority:** Core

## State machine

Order Created → Advance Requested → Advance Paid (Escrow Held) → Production In Progress → Dispatched → Settlement Released  
↳ after Dispatched: Dispute Opened → Under Review → Resolved

## Compliance

- Visible **Prototype / simulated** note on Money + Admin Payments
- Copy uses “modeled on an RBI-authorised payment aggregator’s escrow settlement pattern”
- Never “our escrow account” / “we hold your money” / unqualified “RBI-licensed”
- Not legal advice — real deploy needs licensed-aggregator partnership or licensing review

## Trust Score

`0.5×OnTimeSettlementRate + 0.3×(1−DisputeRate) + 0.2×OrderCompletionRate`  
Labels: Excellent / Good / New / Needs Attention — components on tap

## Check before moving on

- [x] Walk order through states (Admin → Payments + Money tab)
- [x] No forbidden escrow/hold/licensed copy
- [x] Prototype note visible (bordered banner, not buried)
