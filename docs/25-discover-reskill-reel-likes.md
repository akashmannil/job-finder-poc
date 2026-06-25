# 25 — Discover landing, reskilling reel & posting likes

> Commit: `feat: discover landing, infinite reskilling reel & posting likes` *(changes staged — not yet committed)*
> Nav: [← Prev](24-display-first-profile.md) · [Index](DEVLOG.md)

## What this adds

Three changes that make the candidate side pull users in (discovery first) and keep reskilling
front-and-centre as its own surface:

- **Discover is the new landing tab** (replaces Profile as the default). Instead of opening on your
  own profile, the app leads with **the market**: a highlight band of live stats, the single
  **most attractive offer** of the moment, a **trending roles** grid, and a teaser that jumps to the
  reskilling feed. The intent is the same reason a storefront leads with the best product — give a
  reason to come back.
- **Reskilling is its own tab, as an infinite, reels-style feed** (no longer stacked under Matches).
  Each card advertises a skill you’re missing — pulled from your **match gaps**, skills **adjacent**
  to your stack, and the **most in-demand** skills on the market — with a fun pitch and the courses
  that close it. Scrolling loads more endlessly, so it works even before you’ve run a match.
- **Likes on postings.** A heart toggle with a live count on Discover and Match cards. Likes are a
  **market-demand signal on roles**, deliberately separate from the platform’s no-vanity-metrics
  rule for *people* — postings can be popular; profiles still carry only the conduct score.

The candidate tabs are now **Discover · Profile · Matches · Reskilling · Applications**.

## Why (meaning of the change)

Two problems motivated this. First, **Matches + Reskilling on one page** conflated "roles to apply
to" with "skills to grow" — two different jobs-to-be-done sharing one scroll. Splitting Reskilling
into its own tab lets each be designed for its purpose: Matches stays a ranked decision list;
Reskilling becomes an open-ended, motivating feed.

Second, **landing on your own profile is a weak hook** — there's nothing new to see. Leading with
the market's best offers and a popularity signal gives the app a reason-to-open and a sense of life,
without compromising the people-side principle (no likes/followers on humans). The reskilling reel
turns "here are your gaps" (a chore) into "here's what's hot and how to get it" (an advertisement),
which is the right tone for growth.

## Files in this commit

- [`lib/likes.ts`](../lib/likes.ts) — **new.** Seeded, deterministic base like counts per posting;
  `likeCount`, an `attractiveness` score, `trendingJobs`, `marketStats`, and `topSkillsInDemand`
  (requirement frequency, must-haves weighted double).
- [`lib/reskill.ts`](../lib/reskill.ts) — adds the infinite-feed builder: `buildPool`
  (gaps → adjacent → trending, deduped against owned skills) and `reskillPage`, which cycles the
  pool with rotating "advertising" pitches so the feed never runs dry.
- [`components/candidate/Discover.tsx`](../components/candidate/Discover.tsx) — **new.** The landing
  surface: market stats, hero offer, trending grid, and the reskill teaser (jumps to the reel tab).
- [`components/candidate/ReskillReel.tsx`](../components/candidate/ReskillReel.tsx) — **new.** The
  infinite-scroll reskilling feed (IntersectionObserver paging, capped at `MAX_PAGES`), with the
  in-progress toggle carried over from the old panel.
- [`components/candidate/LikeButton.tsx`](../components/candidate/LikeButton.tsx) — **new.** The
  reusable heart toggle + count.
- [`store/store.tsx`](../store/store.tsx) — `likedJobs` slice + `toggleLike` (persisted).
- [`app/page.tsx`](../app/page.tsx) — five-tab candidate workspace; default view is **Discover**;
  Matches renders only `MatchResults` now.
- [`components/candidate/MatchCard.tsx`](../components/candidate/MatchCard.tsx) — a like button on
  each match card.
- **Removed:** `components/candidate/ReskillPanel.tsx` (replaced by the reel).

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. As **Candidate**, the app opens on **Discover** — stats, an "Offer of the moment", trending
   roles, and a reskilling teaser. Tap a **♡** to like a posting; the count ticks up and persists.
2. Click the teaser (or the **Reskilling** tab) → an endless feed of skill cards; scroll and more
   load. **Start reskilling** on one — it’s flagged on your profile.
3. **Matches** now shows only the ranked matches (each with a like button); **Applications** is
   unchanged.

## Decisions & notes

- **Likes scope = postings only.** This is the deliberate exception to the no-vanity-metrics rule,
  which remains in force for people/profiles. Recorded in the project memory.
- **Base like counts are seeded** (hash of job id + a small pay boost) so the market looks alive in a
  no-backend POC; the candidate's own like adds one on top.
- **The reel is "infinite" but bounded** by `MAX_PAGES` to avoid unbounded DOM growth; the pool
  cycles with rotating copy so repeats feel fresh.
- **Reskilling works pre-match**: with no gaps yet, the feed falls back to adjacent + in-demand
  skills, so the tab is never empty for a candidate with any skills.
