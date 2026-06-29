# 13 - Recruiter dashboard & consented applicant view

> Commit: `feat: recruiter dashboard & consented applicant view`
> Nav: [← Prev](12-sla-conduct.md) · [Index](DEVLOG.md) · [Next →](14-ai-decision.md)

## What this adds

The recruiter side. The dashboard shows the active recruiter's postings (with applicant counts
and an overdue indicator), their **public response score**, and per-applicant cards that expand
to the candidate's **consented** profile - only the fields the candidate chose to share, rendered
with the same identity view.

## Why (meaning of the change)

This is the other half of the two-sided handoff. The recruiter never sees raw candidate data -
only the consent snapshot captured at apply time, proving selective disclosure end to end. Their
own conduct score sits at the top of the dashboard, making accountability unavoidable: overdue
applications are flagged in red, and the score reflects how they've handled past ones.

## Files in this commit

- [`components/recruiter/ApplicantCard.tsx`](../components/recruiter/ApplicantCard.tsx) - one
  applicant: status, SLA countdown, and an expandable consented profile (reuses `IdentityPage`).
- [`components/recruiter/PostingCard.tsx`](../components/recruiter/PostingCard.tsx) - a posting
  with applicant/pending/overdue counts and its applicants.
- [`components/recruiter/RecruiterDashboard.tsx`](../components/recruiter/RecruiterDashboard.tsx) -
  the dashboard with the recruiter's response score.
- [`app/page.tsx`](../app/page.tsx) - renders the dashboard in the recruiter workspace.

## How to verify

Switch to the Recruiter role: seeded applicants appear under Northwind Labs' postings. Expand one
to see exactly the consented profile. Apply as a candidate to a Northwind role, switch back, and
it shows up. Fast-forward the clock until one goes overdue - the count turns red and the response
score drops. `npx tsc --noEmit` passes.

## Decisions & notes

- The recruiter side represents one fixed recruiter (`ACTIVE_RECRUITER_ID`); true multi-recruiter
  accounts are out of POC scope (noted in the README).
- Decision actions (advance/reject with an AI-drafted message) arrive in commit 14.
