"use client";

import { EVIDENCE_RANK } from "@/types";
import { reskillProgressCopy as C } from "@/lib/copy/candidate";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";

// A private, factual snapshot of growth: skills in progress and verified evidence
// earned. No streaks, no guilt, no public count: progress you can see, not perform.
export function ReskillProgress() {
  const { profile } = useStore();
  const heading = useVariant(C.heading);
  const inProgressLabel = useVariant(C.inProgress);
  const inProgress = profile.skills.filter((s) => s.currentlyReskilling);
  const verified = profile.skills.filter(
    (s) => EVIDENCE_RANK[s.evidence] >= EVIDENCE_RANK.assessment_passed,
  );

  if (profile.skills.length === 0) return null;

  return (
    <section className="card p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{heading}</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat value={profile.skills.length} label={C.skillsLabel} />
        <Stat value={verified.length} label={C.verifiedLabel} />
        <Stat value={inProgress.length} label={C.growingLabel} />
      </div>
      {inProgress.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">{inProgressLabel}</span>
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
