# 17 — Local matching engine (no AI)

> Commit: `feat: local matching engine`
> Nav: [← Prev](16-skill-catalog.md) · [Index](DEVLOG.md) · [Next →](18-local-assessment.md)

## What this adds

A deterministic, in-app matcher that replaces the Anthropic call. It scores a profile against
every job using the predefined skill catalog — no key, no network, identical output every run.

## Why (meaning of the change)

Matching is the core feature; making it local means the whole candidate flow works in any dev/CI/
test environment offline. The scoring still encodes the thesis, now as explicit, inspectable rules
rather than a prompt:

- **Verified evidence outweighs claims** — each met requirement is multiplied by an evidence
  factor (`self_asserted` 0.6 → `assessment_passed`/`reference_verified` 1.0).
- **Must-haves outweigh nice-to-haves** — weights 3 vs 1.
- **Transferable credit** — a related skill (from the catalog) partially satisfies a requirement
  ("transferable from JavaScript"), so real adjacency is rewarded without keyword gaming.
- **Reskilling** nudges a self-asserted skill up slightly; **disqualifiers** zero the score.

Determinism is also a testability win: same input → same ranking, so the engine is trivial to
reason about and verify.

## Files in this commit

- [`lib/matcher.ts`](../lib/matcher.ts) — rewritten as a pure scoring engine over the catalog.
- [`app/api/match/route.ts`](../app/api/match/route.ts) — calls the local engine; no Anthropic import.
- `lib/schema.ts` — **deleted** (the JSON-schema for structured output is no longer needed).

## How to verify

`npx tsc --noEmit` passes. Candidate → load sample profile → "Find matches" returns ranked,
explained results **without any API key**. Pass an assessment (next commit) or change an evidence
tier and re-run — the score moves predictably.

## Decisions & notes

- The scoring constants (weights, evidence factors, transfer factor) live at the top of
  `matcher.ts` — tuning them is a one-line change.
- The AI matcher could return later as an alternative engine behind the same
  `matchProfileToJobs(profile)` signature; the UI wouldn't change.
