# 36 - Editable copy module + candidate copy

> Commit: `refactor: centralize candidate copy into editable variant constants`
> Nav: [Prev](35-peer-search-visibility.md) · [Index](DEVLOG.md) · [Next](37-copy-candidate-profile.md)

## What this adds

The start of moving all hardcoded UI text out of components and into an editable copy module, where
each string is an **array of phrasings picked at random** so the product reads a little differently
each visit.

- A tiny copy system: `pick(arr)` (pure) and `useVariant(arr)` (a hook that resolves one variant
  **once per mount**, so text is stable across re-renders and never mismatches between server and
  client).
- `lib/copy/candidate.ts` holds the candidate-side copy. Sentences/headings are variant arrays;
  truly atomic CTAs (button verbs like Apply) stay single strings on purpose, because randomizing a
  button verb hurts usability.
- The candidate **discovery / matches / reskilling / applications** components now read from these
  constants instead of inline literals.

## Why (meaning of the change)

Copy was scattered across dozens of components, so tweaking tone meant hunting through JSX. Pulling
it into one place makes it trivially editable, and the array-of-variants shape adds variety without
extra wiring. This also removes a batch of em-dash / "AI-sounding" phrasing as the strings move
(the full dash sweep across the repo lands in commit 39).

## Files in this commit

- `lib/copy/pick.ts`, `lib/copy/useVariant.ts` - the helper + hook.
- `lib/copy/candidate.ts` - candidate copy (discover, matches, match reel, reskill, progress, saved
  roles, activity digest, applications).
- Migrated components: `Discover`, `MatchResults`, `MatchCard`, `MatchReel`, `ReskillReel`,
  `ReskillProgress`, `SavedRoles`, `ActivityDigest`, `ApplicationTracker`.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Reload the candidate side a few times: headings,
subtitles, and empty states vary between visits; labels and buttons stay constant.

## Decisions & notes

- **Pick once per mount** (not per render) to avoid flicker and SSR hydration mismatches.
- **Atomic labels stay single strings** - a deliberate exception to "everything gets variants",
  since flipping button verbs would be confusing. Everything is still centralized and editable.
- Candidate profile / consent / assessment copy follows in commit 37; recruiter, messaging, and
  shared chrome in commit 38.
