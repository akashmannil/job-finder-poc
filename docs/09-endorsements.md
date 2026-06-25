# 09 — Evidence-backed endorsements

> Commit: `feat: evidence-backed endorsements`
> Nav: [← Prev](08-reskilling.md) · [Index](DEVLOG.md) · [Next →](10-identity-page.md)
>
> **Note:** the standalone `Endorsements.tsx` was later removed in
> [24 — Display-first candidate profile](24-display-first-profile.md); the same add/validate logic
> now lives in the Endorsements section of `components/candidate/CandidateProfile.tsx`. The
> validation/weighting rules (`lib/endorsements`) are unchanged.

## What this adds

An endorsement surface where each endorsement must carry a **skill, a stated relationship, and a
specific evidence sentence** — no one-tap "endorse for Leadership." Endorsements are stored and
shown with a credibility weight derived from the relationship.

## Why (meaning of the change)

This is the anti-gaslighting fix applied to social proof. LinkedIn's endorsements are noise
because they're frictionless and contextless. Here, the validation rules force specificity, and
the relationship drives a visible credibility weight (manager/client read stronger than "other"),
so an endorsement carries information instead of vanity. It's the same "proof over reach"
principle as the evidence tiers, applied to what others say about you.

## Files in this commit

- [`types/index.ts`](../types/index.ts) — `Endorsement`, `EndorsementRelationship`.
- [`lib/endorsements.ts`](../lib/endorsements.ts) — relationship weights, validation (requires a
  ≥20-char evidence sentence), and a factory. Pure, no AI.
- [`store/store.tsx`](../store/store.tsx) — `endorsements` + `addEndorsement` / `removeEndorsement`.
- [`components/candidate/Endorsements.tsx`](../components/candidate/Endorsements.tsx) — the
  add/list UI with validation and animated rows.
- [`app/page.tsx`](../app/page.tsx) — adds the section to the candidate workspace.

## How to verify

In Candidate, try to add an endorsement with a too-short evidence sentence — it's rejected with a
clear message. Add a valid one — it appears with the relationship's credibility weight, and
persists across reload. `npx tsc --noEmit` passes.

## Decisions & notes

- Endorsements are self-entered in this POC (no real endorser auth); the *structure* — relationship
  + specific evidence + weight — is the point and is what a real system would verify.
- They surface on the public identity page (commit 10) and the consented recruiter view (commit 11).
