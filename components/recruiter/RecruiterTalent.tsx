"use client";

import { useMemo, useState } from "react";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { EvidenceBadge } from "@/components/common/EvidenceBadge";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { ACTIVE_RECRUITER_ID, getRecruiterJobs } from "@/lib/jobs";
import { talentDevelopment, talentForJob } from "@/lib/talent";
import { EVIDENCE_RANK } from "@/types";

// The recruiter's "possible matches": who in the sourcing pool fits a chosen
// posting, plus where required skills are scarce (the case for offering training).
// Contact stays double-opt-in — the recruiter signals interest; the candidate
// chooses to apply. Nothing is shared without consent.
export function RecruiterTalent() {
  const jobs = getRecruiterJobs(ACTIVE_RECRUITER_ID);
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [invited, setInvited] = useState<Set<string>>(new Set());

  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const matches = useMemo(() => (job ? talentForJob(job) : []), [job]);
  const development = useMemo(() => talentDevelopment(ACTIVE_RECRUITER_ID), []);

  if (!job) {
    return <p className="text-sm text-muted">No postings to source for yet.</p>;
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="h-display">Talent</h1>
          <p className="mt-1 text-muted">
            Candidates who fit your roles, ranked on verified evidence. Inviting signals interest —
            they still choose to apply.
          </p>
        </div>

        {/* Posting selector */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {jobs.map((j) => (
            <button
              key={j.id}
              onClick={() => setJobId(j.id)}
              className={`shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
                j.id === job.id ? "bg-accent-soft text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {j.title}
            </button>
          ))}
        </div>
      </section>

      {/* Ranked candidate matches */}
      <StaggerList className="space-y-3">
        {matches.map(({ candidate, match }) => {
          const skills = [...candidate.profile.skills].sort(
            (a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence],
          );
          const isInvited = invited.has(candidate.id);
          return (
            <FadeUp key={candidate.id}>
              <article className="card p-5">
                <div className="flex items-start gap-4">
                  <ScoreBadge score={match.fitScore} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{candidate.profile.name}</h3>
                    <p className="text-sm text-muted">
                      {candidate.profile.headline} · {candidate.profile.location}
                    </p>
                    <p className="mt-2 text-sm">{match.summary}</p>
                  </div>
                  <button
                    className={isInvited ? "btn-ghost text-sm" : "btn-primary text-sm"}
                    disabled={isInvited}
                    onClick={() =>
                      setInvited((prev) => new Set(prev).add(candidate.id))
                    }
                  >
                    {isInvited ? "Invited ✓" : "Invite to apply"}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1 text-sm"
                    >
                      {s.name}
                      <EvidenceBadge tier={s.evidence} />
                    </span>
                  ))}
                </div>

                {match.gaps.length > 0 && (
                  <p className="mt-3 text-xs text-muted">
                    Gaps:{" "}
                    {match.gaps.map((g) => g.skill).join(", ")}
                  </p>
                )}
                {isInvited && (
                  <p className="mt-2 text-xs text-accent">
                    They’ll see your interest and choose whether to apply — contact unlocks only if
                    they do.
                  </p>
                )}
              </article>
            </FadeUp>
          );
        })}
      </StaggerList>

      {/* Talent development */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Talent development
        </h2>
        <p className="text-sm text-muted">
          Where your required skills are scarce in the market — training you could sponsor to grow the
          candidates you need.
        </p>
        <StaggerList className="grid gap-3 sm:grid-cols-2">
          {development.map((d) => (
            <FadeUp key={d.skill}>
              <div className="card h-full space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{d.skill}</span>
                  <span
                    className={`chip ${d.supply <= 1 ? "!text-danger" : "!text-warning"}`}
                    title="Candidates in pool with this skill"
                  >
                    {d.supply} in pool
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Demand {d.demand} across your postings · supply {d.supply} candidates
                </p>
                <ul className="space-y-1.5">
                  {d.courses.slice(0, 2).map((c) => (
                    <li key={c.id} className="text-sm">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {c.title}
                      </a>
                      <span className="text-muted">
                        {" "}
                        · {c.provider} · {c.hours}h
                      </span>
                    </li>
                  ))}
                  {d.courses.length === 0 && (
                    <li className="text-sm text-muted">No course on file for this skill yet.</li>
                  )}
                </ul>
              </div>
            </FadeUp>
          ))}
        </StaggerList>
      </section>
    </div>
  );
}
