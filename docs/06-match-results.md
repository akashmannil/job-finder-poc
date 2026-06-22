# 06 — Match results UI

> Commit: `feat: match results UI`
> Nav: [← Prev](05-profile-builder.md) · [Index](DEVLOG.md) · [Next →](07-assessment-passport.md)

## What this adds

The candidate-facing matching experience: a "Find matches" action that calls `/api/match` with
the profile, and a ranked list of result cards. Each card shows an animated fit-score ring, why
the role fits (met requirements + the evidence that satisfied each), and skill gaps tagged by
severity. The top match is highlighted.

## Why (meaning of the change)

This closes the candidate matching loop and makes the thesis legible to a human: fit is
**explained**, not just scored. "Why it fits" cites the evidence behind each met requirement, and
gaps are visually separated into must-have (red) vs. nice-to-have (amber) — the same distinction
the matcher weights. Re-running after strengthening evidence (commit 07) visibly changes results.

## Files in this commit

- [`components/common/ScoreBadge.tsx`](../components/common/ScoreBadge.tsx) — animated SVG fit
  ring, color-coded by score band.
- [`components/candidate/MatchCard.tsx`](../components/candidate/MatchCard.tsx) — one job: score,
  summary, met requirements, gaps; top-match emphasis.
- [`components/candidate/MatchResults.tsx`](../components/candidate/MatchResults.tsx) — fetches
  `/api/match`, with loading skeletons, an error state, and staggered result reveal.
- [`app/page.tsx`](../app/page.tsx) — renders matches under the profile builder.

## How to verify

With a key in `.env.local`: Candidate role → load the sample profile → "Find matches". Cards
animate in ranked order with score rings; the top card is flagged. Without a key, the error state
renders the message from the route. `npx tsc --noEmit` passes.

## Decisions & notes

- The button reads "Re-run match" after the first run so re-matching post-verification is obvious.
- Fetch state lives in the component (POC scope); no global cache.
