# 02 - Domain types & seed data

> Commit: `feat: domain types & seed data`
> Nav: [← Prev](01-scaffold.md) · [Index](DEVLOG.md) · [Next →](03-store-role-switcher.md)

## What this adds

The shared domain model (`types/index.ts`) and the bundled mock dataset: 30 varied jobs across
five companies and four recruiters, plus 30 skill-tagged courses. Thin typed accessors
(`lib/jobs.ts`, `lib/courses.ts`) load and query them.

## Why (meaning of the change)

Two modelling choices encode the thesis directly into the type system:

- **`EvidenceTier` + `EVIDENCE_RANK`** make "verified vs. self-asserted" a first-class,
  *ordered* concept. The matcher and UI both lean on this ranking so that verified evidence can
  outweigh claims - inflation stops paying.
- **`Requirement.kind` (`must_have | nice_to_have | disqualifier`)** turns a job description
  into structured requirements, so matching can weight must-haves over fluff instead of
  comparing prose to prose.

Seed data (no external APIs) keeps the POC demoable offline and deterministic. Jobs are spread
across recruiters (`rec-1`..`rec-4`) so the recruiter dashboard has real postings to work with;
`ACTIVE_RECRUITER_ID` pins which recruiter the recruiter view represents.

## Files in this commit

- [`types/index.ts`](../types/index.ts) - `EvidenceTier`, `Skill`, `Profile`, `Requirement`,
  `Job`, `Course`, `Recruiter`, and the evidence ranking/labels.
- [`data/jobs.json`](../data/jobs.json) - 30 seed jobs with classified requirements.
- [`data/courses.json`](../data/courses.json) - 30 skill-tagged courses (feeds the reskill loop).
- [`lib/jobs.ts`](../lib/jobs.ts) - typed accessors + the recruiter roster.
- [`lib/courses.ts`](../lib/courses.ts) - typed accessors + `coursesForSkill`.

## How to verify

`npx tsc --noEmit` passes. The JSON is typed via `as Job[]` / `as Course[]`, so a malformed
seed row would surface at build.

## Decisions & notes

- Feature-specific types (matches, endorsements, applications, conduct) are intentionally
  deferred to the commits that introduce them, keeping each commit self-contained.
- Skill names form a shared vocabulary across jobs and courses so the reskill loop can join them.
