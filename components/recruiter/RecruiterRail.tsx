"use client";

import { isTerminal } from "@/lib/applications";
import { recruiterConduct } from "@/lib/conductScore";
import { ACTIVE_RECRUITER_ID, getRecruiter, getRecruiterJobs } from "@/lib/jobs";
import { topSkillsInDemand } from "@/lib/likes";
import { isOverdue } from "@/lib/sla";
import { railCopy as R } from "@/lib/copy/sidebar";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { RecruiterView } from "@/app/page";

// The recruiter's right-hand context rail (xl+), mirror of the candidate's. Three
// glanceable cards that jump into the relevant tab: how you stand, what you owe a
// decision on (the anti-ghosting nudge), and what the market wants. Reputation here
// is behavior (the response score), never reach.
export function RecruiterRail({ onNavigate }: { onNavigate: (v: RecruiterView) => void }) {
  const { applications, now } = useStore();
  const standingHeading = useVariant(R.standingHeading);
  const owedHeading = useVariant(R.owedHeading);
  const pulseHeading = useVariant(R.pulseHeading);

  const t = now();
  const recruiter = getRecruiter(ACTIVE_RECRUITER_ID);
  const jobs = getRecruiterJobs(ACTIVE_RECRUITER_ID);
  const myApps = applications.filter((a) => a.recruiterId === ACTIVE_RECRUITER_ID);
  const conduct = recruiterConduct(myApps, t);
  const pending = myApps.filter((a) => !isTerminal(a.status) && !a.respondedAt);
  const overdue = pending.filter((a) => isOverdue(a, t)).length;
  const hotSkills = topSkillsInDemand(6);

  return (
    <>
      {/* Standing */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {standingHeading}
        </h3>
        <p className="mt-2 truncate text-sm font-semibold">{recruiter?.company ?? "Your team"}</p>
        <p className="mt-1 text-xs text-muted">
          {R.responseLabel}{" "}
          <span className="font-semibold text-fg">
            {conduct.score === null ? "-" : `${conduct.score}/100`}
          </span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {jobs.length} {R.postingsLabel}
        </p>
        <button className="btn-soft mt-3 w-full text-sm" onClick={() => onNavigate("standing")}>
          {R.viewStanding}
        </button>
      </section>

      {/* Decisions owed */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{owedHeading}</h3>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{pending.length}</p>
        {overdue > 0 && (
          <p className="mt-1 text-xs font-medium text-danger">
            {overdue} {R.overdueLabel}
          </p>
        )}
        <button className="btn-soft mt-3 w-full text-sm" onClick={() => onNavigate("postings")}>
          {R.review}
        </button>
      </section>

      {/* Market pulse */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{pulseHeading}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotSkills.map((s) => (
            <button
              key={s.skill}
              onClick={() => onNavigate("talent")}
              className="chip transition-colors hover:!border-accent hover:!text-accent"
            >
              {s.skill}
            </button>
          ))}
        </div>
        <button
          className="mt-3 text-xs font-medium text-accent hover:underline"
          onClick={() => onNavigate("market")}
        >
          {R.openMarket} →
        </button>
      </section>
    </>
  );
}
