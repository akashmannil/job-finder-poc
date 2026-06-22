# 10 — Public identity page (no vanity metrics)

> Commit: `feat: public identity page (no vanity metrics)`
> Nav: [← Prev](09-endorsements.md) · [Index](DEVLOG.md) · [Next →](11-consent-apply.md)

## What this adds

A presentational `IdentityPage` that renders a candidate's public profile: identity, skills
sorted by evidence strength, endorsements, experience, and projects — with a "currently
reskilling" row. A Workspace ⇄ Public profile toggle in the candidate view lets you preview it.

## Why (meaning of the change)

This is the anti-gaslighting thesis made visible. The page **deliberately shows no vanity
metrics** — no views, followers, likes, or connection counts — and says so on the page itself.
Status comes only from evidence: skills lead with their strongest verification, endorsements
carry relationship context, reskilling is framed as a positive. It's the calm, proof-first
alternative to a performance feed.

The component is intentionally pure/presentational so it can be **reused for the recruiter's
consented view** (commit 11) — the same identity, filtered by what the candidate approved.

## Files in this commit

- [`components/common/IdentityPage.tsx`](../components/common/IdentityPage.tsx) — the reusable,
  vanity-metric-free profile view.
- [`app/page.tsx`](../app/page.tsx) — Workspace/Public-profile toggle in the candidate workspace.

## How to verify

Candidate → load sample profile → switch to "Public profile": the identity page renders skills
strongest-evidence-first, endorsements, and reskilling, with the "no vanity metrics" note. No
counts of any kind appear. `npx tsc --noEmit` passes.

## Decisions & notes

- Keeping `IdentityPage` props-driven (profile + endorsements) is what lets the recruiter reuse it
  with a consent-filtered profile next.
- The conduct score is added to this page in commit 12, once it exists.
