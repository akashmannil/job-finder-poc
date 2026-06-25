# Engines & knowledge base

JobMatch runs on **deterministic, in-app engines** instead of an external model. This document
explains how each engine works and the predefined knowledge it draws on. (There are no AI prompts;
the name is kept for continuity with the build trail.)

## Knowledge base — [`lib/skills/`](lib/skills/)

- **Catalog** ([`catalog.ts`](lib/skills/catalog.ts)) — canonical skills with `aliases`
  (synonyms that should match, e.g. TS ↔ TypeScript) and `related` skills (adjacencies that earn
  transferable credit). `normalizeSkill`, `relatedOf`, and `areRelated` are the helpers the
  engines use.
- **Question bank** ([`questionBank.ts`](lib/skills/questionBank.ts)) — per-skill multiple-choice
  questions; `answer` is stored as the correct option's *text* so options can be shuffled for
  display without breaking grading. Skills without a bank fall back to generic competence
  questions, so everything stays assessable.

Both are small and **expandable by appending entries** — no engine code changes needed.

## 1. Matching — [`lib/matcher.ts`](lib/matcher.ts)

For each job, the matcher scores requirements against the candidate's skills:

- **Weights:** `must_have` = 3, `nice_to_have` = 1 — must-haves dominate the score.
- **Evidence factors:** `self_asserted` 0.6 · `portfolio` 0.8 · `assessment_passed` 1.0 ·
  `reference_verified` 1.0 — verified evidence is worth more than a claim, so inflation doesn't pay.
- **Transferable credit:** if a requirement isn't met directly but the candidate has a `related`
  skill, it earns partial credit (`TRANSFER_FACTOR` = 0.5) and is shown as "transferable from X".
- **Reskilling** gives a small bonus to a self-asserted skill being actively grown; a
  **disqualifier** the candidate has zeroes the score.
- `fitScore = round(100 × earned / possible)`. Results carry explainable `metRequirements` (with
  the evidence that satisfied each) and `gaps` (tagged by severity), then sort by score.

The thesis lives in the constants at the top of the file — tuning is a one-line change.
`matchProfileToJobs(profile)` scores one candidate against every job (candidate Matches);
`matchProfileToJob(profile, job)` scores one candidate against one job and powers the recruiter's
**Talent** view, so a given pairing reads the *same* fit score to both sides.

## 2. Assessment — [`lib/assessor.ts`](lib/assessor.ts)

- **Generate:** take up to 4 questions for the (normalized) skill from the bank, shuffle each
  question's options, and return them **without** the answer key.
- **Grade:** rebuild the answer map from the bank server-side and compare each selected option's
  *text* to the known answer. `score = round(100 × correct / total)`, `passed = score ≥ 70`.

Splitting generate/grade keeps the answer key off the client, so a pass genuinely earns the
`assessment_passed` evidence tier.

## 3. Decision — [`lib/decision.ts`](lib/decision.ts)

One template per reason code (`moving_forward`, `skills_gap`, `role_filled`,
`seniority_mismatch`), personalized from the consented application data (candidate name, role,
company, a shared skill). The recruiter edits the draft before sending — the template removes the
effort, the human keeps control. `outcomeFor` maps each reason to the terminal status
(`offer` / `rejected`).

## 4. Market, talent & growth signals

The discovery and retention surfaces are the same kind of inspectable, deterministic helpers:

- **Likes & attractiveness** ([`lib/likes.ts`](lib/likes.ts)) — a posting's base popularity is a
  stable hash of its id plus a small pay boost; `attractiveness` (pay + popularity + remote) ranks
  postings consistently for both the candidate Discover and the recruiter Market.
- **Recruiter standing** ([`lib/recruiterMarket.ts`](lib/recruiterMarket.ts)) — a recruiter's
  postings placed against the whole market by the same `attractiveness` score, plus competitor lists.
- **Talent** ([`lib/talent.ts`](lib/talent.ts)) — a seed sourcing pool ranked per posting with the
  matcher; `talentDevelopment` compares required-skill demand to pool supply and attaches courses.
- **Reskilling feed** ([`lib/reskill.ts`](lib/reskill.ts)) — `reskillPage` cycles a pool of
  gaps → adjacent → in-demand skills with rotating copy for an endless, deterministic feed.
- **Activity digest** ([`lib/activity.ts`](lib/activity.ts)) — reports only real application status
  changes since the last visit; no fabricated counts.

## Why deterministic

- **Runs anywhere** — no key, no network, works in CI/test/dev and offline.
- **Reproducible** — same input, same output; easy to reason about and verify.
- **Honest by construction** — "verified > claimed" and "must-have > nice-to-have" are explicit,
  inspectable rules rather than a prompt the model might drift from.
- **Swap-friendly** — each engine has a small, stable signature, so an AI-backed implementation
  could replace any one of them later without touching the routes or UI.
