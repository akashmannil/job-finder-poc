# 19 - Local decision engine (no AI)

> Commit: `feat: local decision engine`
> Nav: [← Prev](18-local-assessment.md) · [Index](DEVLOG.md) · [Next →](20-retire-ai.md)

## What this adds

Template-based decision messages, replacing the AI draft. `draftDecision` composes a warm,
specific message per reason code, personalized from the application's consented data; the recruiter
still edits before sending.

## Why (meaning of the change)

The anti-ghosting payoff doesn't need a model: the point was that a kind, specific message is
**one click away**, so silence is never the easy option. Templates deliver that offline and
deterministically, personalized with the candidate's name, the role, and a skill they shared. The
recruiter edits the draft before sending, so the human stays in control either way.

## Files in this commit

- [`lib/decision.ts`](../lib/decision.ts) - rewritten as per-reason templates (same
  `DECISION_REASONS` / `outcomeFor` / `draftDecision` surface, no Anthropic).
- [`app/api/draft-decision/route.ts`](../app/api/draft-decision/route.ts) - calls the local
  drafter; no Anthropic import.

## How to verify

`npx tsc --noEmit` passes. Recruiter → expand an applicant → pick a reason → an editable,
personalized message appears instantly (no key) → send. The candidate sees it in their tracker.

## Decisions & notes

- The `DECISION_REASONS` / `outcomeFor` / `DraftResult` surface is unchanged, so the
  `DecisionPanel` UI didn't change - only the implementation behind it.
- After this commit, no active code calls Anthropic; the dependency is removed next.
