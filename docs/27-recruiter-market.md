# 27 - Recruiter workspace tabs + Market & competition

> Commit: `feat: recruiter workspace tabs + market & competition view`
> Nav: [← Prev](26-candidate-retention.md) · [Index](DEVLOG.md) · [Next →](28-recruiter-talent.md)

## What this adds

The recruiter side gains the same kind of rich, tabbed experience the candidate side has. This
commit introduces the **tab shell** and the first new surface - a **Market** view that mirrors the
candidate's Discover:

- **Market stats** band - the same live headline facts (open roles, remote %, median pay, most-wanted
  skill).
- **Your standing** - how this recruiter's postings compare to the whole market: open-postings count,
  average top pay vs. market (with delta), average interest per role vs. market, and the **market
  rank** of each of their roles ("your strongest posting ranks #N of 30").
- **What candidates are drawn to** - the most attractive postings market-wide (popular roles), with
  the recruiter's own marked "Yours".
- **Your competition** - competitors' postings ranked by appeal, so the recruiter can benchmark pay
  and interest.

The recruiter workspace is now tabbed: **Market · Postings** (Postings is the existing dashboard).
Talent and Standing tabs arrive in commits 28-29.

## Why (meaning of the change)

The candidate side became a pull-you-in experience (Discover, reel, retention); the recruiter side
was a single dashboard. To keep both sides engaged, the recruiter needs the equivalent: a reason to
open the app that isn't just "process my queue." Benchmarking - *where do my roles stand, what's
hot, what are others offering* - is the recruiter's version of Discover, and it's honest signal
(pay, interest, rank) rather than vanity.

**Likes are read-only on the recruiter side**: postings show a popularity count, but recruiters
don't cast likes. Candidates express demand; recruiters observe it - keeping the signal meaningful.

## Files in this commit

- [`lib/recruiterMarket.ts`](../lib/recruiterMarket.ts) - **new.** `competitorJobs`,
  `recruiterStanding` (pay/interest vs market, per-posting market rank), reusing `attractiveness` /
  `baseLikes` from [`lib/likes.ts`](../lib/likes.ts).
- [`components/recruiter/RecruiterMarket.tsx`](../components/recruiter/RecruiterMarket.tsx) -
  **new.** The Market view (stats, standing, popular, competition).
- [`app/page.tsx`](../app/page.tsx) - `RecruiterWorkspace` reworked from a bare dashboard into a
  tabbed shell (Market · Postings) with the same segmented-control pattern as the candidate side.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. Switch to **Recruiter** (header toggle) - it opens on **Market**.
2. **Your standing** shows your postings' pay/interest vs market and each role's market rank.
3. **What candidates are drawn to** and **Your competition** list popular and competitor postings
   with pay and a read-only ♥ interest count.
4. **Postings** tab is the existing applicants dashboard, unchanged.

## Decisions & notes

- Standing/rank are computed from the seed jobs via the shared `attractiveness` score, so the
  candidate and recruiter market views agree on what "popular" means.
- This commit is structure + Market only; **Talent** (possible candidate matches) and **Standing**
  (recruiter profile + conduct) follow in 28 and 29 to keep each commit focused.
