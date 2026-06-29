# 42 - Side rails (vertical nav + context panel)

> Commit: `feat: workspace side rails - vertical nav + right context panel`
> Nav: [Prev](41-matching-incentives.md) · [Index](DEVLOG.md)

## What this adds

The app rendered in a centered `max-w-6xl` column with a single horizontal tab strip on
top, leaving wide empty gutters on large monitors. This commit reclaims that space with a
responsive three-column workspace shell:

- **Left: a vertical navigation rail.** On `lg+` the tab menu moves to a sticky sidebar
  (still the animated pill, now vertical); below `lg` it stays the familiar horizontal
  segmented control. Same tabs, same state - only the layout changes by breakpoint.
- **Right: a context panel.** On `xl+` a sticky rail of compact cards summarizes the
  current state and offers one-tap jumps into the relevant tab. Hidden below `xl`, so it
  only appears where there is genuinely room.
- The page container widens to `xl:max-w-[84rem]` so the rails consume the gutters instead
  of squeezing the reading column.

### Candidate context rail

- **You** - initials, name, headline, the engagement (conduct) score, and a jump to Profile
  (or a "build profile" prompt when none is loaded).
- **In demand now** - the top in-demand skills as chips that jump into the Reskilling reel.
- **Tracking** - application and saved-role counts that jump to Applications / Discover.

### Recruiter context rail (mirror)

- **Your standing** - company, response score, open-posting count, jump to Standing.
- **Decisions owed** - count of applications awaiting a decision (overdue flagged in red),
  jump to Postings - the anti-ghosting nudge, always in view.
- **Market pulse** - in-demand skills that jump into Talent, plus a jump to Market.

## Why (meaning of the change)

The request was that the empty side space should do something. Rather than padding, the
rails add *navigation* (a real menu, not a strip) and *context* (glanceable state with quick
jumps) - the app feels more like a workspace and less like a single scrolling column. The
rails reuse existing engines (`topSkillsInDemand`, `recruiterConduct`/`candidateConduct`,
the SLA helpers), so every number agrees with the tab it links to.

This stays inside the product's rules: the only number on a person is the conduct/response
score (behavior, not reach); skills-in-demand is a market signal; nothing here is a vanity
metric, a streak, or a manufactured-urgency nudge.

## Files in this commit

- `components/common/WorkspaceShell.tsx` - new responsive shell (vertical/horizontal nav +
  content + optional right aside); both workspaces render through it.
- `components/candidate/CandidateRail.tsx` - candidate context cards.
- `components/recruiter/RecruiterRail.tsx` - recruiter context cards.
- `lib/copy/sidebar.ts` - new `railCopy` (variant headings + stable labels).
- `app/page.tsx` - both workspaces mount on `WorkspaceShell`; exports `TopView` /
  `RecruiterView` for the rails to type their navigation callback.
- `app/layout.tsx` - header + main widen to `xl:max-w-[84rem]`.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. On a wide (`xl+`) viewport the tabs sit in
a left rail and a context panel sits on the right; clicking a rail card or skill chip
switches tabs. Narrow the window: below `xl` the right rail disappears, and below `lg` the
nav returns to the horizontal segmented control - no layout breakage at any width.

## Decisions & notes

- One nav element with responsive flex direction (not two), so the `layoutId` pill stays
  unique and animates correctly in both orientations.
- The right rail is `hidden xl:block` by design - the center column keeps a comfortable
  reading width rather than stretching edge to edge.
- The rails are derived, read-only views of existing state; they add no new store fields.
