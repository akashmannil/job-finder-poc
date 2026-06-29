"use client";

import { useState } from "react";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { ConductScore } from "@/components/common/ConductScore";
import { PostingCard } from "@/components/recruiter/PostingCard";
import { ReviewReel } from "@/components/recruiter/ReviewReel";
import { recruiterConduct } from "@/lib/conductScore";
import { ACTIVE_RECRUITER_ID, getRecruiter, getRecruiterJobs } from "@/lib/jobs";
import { dashboardCopy as RD } from "@/lib/copy/recruiter";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";

export function RecruiterDashboard() {
  const { applications, now } = useStore();
  const [mode, setMode] = useState<"list" | "reel">("list");
  const dashboard = useVariant(RD.dashboard);
  const dashboardTail = useVariant(RD.dashboardTail);
  const applicantsH = useVariant(RD.applicants);
  const noApplicants = useVariant(RD.noApplicants);
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
            <h1 className="h-display">{recruiter?.company ?? "Recruiter"}</h1>
            <p className="mt-1 text-muted">
              {dashboard} · {recruiter?.name}. {dashboardTail}
            </p>
          </div>
          <ConductScore score={conduct.score} label={RD.responseScore} detail={detail} />
        </div>
      </FadeUp>

      {postings.length === 0 ? (
        <FadeUp>
          <div className="card p-6 text-sm text-muted">
            {noApplicants} <strong>{recruiter?.company}</strong>, {RD.noApplicantsTail}
          </div>
        </FadeUp>
      ) : (
        <>
          <FadeUp>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">{applicantsH}</h2>
              <div className="inline-flex rounded-[11px] bg-surface2 p-1">
                {(["list", "reel"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-[8px] px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                      mode === m ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
                    }`}
                  >
                    {m === "reel" ? RD.reviewReel : RD.list}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {mode === "reel" ? (
            <FadeUp>
              <ReviewReel recruiterId={ACTIVE_RECRUITER_ID} />
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
        </>
      )}
    </StaggerList>
  );
}
