# 04 — Requirement-level matcher

> Commit: `feat: requirement-level matcher`
> Nav: [← Prev](03-store-role-switcher.md) · [Index](DEVLOG.md) · [Next →](05-profile-builder.md)

## What this adds

The core AI feature, server-side: a configured Anthropic client, a JSON-schema-constrained
matching call, and the `POST /api/match` route. Given a candidate profile, it scores every job
and returns ranked results with met requirements and gaps.

## Why (meaning of the change)

This is where the thesis becomes code:

- **Requirement-vs-evidence, not text-vs-text.** The prompt sends the profile and the jobs'
  *classified requirements*, and instructs the model to weight `must_have` over `nice_to_have`
  and **verified evidence over self-asserted claims** — so résumé keyword-stuffing can't win.
- **Structured outputs.** The response is constrained by [`MATCH_RESULT_SCHEMA`](../lib/schema.ts)
  via `output_config.format`, so we parse guaranteed-valid JSON instead of scraping prose.
- **Prompt caching.** The large, stable job list is the first content block and carries
  `cache_control: { type: "ephemeral" }`, so repeated matches reuse the cached prefix.
- **Server-side trust boundary.** The key is read from the environment in `lib/anthropic.ts` and
  never reaches the browser; the UI talks only to `/api/match`.

## Files in this commit

- [`types/index.ts`](../types/index.ts) — match types (`MetRequirement`, `GapItem`,
  `MatchResultRaw`, `MatchResult`).
- [`lib/anthropic.ts`](../lib/anthropic.ts) — lazy client, model id, and `callStructured()`
  (handles refusals + extracts the JSON text block).
- [`lib/schema.ts`](../lib/schema.ts) — the match JSON schema (mirrors `MatchResultRaw`).
- [`lib/matcher.ts`](../lib/matcher.ts) — system prompt, cached job block, validation, and the
  sort + join back to full jobs.
- [`app/api/match/route.ts`](../app/api/match/route.ts) — POST handler with typed error handling.

## How to verify

`npx tsc --noEmit` passes. With a key in `.env.local`, the endpoint returns ranked matches:

```bash
curl -s localhost:3000/api/match -H 'content-type: application/json' \
  -d '{"profile":{"name":"A","headline":"","location":"","remotePref":"any",
       "skills":[{"name":"React","evidence":"assessment_passed"},
                 {"name":"TypeScript","evidence":"self_asserted"}],
       "experience":[],"projects":[]}}'
```

The candidate-facing UI that calls this lands in commit 06.

## Decisions & notes

- `output_config` / per-block `cache_control` are typed locally and cast at the call site
  because they may be ahead of the installed SDK's static types; the SDK still forwards them.
- `refusal` is compared via a string cast for the same SDK-version reason.
