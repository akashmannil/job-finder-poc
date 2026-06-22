# 12 — SLA & two-way conduct score

> Commit: `feat: SLA & two-way conduct score`
> Nav: [← Prev](11-consent-apply.md) · [Index](DEVLOG.md) · [Next →](13-recruiter-dashboard.md)

## What this adds

The accountability layer. Applications carry a response SLA; if it lapses without a decision,
the application auto-closes (the ghost path, made explicit). A **two-way conduct score** turns
behavior into reputation — recruiter (decide, on time?) and candidate (engage when courted?). A
`TimeControls` widget fast-forwards a simulated clock so SLA expiry can be demoed in seconds.

## Why (meaning of the change)

This is the anti-ghosting thesis as a mechanism. Silence is no longer free: an ignored
application auto-resolves and **debits the recruiter's conduct score**. Conduct is also the
platform's reputation signal — deliberately the *only* score on a profile, replacing vanity
metrics with evidence of behavior. The simulated clock makes the otherwise-invisible passage of
SLA time tangible in a demo.

## Files in this commit

- [`lib/sla.ts`](../lib/sla.ts) — SLA window, deadlines, overdue/label helpers, and
  `autoResolveLapsed` (pure).
- [`lib/conductScore.ts`](../lib/conductScore.ts) — `recruiterConduct` and `candidateConduct` (pure).
- [`components/common/ConductScore.tsx`](../components/common/ConductScore.tsx) — the reputation badge.
- [`components/common/TimeControls.tsx`](../components/common/TimeControls.tsx) — simulated-clock control.
- [`store/store.tsx`](../store/store.tsx) — `clockOffset`, `now()`, `advanceClock` (auto-resolves
  lapsed apps), `resetClock`.
- [`components/common/IdentityPage.tsx`](../components/common/IdentityPage.tsx) — optional conduct badge.
- [`components/candidate/ApplicationTracker.tsx`](../components/candidate/ApplicationTracker.tsx) —
  live SLA countdown per application.
- [`app/layout.tsx`](../app/layout.tsx) — adds `TimeControls` to the header.
- [`app/page.tsx`](../app/page.tsx) — shows candidate conduct on the public profile.

## How to verify

Apply to a role, then click "+3d" / "+1d" in the header until a seeded or new application passes
its SLA — it flips to "Auto-closed (SLA lapsed)" in the tracker. The recruiter's conduct
(visible on the dashboard in commit 13) drops accordingly. `npx tsc --noEmit` passes.

## Decisions & notes

- Auto-resolution is one-way; resetting the clock stops further lapsing but doesn't reopen closed
  applications (matching real semantics).
- Conduct is computed purely from store data, so it always reflects current state.
