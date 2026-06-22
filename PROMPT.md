# Claude Code Prompt — JobMatch (Two-Sided, Proof-Over-Reach Hiring Platform POC)

> Paste everything below the line into a fresh Claude Code session opened in an empty
> `job-finder-poc/` directory. It is self-contained: product thesis, both-sided scope, the
> proof-over-reach identity layer, stack, architecture, the AI contracts, and the documentation
> requirements are all specified.

---

You are a senior full-stack engineer building a **portfolio-quality proof of concept** of a
two-sided, LinkedIn-like hiring platform that deliberately fixes LinkedIn's incentive rot.

## 1. Product thesis (build everything to serve this)

Modern hiring fails three ways: **recruiters ghost applicants**; **matching is unfit** because
AI-tailored résumés and bloated job descriptions reduce matching to comparing two pieces of
marketing copy; and **professional identity is gaslit** — LinkedIn optimizes for *reach*
(likes, impressions, followers), so people perform success into a viral feed and authentic
signal drowns.

**JobMatch fixes all three by:** (a) shifting the unit of trust from the résumé to a verified,
candidate-owned profile; (b) making the marketplace accountable — every application has a
state machine with a response SLA and a public conduct score; and (c) building identity to
**optimize for proof, not reach** — every status signal is backed by verifiable evidence,
contact is consented, and there is **no viral broadcast feed to perform into**. A **reskilling
loop** turns skill gaps into a growth path, treating *willingness to reskill* as a first-class
positive signal a résumé can't express.

This is a **POC and portfolio piece**. Optimize for: runs in one `npm install && npm run dev`,
looks polished, clearly tells the story, and is exceptionally well documented. Do **not** add
real auth, a server database, payments, deployment infra, or a social feed.

## 2. Hard constraints (do not deviate)

- **Stack:** Next.js (latest, App Router) + TypeScript (strict) + Tailwind CSS. RSC where
  natural; Client Components for the interactive flows.
- **AI:** the official Anthropic SDK `@anthropic-ai/sdk`. Model id **exactly** `claude-opus-4-8`.
  All Claude calls happen **server-side** in Route Handlers — the API key is never exposed to
  the browser. Read from `process.env.ANTHROPIC_API_KEY`.
- **Data:** bundled mock/seed data only. No external job/course APIs, no scraping, no network
  calls except to the Anthropic API. Ship `data/jobs.json` (30–40 varied jobs, each owned by a
  recruiter id) and `data/courses.json` (20–30 courses tagged by skill).
- **State:** a single client-side store (React Context) is the source of truth for both sides,
  persisted to `localStorage` so the demo survives a refresh. No server DB.
- **Proof over reach (design rule):** **no vanity metrics anywhere** — no like counts, follower
  counts, impression numbers, "profile views," streaks, or engagement badges. Status comes only
  from verifiable evidence. Self-asserted vs. verified must always be visually distinct.
- **Structured output:** every Claude call returning structured data must use
  `output_config: { format: { type: "json_schema", schema: ... } }` — never parse free-form prose.
- **No scope creep** beyond §4–§7.

## 3. The mechanism that makes a two-sided POC demoable

Both sides operate on **one shared store**, toggled by a **RoleSwitcher** (Candidate ⇄
Recruiter) in the global header. The pivot object is the **Application**:

- When a candidate applies, an `Application` is created holding the job id, a **consent
  snapshot** (exactly what the candidate chose to share), a `status`, timestamps, and an
  `slaDeadline`.
- The recruiter view reads and advances those same Applications. Any change (advance, reject,
  express interest) is immediately visible when you switch back to the candidate view.
- Include a **"Simulate a day passing"** dev control so SLA expiry → auto-resolution → conduct
  penalty can be demonstrated in seconds.

This makes the thesis tangible: apply as candidate → switch to recruiter → act (or let the SLA
lapse) → switch back → see the status, the decision feedback, and the conduct score move.

## 4. What the candidate side must demonstrate

