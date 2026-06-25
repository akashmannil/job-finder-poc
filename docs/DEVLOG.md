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
| 15 | [Root documentation](15-root-docs.md) | `docs: root README, ARCHITECTURE, PROMPTS` | The polished top-level docs above this trail, plus a verified production build. |

### Phase 2 — local, no-AI engines (runs anywhere, deterministic)

| # | Feature | Commit | What & why |
|---|---------|--------|------------|
| 16 | [Skill catalog & question bank](16-skill-catalog.md) | `feat: predefined skill catalog & question bank` | The expandable knowledge base (skills, aliases, related, question banks) that powers offline engines. |
| 17 | [Local matching engine](17-local-matcher.md) | `feat: local matching engine` | Deterministic, catalog-driven scoring (verified > claims, must-have > nice, transferable credit) replacing the AI matcher — no key needed. |
| 18 | [Local assessment engine](18-local-assessment.md) | `feat: local assessment engine` | Offline quiz from the question bank with server-side grading (answer key never sent) — earned verification without AI. |
| 19 | [Local decision engine](19-local-decision.md) | `feat: local decision engine` | Template-based, personalized decision messages replacing the AI draft — humane closure, offline. |
| 20 | [Retire Anthropic dependency](20-retire-ai.md) | `chore: retire Anthropic dependency` | Remove the unused SDK + key requirement and update the root docs — the app now runs fully offline. |

### Phase 3 — UI/UX refinements

| # | Feature | Commit | What & why |
|---|---------|--------|------------|
| 21 | [Apple-style visual overhaul](21-visual-overhaul.md) | `style: apple-inspired visual overhaul` *(staged, not yet committed)* | Premium redesign — neutral surfaces, SF-style type, pill buttons, soft-cornered cards, frosted header, refined accents — all from the design tokens. |
| 22 | [Section navigation & Applications tab](22-section-navigation.md) | `feat: candidate section menu + dedicated Applications tab` *(committed in `caf71cf`; section menu later superseded by 24)* | Replace the long candidate scroll with a section menu (one section at a time) and promote Applications to its own top-level tab with a live count badge. |
| 23 | [Swipe reels](23-swipe-reels.md) | *committed in `caf71cf`* | A Tinder-style swipe deck as an alternative to the lists: swipe to apply/skip (candidate) or shortlist/pass (recruiter), behind a List / Reel toggle — same consent & decision logic underneath. |
| 24 | [Display-first candidate profile](24-display-first-profile.md) | `feat: display-first candidate profile (edit on click)` *(committed in `ce9da2b`)* | Replace the edit-first section forms with a LinkedIn-style profile that shows the data and reveals editors only on Edit; folds in Skill passport, Endorsements, and the public-profile preview. Supersedes 22's section menu. |

### Phase 4 — discovery, growth & market signal

| # | Feature | Commit | What & why |
|---|---------|--------|------------|
| 25 | [Discover, reskilling reel & posting likes](25-discover-reskill-reel-likes.md) | `feat: discover landing, infinite reskilling reel & posting likes` *(committed in `394341e`)* | Lead with the market (Discover landing + most-attractive offer), split Reskilling into its own infinite reels-style feed, and add likes as a market-demand signal on postings (not on people). |
| 26 | [Candidate retention (no baiting)](26-candidate-retention.md) | `feat: candidate retention — activity digest, saved roles & reskilling progress` | Honest reasons to return: a "while you were away" digest (only real decisions), a saved-roles watchlist, and a private reskilling-progress snapshot — no streaks, counts, or FOMO. |
| 27 | [Recruiter market & competition](27-recruiter-market.md) | `feat: recruiter workspace tabs + market & competition view` | Give the recruiter side a tabbed workspace and a Market view (your standing vs market, popular postings, competitor postings) — the recruiter mirror of Discover. |

## Root documentation

- [README](../README.md) — overview, demo script, setup, limitations
- [ARCHITECTURE](../ARCHITECTURE.md) — design rationale (incl. the design system)
- [PROMPTS](../PROMPTS.md) — the engines & question bank

Through 25 (Discover landing, reskilling reel & posting likes) is committed (`394341e`). Commit 26
(candidate retention) is staged in the working tree, ready to commit. Phase 4 continues with the
recruiter-side experience (market, talent, standing) in commits 27+.
