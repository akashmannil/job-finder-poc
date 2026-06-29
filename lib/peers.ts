import { ACTIVE_RECRUITER_ID, RECRUITERS } from "@/lib/jobs";
import {
  applicationThreads,
  currentUserId,
  ME,
  totalUnread,
} from "@/lib/messaging";
import { TALENT_POOL } from "@/lib/talent";
import type { ThreadView } from "@/lib/messaging";
import type {
  Application,
  Message,
  PeerParticipant,
  PeerThread,
  Profile,
  Role,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Peer-to-peer messaging (candidate↔candidate, recruiter↔recruiter). There is no
// cold DM: a thread starts as a request with a stated reason, and chat opens only
// after the recipient accepts. Same consent spirit as the application channel.
// ─────────────────────────────────────────────────────────────────────────────

/** The current viewer as a peer participant. */
export function selfParticipant(role: Role, profile: Profile): PeerParticipant {
  if (role === "recruiter") {
    const r = RECRUITERS.find((x) => x.id === ACTIVE_RECRUITER_ID);
    return { id: ACTIVE_RECRUITER_ID, name: r?.name ?? "You", role: "recruiter", subtitle: r?.company };
  }
  return {
    id: ME,
    name: profile.name || "You",
    role: "candidate",
    subtitle: profile.headline || undefined,
  };
}

/** People the current viewer could connect with (same role, excludes self). */
export function peerDirectory(role: Role): PeerParticipant[] {
  if (role === "recruiter") {
    return RECRUITERS.filter((r) => r.id !== ACTIVE_RECRUITER_ID).map((r) => ({
      id: r.id,
      name: r.name,
      role: "recruiter" as const,
      subtitle: r.company,
    }));
  }
  return TALENT_POOL.map((c) => ({
    id: c.id,
    name: c.profile.name,
    role: "candidate" as const,
    subtitle: c.profile.headline,
  }));
}

const isParticipant = (t: PeerThread, userId: string) =>
  t.participants.some((p) => p.id === userId);
const otherParticipant = (t: PeerThread, userId: string) =>
  t.participants.find((p) => p.id !== userId);

/** Active peer threads the viewer is in, as unified thread views. */
export function activePeerThreadViews(peerThreads: PeerThread[], role: Role): ThreadView[] {
  const me = currentUserId(role);
  return peerThreads
    .filter((t) => t.status === "active" && isParticipant(t, me))
    .map((t) => {
      const o = otherParticipant(t, me);
      return {
        id: t.id,
        kind: "peer" as const,
        otherName: o?.name ?? "Peer",
        context: o?.subtitle ? `${o.subtitle} · connection` : "connection",
      };
    });
}

/** Pending requests addressed TO the viewer (awaiting their accept/decline). */
export function incomingRequests(peerThreads: PeerThread[], role: Role): PeerThread[] {
  const me = currentUserId(role);
  return peerThreads.filter(
    (t) => t.status === "pending" && isParticipant(t, me) && t.requestedById !== me,
  );
}

/** Pending requests the viewer SENT (waiting on the other side). */
export function outgoingRequests(peerThreads: PeerThread[], role: Role): PeerThread[] {
  const me = currentUserId(role);
  return peerThreads.filter((t) => t.status === "pending" && t.requestedById === me);
}

/** The other party of a peer thread, from the viewer's perspective. */
export function otherOf(t: PeerThread, role: Role): PeerParticipant | undefined {
  return otherParticipant(t, currentUserId(role));
}

/** Peer ids the viewer is already connected to or has a pending thread with. */
export function connectedPeerIds(peerThreads: PeerThread[], role: Role): Set<string> {
  const me = currentUserId(role);
  const ids = new Set<string>();
  for (const t of peerThreads) {
    if (!isParticipant(t, me)) continue;
    const o = otherParticipant(t, me);
    if (o) ids.add(o.id);
  }
  return ids;
}

/** Build a new pending connection request from the viewer to a target. */
export function buildPeerRequest(
  self: PeerParticipant,
  target: PeerParticipant,
  reason: string,
): PeerThread {
  return {
    id: `peer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    participants: [self, target],
    requestedById: self.id,
    reason,
    status: "pending",
    createdAt: Date.now(),
  };
}

/** Messages-tab badge: unread (application + peer) plus incoming requests to act on. */
export function messagesBadge(
  role: Role,
  applications: Application[],
  peerThreads: PeerThread[],
  messages: Message[],
  threadReads: Record<string, number>,
): number {
  const me = currentUserId(role);
  const ids = [
    ...applicationThreads(applications, role).map((t) => t.id),
    ...activePeerThreadViews(peerThreads, role).map((t) => t.id),
  ];
  return totalUnread(ids, messages, me, threadReads) + incomingRequests(peerThreads, role).length;
}
