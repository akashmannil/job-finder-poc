"use client";

import { EVIDENCE_RANK } from "@/types";
import { useStore } from "@/store/store";

// A private, factual snapshot of growth — skills in progress and verified evidence
// earned. No streaks, no guilt, no public count: progress you can see, not perform.
export function ReskillProgress() {
  const { profile } = useStore();
  const inProgress = profile.skills.filter((s) => s.currentlyReskilling);
  const verified = profile.skills.filter(
    (s) => EVIDENCE_RANK[s.evidence] >= EVIDENCE_RANK.assessment_passed,
  );

  if (profile.skills.length === 0) return null;

  return (
    <section className="card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Your progress</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat value={profile.skills.length} label="skills on profile" />
        <Stat value={verified.length} label="verified by evidence" />
        <Stat value={inProgress.length} label="currently growing" />
      </div>
      {inProgress.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">In progress:</span>
          {inProgress.map((s) => (
            <span key={s.name} className="chip !text-accent">
              {s.name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-surface2 p-3">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
