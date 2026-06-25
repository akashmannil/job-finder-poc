# JobMatch

A two-sided, **proof-over-reach** hiring platform — a portfolio proof of concept that fixes the
three things broken about modern hiring: recruiters ghost applicants, AI-tailored résumés make
matching unfit, and professional identity is gaslit by vanity-metric feeds.

JobMatch's answer: shift the unit of trust from the résumé to a **verified, candidate-owned
profile**; make the marketplace **accountable** (response SLAs + a public conduct score); and
build identity to optimize for **proof, not reach** (no likes, followers, or impressions
anywhere).

> **Follow the build:** this app was built feature-by-feature with a documented commit trail.
> Start at **[docs/DEVLOG.md](docs/DEVLOG.md)** and read top to bottom — each entry explains the
> *why* and links to the code.

## What it demonstrates

**Candidate side**

- **Verified profile** that replaces the résumé — every skill carries an evidence tier.
- **Requirement-level matching** that weights verified evidence over claims and must-haves over
  fluff, with explainable "why it fits" and gaps.
- **Skill passport** — pass an assessment to *earn* verified evidence.
- **Reskilling loop** — gaps become course recommendations; "currently reskilling" is a positive
  signal a résumé can't carry.
- **Evidence-backed endorsements** — relationship + specific evidence required (no one-tap skills).
- **Public identity page** with **zero vanity metrics**, plus consent-controlled applying.

**Recruiter side**

- **Dashboard** of postings with applicant/overdue counts and a **public response score**.
- **Consented applicant view** — only what the candidate chose to share.
- **Application SLA + auto-close** — ghosting is penalized, not free.
- **One-click decision** — pick a reason, get a kind, specific, editable message; send.
- **Mutual-interest gating** — contact unlocks only when both sides opt in.

## Try it (the demo script)

The candidate **Workspace** uses a left **section menu** (Profile · Skill passport · Endorsements ·
Matches · Reskilling — one section at a time, no long scroll), and **Applications** is its own
top-level tab.

1. **Candidate** → **Profile** section → *Load sample profile*, then **Matches** → *Find matches*.
2. Open **Skill passport**, *Assess* a skill, pass it, and *Re-run match* — the score moves.
3. Check **Reskilling**, mark a gap *in progress*.
4. In **Matches**, *Apply* to a Northwind Labs role; tune what you share in the consent dialog.
5. Switch to **Recruiter** (header toggle) → expand the applicant → *Start reviewing* → pick a
   reason → send the drafted decision.
6. Switch back to **Candidate** → the **Applications** tab shows the decision. Or use **⏱ +3d** in
   the header to let an SLA lapse and watch the recruiter's response score drop.

## Proof over reach (a deliberate trade-off)

There is no feed, and no like/follower/impression/view counter anywhere — by design. Reputation
comes only from evidence (verified skills, earned assessments, weighted endorsements) and
behavior (the conduct score). The honest cost: without vanity loops the product is calmer but
grows slower. That's the values choice this POC is making on purpose.

## Tech stack

Next.js (App Router) · TypeScript (strict) · Tailwind + Framer Motion, wrapped in an
**Apple-inspired design system** (CSS-variable tokens, SF-style type, pill buttons, soft-cornered
cards; 5 accent themes × light/dark). Matching, assessments, and decision messages run on
**deterministic, in-app engines** over a predefined, expandable skill catalog — no external AI,
no API keys.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables or keys are required — everything runs
offline and deterministically.

## Project structure

- [`app/`](app/) — App Router pages and API routes (`/api/match`, `/api/assess`, `/api/draft-decision`).
- [`components/`](components/) — `common/`, `candidate/`, `recruiter/` UI.
- [`lib/`](lib/) — the engines (matcher, assessor, decision), plus reskill, sla, conduct, consent,
  endorsements, data accessors, and [`lib/skills/`](lib/skills/) (the catalog + question bank).
- [`store/`](store/) — the shared client store both sides use.
- [`data/`](data/) — seed jobs & courses.
- [`docs/`](docs/) — the commit-by-commit build trail. See also
  [ARCHITECTURE.md](ARCHITECTURE.md) and [PROMPTS.md](PROMPTS.md).

## POC limitations / what I'd build next

- **No real auth or multi-user** — the role switcher and a fixed `ACTIVE_RECRUITER_ID` simulate
  two sides over one local store. Next: real accounts and a server database.
- **Verification is demo-grade** — assessments are short and self-launched; endorsements are
  self-entered. Next: proctoring, real endorser identity, and reference verification.
- **Mock data, no live jobs.** Next: real postings with verified salary ranges and **ghost-job
  detection** (flag stale/evergreen reqs).
- **Recruiter accountability is local.** Next: org-wide response scores and candidate-facing
  "typical response time" at apply time.
- **Engines are deterministic & offline by design** (no external AI), driven by the predefined
  skill catalog so the app runs anywhere. They're built behind small, stable interfaces, so an
  AI-backed engine could later be swapped in without touching the UI — and the catalog/question
  bank expand by appending entries.
