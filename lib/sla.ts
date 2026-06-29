import { isTerminal } from "@/lib/applications";
import type { Application } from "@/types";

export const DAY = 86_400_000;
/** Recruiters commit to a decision within this window. */
export const SLA_DAYS = 5;
export const SLA_MS = SLA_DAYS * DAY;

export function deadlineOf(app: Application): number {
  return app.createdAt + SLA_MS;
}

/** Past deadline and still awaiting a decision. */
export function isOverdue(app: Application, now: number): boolean {
  return !isTerminal(app.status) && now > deadlineOf(app);
}

export function msLeft(app: Application, now: number): number {
  return deadlineOf(app) - now;
}

/** A short SLA label for the UI given the current (possibly simulated) time. */
export function slaLabel(app: Application, now: number): string {
  if (isTerminal(app.status)) return "Resolved";
  const left = msLeft(app, now);
  if (left <= 0) return "SLA lapsed";
  const hrs = Math.ceil(left / 3_600_000);
  if (hrs < 24) return `${hrs}h to respond`;
  return `${Math.ceil(hrs / 24)}d to respond`;
}

/**
 * Auto-resolve any application whose SLA has lapsed without a decision - the ghost
 * path, made explicit. Returns a new array (pure); penalizes the recruiter's conduct.
 */
export function autoResolveLapsed(apps: Application[], now: number): Application[] {
  return apps.map((a) =>
    isOverdue(a, now) ? { ...a, status: "auto_closed" as const } : a,
  );
}
