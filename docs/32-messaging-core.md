# 32 — Messaging core (candidate ↔ recruiter, consent-gated)

> Commit: `feat: consent-gated messaging — candidate ↔ recruiter threads`
> Nav: [← Prev](31-fix-role-switch-blank.md) · [Index](DEVLOG.md) · [Next →](33-peer-connections.md)

## What this adds

In-app messaging — but **consent-gated by construction**, never an open inbox. A candidate ↔
recruiter thread exists **only** for an application where both sides opted in (mutual interest:
`candidateInterested && recruiterInterested`). There is no cold-outreach path.

- A shared **Messages** surface (thread list + conversation) used by *both* roles — the viewer's
  identity (and which bubbles are "mine") comes from the current role.
- A **Messages tab** on both the candidate and recruiter workspaces, each with an honest **unread
  badge** (a plain count — no "someone viewed you" pressure).
- Send/receive with read state per viewer; seed conversations so both sides are populated on first
  load.

## Why (meaning of the change)

Messaging is exactly where a "proof over reach" product can betray itself — open DMs are the
recruiter/sales-spam pathology the [anti-gaslighting principles] rule out. So messaging is wired to
the existing **mutual-interest gate** rather than a contact list: the thread *is* the payoff of a
connection both parties chose. This keeps the channel valuable (every message is wanted) and
spam-free (you can't message someone who hasn't opted in).

## Files in this commit

- [`types/index.ts`](../types/index.ts) — `Message` (with a stable `senderId` so messages attribute
  correctly even in same-role peer threads later).
- [`lib/messaging.ts`](../lib/messaging.ts) — **new.** `currentUserId(role)`, `applicationThreads`
  (derives threads from mutual-interest applications), `threadMessages`, `unreadCount`,
  `totalUnread`.
- [`store/store.tsx`](../store/store.tsx) — `messages` + `threadReads` slices and `sendMessage` /
  `markThreadRead` actions (persisted).
- [`components/common/Messages.tsx`](../components/common/Messages.tsx) — **new.** The shared
  master-detail messaging UI (thread list, conversation, composer, unread badges, empty state).
- [`lib/seedMessages.ts`](../lib/seedMessages.ts) — **new.** Seed conversations on two
  mutual-interest applications.
- [`lib/seedApplications.ts`](../lib/seedApplications.ts) — adds one **own** mutual-interest
  application so the candidate's Messages tab is populated on first load.
- [`app/page.tsx`](../app/page.tsx) — a **Messages** tab (with unread badge) on both workspaces.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. **Candidate → Messages** — a thread with **Northwind Labs** shows an unread message; open it, the
   badge clears, reply, and the bubble appears on the right.
2. **Recruiter → Messages** — a thread with **Jordan Patel** (a mutual-interest applicant) with two
   messages; reply works the same.
3. Threads only appear for mutual interest: a fresh application (candidate interested, recruiter not
   yet) shows **no** thread until the recruiter expresses interest in Postings.

## Decisions & notes

- **Threads are derived, not stored** — they fall out of application state, so they can never exist
  without consent. Only messages and read marks are persisted.
- **Read state is per viewer** (`${userId}:${threadId}`), and sending catches the sender up; the
  badge is a plain unread count, deliberately not an attention metric.
- Peer-to-peer messaging (request/accept) is added next in [doc 33](33-peer-connections.md).
