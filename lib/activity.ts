import { getJob } from "@/lib/jobs";
import type { Application } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// An honest "since you were last here" digest. It only reports things that
// actually changed (recruiter decisions on your applications) - never invented
// counts, urgency, or "people viewed you" bait. Empty when nothing happened.
// ─────────────────────────────────────────────────────────────────────────────

export interface DigestItem {
  id: string;
  text: string;
  tone: "positive" | "neutral" | "negative";
}

/** Updates to the candidate's own applications since their previous session. */
export function activityDigest(apps: Application[], since: number): DigestItem[] {
  if (since <= 0) return []; // first visit - nothing to recap
  const items: DigestItem[] = [];

  for (const a of apps) {
    if (!a.own) continue;
    if (!a.respondedAt || a.respondedAt <= since) continue;
    const title = getJob(a.jobId)?.title ?? a.jobId;

    if (a.status === "offer") {
      items.push({ id: a.id, text: `You have an offer to review on ${title}.`, tone: "positive" });
    } else if (a.status === "rejected") {
      items.push({ id: a.id, text: `A decision came back on ${title}.`, tone: "neutral" });
    } else if (a.status === "reviewing") {
      items.push({ id: a.id, text: `${title} is now under review.`, tone: "neutral" });
    }
  }

  return items;
}
