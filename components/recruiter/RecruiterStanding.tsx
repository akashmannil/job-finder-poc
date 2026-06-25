"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { ConductScore } from "@/components/common/ConductScore";
import { isTerminal, formatRelative } from "@/lib/applications";
import { recruiterConduct } from "@/lib/conductScore";
import { ACTIVE_RECRUITER_ID, getJob, getRecruiter, getRecruiterJobs } from "@/lib/jobs";
import { isOverdue, msLeft, slaLabel } from "@/lib/sla";
import { useStore } from "@/store/store";

// The recruiter's own "profile" — how they currently stand. Mirrors the candidate's
// display-first identity: company identity, the public conduct/response score with a
// factual breakdown, and the decisions they owe (anti-ghosting, not a vanity wall).
export function RecruiterStanding({ onReview }: { onReview: () => void }) {
  const { applications, now } = useStore();
  const t = now();
  const recruiter = getRecruiter(ACTIVE_RECRUITER_ID);
  const jobs = getRecruiterJobs(ACTIVE_RECRUITER_ID);
  const myApps = applications.filter((a) => a.recruiterId === ACTIVE_RECRUITER_ID);

  const conduct = recruiterConduct(myApps, t);
  const pending = myApps
    .filter((a) => !isTerminal(a.status))
    .sort((a, b) => msLeft(a, t) - msLeft(b, t));
  const overdueCount = pending.filter((a) => isOverdue(a, t)).length;

  return (
    <div className="space-y-8">
      {/* Identity + conduct */}
      <FadeUp>
        <header className="card p-8">
          <h1 className="h-display">{recruiter?.company ?? "Recruiter"}</h1>
          <p className="mt-2 text-lg text-muted">Hiring team · {recruiter?.name}</p>
          <div className="mt-4">
            <ConductScore
              score={conduct.score}
              label="Public response score"
              detail={
                conduct.score === null
                  ? "no decisions yet"
                  : `${conduct.timely} on time · ${conduct.late} late · ${conduct.ghosted} ghosted`
              }
            />
          </div>
          <p className="mt-4 text-xs text-muted">
            No followers, ratings, or vanity metrics — a recruiter&apos;s reputation here is how they
            treat applicants: decide, and decide on time.
          </p>
        </header>
      </FadeUp>

      {/* Snapshot */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={`${jobs.length}`} label="open postings" />
        <Stat value={`${myApps.length}`} label="applicants" />
        <Stat
          value={conduct.medianResponseHours === null ? "—" : `${Math.round(conduct.medianResponseHours)}h`}
          label="median response"
        />
        <Stat
          value={`${overdueCount}`}
          label="overdue"
          tone={overdueCount > 0 ? "negative" : "neutral"}
        />
      </section>

      {/* Decisions you owe */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Needs your decision
          </h2>
          {pending.length > 0 && (
            <button className="btn-soft text-sm" onClick={onReview}>
              Review in Postings
            </button>
          )}
        </div>

        {pending.length === 0 ? (
          <div className="card p-6 text-sm text-muted">
            You&apos;re all caught up — no applications are waiting on you. That&apos;s exactly how the
            response score stays high.
          </div>
        ) : (
          <StaggerList className="space-y-2">
            {pending.map((a) => {
              const overdue = isOverdue(a, t);
              return (
                <FadeUp key={a.id}>
                  <article className="card flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.candidateName}</p>
                      <p className="text-sm text-muted">
                        {getJob(a.jobId)?.title ?? a.jobId} · applied {formatRelative(a.createdAt, t)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        overdue
                          ? "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-danger"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      {slaLabel(a, t)}
                    </span>
                  </article>
                </FadeUp>
              );
            })}
          </StaggerList>
        )}
      </section>
    </div>
  );
}

function Stat({
  value,
  label,
  tone = "neutral",
}: {
  value: string;
  label: string;
  tone?: "negative" | "neutral";
}) {
  return (
    <div className="card p-4">
      <p className={`text-2xl font-semibold tracking-tight ${tone === "negative" ? "text-danger" : ""}`}>
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
