import { deadlineOf, isOverdue } from "@/lib/sla";
import type { Application } from "@/types";

export interface ConductResult {
  /** 0–100, or null when there isn't enough activity to judge. */
  score: number | null;
  total: number;
  timely: number;
  late: number;
  ghosted: number;
  medianResponseHours: number | null;
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Recruiter conduct: did they decide on applications, and on time?
 * - responded within SLA → full credit; responded late → half credit; auto-closed/overdue → zero.
 * - applications still within their SLA window are not yet judged (excluded).
 */
export function recruiterConduct(apps: Application[], now: number): ConductResult {
  let timely = 0;
  let late = 0;
  let ghosted = 0;
  const responseHours: number[] = [];

  for (const a of apps) {
    if (a.status === "auto_closed") {
      ghosted++;
      continue;
    }
    if (a.respondedAt) {
      responseHours.push((a.respondedAt - a.createdAt) / 3_600_000);
      if (a.respondedAt <= deadlineOf(a)) timely++;
      else late++;
      continue;
    }
    if (isOverdue(a, now)) ghosted++; // overdue but not yet swept
    // else: pending within SLA → not judged
  }

  const scored = timely + late + ghosted;
  const score = scored === 0 ? null : Math.round((100 * (timely + 0.5 * late)) / scored);
  return { score, total: apps.length, timely, late, ghosted, medianResponseHours: median(responseHours) };
}

/**
 * Candidate conduct: when a recruiter expresses interest, does the candidate engage?
 * Measured as mutual-interest rate over the applications where the recruiter opted in.
 */
export function candidateConduct(apps: Application[]): ConductResult {
  const courted = apps.filter((a) => a.recruiterInterested);
  const mutual = courted.filter((a) => a.candidateInterested).length;
  const score = courted.length === 0 ? null : Math.round((100 * mutual) / courted.length);
  return {
    score,
    total: apps.length,
    timely: mutual,
    late: 0,
    ghosted: courted.length - mutual,
    medianResponseHours: null,
  };
}
