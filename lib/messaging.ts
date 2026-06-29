import { ACTIVE_RECRUITER_ID, getJob, getRecruiter } from "@/lib/jobs";
import type { Application, Message, Role } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Messaging is consent-gated by construction. Candidate ↔ recruiter threads exist
// ONLY for applications where both sides opted in (mutual interest) — there is no
// cold-outreach path. Threads are derived from that state; only the messages (and
// per-viewer read marks) are stored.
// ─────────────────────────────────────────────────────────────────────────────

/** The candidate user's stable participant id. */
export const ME = "me";

/** Who the current viewer is, as a participant id. */
export function currentUserId(role: Role): string {
  return role === "recruiter" ? ACTIVE_RECRUITER_ID : ME;
}

export interface ThreadView {
  id: string;
  kind: "application" | "peer";
  /** The other party's display name, from the current viewer's perspective. */
  otherName: string;
  /** A short context line (the role this conversation is about). */
  context: string;
  applicationId?: string;
}

/** Threads available to the current viewer — application threads with mutual interest. */
export function applicationThreads(apps: Application[], role: Role): ThreadView[] {
  return apps
    .filter((a) => a.candidateInterested && a.recruiterInterested)
    .filter((a) => (role === "recruiter" ? a.recruiterId === ACTIVE_RECRUITER_ID : a.own))
    .map((a) => {
      const job = getJob(a.jobId);
      const company = getRecruiter(a.recruiterId)?.company ?? "Recruiter";
      const otherName = role === "recruiter" ? a.candidateName : company;
      const context =
        role === "recruiter"
          ? `${job?.title ?? a.jobId} · applicant`
          : `${job?.title ?? a.jobId} · ${company}`;
      return { id: `app:${a.id}`, kind: "application" as const, otherName, context, applicationId: a.id };
    });
}

/** Messages for a thread, oldest first. */
export function threadMessages(messages: Message[], threadId: string): Message[] {
  return messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

/** Key for a viewer's read mark on a thread. */
export function readKey(userId: string, threadId: string): string {
  return `${userId}:${threadId}`;
}

/** Unread = messages from the other party newer than this viewer's last read. */
export function unreadCount(
  messages: Message[],
  threadId: string,
  userId: string,
  threadReads: Record<string, number>,
): number {
  const lastRead = threadReads[readKey(userId, threadId)] ?? 0;
  return messages.filter(
    (m) => m.threadId === threadId && m.senderId !== userId && m.createdAt > lastRead,
  ).length;
}

/** Total unread across the viewer's threads — for the Messages tab badge. */
export function totalUnread(
  threadIds: string[],
  messages: Message[],
  userId: string,
  threadReads: Record<string, number>,
): number {
  return threadIds.reduce(
    (sum, id) => sum + unreadCount(messages, id, userId, threadReads),
    0,
  );
}
