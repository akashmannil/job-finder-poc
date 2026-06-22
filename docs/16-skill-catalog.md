# 16 — Predefined skill catalog & question bank

> Commit: `feat: predefined skill catalog & question bank`
> Nav: [← Prev](15-root-docs.md) · [Index](DEVLOG.md) · [Next →](17-local-matcher.md)

## What this adds

The knowledge base that lets the app run **without any external AI**: a predefined skill catalog
(canonical names, aliases, related skills) and a per-skill assessment question bank with a generic
fallback. Both are plain data + small pure helpers, designed to be expanded.

## Why (meaning of the change)

Up to now, matching, assessments, and decision messages all called the Anthropic API, so the app
needed a key to do anything interesting. This commit lays the foundation to replace those calls
with **deterministic, in-app engines** (next three commits), so the platform works in any dev/CI/
test environment offline and behaves identically every run.

- The **catalog** gives the matcher real knowledge: `aliases` make synonyms match (TS ↔
  TypeScript), `related` enables transferable partial credit (React partly covers Next.js).
- The **question bank** replaces generated quizzes with curated questions; `answer` is stored as
  text so options can be shuffled for display without breaking grading. Unknown skills get generic
  competence questions, so everything stays assessable.

Both are deliberately small and additive — growing coverage is just appending entries.

## Files in this commit

- [`lib/skills/catalog.ts`](../lib/skills/catalog.ts) — `SKILL_CATALOG` + `normalizeSkill`,
  `relatedOf`, `areRelated`.
- [`lib/skills/questionBank.ts`](../lib/skills/questionBank.ts) — `QUESTION_BANK`,
  `genericQuestions`, `questionsForSkill`.

## How to verify

`npx tsc --noEmit` passes. These modules are pure data/functions; the engines that consume them
land next.

## Decisions & notes

- Answers are stored as the correct option's **text**, not an index, so display-time shuffling is
  safe and grading stays correct.
- Unknown skills pass through `normalizeSkill` unchanged and fall back to generic questions —
  nothing breaks when the catalog doesn't cover a skill yet.
