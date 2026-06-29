# 05 - Candidate profile builder & evidence tiers

> Commit: `feat: candidate profile builder & evidence tiers`
> Nav: [← Prev](04-matcher.md) · [Index](DEVLOG.md) · [Next →](06-match-results.md)
>
> **Note:** `ProfileBuilder.tsx` was later removed in
> [24 - Display-first candidate profile](24-display-first-profile.md); its edit logic now lives,
> gated behind an explicit *Edit*, in `components/candidate/CandidateProfile.tsx`. The evidence
> tiers and `EvidenceBadge` are unchanged.

## What this adds

The candidate workspace's profile builder: edit identity, skills (each with an evidence tier),
experience, and projects, all bound to the shared store. A reusable `EvidenceBadge` renders the
four tiers, and a "Load sample profile" button fills realistic data for one-click demoing.

## Why (meaning of the change)

This is the **verified profile that replaces the résumé** - the thing the matcher consumes. The
UI makes evidence a deliberate, visible choice: every skill carries an evidence tier, and the
badge gives verified tiers more visual weight than self-asserted claims, mirroring how the
matcher weights them. Assessment-passed evidence will later be *earned* (commit 07) rather than
self-selected, reinforcing that proof beats claims.

## Files in this commit

- [`components/common/EvidenceBadge.tsx`](../components/common/EvidenceBadge.tsx) - tiered badge,
  visual weight tracking evidence strength.
- [`lib/sampleProfile.ts`](../lib/sampleProfile.ts) - the one-click demo profile.
- [`components/candidate/ProfileBuilder.tsx`](../components/candidate/ProfileBuilder.tsx) - the
  full editor (identity, skills, experience, projects) with animated add/remove.
- [`app/page.tsx`](../app/page.tsx) - renders the builder in the candidate workspace.

## How to verify

In the Candidate role, click "Load sample profile" - fields populate and skills appear with
evidence badges. Add/remove skills (rows animate), change a skill's evidence, edit experience and
projects. Everything persists across reload via the store. `npx tsc --noEmit` passes.

## Decisions & notes

- The evidence dropdown allows all four tiers for editing convenience in the POC; in commit 07
  `assessment_passed` becomes something you *earn* by passing an assessment.
- Skills are de-duplicated by name on add.
