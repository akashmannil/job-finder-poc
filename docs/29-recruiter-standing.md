# 29 - Recruiter Standing (profile + decisions owed)

> Commit: `feat: recruiter standing tab - identity, response score & decisions owed`
> Nav: [← Prev](28-recruiter-talent.md) · [Index](DEVLOG.md) · [Next →](30-docs-sweep.md)

## What this adds

The recruiter's **Standing** tab - the mirror of the candidate's display-first profile: how the
recruiter currently looks and what they owe.

- **Identity + public response score** - company, hiring contact, and the conduct score with a
  factual breakdown (on time / late / ghosted), plus a "no vanity metrics" note that applies to
  recruiters too.
- **Snapshot** - open postings, applicants, median response time, and overdue count.
- **Needs your decision** - every application still waiting on the recruiter, sorted by SLA urgency
  (overdue first), with a one-click jump to **Postings** to act. This is the anti-ghosting loop made
  personal: the thing that keeps the score high is simply deciding on time.

## Why (meaning of the change)

The candidate has a profile that shows "how you currently are"; the recruiter needed the same. But a
recruiter's reputation isn't a headshot and a follower count - it's behavior. So Standing leads with
the **conduct score and the decisions owed**, turning the abstract "be accountable" principle into a
concrete, actionable list. It doubles as honest recruiter retention: a reason to return that is the
recruiter's own commitment, not a manufactured nudge.

## Files in this commit

- [`components/recruiter/RecruiterStanding.tsx`](../components/recruiter/RecruiterStanding.tsx) -
  **new.** Identity + conduct header, snapshot stats, and the SLA-sorted "needs your decision" list
  (computed from `recruiterConduct`, `msLeft`, `isOverdue`).
- [`app/page.tsx`](../app/page.tsx) - adds the **Standing** tab; its "Review in Postings" action
  switches the recruiter workspace to the Postings tab.

The recruiter workspace tabs are now complete: **Market · Talent · Postings · Standing**.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. **Recruiter → Standing** - company identity, the public response score with its breakdown, and a
   snapshot (postings / applicants / median response / overdue).
2. **Needs your decision** lists pending applicants by urgency. Use **⏱ +3d** in the header to push
   one overdue - it jumps to the top in red.
3. **Review in Postings** switches to the Postings tab to actually decide.

## Decisions & notes

- Standing reads the same `recruiterConduct` and SLA helpers as the dashboard, so the score and
  deadlines are consistent across tabs.
- No new state - it's a view over existing applications, so it always reflects current behavior.
