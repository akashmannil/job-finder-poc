import { EVIDENCE_LABEL, type EvidenceTier } from "@/types";

// Visual weight tracks the evidence rank — verified tiers read stronger than claims.
const STYLES: Record<EvidenceTier, { className: string; dot: string }> = {
  self_asserted: { className: "bg-surface2 text-muted border border-border", dot: "var(--muted)" },
  portfolio: { className: "bg-accent-soft text-accent", dot: "var(--accent)" },
  assessment_passed: { className: "bg-accent text-accent-contrast", dot: "var(--accent-contrast)" },
  reference_verified: {
    className: "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-success",
    dot: "var(--success)",
  },
};

export function EvidenceBadge({ tier }: { tier: EvidenceTier }) {
  const s = STYLES[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}
      title={`Evidence: ${EVIDENCE_LABEL[tier]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {EVIDENCE_LABEL[tier]}
    </span>
  );
}
