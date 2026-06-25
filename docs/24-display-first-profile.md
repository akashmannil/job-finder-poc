# 24 — Display-first candidate profile

> Commit: `feat: display-first candidate profile (edit on click)` *(changes staged — not yet committed)*
> Nav: [← Prev](23-swipe-reels.md) · [Index](DEVLOG.md) · [Next →](25-discover-reskill-reel-likes.md)
>
> **Supersedes [22 — Section navigation](22-section-navigation.md).** The section menu and the
> separate edit-first section components are removed here.

## What this adds

The candidate workspace is now a **display-first profile page**, the way LinkedIn / Facebook
profiles read: the data is *shown* meaningfully by default, and editing is revealed only on an
explicit **Edit** click — instead of landing the user in a wall of always-open form fields.

- A single profile page renders **Identity, Skills, Experience, Projects, and Endorsements** as
  finished content. Each section has its own **Edit / Done** button that swaps that section (and only
  that section) into its form in place. Edits live-save to the store, so **Done** just returns to the
  read view.
- **"Prove a skill"** (assessment) is now an inline action on each unverified skill chip — the old
  standalone Skill Passport is folded into the Skills section.
- A **"Preview as recruiter"** button swaps the whole page to the read-only
  [`IdentityPage`](../components/common/IdentityPage.tsx) — the exact consented recruiter view —
  which replaces the now-redundant separate "Public profile" tab.
- The candidate top tabs simplify to **Profile · Matches · Applications**. *Matches* carries both
  `MatchResults` and `ReskillPanel` (reskilling is downstream of matching, so it lives with it).

## Why (meaning of the change)

The prior structure (a section menu over `ProfileBuilder → SkillPassport → Endorsements`, each an
edit-first form — see [doc 22](22-section-navigation.md)) optimized for *data entry*. But on a
profile, the common case is reading — by the candidate confirming how they look, and by the
recruiter judging fit. Forms-by-default made the product feel like an "infinite form field mess"
and buried the actual content. Leading with display, and gating edit behind a click, makes the
priority explicit: **show the details meaningfully; edit only when asked.** Pages that are
genuinely tools — *Matches*, *Reskilling*, the assessment — stay action-first, because there the
action *is* the content.

## Files in this commit

- [`components/candidate/CandidateProfile.tsx`](../components/candidate/CandidateProfile.tsx) —
  **new.** The display-first profile: a `Section` shell (title + Edit/Done + animated view⇄edit
  swap) wrapping `IdentitySection`, `SkillsSection` (with inline "Prove" → `SkillAssessment`),
  `ExperienceSection`, `ProjectsSection`, and `EndorsementsSection`, plus the *Preview as recruiter*
  toggle and the empty-state *Load sample profile*. Editing logic is the same as before, just gated.
- [`app/page.tsx`](../app/page.tsx) — `CandidateWorkspace` reworked to the three tabs
  (`profile` / `matches` / `applications`); the section-menu (`SECTIONS` / `WorkspaceSections`) is
  removed. *Matches* now renders `MatchResults` + `ReskillPanel`.
- **Removed** (logic merged into `CandidateProfile`):
  `components/candidate/ProfileBuilder.tsx`, `components/candidate/SkillPassport.tsx`,
  `components/candidate/Endorsements.tsx`.

## How to verify

`npx tsc --noEmit` passes and the dev server compiles `/` with `200`.

1. As **Candidate** → **Profile**: you see the rendered profile, not forms. Click **Edit** on a
   section — only that section becomes editable; **Done** returns it to display.
2. On an unverified skill, click **Prove** → the assessment opens inline; passing upgrades the badge.
3. Click **Preview as recruiter** → the read-only identity page (no edit controls, no vanity
   metrics) appears; **Back to editing** returns.
4. Empty profile shows **Load sample profile**; **Matches** and **Applications** behave as before.

## Decisions & notes

- **One section edits at a time** (`editing: SectionId | null`) — keeps the page calm and the focus
  obvious, LinkedIn-style.
- **Live save retained.** Edits write straight to the store (as the old forms did), so there is no
  separate save/cancel buffer — *Done* is purely a view toggle.
- **Public profile tab folded in** as *Preview as recruiter*: same `IdentityPage`, fewer top-level
  surfaces.
- The recruiter side was already display-first (consented profiles render via `IdentityPage`), so it
  needed no change.