1. **Structured profile builder** — replaces the résumé. Discrete skills/experience/projects.
2. **Verified-evidence tiers** — each skill carries `self_asserted | portfolio |
   assessment_passed | reference_verified`; the matcher weights verified evidence higher.
3. **Requirement-level match with explainable gaps** — JDs parsed into `must_have |
   nice_to_have | disqualifier`; match is requirement-vs-evidence, not text-vs-text.
4. **Skill Passport via a mock assessment** — pass a short Claude-generated assessment to
   upgrade a skill to `assessment_passed` and add it to a shareable passport.
5. **Reskilling loop** — gaps recommend courses; marking one "in progress" sets a
   `currently_reskilling` flag surfaced as a positive signal.
6. **Consent & apply** — choose exactly what a recruiter sees, preview that view, then apply
   (creates an Application). An **Application Tracker** shows live status per application.
7. **Public verified identity page** — the proof-over-reach profile: verified skills with
   evidence badges, passport, reskilling status, conduct score — and **zero vanity metrics**.
   Self-asserted vs. verified is unmistakably separated.
8. **Evidence-backed endorsements** — an endorsement requires a stated working relationship
   **and** a specific evidence sentence (no one-tap "skills"). Display weighted by how
   verifiable the relationship is.

## 5. What the recruiter side must demonstrate

1. **Posting dashboard** — the recruiter's postings, each with applicant counts and an SLA
   summary.
2. **Consented applicant view** — see only what the candidate approved: verified skills with
   evidence badges, passport, reskilling status. Self-asserted vs. verified visually distinct.
3. **Application state machine + SLA** — `Received → Reviewing → Decision`. Each application
   shows time remaining against its SLA; lapsing it auto-resolves to "no longer considered" and
   notifies the candidate (the ghost path, made visible and penalized).
4. **One-click structured decision** — pick a reason code (skills gap, role filled, seniority
   mismatch, moving forward) and get a **Claude-drafted, personalized message** the recruiter
   can send in one click. Closure becomes cheaper than silence.
5. **Mutual-interest gating** — recruiter can express interest; full contact unlocks only when
   both sides have opted in (double opt-in).

## 6. Cross-cutting: the two-way conduct score

Both roles carry a public **conduct score** (generalize the recruiter response score):

- **Recruiters:** median response time, % resolved before SLA, % auto-ghosted.
- **Candidates:** responsiveness to unlocked contact, follow-through on applications.

It appears on the identity page and the consented view for both sides. It replaces vanity
metrics as the reputation signal. Pure, computed from store data (`lib/conductScore.ts`).

## 7. Architecture & file tree

