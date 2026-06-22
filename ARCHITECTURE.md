# Architecture

JobMatch is a Next.js (App Router) app where **both sides of the marketplace run in one client
store**, and all AI work happens server-side behind API routes. This document explains the
load-bearing decisions.

## The shared store + role switcher

There is no server database and no auth. Instead, a single React Context
([`store/store.tsx`](store/store.tsx)), persisted to `localStorage`, holds everything: the
current `role`, the candidate `profile`, `endorsements`, `applications`, the latest match
`matchGaps`, and a simulated `clockOffset`. A `RoleSwitcher` flips between the Candidate and
Recruiter workspaces, which read and write the *same* store.

This is what makes a two-sided platform demoable solo: an action taken as a recruiter is
immediately visible when you switch back to the candidate, because there's one source of truth
underneath both.

## The Application — the pivot object

```
Candidate                         Shared store                         Recruiter
---------                         ------------                         ---------
build verified profile
  └─ apply (consent dialog) ──▶ Application {                ┌──▶ dashboard (own postings)
                                  jobId, recruiterId,        │     └─ consented applicant view
                                  consent snapshot,  ────────┘     └─ Start reviewing
                                  status, createdAt,               └─ pick reason → AI draft
                                  respondedAt?, ...        ◀────────── send decision
                                }
  tracker shows status  ◀────────  (status, decisionMessage)
                                  SLA lapses → auto_closed → recruiter conduct score drops
```

An `Application` captures the candidate's **consent snapshot** (the exact, filtered profile they
chose to share) at apply time. The recruiter only ever sees that snapshot — selective disclosure,
end to end. The recruiter advances it through a small state machine
(`received → reviewing → offer | rejected`), or the SLA lapses and it `auto_closes`.

## Why verified profile over résumé

A résumé is gameable marketing copy, and AI tailoring made it noise. The matcher never reads a
résumé — it reads a **structured profile** whose skills carry ordered evidence tiers
(`self_asserted < portfolio < assessment_passed < reference_verified`). The model is told to
weight verified evidence above claims, so inflation stops paying. Assessment-passed evidence is
*earned* server-side (the answer key never reaches the client), making "verified" mean something.

## Why requirement-level matching

Jobs store **classified requirements** (`must_have | nice_to_have | disqualifier`), not prose.
The matcher compares requirements against evidence and weights must-haves heavily, instead of
fuzzy text-vs-text similarity. Results are explainable: each met requirement cites the evidence
that satisfied it, and gaps are tagged by severity — which then drive the reskilling loop.

## Why structured outputs

Every AI call uses `output_config.format` with a JSON schema
([`lib/schema.ts`](lib/schema.ts) and inline schemas in `lib/assessor.ts` / `lib/decision.ts`),
so responses are guaranteed-valid JSON we parse directly — never scraped from prose. See
[PROMPTS.md](PROMPTS.md) for the prompts and schemas.

## Prompt caching

In the matcher, the large, stable **job list is the first content block** and carries
`cache_control: { type: "ephemeral" }`. The volatile profile comes after it. Because caching is a
prefix match, repeated matches (e.g. re-running after passing an assessment) reuse the cached job
prefix — cheaper and faster.

## Server-side trust boundary

The Anthropic key is read only in [`lib/anthropic.ts`](lib/anthropic.ts) and used inside the
`/api/*` route handlers (`runtime = "nodejs"`). It is never imported into a client component, so
it never reaches the browser bundle. The UI talks to Claude only through those routes.

## SLA & conduct score

[`lib/sla.ts`](lib/sla.ts) defines the response window and `autoResolveLapsed`, which the store
runs whenever the simulated clock advances. [`lib/conductScore.ts`](lib/conductScore.ts) derives
a recruiter score (decide, on time?) and a candidate score (engage when courted?) purely from the
applications, so reputation always reflects current behavior. This conduct score is the *only*
score on a profile — there are deliberately no vanity metrics anywhere in the UI.

## Theming & motion

Colors are CSS variables swapped via `data-theme` / `data-mode` on `<html>`
([`app/globals.css`](app/globals.css)), so a theme change is one attribute write with no
per-element class churn; an inline script applies the saved theme before first paint. Animations
use shared Framer Motion presets ([`components/common/Motion.tsx`](components/common/Motion.tsx))
and respect `prefers-reduced-motion`.
