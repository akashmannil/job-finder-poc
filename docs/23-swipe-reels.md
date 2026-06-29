# 23 - Swipe reels (candidate & recruiter)

> Commit: code landed in `caf71cf` (*chore: viewing changes and addition of tinder like views*); this doc back-fills the trail.
> Nav: [← Prev](22-section-navigation.md) · [Index](DEVLOG.md) · [Next →](24-display-first-profile.md)

## What this adds

A second, **swipe-to-decide** way to move through the two highest-volume queues in the app -
modelled on the card-swipe interaction people already know (Tinder-style horizontal swipe, with an
Instagram-reel-like one-card-at-a-time focus). It is **additive**: the existing list views are
untouched and a **List / Reel** toggle picks the mode.

- **Candidate - match reel.** Swipe a job card **right to apply**, **left to skip**. Right-swipe
  opens the existing consent dialog, so the candidate still controls exactly what they share - the
  double-opt-in principle is preserved, not bypassed for a one-tap apply.
- **Recruiter - review reel.** Swipe an applicant card **right to shortlist** (moving forward) or
  **left to pass**. Each swipe sends the *same* templated decision the list view's `DecisionPanel`
  would, via the existing local decision engine - recruiters still answer on the clock, just faster.

Every deck also works without dragging: **← / → arrow keys** and the on-card **action buttons**
do the same thing, and a decision **stamp** ("APPLY/SKIP", "SHORTLIST/PASS") fades in as you drag.

## Why (meaning of the change)

Lists are great for scanning and comparison, but triage - "do I want this or not?" repeated dozens
of times - is faster as a focused, one-decision-at-a-time gesture. Offering it as an *alternative*
mode (not a replacement) lets each user pick the shape that fits the task without losing the
detail-rich list. Reusing the **same** apply/consent and decision/SLA logic underneath means the
new surface introduces no new rules - only a new way to drive the existing ones.

## Files in this commit

- [`components/common/SwipeDeck.tsx`](../components/common/SwipeDeck.tsx) - a reusable, generic
  Tinder-style deck. Owns drag/fling (Framer Motion `useMotionValue` + `animate`), the rotate/stamp
  transforms, keyboard (← →), the action buttons, a peek of the next card, and a progress counter.
  It is presentation-only: callers pass `items`, `renderCard`, and `onSwipe`, and decide what a
  swipe *means*. It runs on a stable index over the passed list, so acting on a card never
  reshuffles the deck mid-swipe.
- [`components/candidate/MatchReel.tsx`](../components/candidate/MatchReel.tsx) - wraps `SwipeDeck`
  over the match results; right-swipe opens [`ConsentShare`](../components/candidate/ConsentShare.tsx),
  left-swipe skips. Renders a full-height job card (score ring, why-it-fits, gaps).
- [`components/candidate/MatchResults.tsx`](../components/candidate/MatchResults.tsx) - adds the
  **List / Reel** toggle (shown once there are results) and renders the chosen view.
- [`components/recruiter/ReviewReel.tsx`](../components/recruiter/ReviewReel.tsx) - wraps `SwipeDeck`
  over the recruiter's open (non-terminal) applicants, snapshotted once. Right = `moving_forward`,
  left = `skills_gap`, both routed through [`lib/decision`](../lib/decision.ts) +
  `updateApplication` (status, `respondedAt`, drafted message).
- [`components/recruiter/RecruiterDashboard.tsx`](../components/recruiter/RecruiterDashboard.tsx) -
  adds the **List / Review reel** toggle above the applicants.

## How to verify

`npx tsc --noEmit` passes and the dev server compiles `/` with `200`.

1. As **Candidate** → **Matches** → *Find matches*, switch the toggle to **Reel**. Drag a card
   right (the **APPLY** stamp fades in) → the consent dialog opens; drag left to skip. The ← →
   keys and the ✕ / ♥ buttons do the same. The counter tracks position; the end shows a done card.
2. As **Recruiter** → **Review reel**: swipe right to shortlist, left to pass. Switch to **List** -
   the decisions you swiped are reflected there with their templated messages.

## Decisions & notes

- **Consent is kept on the candidate apply path.** A right-swipe opens the consent dialog rather
  than auto-applying - selective disclosure is a core product value, so the reel speeds up *reaching*
  the decision, not the disclosure choice.
- **Recruiter swipes are final and templated.** A swipe sends immediately (left defaults to the
  "skills gap" wording). The reel is fast first-pass triage; to refine a message, use the list
  view's `DecisionPanel`. Easy to change later to "stage, then send" if wanted.
- **Decks run on a snapshot.** Both reels capture their list once so an action never reorders the
  cards under the user's thumb; re-entering the reel re-snapshots.
- Additive only - no data-model, engine, or store changes.
