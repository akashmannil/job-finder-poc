# 38 - Recruiter, messaging & shared copy

> Commit: `refactor: move recruiter, messaging & identity copy to constants`
> Nav: [Prev](37-copy-candidate-profile.md) · [Index](DEVLOG.md) · [Next](39-dash-cleanup.md)

## What this adds

Extends the copy migration to the recruiter side, the messaging surface, and the shared identity
page:

- `lib/copy/recruiter.ts` - Market, Talent, Standing, and Dashboard copy.
- `lib/copy/messaging.ts` - the Messages surface (threads, requests, visibility toggle, the new
  connection composer, conversation).
- `lib/copy/shared.ts` - the public `IdentityPage` (section titles, the proof-over-reach note).

All migrated components now read headings, subtitles, empty states, notes, and labels from these
constants (variant arrays for sentences, single strings for atomic labels), and the em dashes in
those strings are gone.

## Why (meaning of the change)

Completes the "all UI copy is editable in one place" goal for the main surfaces, and removes the
bulk of the remaining em-dash phrasing in app code as a side effect. The repo-wide mechanical dash
sweep (including comments and docs) follows in commit 39.

## Files in this commit

- New: `lib/copy/recruiter.ts`, `lib/copy/messaging.ts`, `lib/copy/shared.ts`.
- Migrated: `RecruiterMarket`, `RecruiterTalent`, `RecruiterStanding`, `RecruiterDashboard`,
  `components/common/Messages.tsx`, `components/common/IdentityPage.tsx`.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Reload the recruiter tabs and Messages: copy is
intact and the sentence-level text varies per mount.

## Decisions & notes

- A few tiny chrome labels (role switcher "Candidate/Recruiter", the header brand, the time
  controls) remain inline; they carry no em dashes and are covered by the style sweep in commit 39.
- Salary-range and delta glyphs were switched from en dash / minus sign to a plain hyphen as part of
  the same pass.
