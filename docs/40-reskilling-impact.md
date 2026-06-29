# 40 - Reskilling incentives (what a skill unlocks)

> Commit: `feat: reskilling impact stats (roles unlocked, demand, pay)`
> Nav: [Prev](39-dash-cleanup.md) · [Index](DEVLOG.md) · [Next](41-matching-incentives.md)

## What this adds

Every card in the reskilling reel now shows the concrete payoff of learning that skill, so the user
sees a reason beyond "you have a gap":

- **roles want it** - how many open postings list the skill.
- **of postings** - its market demand as a percentage.
- **roles pay (median)** - the median top-of-band pay across roles that want it.
- A green **pay-premium** line when those roles pay meaningfully above the market median
  ("Pays about $Xk above the market median").

All figures are computed live from the job set, so they stay honest and need no upkeep.

## Why (meaning of the change)

The reskilling feed listed skills and courses but never answered "what's in it for me?" Showing
roles unlocked, demand, and pay turns each card into an offer: learn this and you match more, earn
more, and show up more in the market. It reinforces the platform thesis (growth is a positive,
visible signal) with numbers rather than exhortation.

## Files in this commit

- `lib/skillImpact.ts` - new: `skillImpact(skill)` returns roles, demand %, median pay, and pay
  premium vs the market median (all from `JOBS`).
- `lib/copy/candidate.ts` - reskilling impact labels added to `reskillCopy`.
- `components/candidate/ReskillReel.tsx` - each card renders an impact stat strip (+ premium line),
  shown only when at least one posting wants the skill.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Open **Reskilling**: each card shows the
roles / demand / pay strip, with a pay-premium callout on the higher-paying skills.

## Decisions & notes

- The strip is hidden for skills no posting lists (avoids a discouraging "0 roles want it").
- Pay premium only shows at >= $1k so a rounding-to-$0k line never appears.
- Pairs with commit 41, which adds the matching-side incentives (salary + projected fit lift).
