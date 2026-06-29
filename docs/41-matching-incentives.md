# 41 - Matching incentives (pay + projected fit lift)

> Commit: `feat: matching incentives - salary and projected fit lift on match cards`
> Nav: [Prev](40-reskilling-impact.md) · [Index](DEVLOG.md)

## What this adds

Match cards now make the upside explicit, in both the list and the swipe reel:

- **Salary range** on every match card (it was only shown in the reel and on Discover before).
- **Projected fit lift** for the single most valuable gap: a callout like
  "Learn Kubernetes to reach about 88% fit (+16)" - the exact score the role would show if that skill
  were assessment-verified. It points at the must-have gap first, since that moves the number most.

## Why (meaning of the change)

Matching showed a fit score and a list of gaps, but never connected the two: a user couldn't see
that closing one gap would jump them from a weak to a strong match, or what the role pays. Surfacing
pay and a concrete "+N% fit" turns gaps from a discouraging list into a clear next step, and ties the
matching screen straight into the reskilling loop (the same skill shows its market payoff there).

## Files in this commit

- `lib/matcher.ts` - new `projectedFit(profile, job, skill)`: re-scores the job with the skill added
  (assessment-verified) and returns the resulting fit, reusing the existing matcher.
- `lib/copy/candidate.ts` - lift-callout labels added to `matchesCopy`.
- `components/candidate/MatchCard.tsx` - salary range + the fit-lift callout.
- `components/candidate/MatchReel.tsx` - the fit-lift callout on the swipe card.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Load a sample profile, run **Matches**: cards show
pay, and any card with a closable gap shows "Learn X to reach about Y% fit (+N)". The same skill in
**Reskilling** shows its market payoff (commit 40).

## Decisions & notes

- The callout only appears when the projected score is actually higher than the current one, so it is
  never a no-op.
- It targets the top must-have gap (falling back to the first gap), since must-haves carry the most
  matcher weight; the projection uses the real matcher, so card and projection always agree.
- Closes Phase 7 (incentives): reskilling payoff (40) + matching payoff (41).