```text
job-finder-poc/
├── app/
│   ├── layout.tsx                  # global header w/ RoleSwitcher; wraps StoreProvider
│   ├── page.tsx                    # renders Candidate or Recruiter workspace by role
│   ├── globals.css
│   └── api/
│       ├── match/route.ts          # POST profile -> ranked, gap-annotated matches
│       ├── assess/route.ts         # POST {skill} -> generated assessment + grading
│       └── draft-decision/route.ts # POST {application, reasonCode} -> drafted message
├── components/
│   ├── common/
│   │   ├── RoleSwitcher.tsx
│   │   ├── EvidenceBadge.tsx
│   │   ├── ConductScore.tsx        # two-way; no vanity metrics
│   │   ├── IdentityPage.tsx        # public verified profile (proof, not reach)
│   │   └── TimeControls.tsx        # "Simulate a day passing"
│   ├── candidate/
│   │   ├── ProfileBuilder.tsx
│   │   ├── MatchResults.tsx
│   │   ├── MatchCard.tsx           # fit score, met reqs, gaps, apply CTA
│   │   ├── SkillAssessment.tsx
│   │   ├── SkillPassport.tsx
│   │   ├── ReskillPanel.tsx
│   │   ├── Endorsements.tsx        # relationship + evidence sentence required
│   │   ├── ConsentShare.tsx        # choose shared fields + preview recruiter view
│   │   └── ApplicationTracker.tsx  # live status per application
│   └── recruiter/
│       ├── RecruiterDashboard.tsx
│       ├── PostingCard.tsx         # applicant count + SLA summary
│       ├── ApplicantCard.tsx       # consented view of one candidate
│       └── DecisionPanel.tsx       # state machine + reason codes + AI-drafted message
├── lib/
│   ├── anthropic.ts                # server-only client
│   ├── matcher.ts                  # requirement-level match (structured output)
│   ├── assessor.ts                 # generate + grade assessment (structured output)
│   ├── decision.ts                 # AI-drafted decision message (structured output)
│   ├── reskill.ts                  # gaps -> courses (pure)
│   ├── conductScore.ts             # two-way conduct score from applications (pure)
│   ├── endorsements.ts             # validate + weight endorsements (pure)
│   ├── sla.ts                      # SLA deadlines, expiry, auto-resolution (pure)
│   ├── schema.ts                   # JSON schemas + TS types (single source of truth)
│   ├── jobs.ts
│   └── courses.ts
├── store/
│   └── store.tsx                   # React Context: role, profile, applications,
│                                   #   endorsements; localStorage-persisted
├── types/index.ts                  # Profile, Skill, EvidenceTier, Job, Requirement,
│                                   #   Application, ApplicationStatus, Endorsement,
│                                   #   ConductScore, MatchResult, ...
├── data/
│   ├── jobs.json
│   └── courses.json
├── docs/
│   ├── DEVLOG.md                   # ordered index: every commit -> its feature doc
│   ├── 01-scaffold.md              # one doc per feature commit (template in §11)
│   ├── 02-domain-types.md
│   └── NN-<slug>.md                # ... through the full commit plan (§12)
├── .env.example                    # ANTHROPIC_API_KEY=
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── PROMPTS.md
├── package.json
└── tsconfig.json                   # strict: true
```

## 8. The AI contracts (most important part)

### a. Matching — `lib/matcher.ts`

`matchProfileToJobs(profile: Profile): Promise<MatchResult[]>`

1. Load all jobs. Put the (large, stable) job list **first** and apply
   `cache_control: { type: "ephemeral" }` so repeated matches reuse the cached prefix.
2. System prompt: an expert recruiter who scores fit **honestly** (not inflated), weights
   **verified** evidence above self-asserted claims, separates must-haves from nice-to-haves,
   and never rewards keyword stuffing.
3. Structured output per job: `jobId`, `fitScore` (0–100), `summary`,
   `metRequirements: { requirement, evidence }[]`, `gaps: { skill, severity }[]`.
4. Validate, sort by `fitScore` desc, join back to the full `Job`.

### b. Assessment — `lib/assessor.ts`

- `generateAssessment(skill)` → 3–4 multiple-choice questions (structured output).
- `gradeAssessment(skill, answers)` → `{ passed, score }` (structured output). On pass, the
  client upgrades the skill's evidence tier and adds it to the passport.

### c. Decision draft — `lib/decision.ts`

- `draftDecision(application, reasonCode)` → `{ subject, body }` (structured output): a short,
  specific, humane message personalized from the consented profile + the job + reason. The
  point: make a real, kind rejection or next-step one click away, so ghosting loses.

### d. Pure logic (no AI)

- `reskill.recommendCourses(gaps)` → maps gaps to `courses.json`.
- `sla.*` → compute deadlines, detect expiry, auto-resolve lapsed applications.
- `conductScore.compute(...)` → two-way conduct score from store data.
- `endorsements.*` → validate (relationship + evidence sentence required) and weight by
  relationship verifiability.

Define all schemas + types in `lib/schema.ts`/`types`. Handle errors with typed SDK exceptions
and input validation → clean HTTP errors the UI can show.

## 9. UX flow (one app, two roles)

