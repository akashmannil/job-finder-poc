# Architecture

JobMatch is a Next.js (App Router) app where **both sides of the marketplace run in one client
store**, and matching / assessment / decision logic runs in **deterministic, in-app engines**
behind API routes — no external AI, no API keys. This document explains the load-bearing
decisions.

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

```text
Candidate                         Shared store                         Recruiter
---------                         ------------                         ---------
build verified profile
  └─ apply (consent dialog) ──▶ Application {                ┌──▶ dashboard (own postings)
                                  jobId, recruiterId,        │     └─ consented applicant view
                                  consent snapshot,  ────────┘     └─ Start reviewing
                                  status, createdAt,               └─ pick reason → drafted msg
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

## Deterministic engines (no AI)

Matching, assessment, and decision drafting are pure, in-app engines driven by a predefined
**skill catalog** and **question bank** ([`lib/skills/`](lib/skills/)). They take no API key,
make no network calls, and produce the same output for the same input — so the app runs in any
dev/CI/test environment and is trivial to reason about. See [PROMPTS.md](PROMPTS.md) for how each
engine works.

- **Matcher** ([`lib/matcher.ts`](lib/matcher.ts)) — scores a profile against each job using
  weighted requirements (must-have > nice-to-have) and evidence factors (verified > claimed),
  with transferable credit from `related` skills in the catalog.
- **Assessor** ([`lib/assessor.ts`](lib/assessor.ts)) — serves bank questions with options
  shuffled and the answer key withheld; grades by matching selected text server-side.
- **Decision** ([`lib/decision.ts`](lib/decision.ts)) — composes a personalized message per
  reason code from the consented application data.

Each engine sits behind a small, stable function signature, so an AI-backed implementation could
later replace any one of them without changing the routes or UI.

## Server-side boundary

The engines run inside the `/api/*` route handlers (`runtime = "nodejs"`). The one thing that
must not reach the browser — the **assessment answer key** — stays server-side: generation strips
it and grading looks it up from the bank. There are no secrets or API keys in the app.

## SLA & conduct score

[`lib/sla.ts`](lib/sla.ts) defines the response window and `autoResolveLapsed`, which the store
runs whenever the simulated clock advances. [`lib/conductScore.ts`](lib/conductScore.ts) derives
a recruiter score (decide, on time?) and a candidate score (engage when courted?) purely from the
applications, so reputation always reflects current behavior. This conduct score is the *only*
score on a profile — there are deliberately no vanity metrics anywhere in the UI.

## Design system, theming & motion

The UI uses an **Apple-inspired design system** defined entirely in
[`app/globals.css`](app/globals.css): neutral surface tokens, the system "SF" type stack with
tight heading tracking, and shared component classes (`.card`, `.btn*`, `.input`, `.chip`,
`.h-display`). Because every surface reads CSS variables, the whole look is retuned by editing
tokens rather than components.

Colors are CSS variables swapped via `data-theme` / `data-mode` on `<html>`, so a theme change is
one attribute write with no per-element class churn; an inline script applies the saved theme
before first paint. Accent **tints are derived with `color-mix`**, so each of the five accent
themes (`blue`/`purple`/`green`/`orange`/`pink`) declares only its base color. Animations use
shared Framer Motion presets ([`components/common/Motion.tsx`](components/common/Motion.tsx)) and
respect `prefers-reduced-motion`. See [docs/21](docs/21-visual-overhaul.md) for the overhaul.
