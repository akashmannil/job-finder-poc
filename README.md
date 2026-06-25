# JobMatch

A two-sided, **proof-over-reach** hiring platform — a portfolio proof of concept that fixes the
three things broken about modern hiring: recruiters ghost applicants, AI-tailored résumés make
matching unfit, and professional identity is gaslit by vanity-metric feeds.

JobMatch's answer: shift the unit of trust from the résumé to a **verified, candidate-owned
profile**; make the marketplace **accountable** (response SLAs + a public conduct score); and
build identity to optimize for **proof, not reach** — no likes, followers, or impressions on
*people*. (Postings can be liked — that's a market-demand signal on a role, not a vanity metric on
a human.)

> **Follow the build:** this app was built feature-by-feature with a documented commit trail.
> Start at **[docs/DEVLOG.md](docs/DEVLOG.md)** and read top to bottom — each entry explains the
> *why* and links to the code.

## What it demonstrates

**Candidate side**

- **Discover landing** that leads with the market — live stats, the most attractive offer of the
  moment, and trending roles you can **like** (a demand signal on *postings*, not on people).
- **Display-first profile** that replaces the résumé — a LinkedIn-style page that *shows* your
  details and reveals an editor only on **Edit**; every skill carries an evidence tier.
- **Requirement-level matching** that weights verified evidence over claims and must-haves over
  fluff, with explainable "why it fits" and gaps — browsable as a list or a **swipe reel**.
- **Prove a skill** inline — pass an assessment to *earn* verified evidence.
- **Reskilling reel** — an infinite, advertising-style feed of skills to grow (from your gaps,
  adjacent skills, and market demand); "currently reskilling" is a positive signal a résumé can't
  carry.
- **Evidence-backed endorsements** — relationship + specific evidence required (no one-tap skills).
- **Preview as recruiter** — the exact consented view, with **zero vanity metrics**, plus
  consent-controlled applying.
- **Honest retention (no baiting)** — a saved-roles watchlist, a private reskilling-progress
  snapshot, and a "while you were away" digest that surfaces *only* real decisions since your last
  visit. No streaks, attention counts, or FOMO.

**Recruiter side** (a tabbed workspace mirroring the candidate's — **Market · Talent · Postings ·
Standing**)

- **Market** — the recruiter's Discover: market stats, **your standing vs the market** (pay/interest
  deltas, per-posting market rank), **popular postings**, and **competitor postings** to benchmark.
- **Talent** — **possible candidate matches** for a chosen posting (same matcher, run in reverse),
  double-opt-in **Invite to apply**, and a **talent-development** view (scarce required skills +
  courses to sponsor).
- **Postings** — the dashboard: postings with applicant/overdue counts; **consented applicant view**
  (only what the candidate shared), as a list or a **swipe reel**; **one-click decision** (pick a
  reason → kind, editable message); **mutual-interest gating**.
- **Standing** — the recruiter's profile: company identity, the **public response score** with a
  breakdown, and an SLA-sorted **"needs your decision"** list. **Application SLA + auto-close** means
  ghosting is penalized, not free.

## Try it (the demo script)

The candidate side has five tabs — **Discover · Profile · Matches · Reskilling · Applications**.
The app opens on **Discover** (the market); **Profile** is *display-first* — it shows your details
and reveals an editor only when you click **Edit** on a section (LinkedIn/Facebook style).

1. **Candidate** opens on **Discover** — market stats, the "Offer of the moment", and trending
   roles. **Like** a posting (♡) and the count ticks up; the teaser jumps to the reskilling reel.
2. **Profile** → *Load sample profile*. Each section (Identity, Skills, Experience, Projects,
   Endorsements) shows its data; click **Edit** on one to change it, **Done** to return. On a skill,
   click **Prove** to take an assessment and *earn* verified evidence; **Preview as recruiter** shows
   exactly what recruiters get.
3. **Matches** → *Find matches*. Flip the **List / Reel** toggle and **swipe right to apply / left
   to skip** — right-swipe opens the consent dialog. Each card also has a like button.
4. **Reskilling** is an endless feed of skills to grow (your gaps + adjacent + in-demand). Scroll for
   more; **Start reskilling** on one to flag it on your profile.
5. Switch to **Recruiter** (header toggle) — its own tabbed workspace (**Market · Talent · Postings ·
   Standing**) opens on **Market**: your standing vs the market, popular and competitor postings.
   **Talent** ranks sourcing candidates for a posting (with double-opt-in *Invite to apply*) and
   shows scarce skills to train. **Standing** is your response score + the decisions you owe.
6. **Postings** → expand an applicant → *Start reviewing* → pick a reason → send the drafted
   decision (or **Review reel** to swipe shortlist/pass).
7. Switch back to **Candidate** → the **Applications** tab shows the decision. Or use **⏱ +3d** in
   the header to let an SLA lapse and watch the recruiter's response score drop.

## Proof over reach (a deliberate trade-off)

There is no like/follower/impression/view counter on **people** — by design. A person's reputation
comes only from evidence (verified skills, earned assessments, weighted endorsements) and behavior
(the conduct score), never from popularity. Likes exist **only on postings**, where they're a
demand signal on a *role* rather than a vanity metric on a *human* — the line the platform draws on
purpose. The honest cost: without people-side vanity loops the product is calmer but grows slower.
That's the values choice this POC is making.

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