- **Header:** RoleSwitcher (Candidate ⇄ Recruiter) + TimeControls, always visible.
- **Candidate:** build profile → match → (verify a skill via assessment → passport) →
  (reskill from gaps) → add/receive endorsements → view public identity page → consent & apply
  → track status.
- **Recruiter:** dashboard → open a posting → review consented applicants → advance or decide
  (one-click AI-drafted message) → watch the conduct score; or let an SLA lapse to see the
  ghost penalty.
- **The handoff is the hero moment:** an action on one side visibly changes the other. Make
  status changes and the conduct score feel alive — and ensure **no vanity metric ever
  appears**.
- Clean, modern, calm, responsive Tailwind. Clear empty/loading/error states. Include "Load
  sample profile" (with seed endorsements) and seed a couple of in-progress applications so the
  recruiter dashboard isn't empty on first load.

## 10. Documentation (this is graded — do it well)

Documentation has **two layers**: the **root docs** below (the polished portfolio reads), and
a **per-commit doc trail** in `docs/` that lets a reviewer follow the build feature-by-feature
(§11). Both are required.

- **README.md** — the three-part thesis in a few sentences, what each side demonstrates, the
  proof-over-reach stance (and the honest trade-off: no vanity metrics means slower, calmer
  growth — a deliberate values choice), the role-switcher + time-simulation demo script, tech
  stack, exact setup (`npm install`, copy `.env.example` → `.env.local`, add key,
  `npm run dev`), and "POC limitations / what I'd build next."
- **ARCHITECTURE.md** — the shared-store + role-switcher design, the Application lifecycle, why
  verified-profile-over-résumé, why requirement-level matching, why no vanity metrics, the
  two-way conduct score, where the cache breakpoint is, and the server-side trust boundary.
- **PROMPTS.md** — the actual system prompts and JSON schemas for matching, assessment, and
  decision drafting, with notes on *why* each is written that way.
- Inline: concise comments only on non-obvious parts (schemas, caching, evidence weighting,
  SLA auto-resolution, endorsement weighting).

## 11. Commit & documentation protocol (required)

This directory is **not yet a git repo** — `git init` is the first action. Then build **one
feature per commit**, in the order of §12. Every commit must:

- compile cleanly (`npx tsc --noEmit` passes) and leave the app runnable;
- be **atomic** — one coherent feature, nothing unrelated bundled in;
- use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`);
- include, **in the same commit**, its feature doc under `docs/` plus an updated `docs/DEVLOG.md`;
- reference its doc in the commit body (`Docs: docs/NN-<slug>.md`) and end with the trailer
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Do not skip hooks or signing.

### Per-feature doc template — `docs/NN-<slug>.md`

Every numbered doc MUST follow this format, so the trail is navigable by **both code and
meaning**:

```markdown
# NN — <Feature title>

> Commit: `feat: <subject>`
> Nav: [← Prev](NN-1-<slug>.md) · [Index](DEVLOG.md) · [Next →](NN+1-<slug>.md)

## What this adds
Plain-language summary of the feature (2–4 sentences).

## Why (meaning of the change)
How it serves the thesis (verified trust / accountability / proof-over-reach); what problem
it solves and which alternative was rejected.

## Files in this commit
- [`path/to/file.ts`](../path/to/file.ts) — what it does and the key idea inside it
- ...

## How to verify
Concrete steps to see it work (a UI action, or `npx tsc --noEmit`).

