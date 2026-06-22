"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { ConductScore } from "@/components/common/ConductScore";
import { PostingCard } from "@/components/recruiter/PostingCard";
import { recruiterConduct } from "@/lib/conductScore";
import { ACTIVE_RECRUITER_ID, getRecruiter, getRecruiterJobs } from "@/lib/jobs";
import { useStore } from "@/store/store";

export function RecruiterDashboard() {
  const { applications, now } = useStore();
  const recruiter = getRecruiter(ACTIVE_RECRUITER_ID);
  const jobs = getRecruiterJobs(ACTIVE_RECRUITER_ID);
  const myApps = applications.filter((a) => a.recruiterId === ACTIVE_RECRUITER_ID);

  const conduct = recruiterConduct(myApps, now());
  const detail =
    conduct.score === null
      ? undefined
      : `${conduct.ghosted} ghosted · ${
          conduct.medianResponseHours !== null
            ? `${Math.round(conduct.medianResponseHours)}h median`
            : "no responses yet"
        }`;

  // Only show postings that have applicants, most applicants first.
  const postings = jobs
    .map((job) => ({ job, apps: myApps.filter((a) => a.jobId === job.id) }))
    .filter((p) => p.apps.length > 0)
    .sort((a, b) => b.apps.length - a.apps.length);

  return (
    <StaggerList className="space-y-6">
      <FadeUp>
        <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {recruiter?.company ?? "Recruiter"} — hiring dashboard
            </h1>
            <p className="text-sm text-muted">
              {recruiter?.name}. Answer on the clock — your response score is public.
            </p>
          </div>
          <ConductScore score={conduct.score} label="Your response score" detail={detail} />
        </div>
      </FadeUp>

      {postings.length === 0 ? (
        <FadeUp>
          <div className="card p-6 text-sm text-muted">
            No applicants yet. Switch to the Candidate role, apply to a role at{" "}
            <strong>{recruiter?.company}</strong>, then come back.
          </div>
        </FadeUp>
      ) : (
        <StaggerList className="space-y-3">
          {postings.map(({ job, apps }) => (
            <FadeUp key={job.id}>
              <PostingCard job={job} applications={apps} />
            </FadeUp>
          ))}
        </StaggerList>
      )}
    </StaggerList>
  );
}
