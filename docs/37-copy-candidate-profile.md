# 37 - Candidate profile / consent / assessment copy

> Commit: `refactor: move candidate profile, consent & assessment copy to constants`
> Nav: [Prev](36-copy-module-candidate.md) · [Index](DEVLOG.md) · [Next](38-copy-recruiter-messaging.md)

## What this adds

Continues the copy migration into the candidate's display-first profile and its two dialogs:

- `CandidateProfile` - page title/subtitle, the recruiter-preview note, the empty-profile prompt,
  every section title/subtitle, field placeholders, empty states, and button labels now read from
  constants (variants for sentences, single strings for placeholders/labels).
- `ConsentShare` - apply header, share/preview labels, the revoke note, and buttons.
- `SkillAssessment` - loading/grading lines, result pass/fail copy, the verified note, and buttons.

## Why (meaning of the change)

These are the highest-text-density candidate surfaces, so centralizing them gives the biggest
editability win and removes a lot of the em-dash phrasing in one pass. Variant arrays add life to the
sentence copy; placeholders and CTA verbs stay fixed so forms remain predictable.

## Files in this commit

- `lib/copy/profile.ts` - new: `profileCopy`, `consentCopy`, `assessmentCopy`.
- `components/candidate/CandidateProfile.tsx`, `ConsentShare.tsx`, `SkillAssessment.tsx` - migrated.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Open Profile, the consent dialog (Apply), and an
assessment (Prove a skill): copy is intact and varies between mounts for the sentence-level text.

## Decisions & notes

- Hooks (`useVariant`) are hoisted to the top of each section component to respect the rules of hooks
  (no variant picks inside JSX conditionals).
- A few micro-labels (e.g. field labels like "Name", the "Currently reskilling:" tag) remain inline;
  they carry no em dashes and are swept for style in commit 39.
