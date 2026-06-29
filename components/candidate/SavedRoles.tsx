"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { LikeButton } from "@/components/candidate/LikeButton";
import { getJob } from "@/lib/jobs";
import { savedRolesCopy as C } from "@/lib/copy/candidate";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";

// A plain saved list of the postings you liked: honest info (pay, applied state),
// no "filling fast" urgency or FOMO nudges. A reason to return, not a pressure tactic.
export function SavedRoles({ onApply }: { onApply: (jobId: string) => void }) {
  const { likedJobs, applications } = useStore();
  const heading = useVariant(C.heading);
  const jobs = likedJobs.map(getJob).filter((j): j is NonNullable<typeof j> => Boolean(j));

  if (jobs.length === 0) return null;

  const isApplied = (id: string) => applications.some((a) => a.jobId === id && a.own);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {heading} ({jobs.length})
      </h2>
      <StaggerList className="space-y-2">
        {jobs.map((job) => (
          <FadeUp key={job.id}>
            <article className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted">
                  {job.company} · {job.location}
                  {job.remote ? " · Remote" : ""} · ${Math.round(job.salaryMin / 1000)}k-$
                  {Math.round(job.salaryMax / 1000)}k
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LikeButton job={job} size="sm" />
                <button
                  className={isApplied(job.id) ? "btn-ghost text-sm" : "btn-soft text-sm"}
                  disabled={isApplied(job.id)}
                  onClick={() => onApply(job.id)}
                >
                  {isApplied(job.id) ? `${C.applied} ✓` : C.apply}
                </button>
              </div>
            </article>
          </FadeUp>
        ))}
      </StaggerList>
    </section>
  );
}
