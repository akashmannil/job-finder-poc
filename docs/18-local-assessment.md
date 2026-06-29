# 18 - Local assessment engine (no AI)

> Commit: `feat: local assessment engine`
> Nav: [← Prev](17-local-matcher.md) · [Index](DEVLOG.md) · [Next →](19-local-decision.md)

## What this adds

An offline assessment engine. `generateAssessment` pulls questions from the predefined bank
(options shuffled for display, answers stripped); `gradeAssessment` grades by matching each
selected option's text to the known answer. No AI, no key.

## Why (meaning of the change)

This keeps the "earned verification" property without external calls: the **answer key never
leaves the server** (generation omits it; grading looks it up from the bank), so passing still
means something and a verified `assessment_passed` tier is genuinely earned. Because grading
matches on text, options can be shuffled freely without breaking correctness - and the whole flow
is deterministic and offline.

## Files in this commit

- [`lib/assessor.ts`](../lib/assessor.ts) - rewritten over the question bank: shuffle, generate,
  grade (pass threshold 70).
- [`app/api/assess/route.ts`](../app/api/assess/route.ts) - `generate` / `grade` actions; no
  Anthropic import.

## How to verify

`npx tsc --noEmit` passes. Candidate → Skill passport → "Assess React" → answer → submit grades
locally and, on a pass, upgrades the skill to `assessment_passed`. Skills without a dedicated bank
(e.g. niche ones) get generic competence questions. Works with **no API key**.

## Decisions & notes

- Question count and pass threshold are constants at the top of `assessor.ts`.
- Expanding coverage is purely additive - add entries to `QUESTION_BANK` (commit 16).
