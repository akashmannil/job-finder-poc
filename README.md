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
- **Requirement-level matching** (Claude) that weights verified evidence over claims and
  must-haves over fluff, with explainable "why it fits" and gaps.
- **Skill passport** — pass a Claude-generated assessment to *earn* verified evidence.
- **Reskilling loop** — gaps become course recommendations; "currently reskilling" is a positive
  signal a résumé can't carry.
- **Evidence-backed endorsements** — relationship + specific evidence required (no one-tap skills).
- **Public identity page** with **zero vanity metrics**, plus consent-controlled applying.

**Recruiter side**

- **Dashboard** of postings with applicant/overdue counts and a **public response score**.
- **Consented applicant view** — only what the candidate chose to share.
- **Application SLA + auto-close** — ghosting is penalized, not free.
- **One-click AI decision** — pick a reason, get a kind, specific, editable message; send.
- **Mutual-interest gating** — contact unlocks only when both sides opt in.

## Try it (the demo script)

1. **Candidate** → *Load sample profile* → *Find matches*.
2. Open the **Skill passport**, *Assess* a skill, pass it, and *Re-run match* — the score moves.
3. Check **Reskilling**, mark a gap *in progress*.
4. *Apply* to a Northwind Labs role; tune what you share in the consent dialog.
5. Switch to **Recruiter** (header toggle) → expand the applicant → *Start reviewing* → pick a
   reason → send the AI-drafted decision.
6. Switch back to **Candidate** — the tracker shows the decision. Or use **⏱ +3d** in the header
   to let an SLA lapse and watch the recruiter's response score drop.

## Proof over reach (a deliberate trade-off)

There is no feed, and no like/follower/impression/view counter anywhere — by design. Reputation
comes only from evidence (verified skills, earned assessments, weighted endorsements) and
behavior (the conduct score). The honest cost: without vanity loops the product is calmer but
grows slower. That's the values choice this POC is making on purpose.

## Tech stack

Next.js (App Router) · TypeScript (strict) · Tailwind (CSS-variable theming, 5 accents ×
light/dark) · Framer Motion · Anthropic SDK (`claude-opus-4-8`, structured outputs, server-side).

## Setup

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. The AI features (matching, assessments, decision drafts) need a valid
key; the rest of the UI works without one.

## Project structure

- [`app/`](app/) — App Router pages and API routes (`/api/match`, `/api/assess`, `/api/draft-decision`).
- [`components/`](components/) — `common/`, `candidate/`, `recruiter/` UI.
- [`lib/`](lib/) — matcher, assessor, decision, reskill, sla, conduct, consent, endorsements, data.
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
