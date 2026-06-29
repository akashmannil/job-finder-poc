import type { ApplicationStatus } from "@/types";

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  received: { label: "Received", className: "bg-surface2 text-muted" },
  reviewing: { label: "Reviewing", className: "bg-accent-soft text-accent" },
  offer: {
    label: "Moving forward",
    className: "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-success",
  },
  rejected: {
    label: "Not moving forward",
    className: "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-danger",
  },
  auto_closed: {
    label: "Auto-closed (SLA lapsed)",
    className: "bg-[color-mix(in_srgb,var(--warning)_15%,transparent)] text-warning",
  },
};

/** Terminal statuses - a decision has been reached (or forced). */
export const TERMINAL: ApplicationStatus[] = ["offer", "rejected", "auto_closed"];

export function isTerminal(status: ApplicationStatus): boolean {
  return TERMINAL.includes(status);
}

/** Human-friendly relative time, e.g. "3d ago". `now` is injectable for the sim clock. */
export function formatRelative(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
