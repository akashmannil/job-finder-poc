# 08 - Reskilling loop

> Commit: `feat: reskilling loop`
> Nav: [← Prev](07-assessment-passport.md) · [Index](DEVLOG.md) · [Next →](09-endorsements.md)

## What this adds

After a match, the gaps become a growth plan. `ReskillPanel` shows each gap skill (must-have
first) with the courses that teach it, and a "Mark in progress" toggle that flags the skill as
`currentlyReskilling` on the profile.

## Why (meaning of the change)

This closes the loop the platform is built around: **gap → learn → (re-assess) → better match.**
Crucially, marking a skill in progress turns *willingness to reskill* into a first-class,
visible signal - something a static résumé can't express and a recruiter would value. It also
reframes a rejection-by-gap as a concrete next step instead of a dead end.

The matcher already softens a gap slightly when a skill is `currentlyReskilling`, so toggling it
feeds back into the next match.

## Files in this commit

- [`lib/reskill.ts`](../lib/reskill.ts) - `aggregateGaps` (dedupe across matches, must-have wins)
  and `recommendCourses` (gap → courses). Pure, no AI.
- [`store/store.tsx`](../store/store.tsx) - adds `matchGaps` + `setMatchGaps`.
- [`components/candidate/MatchResults.tsx`](../components/candidate/MatchResults.tsx) - writes the
  aggregated gaps to the store after each match.
- [`components/candidate/ReskillPanel.tsx`](../components/candidate/ReskillPanel.tsx) - course
  recommendations + the reskilling toggle.
- [`app/page.tsx`](../app/page.tsx) - adds the panel to the candidate workspace.

## How to verify

Run a match, scroll to Reskilling: gap skills appear with linked courses. Toggle "Mark in
progress" - the skill gets a "reskilling" chip in the profile, and a follow-up match treats that
gap a little more kindly. `npx tsc --noEmit` passes.

## Decisions & notes

- Gaps are sourced from the latest match (stored in `matchGaps`), so the panel reflects real fit
  gaps rather than a generic list.
- Marking a gap skill in progress adds it to the profile if it wasn't already there.
