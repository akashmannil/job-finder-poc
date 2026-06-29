# 35 - Peer search + network-visibility consent

> Commit: `feat: peer search bar + network-visibility consent`
> Nav: [← Prev](34-messaging-docs.md) · [Index](DEVLOG.md)

## What this adds

Two refinements to the peer **New connection** flow so discovery doesn't expose the whole network
and everyone controls their own findability:

- **Search instead of a dropdown.** Picking a peer was a `<select>` that listed *every* person (name
  + headline) at once. It's now a **search bar**: an empty query shows nothing, and typing returns
  matches by name/headline. You pick a result, then write your reason.
- **Network-visibility consent.** A **Discoverable / Hidden** toggle (in the Messages header) lets
  anyone opt out of network discovery. Hidden people don't appear in anyone's peer search. Two seed
  peers ship hidden, so search visibly respects the setting.

## Why (meaning of the change)

A dropdown of the entire directory is a quiet privacy leak - it broadcasts who's on the platform to
anyone who opens the composer. Search reveals a person only to someone who already knows roughly who
they're looking for. Pairing that with a **per-user visibility switch** puts discovery on a consent
footing end-to-end: you choose whether you can be found, and finders can't browse the whole network.
It's the same "consent over reach" stance the rest of messaging takes.

## Files in this commit

- [`store/store.tsx`](../store/store.tsx) - `networkVisibility` map + `setVisibility(userId,
  visible)` (persisted); seeds two peers (`tal-3`, `rec-4`) hidden.
- [`lib/peers.ts`](../lib/peers.ts) - `isVisible(id, visibility)` and `searchPeers(role, query,
  visibility, connected)` (empty query → no results; filters out hidden + already-connected).
- [`components/common/Messages.tsx`](../components/common/Messages.tsx) - a Discoverable/Hidden
  toggle in the header; the composer replaces the `<select>` with a search field, a results list, and
  a chosen-peer chip with **Change**.

## How to verify

`npx tsc --noEmit` and `npm run build` both pass.

1. **Messages → New connection** - there's no list of everyone; type a name to search, pick a result,
   add a reason, send.
2. Search for the hidden seed peer (candidate: *Priya Sharma*; recruiter: *Marco Bianchi* / Lumen
   Health) - they don't appear.
3. Toggle the header to **Hidden**; the label and state persist (your own discoverability consent).

## Decisions & notes

- Empty query returns **no** results by design - discovery requires intent, not browsing.
- In this single-user POC, your **own** Hidden toggle has no functional effect on *your* searches
  (no one else is searching for you here); it models the consent that matters in a multi-user
  deployment. Others' visibility *is* enforced in your search via the seed-hidden peers.
- Visibility is stored per participant id, so it generalizes to real accounts unchanged.
