# 11 — Consent & apply + application tracker

> Commit: `feat: consent & apply + application tracker`
> Nav: [← Prev](10-identity-page.md) · [Index](DEVLOG.md) · [Next →](12-sla-conduct.md)

## What this adds

Applying. From a match card, the candidate opens a consent dialog, chooses exactly what to share
(with a live recruiter preview), and submits — which creates an `Application` carrying a **consent
snapshot**. An `ApplicationTracker` shows the live status of the candidate's own applications. A
few seeded applications from other candidates populate the recruiter dashboard (next commit).

## Why (meaning of the change)

The `Application` is **the pivot object** that makes the platform two-sided (PROMPT §3). It
captures the candidate's *consented* data at apply time — selective disclosure in action — so the
recruiter only ever sees what was approved. The consent preview reuses the same `IdentityPage`,
so what you see is exactly what they get. This is the data handoff the recruiter side acts on.

## Files in this commit

- [`types/index.ts`](../types/index.ts) — `Application`, `ApplicationStatus`, `ConsentChoices`,
  `ConsentSnapshot`.
- [`lib/consent.ts`](../lib/consent.ts) — `applyConsent` (filters the profile by choices) + field list.
- [`lib/applications.ts`](../lib/applications.ts) — status metadata, terminal check, relative time.
- [`lib/seedApplications.ts`](../lib/seedApplications.ts) — seeded applications for recruiter rec-1
  (one nearing its SLA).
- [`store/store.tsx`](../store/store.tsx) — `applications` + `addApplication` / `updateApplication`.
- [`components/candidate/ConsentShare.tsx`](../components/candidate/ConsentShare.tsx) — consent
  dialog with live recruiter preview.
- [`components/candidate/ApplicationTracker.tsx`](../components/candidate/ApplicationTracker.tsx) —
  the candidate's live status list.
- [`components/candidate/MatchCard.tsx`](../components/candidate/MatchCard.tsx) — Apply button +
  applied state.
- [`app/page.tsx`](../app/page.tsx) — adds the tracker to the workspace.

## How to verify

Candidate → run a match → "Apply" on a card → uncheck a field and watch the preview update →
submit. The card shows "Applied ✓" and the application appears in the tracker. `npx tsc --noEmit`
passes.

## Decisions & notes

- The consented snapshot is stored on the application, not a live reference — revoking/editing the
  profile later doesn't change what was already shared (matching real consent semantics).
- `own` distinguishes the candidate's applications (tracker) from seeded ones (recruiter dashboard).
