# 01 — Scaffold & theming

> Commit: `chore: scaffold`
> Nav: [Index](DEVLOG.md) · [Next →](02-domain-types.md)

## What this adds

A runnable Next.js (App Router) + TypeScript (strict) + Tailwind project with a polished
theming system and animation primitives. The header, landing page, theme switcher (5 accents ×
light/dark), and motion presets are all in place — the shell every later feature plugs into.

## Why (meaning of the change)

This is the foundation, so it deliberately encodes two product values up front:

- **Proof over reach, visually:** a calm, themeable design system (CSS variables, soft cards)
  rather than a loud feed. The aesthetic is part of the thesis.
- **Fluid by default:** shared Framer Motion presets (`fadeUp`, `stagger`) and global CSS
  transitions mean every later feature animates consistently without re-deciding.

Theming is driven by CSS variables swapped via `data-theme` / `data-mode` on `<html>`, so a
theme change is one attribute write — no per-element class churn, and an inline script applies
the saved theme before first paint to avoid a flash.

## Files in this commit

- [`package.json`](../package.json) — deps: Next 15, React 19, Framer Motion, Anthropic SDK.
- [`tsconfig.json`](../tsconfig.json) — strict mode, `@/*` path alias.
- [`tailwind.config.ts`](../tailwind.config.ts) — maps Tailwind colors to CSS variables.
- [`app/globals.css`](../app/globals.css) — theme variables (5 accents × light/dark), component
  classes (`card`, `btn-*`, `input`, `chip`), and global theme transitions.
- [`lib/themes.ts`](../lib/themes.ts) — theme catalog + storage keys shared by provider and UI.
- [`components/common/ThemeProvider.tsx`](../components/common/ThemeProvider.tsx) — context,
  persistence, and the no-flash init script.
- [`components/common/ThemeSwitcher.tsx`](../components/common/ThemeSwitcher.tsx) — animated
  light/dark toggle + accent picker.
- [`components/common/Motion.tsx`](../components/common/Motion.tsx) — shared motion presets.
- [`app/layout.tsx`](../app/layout.tsx) — root layout, header, theme wiring.
- [`app/page.tsx`](../app/page.tsx) — animated landing page stating the thesis.

## How to verify

```bash
npm install
cp .env.example .env.local   # key not needed until commit 4
npm run dev
```

Open the app, toggle light/dark and switch accent colors in the header — the whole UI
transitions smoothly. `npx tsc --noEmit` passes.

## Decisions & notes

- **Tailwind v3 + CSS variables** over v4 for a hand-written, well-understood config.
- ESLint is intentionally omitted; type-safety is enforced by `tsc`.
- Reduced-motion users get transitions/animations disabled via a media query.
