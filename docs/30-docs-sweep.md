# 30 - Root documentation sweep

> Commit: `docs: update root docs for recruiter experience & retention`
> Nav: [← Prev](29-recruiter-standing.md) · [Index](DEVLOG.md) · [Next →](31-fix-role-switch-blank.md)

## What this adds

The top-level docs, brought in line with commits 26-29 (candidate retention + the full recruiter
workspace):

- **[README.md](../README.md)** - recruiter side rewritten as the tabbed workspace
  (Market · Talent · Postings · Standing); a candidate "honest retention (no baiting)" bullet; the
  demo script extended to walk the recruiter tabs.
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - new sections "The recruiter workspace (mirror of the
  candidate side)" and "Retention (honest, by design)".
- **[PROMPTS.md](../PROMPTS.md)** - notes the reverse matcher (`matchProfileToJob`) and a new
  "Market, talent & growth signals" section covering the deterministic likes / standing / talent /
  reskill / activity helpers.

## Why (meaning of the change)

The build trail (`docs/NN`) records each change in order, but the root docs are the front door - they
should always describe the app as it currently is. After adding a whole recruiter experience and a
retention layer, leaving the root docs candidate-only would misrepresent the project. This commit
closes that gap so a reviewer reading top-down gets the accurate, two-sided picture.

## Files in this commit

- [`README.md`](../README.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`PROMPTS.md`](../PROMPTS.md)
  - content updates only.
- [`docs/DEVLOG.md`](DEVLOG.md) - row 30 + footer.

## How to verify

No code changes - `npx tsc --noEmit` and `npm run build` are unaffected and still pass. Read the
README top-to-bottom: both sides and the non-baiting retention stance are described accurately.

## Decisions & notes

- The **no-baiting** constraint is stated explicitly in README and ARCHITECTURE so it reads as a
  deliberate product value, not an omission.
- This completes the Phase 4 batch (25-30): discovery, growth, the recruiter experience, and honest
  retention.
