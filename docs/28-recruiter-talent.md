# 28 - Recruiter Talent (possible matches + development)

> Commit: `feat: recruiter talent matches & development view`
> Nav: [← Prev](27-recruiter-market.md) · [Index](DEVLOG.md) · [Next →](29-recruiter-standing.md)

## What this adds

The recruiter's **Talent** tab - the mirror of the candidate's Matches:

- **Possible matches** - pick one of your postings and see a **sourcing pool** of candidates ranked
  by honest fit (the same matcher the candidate side uses, run in reverse). Each shows their fit
  score, a "why" summary, evidence-tiered skills, and gaps.
- **Invite to apply** - a double-opt-in gesture: the recruiter signals interest, the candidate still
  chooses to apply. No profile is shared without consent, consistent with the platform's contact
  model.
- **Talent development** - where your *required* skills are scarce in the pool (high demand, low
  supply), with the **courses you could sponsor** to grow those candidates. This is the recruiter's
  view of the reskilling/training loop.

## Why (meaning of the change)

A recruiter shouldn't only react to inbound applicants - sourcing is half the job. Talent makes the
recruiter side symmetric with the candidate side: candidates see roles that fit them; recruiters see
candidates that fit their roles, scored on the *same* verified-evidence basis (so the fit number
means the same thing to both). Talent development reframes skill scarcity as something a recruiter
can act on - sponsor training - rather than just a gap to screen out, which fits the platform's
reskilling thesis.

## Files in this commit

- [`lib/matcher.ts`](../lib/matcher.ts) - exports `matchProfileToJob(profile, job)` (single
  profile × single job) so the recruiter can score candidates against a posting.
- [`lib/talent.ts`](../lib/talent.ts) - **new.** The seed `TALENT_POOL` (sourcing candidates),
  `talentForJob(job)` (ranked matches), and `talentDevelopment(recruiterId)` (demand vs pool supply
  per required skill, with courses).
- [`components/recruiter/RecruiterTalent.tsx`](../components/recruiter/RecruiterTalent.tsx) -
  **new.** Posting selector → ranked candidate cards (with Invite to apply) → talent-development grid.
- [`app/page.tsx`](../app/page.tsx) - adds the **Talent** tab between Market and Postings.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. **Recruiter → Talent**. Pick a posting from the selector - candidates re-rank by fit for that role.
2. Each candidate shows a score, evidence-tiered skills, and gaps. **Invite to apply** flips to
   "Invited" with a note that they choose whether to apply.
3. **Talent development** lists your scarcest required skills (demand vs supply) and courses to grow
   them.

## Decisions & notes

- The sourcing pool is **separate from applicants** (seed `TALENT_POOL`), so Talent is genuinely
  about discovery, not the inbound queue (that's the Postings tab).
- **Invite is local UI state** in this POC - it doesn't yet write to the store or create an
  application; it demonstrates the double-opt-in gesture without bypassing candidate consent.
- Fit uses the shared matcher, so a candidate and a recruiter looking at the same pairing see the
  same score.
