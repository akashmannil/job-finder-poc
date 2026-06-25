# 26 — Candidate retention (honest, no baiting)

> Commit: `feat: candidate retention — activity digest, saved roles & reskilling progress`
> Nav: [← Prev](25-discover-reskill-reel-likes.md) · [Index](DEVLOG.md) · [Next →](27-recruiter-market.md)

## What this adds

Three reasons to come back that are built on **delivered value, not dark patterns** — no streaks,
no "people viewed you", no manufactured urgency:

- **"While you were away" digest** on Discover — a calm recap that renders *only* when a real
  recruiter decision landed on one of your applications since your last session. Nothing happened →
  nothing shown.
- **Saved roles** on Discover — the postings you liked, as a plain watchlist with honest info (pay,
  applied state) and an apply button. No "filling fast" pressure.
- **Your progress** on the Reskilling tab — a private, factual snapshot (skills on profile, verified
  by evidence, currently growing). Progress you can see, not perform.

## Why (meaning of the change)

Retention is the obvious place a "proof over reach" product could betray itself — the easy levers
(vanity counts, loss-aversion streaks, FOMO) are exactly the [anti-gaslighting principles] we
reject. So the rule here is: a returning user should find **something genuinely new and useful**, or
nothing at all. The digest reports facts that changed; the watchlist is a convenience; the progress
panel is private and free of guilt. Each is dismissable by simply being empty when there's no signal.

## Files in this commit

- [`store/store.tsx`](../store/store.tsx) — adds `lastSeenAt` (persisted) and exposes
  `previousSeenAt`; on hydrate it captures the prior session's stamp, then writes the new one, so the
  digest can diff the gap.
- [`lib/activity.ts`](../lib/activity.ts) — **new.** `activityDigest(apps, since)` returns only the
  application status changes (offer / rejected / reviewing) that occurred after `since`; empty on the
  first visit.
- [`components/candidate/ActivityDigest.tsx`](../components/candidate/ActivityDigest.tsx) — **new.**
  The recap card (renders nothing when empty).
- [`components/candidate/SavedRoles.tsx`](../components/candidate/SavedRoles.tsx) — **new.** The
  liked-roles watchlist.
- [`components/candidate/ReskillProgress.tsx`](../components/candidate/ReskillProgress.tsx) —
  **new.** The private progress snapshot.
- [`components/candidate/Discover.tsx`](../components/candidate/Discover.tsx) — mounts the digest
  (top) and saved roles (after trending).
- [`components/candidate/ReskillReel.tsx`](../components/candidate/ReskillReel.tsx) — mounts the
  progress panel above the feed.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. As **Candidate**, like a couple of roles on **Discover** → a **Saved roles** list appears.
2. **Reskilling** tab → **Your progress** shows your skill/verified/growing counts.
3. To see the digest: apply to a role, switch to **Recruiter**, send a decision, advance the clock
   if needed, then reload as **Candidate** — "While you were away" recaps the decision. With no new
   decisions (or on a first visit) it stays hidden.

## Decisions & notes

- **No baiting, by design** (the user's explicit constraint). Every surface here is either factual
  or empty — there are no counts of attention, no urgency, no streak to break.
- `lastSeenAt` is wall-clock (`Date.now()`), independent of the simulated SLA clock, so the digest
  reflects real return visits.
- The digest keys off `respondedAt > previousSeenAt`; auto-closed applications aren't timestamped
  separately, so they surface in the tracker rather than the recap.