## Decisions & notes
Any non-obvious choice, trade-off, or follow-up.
```

Rules: **every source file the commit touches is linked** with a clickable relative path.
Prev / Index / Next links are always present and correct (first doc has no Prev; last has no
Next).

### The index — `docs/DEVLOG.md`

An ordered table of every commit: number · feature title (linked to its doc) · conventional
commit subject · one-line "what & why." This is the entry point a reader follows top to
bottom. Update it as the final step of each commit, fixing the neighbouring doc's Next link.

## 12. Ordered commit plan (default sequence)

Each line is one commit with doc `docs/NN-<slug>.md`:

1. `chore: scaffold` — Next.js + TS(strict) + Tailwind, `.env.example`, `.gitignore`, seeded `docs/DEVLOG.md`.
2. `feat: domain types & seed data` — `types/`, `data/jobs.json`, `data/courses.json`.
3. `feat: shared store & role switcher` — `store/`, `RoleSwitcher`.
4. `feat: requirement-level matcher` — `lib/anthropic`, `lib/schema`, `lib/matcher`, `app/api/match`.
5. `feat: candidate profile builder & evidence tiers` — `ProfileBuilder`, `EvidenceBadge`.
6. `feat: match results UI` — `MatchResults`, `MatchCard`.
7. `feat: skill assessment & passport` — `lib/assessor`, `app/api/assess`, `SkillAssessment`, `SkillPassport`.
8. `feat: reskilling loop` — `lib/reskill`, `ReskillPanel`.
9. `feat: evidence-backed endorsements` — `lib/endorsements`, `Endorsements`.
10. `feat: public identity page (no vanity metrics)` — `IdentityPage`.
11. `feat: consent & apply + application tracker` — `ConsentShare`, `ApplicationTracker`, Application object.
12. `feat: SLA & two-way conduct score` — `lib/sla`, `lib/conductScore`, `ConductScore`, `TimeControls`.
13. `feat: recruiter dashboard & consented applicant view` — `RecruiterDashboard`, `PostingCard`, `ApplicantCard`.
14. `feat: one-click AI decision & state machine` — `lib/decision`, `app/api/draft-decision`, `DecisionPanel`, mutual-interest gating.
15. `docs: root README, ARCHITECTURE, PROMPTS` — author/finalize the three root docs and link them from `DEVLOG.md`.

If a feature is too large for one clean commit, split it (`07a`, `07b`) — keep each commit
atomic and compiling.

## 13. Agentic workflow (follow this loop)

1. **Plan:** create a todo list mirroring §12 and keep it current.
2. For each commit, in order:
   - a. Implement the feature.
   - b. Run `npx tsc --noEmit` (and `npm run build` on the final commit); fix until clean.
   - c. Write `docs/NN-<slug>.md` from the template; link every touched file.
   - d. Update `docs/DEVLOG.md` (add the row; fix the previous doc's Next link).
   - e. `git add -A` and commit with a Conventional Commit message + `Docs:` and `Co-Authored-By` trailers.
3. Never bundle two features in one commit; never commit code that doesn't compile.
4. After the last commit, run the full demo loop end-to-end and confirm every `DEVLOG.md` link resolves.
5. If a decision is genuinely ambiguous, pick the conventional Next.js default and record it in
   the relevant feature doc rather than stopping.

## 14. Acceptance criteria

- `npm install && npm run dev` works on a clean checkout (valid key in `.env.local`);
  `npx tsc --noEmit` passes (strict; no `any` in app code).
- **Git history is a clean, ordered sequence of atomic per-feature commits** using Conventional
  Commits, and **every commit compiles**.
- **`docs/DEVLOG.md` exists and links, in order, to one feature doc per commit**; each feature
  doc follows the template, links every source file it introduced, and has working
  Prev / Index / Next navigation.
- Full product loop works: sample profile → ranked matches → pass an assessment (evidence
  upgrades and the next match improves) → gaps yield courses → add an endorsement (requires
  relationship + evidence) → identity page renders verified vs. self-asserted with the conduct
  score and **no vanity metrics** → consent & apply creates an Application → switch to recruiter
  → see the consented view → send a one-click AI-drafted decision → status updates on the
  candidate side; letting an SLA lapse auto-resolves and moves the conduct score.
- No like/follower/impression/profile-view counters appear anywhere in the UI.
- No API key in the client bundle; no network calls except to the Anthropic API.
- Root `README.md`, `ARCHITECTURE.md`, `PROMPTS.md` exist, are accurate to the code, and are
  linked from `DEVLOG.md`.
