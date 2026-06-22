"use client";

import { useState } from "react";
import { EvidenceBadge } from "@/components/common/EvidenceBadge";
import { SkillAssessment } from "@/components/candidate/SkillAssessment";
import { useStore } from "@/store/store";
import { EVIDENCE_RANK, type EvidenceTier } from "@/types";

const VERIFIED: EvidenceTier[] = ["assessment_passed", "reference_verified"];

export function SkillPassport() {
  const { profile, updateProfile } = useStore();
  const [active, setActive] = useState<string | null>(null);

  const verified = profile.skills.filter((s) => VERIFIED.includes(s.evidence));
  const provable = profile.skills.filter((s) => !VERIFIED.includes(s.evidence));

  function markPassed(skill: string) {
    updateProfile({
      skills: profile.skills.map((s) =>
        s.name === skill && EVIDENCE_RANK[s.evidence] < EVIDENCE_RANK.assessment_passed
          ? { ...s, evidence: "assessment_passed" }
          : s,
      ),
    });
  }

  if (profile.skills.length === 0) return null;

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="font-semibold">Skill passport</h2>
        <p className="text-sm text-muted">
          Verified once, shareable everywhere. Prove a skill to upgrade its evidence.
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Verified</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {verified.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-2.5 py-1 text-sm">
              {s.name}
              <EvidenceBadge tier={s.evidence} />
            </span>
          ))}
          {verified.length === 0 && (
            <p className="text-sm text-muted">Nothing verified yet — prove a skill below.</p>
          )}
        </div>
      </div>

      {provable.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Prove a skill</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {provable.map((s) => (
              <button key={s.name} className="btn-soft text-sm" onClick={() => setActive(s.name)}>
                Assess {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {active && (
        <SkillAssessment
          skill={active}
          onClose={() => setActive(null)}
          onPassed={markPassed}
        />
      )}
    </section>
  );
}
