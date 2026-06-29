# 33 - Peer connections (request / accept)

> Commit: `feat: peer messaging via connection requests (candidate↔candidate, recruiter↔recruiter)`
> Nav: [← Prev](32-messaging-core.md) · [Index](DEVLOG.md) · [Next →](34-messaging-docs.md)

## What this adds

Peer-to-peer messaging - **candidate ↔ candidate** and **recruiter ↔ recruiter** - added to the
same Messages surface, but with its own consent gate so it can't become a cold-DM channel:

- **Connection requests with a stated reason.** Starting a peer conversation creates a *pending*
  request (the recipient sees who + why). Chat opens **only after they accept**. A reason of < 10
  characters is rejected - no one-tap blasts.
- **Incoming requests** appear at the top of Messages with **Accept / Decline**; **outgoing**
  requests show as "request sent, waiting".
- **A directory** of same-role peers to request (candidates ↔ the talent pool; recruiters ↔ other
  recruiters), excluding anyone you're already connected to.
- Accepted peer threads join the thread list (tagged **peer**) and chat exactly like application
  threads. Seeded with one active connection + one incoming request per role.

## Why (meaning of the change)

The user asked for messaging "among themselves" too. Peer networking is legitimate (referrals,
mentorship, comparing notes), but open peer DMs are the same spam/gaslighting pathology the platform
rejects. The request/accept-with-reason flow keeps it **symmetric with the application channel**:
both sides opt in before a word is exchanged. It also mirrors how the rest of the app treats
contact - interest is declared, then consented to.

## Files in this commit

- [`types/index.ts`](../types/index.ts) - `PeerThread`, `PeerParticipant`, `ConnectionStatus`.
- [`lib/peers.ts`](../lib/peers.ts) - **new.** Directory, request builder, incoming/outgoing/active
  selectors, `messagesBadge` (unread + requests-to-act-on).
- [`lib/messaging.ts`](../lib/messaging.ts) - `ThreadView` generalized with a `kind`
  (`application` | `peer`).
- [`store/store.tsx`](../store/store.tsx) - `peerThreads` slice + `requestConnection` /
  `respondToConnection` (accept → active, decline → removed), persisted.
- [`components/common/Messages.tsx`](../components/common/Messages.tsx) - incoming-request cards,
  a "New connection" composer (peer + reason), peer threads in the list, pending-sent section.
- [`lib/seedPeers.ts`](../lib/seedPeers.ts) + [`lib/seedMessages.ts`](../lib/seedMessages.ts) -
  **new/updated.** One active peer thread + one incoming request per role, with starter messages.
- [`app/page.tsx`](../app/page.tsx) - the Messages tab badge now uses `messagesBadge` (unread +
  incoming requests) for both roles.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. **Candidate → Messages** - an active **peer** thread with *Maya Rao* and an **incoming request**
   from *Diego Santos* (Accept → it becomes a thread; Decline → it disappears).
2. **New connection** → pick a peer, write a reason (≥ 10 chars), **Send request** → it shows under
   "Pending sent".
3. **Recruiter → Messages** - same, with fellow recruiters (*Sam Rivera* active, *Priya Nair*
   request).

## Decisions & notes

- **No cold DMs**: a peer thread cannot exist without a request + acceptance; the reason field is
  required. This is the peer analogue of mutual interest.
- In this single-user POC, **outgoing requests stay pending** (the seed peer can't accept as
  themselves) - honest rather than faking a reply. The seeded *incoming* requests demonstrate the
  accept flow.
- Peer and application threads share one conversation UI and one `messages` store slice, keyed by
  thread id.
