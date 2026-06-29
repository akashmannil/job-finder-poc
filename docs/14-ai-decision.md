# 14 - One-click AI decision & state machine

> Commit: `feat: one-click AI decision & state machine`
> Nav: [← Prev](13-recruiter-dashboard.md) · [Index](DEVLOG.md) · [Next →](15-root-docs.md)

## What this adds

The recruiter's decision flow. Each applicant card gets a `DecisionPanel`: advance the
application (`received → reviewing`), express interest (mutual-interest gating), and reach a
decision by picking a reason code - which calls Claude to **draft a kind, specific message** the
recruiter can edit and send in one click. Sending sets the terminal status and records the
response time (feeding the conduct score); the candidate sees the result in their tracker.

## Why (meaning of the change)

This is the anti-ghosting payoff: a real, humane rejection or next-step is now genuinely *one
click* - cheaper than silence, which is the whole point. The reason codes keep it honest, the
AI draft removes the effort excuse, and recording `respondedAt` ties the action straight back to
the recruiter's public conduct score. Mutual-interest gating means contact only "unlocks" when
both sides opt in.

## Files in this commit

- [`lib/decision.ts`](../lib/decision.ts) - reason codes, outcome mapping, and `draftDecision`
  (structured output).
- [`app/api/draft-decision/route.ts`](../app/api/draft-decision/route.ts) - POST handler.
- [`components/recruiter/DecisionPanel.tsx`](../components/recruiter/DecisionPanel.tsx) - the state
  machine, reason codes, editable AI draft, and mutual-interest control.
- [`components/recruiter/ApplicantCard.tsx`](../components/recruiter/ApplicantCard.tsx) - mounts
  the decision panel.

## How to verify

With a key in `.env.local`: Recruiter → expand an applicant → "Start reviewing" → pick a reason →
an AI-drafted message appears (editable) → "Send decision". The applicant flips to its terminal
status; switch to Candidate and the application tracker shows the decision and message. The
response score updates. `npx tsc --noEmit` passes.

## Decisions & notes

- Choosing "Moving forward" also marks recruiter interest, so an offer implies mutual interest.
- The draft is fully editable before sending - the AI removes effort, the human keeps control.
