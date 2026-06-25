# 22 — Section navigation & Applications tab

> Commit: `feat: candidate section menu + dedicated Applications tab` *(changes staged — not yet committed)*
> Nav: [← Prev](21-visual-overhaul.md) · [Index](DEVLOG.md) · [Next →](23-swipe-reels.md)
>
> **⚠️ Superseded by [24 — Display-first candidate profile](24-display-first-profile.md).** The
> section menu and the per-section edit-first components described below were replaced by a
> display-first profile. The **Applications** top-level tab (and its count badge) introduced here
> still stands. Kept for narrative continuity.

## What this adds

The candidate workspace no longer stacks every section in one long scroll. Instead:

- A **section menu** (a sticky sidebar on desktop, a horizontally scrollable strip on mobile)
  switches the workspace between **Profile**, **Skill passport**, **Endorsements**, **Matches**,
  and **Reskilling** — one section in view at a time, so reaching a section is a click, not a
  scroll.
- **Applications** is promoted to its own **top-level tab** (alongside *Workspace* and
  *Public profile*), with a **count badge** of your live applications — because application status
  is the highest-stakes information for a candidate and shouldn't be buried at the bottom.

## Why (meaning of the change)

Previously the candidate side rendered `ProfileBuilder → SkillPassport → Endorsements →
MatchResults → ReskillPanel → ApplicationTracker` in a single `space-y` column. To check an
application you scrolled past everything else. Two problems: (1) navigation cost grows with every
section, and (2) the most important, time-sensitive view (am I being ghosted?) was the least
reachable.

The fix separates *navigation* from *content*. The top tabs answer "which mode am I in?"
(work on my profile / track applications / preview my public page), and within Workspace the
section menu answers "which part of my profile am I editing?". Only the active section mounts, so
the page is short and focused, and Framer Motion cross-fades the transition.

## Files in this commit

- [`app/page.tsx`](../app/page.tsx) — reworked `CandidateWorkspace`: three top tabs
  (`workspace` / `applications` / `profile`) with an Applications count badge, plus a new
  `WorkspaceSections` component that renders the section menu + the single active section. The menu
  uses a shared `SECTIONS` list and a `layoutId` accent-soft pill for the active item.
- [`components/candidate/ApplicationTracker.tsx`](../components/candidate/ApplicationTracker.tsx)
  — now a first-class tab: shows an **empty state** (with a pointer to *Workspace → Matches*)
  instead of rendering nothing when there are no applications yet.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. As **Candidate**, note the three tabs — **Workspace**, **Applications**, **Public profile**.
2. In **Workspace**, click through the left menu (Profile, Skill passport, …): only the chosen
   section shows, with no long scroll.
3. Apply to a role from **Matches**, then open **Applications** — the badge increments and the
   application appears with its live SLA. Before applying, the tab shows the empty state.

## Decisions & notes

- Section selection is local UI state (`useState`), not persisted — the workspace always opens on
  **Profile**, the natural starting point. Promote to the store later if deep-linking is wanted.
- The menu collapses to a horizontal scroll strip under `md`, so it stays usable on mobile without
  a separate drawer.
- This is additive UI structure over the same components and store — no data-model or engine
  changes.
