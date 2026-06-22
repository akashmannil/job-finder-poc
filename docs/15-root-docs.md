# 15 — Root documentation

> Commit: `docs: root README, ARCHITECTURE, PROMPTS`
> Nav: [← Prev](14-ai-decision.md) · [Index](DEVLOG.md) · [Next →](16-skill-catalog.md)

## What this adds

The three polished, top-level documents that sit above this per-commit trail, plus a verified
production build.

## Why (meaning of the change)

The `docs/` trail explains *how the app was built, in order*. The root docs serve the other two
audiences: a reviewer who wants the story and the demo (README), an engineer who wants the design
rationale (ARCHITECTURE), and anyone evaluating the LLM design (PROMPTS). Together with the git
history, they let someone follow the project by code *and* by meaning.

## Files in this commit

- [`README.md`](../README.md) — thesis, what each side demonstrates, the demo script, setup,
  structure, and honest POC limitations.
- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — shared store + role switcher, the Application pivot,
  why verified-profile / requirement-level matching / structured outputs, caching, the trust
  boundary, SLA & conduct.
- [`PROMPTS.md`](../PROMPTS.md) — the three prompts and schemas, with the reasoning behind each.
- [`docs/DEVLOG.md`](DEVLOG.md) — links the root docs from the trail.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass on a clean checkout.

## Decisions & notes

- This is the final commit; the feature set is complete per the build plan.
