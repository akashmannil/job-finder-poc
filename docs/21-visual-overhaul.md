# 21 — Apple-style visual overhaul

> Commit: `style: apple-inspired visual overhaul` *(changes staged — not yet committed)*
> Nav: [← Prev](20-retire-ai.md) · [Index](DEVLOG.md)

## What this adds

A complete visual redesign from the generic default look to a clean, premium, Apple-website
aesthetic — without touching any behavior. Retuned neutral palette, SF-style typography, pill
buttons, large soft-cornered cards, a slim frosted header, white-thumb segmented controls, and
refined accent themes. All driven from the design tokens so it cascades app-wide.

## Why (meaning of the change)

The look should reinforce the thesis: calm, confident, proof-over-reach — not a loud dashboard.
The redesign is centralized in CSS variables and shared component classes, so almost every screen
restyled by editing tokens rather than each component. The few component edits are typography
scale and the segmented-control style.

Highlights of the new system:

- **Neutrals** — Apple page/surface tones (light `#fbfbfd`/`#fff`/`#f5f5f7`, true-black dark)
  with hairline borders and very soft shadows.
- **Typography** — the system "SF" stack (`-apple-system`, "SF Pro Display"), tight heading
  tracking, an `.h-display` scale for primary titles, antialiased rendering.
- **Components** — pill buttons with press feedback, `22px`-radius cards, refined inputs with a
  soft focus ring; all via `.btn*`, `.card`, `.input`, `.chip`.
- **Accents** — restrained Apple-like themes (blue, purple, green, orange, pink); accent tints are
  derived with `color-mix`, so each theme declares only its base color.
- **Chrome** — a slim, frosted (`backdrop-blur-xl`) sticky header; segmented controls use a
  white sliding thumb (Apple style) instead of a colored pill.

## Files in this commit

- [`app/globals.css`](../app/globals.css) — the new token system, typography, and component
  classes (the bulk of the change).
- [`lib/themes.ts`](../lib/themes.ts) — Apple-style accent themes (`blue`/`purple`/`green`/
  `orange`/`pink`), default `blue`.
- [`app/layout.tsx`](../app/layout.tsx) — slim frosted header, refined spacing.
- [`app/page.tsx`](../app/page.tsx) — white-thumb candidate view toggle.
- [`components/common/RoleSwitcher.tsx`](../components/common/RoleSwitcher.tsx) — white-thumb
  segmented control.
- [`components/candidate/ProfileBuilder.tsx`](../components/candidate/ProfileBuilder.tsx),
  [`components/recruiter/RecruiterDashboard.tsx`](../components/recruiter/RecruiterDashboard.tsx),
  [`components/common/IdentityPage.tsx`](../components/common/IdentityPage.tsx),
  [`components/candidate/MatchResults.tsx`](../components/candidate/MatchResults.tsx),
  [`components/candidate/ReskillPanel.tsx`](../components/candidate/ReskillPanel.tsx),
  [`components/candidate/ApplicationTracker.tsx`](../components/candidate/ApplicationTracker.tsx)
  — primary headings raised to the display scale.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass. Run the app: the whole UI reads as a clean
Apple-style surface; toggle light/dark and the five accent themes from the header.

## Decisions & notes

- No behavioral changes — purely presentational, so this is a `style:` commit.
- Accent theme IDs changed (`indigo`→`blue`, etc.); a stale persisted theme falls back to the
  default `blue` cleanly.
- Accent tints use the CSS `color-mix()` function (modern evergreen browsers).
