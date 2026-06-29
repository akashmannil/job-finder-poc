"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { EvidenceBadge } from "@/components/common/EvidenceBadge";
import { ConductScore } from "@/components/common/ConductScore";
import { RELATIONSHIP_WEIGHT } from "@/lib/endorsements";
import { identityCopy as I } from "@/lib/copy/shared";
import { useVariant } from "@/lib/copy/useVariant";
import { EVIDENCE_RANK, type Endorsement, type Profile } from "@/types";

/**
 * The proof-over-reach public profile. Reused for the candidate's own preview and
 * the recruiter's consented view. There are deliberately NO vanity metrics here -
 * no views, followers, likes, or connection counts.
 */
export function IdentityPage({
  profile,
  endorsements,
  conduct,
}: {
  profile: Profile;
  endorsements: Endorsement[];
  /** Optional candidate conduct score (0-100 or null) - shown when provided. */
  conduct?: number | null;
}) {
  const skills = [...profile.skills].sort(
    (a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence],
  );
  const reskilling = profile.skills.filter((s) => s.currentlyReskilling);
  const proofNote = useVariant(I.proofNote);
  const skillsSub = useVariant(I.skillsSub);

  return (
    <StaggerList className="space-y-6">
      <FadeUp>
        <header className="card p-8">
          <h1 className="h-display">{profile.name || I.unnamed}</h1>
          {profile.headline && <p className="mt-2 text-lg text-muted">{profile.headline}</p>}
          <p className="mt-2 text-sm text-muted">
            {profile.location || "Location not set"} · prefers {profile.remotePref}
          </p>
          {reskilling.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted">{I.reskillingLabel}</span>
              {reskilling.map((s) => (
                <span key={s.name} className="chip !text-accent">
                  {s.name}
                </span>
              ))}
            </div>
          )}
          {conduct !== undefined && (
            <div className="mt-4">
              <ConductScore score={conduct} label={I.conductLabel} detail={I.conductDetail} />
            </div>
          )}
          <p className="mt-4 text-xs text-muted">{proofNote}</p>
        </header>
      </FadeUp>

      <FadeUp>
        <section className="card p-6">
          <h2 className="font-semibold">{I.skills}</h2>
          <p className="text-sm text-muted">{skillsSub}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1 text-sm"
              >
                {s.name}
                <EvidenceBadge tier={s.evidence} />
              </span>
            ))}
            {skills.length === 0 && <p className="text-sm text-muted">{I.noSkills}</p>}
          </div>
        </section>
      </FadeUp>

      {endorsements.length > 0 && (
        <FadeUp>
          <section className="card p-6">
            <h2 className="font-semibold">{I.endorsements}</h2>
            <ul className="mt-3 space-y-3">
              {endorsements.map((e) => (
                <li key={e.id} className="border-l-2 border-accent pl-3">
                  <p className="text-sm">“{e.evidence}”</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {e.endorserName} · {RELATIONSHIP_WEIGHT[e.relationship].label} · on{" "}
                    <span className="font-medium">{e.skill}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>
      )}

      {profile.experience.length > 0 && (
        <FadeUp>
          <section className="card p-6">
            <h2 className="font-semibold">{I.experience}</h2>
            <ul className="mt-3 space-y-3">
              {profile.experience.map((x, i) => (
                <li key={i}>
                  <p className="text-sm font-medium">
                    {x.title} · {x.company}{" "}
                    <span className="text-muted">({x.years}y)</span>
                  </p>
                  {x.summary && <p className="text-sm text-muted">{x.summary}</p>}
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>
      )}

      {profile.projects.length > 0 && (
        <FadeUp>
          <section className="card p-6">
            <h2 className="font-semibold">{I.projects}</h2>
            <ul className="mt-3 space-y-3">
              {profile.projects.map((p, i) => (
                <li key={i}>
                  <p className="text-sm font-medium">
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </p>
                  {p.description && <p className="text-sm text-muted">{p.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        </FadeUp>
      )}
    </StaggerList>
  );
}
