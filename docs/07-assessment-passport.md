# 07 - Skill assessment & passport

> Commit: `feat: skill assessment & passport`
> Nav: [← Prev](06-match-results.md) · [Index](DEVLOG.md) · [Next →](08-reskilling.md)
>
> **Note:** the standalone `SkillPassport.tsx` was later removed in
> [24 - Display-first candidate profile](24-display-first-profile.md); "Prove a skill" is now an
> inline action on each unverified skill in `components/candidate/CandidateProfile.tsx`. The
> assessment engine (`lib/assessor`, `app/api/assess`, `SkillAssessment`) is unchanged.

## What this adds

The verification step. A candidate can take a short, Claude-generated multiple-choice
assessment for any unverified skill; on passing, that skill is upgraded to `assessment_passed`
and appears in the Skill Passport. Two AI calls back the flow: one generates the questions, one
grades the answers.

## Why (meaning of the change)

This is what makes "verified over self-asserted" real rather than a label a user picks. Evidence
is now **earned**: the answer key never reaches the client (generation omits it; grading happens
server-side), so passing means something. Re-running the match afterwards visibly improves the
score for that skill - the loop the whole thesis depends on. The passport models "verify once,
share many," reducing the assessment fatigue that kills assessment-heavy funnels.

## Files in this commit

- [`types/index.ts`](../types/index.ts) - `Assessment`, `AssessmentQuestion`, `AnsweredItem`,
  `GradeResult`.
- [`lib/assessor.ts`](../lib/assessor.ts) - `generateAssessment` + `gradeAssessment` (structured
  outputs; pass threshold 70).
- [`app/api/assess/route.ts`](../app/api/assess/route.ts) - `generate` / `grade` actions.
- [`components/candidate/SkillAssessment.tsx`](../components/candidate/SkillAssessment.tsx) - the
  animated modal flow (load → take → grade → result).
- [`components/candidate/SkillPassport.tsx`](../components/candidate/SkillPassport.tsx) - verified
  skills + "prove a skill" launchers; upgrades evidence on pass.
- [`app/page.tsx`](../app/page.tsx) - adds the passport to the candidate workspace.

## How to verify

With a key in `.env.local`: load the sample profile → Skill passport → "Assess Next.js" → answer
→ submit. On a pass, the skill moves into Verified and re-running matches reflects the stronger
evidence. `npx tsc --noEmit` passes.

## Decisions & notes

- The answer key is intentionally never sent to the browser - grading is a separate server call.
- Upgrades only ever raise a skill's evidence rank, never lower it.
