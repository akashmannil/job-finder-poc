# Prompts & schemas

The three places JobMatch calls Claude, why each prompt is written the way it is, and the JSON
schema that constrains each response. All calls use `claude-opus-4-8` with
`output_config.format` (structured outputs), server-side only.

## 1. Matching — [`lib/matcher.ts`](lib/matcher.ts)

**System prompt (essence):** an expert technical recruiter who scores fit *honestly* (low scores
for weak fits), weights **verified evidence above self-asserted claims** (with the tier order
spelled out), treats **must-haves as far more important than nice-to-haves**, never rewards
keyword matching, and slightly softens a gap when a skill is `currentlyReskilling`.

**Why:** the prompt encodes the entire thesis. Spelling out the evidence ranking and the
must-have/nice-to-have weighting is what stops AI-tailored résumé keywords from winning — the
model is told to judge capability, not vocabulary. Asking for the *evidence behind each met
requirement* is what makes results explainable in the UI.

**Caching:** the job list is sent first with `cache_control: ephemeral`; the profile follows, so
re-runs reuse the cached prefix.

**Schema** ([`lib/schema.ts`](lib/schema.ts)): `{ results: [{ jobId, fitScore:int, summary,
metRequirements:[{requirement, evidence}], gaps:[{skill, severity:"must_have"|"nice_to_have"}] }] }`,
`additionalProperties:false` throughout. Mirrors `MatchResultRaw` in
[`types/index.ts`](types/index.ts).

## 2. Assessment — [`lib/assessor.ts`](lib/assessor.ts)

Two calls:

- **Generate:** "write exactly 4 fair multiple-choice questions, 4 options each, one correct,
  **do not reveal which is correct**." → `{ questions: [{ question, options[] }] }`.
- **Grade:** given the questions, options, and the candidate's selected answers, "decide
  correctness yourself; return an integer score 0–100, `passed = score >= 70`, and a one-sentence
  rationale." → `{ passed, score:int, rationale }`.

**Why:** splitting generate and grade keeps the **answer key off the client** — generation omits
it and grading happens server-side — so passing actually means something. That's the difference
between *earned* `assessment_passed` evidence and a self-selected label.

## 3. Decision draft — [`lib/decision.ts`](lib/decision.ts)

**System prompt (essence):** a recruiter writing a short (2–4 sentence), warm, **specific**
decision message; reference something concrete from the candidate's profile; if a rejection, be
kind and name the reason honestly; if moving forward, be enthusiastic and state the next step;
never generic or cold. Input includes the candidate name, role, their consented skills, and the
chosen reason code.

**Why:** ghosting persists because a thoughtful rejection is *effort*. Making a kind, specific
message one click away (then letting the recruiter edit it) removes the effort excuse — the
mechanism behind the whole anti-ghosting argument. The reason code keeps it honest.

**Schema:** `{ subject, body }`, `additionalProperties:false`.

## Cross-cutting notes

- **Structured outputs over prose parsing** everywhere — no regex, no brittle string scraping.
- **`callStructured`** ([`lib/anthropic.ts`](lib/anthropic.ts)) centralizes the call: it checks
  for a `refusal` stop reason and extracts the JSON text block. `output_config` / per-block
  `cache_control` are typed locally and cast at the call site because they can be ahead of the
  installed SDK's static types; the SDK still forwards them on the wire.
- **Honest scoring is a prompt instruction, not a post-filter** — the value is in telling the
  model what "good" means (verified > claimed, must-have > nice-to-have, kind > generic).
