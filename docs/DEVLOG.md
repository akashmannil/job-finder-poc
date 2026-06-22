# DEVLOG — JobMatch build trail

Read top to bottom. Each row is one commit: a feature, its doc (the *meaning* of the change),
and the conventional commit subject. Open a doc to see the reasoning and links to every source
file in that commit.

| # | Feature | Commit | What & why |
|---|---------|--------|------------|
| 01 | [Scaffold & theming](01-scaffold.md) | `chore: scaffold` | Next.js + TS + Tailwind, a CSS-variable theme system (5 accents × light/dark) and Framer Motion — the foundation everything renders on. |
| 02 | [Domain types & seed data](02-domain-types.md) | `feat: domain types & seed data` | The shared model (evidence tiers, classified requirements) + 30 seed jobs and 30 courses, with typed accessors. |
| 03 | [Shared store & role switcher](03-store-role-switcher.md) | `feat: shared store & role switcher` | One localStorage-backed Context both sides read/write, with an animated Candidate ⇄ Recruiter toggle — the mechanism that makes a two-sided POC demoable. |

> Build in progress — rows are appended as each feature lands.
