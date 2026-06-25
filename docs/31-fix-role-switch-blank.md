# 31 — Fix blank page on role switch

> Commit: `fix: blank page when switching recruiter → candidate (nested AnimatePresence)` *(changes staged — not yet committed)*
> Nav: [← Prev](30-docs-sweep.md) · [Index](DEVLOG.md)

## What this fixes

Switching role from **Recruiter** back to **Candidate** showed an **empty page** — the candidate
workspace never appeared after the transition.

## Why it happened (root cause)

`Home` wrapped the active workspace in an outer `AnimatePresence mode="wait"` keyed by `role`, and
**each workspace already contains its own** `AnimatePresence mode="wait"` (keyed by the active tab).
That's two nested `mode="wait"` presences.

`mode="wait"` holds the *entering* child until the *exiting* child reports it's safe to remove. With
a nested `AnimatePresence` inside the exiting subtree, that "safe to remove" promise can fail to
resolve, so the outer presence **deadlocks**: the exiting workspace is gone, but the incoming one is
never mounted — a persistent blank page. It only surfaced when *returning* to candidate because the
first render is a plain mount, not a presence swap.

## The fix

De-nest the presences. The outer `AnimatePresence` is removed; the role swap now uses a plain,
key-ed `motion.div`. Changing `key={role}` remounts the workspace and replays its enter animation
(fade/slide in) on every switch — without an exit-promise to deadlock. Each workspace keeps its own
inner tab `AnimatePresence`, which is now the only presence in the tree, so tab transitions are
unchanged.

Trade-off: the role switch no longer plays an *exit* animation (the new workspace simply animates
in). That's an imperceptible change next to the bug it removes.

## Files in this commit

- [`app/page.tsx`](../app/page.tsx) — `Home` returns a key-ed `motion.div` instead of an outer
  `AnimatePresence mode="wait"`; a comment documents why nesting is avoided. `AnimatePresence` is
  still imported and used by the inner workspace tab transitions.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. Start as **Candidate** (default) — the Discover page renders.
2. Switch to **Recruiter** — the recruiter Market renders.
3. Switch back to **Candidate** — the workspace renders immediately (previously blank). Repeat a few
   times; every switch shows content.
4. Tab transitions within each role still cross-fade as before.

## Decisions & notes

- Root cause is a documented Framer Motion limitation (nested `AnimatePresence mode="wait"`), not a
  data/logic bug — so the fix is structural, with no change to the store or any feature.
