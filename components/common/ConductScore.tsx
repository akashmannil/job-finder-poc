"use client";

import { motion } from "framer-motion";

function tone(score: number): string {
  if (score >= 85) return "var(--success)";
  if (score >= 65) return "var(--accent)";
  if (score >= 40) return "var(--warning)";
  return "var(--danger)";
}

/**
 * Reputation as behavior, not reach. This is the only "score" on a profile - there
 * are no vanity metrics anywhere else.
 */
export function ConductScore({
  score,
  label = "Conduct",
  detail,
}: {
  score: number | null;
  label?: string;
  detail?: string;
}) {
  if (score === null) {
    return (
      <div className="inline-flex flex-col rounded-xl border border-border bg-surface2 px-3 py-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-sm text-muted">No activity yet</span>
      </div>
    );
  }
  const color = tone(score);
  return (
    <div className="inline-flex flex-col rounded-xl border border-border bg-surface2 px-3 py-2">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="flex items-baseline gap-1">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted">/100</span>
      </div>
      {detail && <span className="text-xs text-muted">{detail}</span>}
    </div>
  );
}
