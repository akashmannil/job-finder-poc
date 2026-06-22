# DEVLOG — JobMatch build trail

Read top to bottom. Each row is one commit: a feature, its doc (the *meaning* of the change),
and the conventional commit subject. Open a doc to see the reasoning and links to every source
file in that commit.

| # | Feature | Commit | What & why |
|---|---------|--------|------------|
| 01 | [Scaffold & theming](01-scaffold.md) | `chore: scaffold` | Next.js + TS + Tailwind, a CSS-variable theme system (5 accents × light/dark) and Framer Motion — the foundation everything renders on. |
| 02 | [Domain types & seed data](02-domain-types.md) | `feat: domain types & seed data` | The shared model (evidence tiers, classified requirements) + 30 seed jobs and 30 courses, with typed accessors. |
| 03 | [Shared store & role switcher](03-store-role-switcher.md) | `feat: shared store & role switcher` | One localStorage-backed Context both sides read/write, with an animated Candidate ⇄ Recruiter toggle — the mechanism that makes a two-sided POC demoable. |
| 04 | [Requirement-level matcher](04-matcher.md) | `feat: requirement-level matcher` | Server-side Claude matching with structured outputs + prompt caching: weights verified evidence over claims and must-haves over fluff. |
| 05 | [Profile builder & evidence tiers](05-profile-builder.md) | `feat: candidate profile builder & evidence tiers` | The verified profile that replaces the résumé — skills with evidence tiers, animated editor, and a one-click sample profile. |
| 06 | [Match results UI](06-match-results.md) | `feat: match results UI` | Ranked match cards with an animated score ring, evidence-cited "why it fits", and severity-tagged gaps. |
| 07 | [Skill assessment & passport](07-assessment-passport.md) | `feat: skill assessment & passport` | Claude-generated quiz (answer key server-side) that, on passing, upgrades a skill to assessment-verified and adds it to a shareable passport. |
| 08 | [Reskilling loop](08-reskilling.md) | `feat: reskilling loop` | Gaps → course recommendations → a "currently reskilling" signal that feeds back into matching. |
| 09 | [Evidence-backed endorsements](09-endorsements.md) | `feat: evidence-backed endorsements` | Endorsements that require a relationship + specific evidence sentence, weighted by credibility — proof over one-tap noise. |
| 10 | [Public identity page](10-identity-page.md) | `feat: public identity page (no vanity metrics)` | A reusable proof-over-reach profile view with zero vanity metrics, previewable via a Workspace/Public-profile toggle. |
| 11 | [Consent & apply + tracker](11-consent-apply.md) | `feat: consent & apply + application tracker` | Applying creates an Application carrying a consent snapshot (selective disclosure), with a live recruiter preview and a candidate status tracker. |
| 12 | [SLA & two-way conduct score](12-sla-conduct.md) | `feat: SLA & two-way conduct score` | Response SLAs with auto-close (the ghost path), a behavior-based conduct score replacing vanity metrics, and a simulated clock to demo it. |
| 13 | [Recruiter dashboard](13-recruiter-dashboard.md) | `feat: recruiter dashboard & consented applicant view` | Postings with applicant/overdue counts, the recruiter's public response score, and consent-filtered applicant profiles. |
| 14 | [One-click AI decision](14-ai-decision.md) | `feat: one-click AI decision & state machine` | Application state machine + reason codes + a Claude-drafted, editable decision message — humane closure made one click; plus mutual-interest gating. |

> Build in progress — rows are appended as each feature lands.
