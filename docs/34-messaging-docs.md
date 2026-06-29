# 34 - Docs sweep for messaging

> Commit: `docs: document consent-gated messaging across root docs`
> Nav: [← Prev](33-peer-connections.md) · [Index](DEVLOG.md) · [Next →](35-peer-search-visibility.md)

## What this adds

The top-level docs, updated for the messaging feature (commits 32-33):

- **[README.md](../README.md)** - a "Messaging (consent-gated)" bullet on the candidate side and a
  "Messages" bullet on the recruiter side; the recruiter tab list now ends with **Messages**; the
  candidate tab list is now six tabs; a demo step (8) for messaging.
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - a new "Messaging (consent-gated)" section: threads
  derived from mutual interest, peer request/accept, one shared surface, all client state.
- **[PROMPTS.md](../PROMPTS.md)** - a note clarifying messaging is *not* an engine (pure store
  logic), so the deterministic-engines story stays accurate.

## Why (meaning of the change)

The root docs are the front door and must describe the app as it actually is. After adding a whole
messaging layer - and, importantly, the *consent* design that keeps it on-thesis - the docs need to
say so, or a reviewer would either miss the feature or assume it's an open inbox.

## Files in this commit

- [`README.md`](../README.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`PROMPTS.md`](../PROMPTS.md)
  - content updates only.
- [`docs/DEVLOG.md`](DEVLOG.md) - row 34 + footer.

## How to verify

No code changes - `npx tsc --noEmit` and `npm run build` are unaffected and still pass. Read the
README: messaging appears on both sides and is described as consent-gated (mutual interest +
peer request/accept), with no cold outreach.

## Decisions & notes

- The **no-cold-DM** stance is stated explicitly so messaging reads as a deliberate extension of the
  platform's consent model, not a generic inbox.
- This closes Phase 5 (messaging): core (32), peer connections (33), docs (34).
