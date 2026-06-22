# 20 — Retire the Anthropic dependency

> Commit: `chore: retire Anthropic dependency; docs for offline engines`
> Nav: [← Prev](19-local-decision.md) · [Index](DEVLOG.md)

## What this adds

The cleanup that completes the move to offline engines: the unused Anthropic client and the
`@anthropic-ai/sdk` dependency are removed, `.env.example` no longer asks for a key, and the root
docs are updated to describe the deterministic engines. Verified with a production build.

## Why (meaning of the change)

After commits 16–19, no active code called the API. Removing the module and dependency makes the
"runs anywhere, no keys" property real and obvious — there's nothing left to configure. The docs
now match the code: matching, assessment, and decisions are explained as inspectable rules over a
predefined skill catalog, with a clear note that an AI engine could be swapped back in behind the
same interfaces.

## Files in this commit

- `lib/anthropic.ts` — **deleted** (no longer imported).
- [`package.json`](../package.json) — `@anthropic-ai/sdk` removed.
- [`.env.example`](../.env.example) — now states no keys/vars are required.
- [`README.md`](../README.md) — tech stack, setup, and limitations updated for offline engines.
- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — "Deterministic engines" + "Server-side boundary"
  replace the AI/structured-output/caching sections.
- [`PROMPTS.md`](../PROMPTS.md) — rewritten as "Engines & knowledge base."

## How to verify

```bash
npm install
npm run dev      # no key needed
```

`npx tsc --noEmit` and `npm run build` both pass. A repo-wide search for "anthropic" finds no
references in `app/`, `lib/`, `components/`, or `store/`.

## Decisions & notes

- The handoff spec at the repo root (`PROMPT.md`) still documents the original AI-based design; it
  is kept as the alternative blueprint. The *running app* is fully offline.
- This completes Phase 2 — the platform now runs end-to-end on predefined, expandable skillsets.
