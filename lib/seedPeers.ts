import type { PeerThread } from "@/types";

// Seed peer connections so both roles have something to act on: one active thread
// (chat already open) and one incoming request (accept/decline). Outgoing requests
// the user sends during the demo stay pending — honest, since the seed peers can't
// reply in a single-user POC.

const DAY = 86_400_000;
const now = Date.now();

const ME = { id: "me", name: "You", role: "candidate" as const };
const REC1 = { id: "rec-1", name: "Dana Okafor", role: "recruiter" as const, subtitle: "Northwind Labs" };

export const SEED_PEER_THREADS: PeerThread[] = [
  // Candidate ↔ candidate — active connection.
  {
    id: "peer:maya",
    participants: [
      ME,
      { id: "tal-1", name: "Maya Rao", role: "candidate", subtitle: "Senior frontend engineer" },
    ],
    requestedById: "tal-1",
    reason: "Loved your portfolio — would value swapping feedback on design-system work.",
    status: "active",
    createdAt: now - 3 * DAY,
  },
  // Candidate ↔ candidate — incoming request to accept/decline.
  {
    id: "peer:req-diego",
    participants: [
      ME,
      {
        id: "tal-2",
        name: "Diego Santos",
        role: "candidate",
        subtitle: "Backend engineer, distributed systems",
      },
    ],
    requestedById: "tal-2",
    reason: "Saw you're reskilling into platform work — would love to compare notes.",
    status: "pending",
    createdAt: now - 6 * 3_600_000,
  },
  // Recruiter ↔ recruiter — active connection.
  {
    id: "peer:rec2",
    participants: [
      REC1,
      { id: "rec-2", name: "Sam Rivera", role: "recruiter", subtitle: "Brightwave" },
    ],
    requestedById: "rec-2",
    reason: "Comparing notes on the senior frontend market this quarter.",
    status: "active",
    createdAt: now - 2 * DAY,
  },
  // Recruiter ↔ recruiter — incoming request to accept/decline.
  {
    id: "peer:req-rec3",
    participants: [
      REC1,
      { id: "rec-3", name: "Priya Nair", role: "recruiter", subtitle: "Cobalt Systems" },
    ],
    requestedById: "rec-3",
    reason: "Open to comparing engineering comp bands? Happy to share ours.",
    status: "pending",
    createdAt: now - 5 * 3_600_000,
  },
];
