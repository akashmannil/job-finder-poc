# 39 - Remove em-dash / AI-style text repo-wide

> Commit: `style: replace em/en dashes with hyphens across source and docs`
> Nav: [Prev](38-copy-recruiter-messaging.md) · [Index](DEVLOG.md)

## What this adds

A mechanical sweep that removes the "AI tell" long dashes everywhere they remained: em dashes (-),
en dashes, the figure dash, and the Unicode minus sign are all replaced with a plain hyphen across
every tracked `.ts`, `.tsx`, and `.md` file. Combined with commits 36-38 (which already dropped
dashes from migrated UI copy), the repo is now free of em/en dashes in code, comments, and docs.

## Why (meaning of the change)

The user asked to drop the em-dash heavy, AI-sounding phrasing throughout. Commits 36-38 handled the
visible UI strings as they moved into the copy module; this commit finishes the job everywhere else:
source-file comments, seed data strings, and the entire `docs/` build trail plus the root docs
(README, ARCHITECTURE, PROMPTS, PROMPT).

## Files in this commit

- Every tracked `.ts` / `.tsx` (comments + any residual strings) and every `.md` file. Data JSON had
  no such dashes and was left untouched.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass (the change is text-only). A repo search confirms
it (hex escapes so this doc itself stays dash-free):

```bash
git ls-files '*.ts' '*.tsx' '*.md' | xargs perl -ne 'print $ARGV if /[\x{2014}\x{2013}\x{2212}]/'
# no output
```

## Decisions & notes

- Purely a character swap, so it is a `style:` commit; no logic or behavior changed.
- Ranges and deltas now read with a hyphen (e.g. `$150k-$185k`, `+$5k vs market`).
- This closes Phase 6: editable copy (36-38) plus the dash cleanup (39).
