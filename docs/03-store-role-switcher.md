# 03 - Shared store & role switcher

> Commit: `feat: shared store & role switcher`
> Nav: [← Prev](02-domain-types.md) · [Index](DEVLOG.md) · [Next →](04-matcher.md)

## What this adds

A single client-side store (React Context, persisted to `localStorage`) that is the source of
truth for both sides of the marketplace, and a `RoleSwitcher` in the header that toggles between
the Candidate and Recruiter workspaces with an animated pill. The landing page now renders a
role-aware workspace that cross-fades on switch.

## Why (meaning of the change)

This is the mechanism that makes a two-sided platform demoable solo (PROMPT §3): instead of two
apps or real multi-user auth, both roles operate on **one shared store**, so an action taken as
a recruiter is visible when you switch back to the candidate. Persisting to `localStorage` means
the demo survives a refresh. The store is deliberately structured as a small state object with
focused actions, so later feature slices (applications, endorsements, a simulated clock) extend
it cleanly.

The `hydrated` flag gates UI until persisted state has loaded, avoiding a server/client flash.

## Files in this commit

- [`types/index.ts`](../types/index.ts) - adds the `Role` type.
- [`store/store.tsx`](../store/store.tsx) - the Context store: `role`, `profile`, persistence,
  `hydrated`, and actions (`setRole`, `setProfile`, `updateProfile`).
- [`components/common/RoleSwitcher.tsx`](../components/common/RoleSwitcher.tsx) - animated
  segmented toggle (shared `layoutId` pill).
- [`app/layout.tsx`](../app/layout.tsx) - wraps the tree in `StoreProvider`; adds the switcher.
- [`app/page.tsx`](../app/page.tsx) - role-aware workspace with an `AnimatePresence` cross-fade.

## How to verify

Run the app, flip Candidate ⇄ Recruiter in the header - the pill animates and the workspace
cross-fades. Reload: the selected role persists. `npx tsc --noEmit` passes.

## Decisions & notes

- One store rather than per-role stores keeps the cross-side handoff trivial to demo.
- Workspaces are placeholders here; later commits slot real features into them.
