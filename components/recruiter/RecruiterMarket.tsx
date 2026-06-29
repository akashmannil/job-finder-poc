"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { ACTIVE_RECRUITER_ID, getRecruiter } from "@/lib/jobs";
import { baseLikes, marketStats, trendingJobs } from "@/lib/likes";
import { competitorJobs, recruiterStanding } from "@/lib/recruiterMarket";
import { marketCopy as RM } from "@/lib/copy/recruiter";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { Job } from "@/types";

// The recruiter's market lens — the mirror of the candidate's Discover. It shows
// where the recruiter's postings stand, what's popular, and what competitors are
// offering, so they can benchmark. Likes are read-only here: recruiters observe
// demand, candidates express it.
export function RecruiterMarket() {
  const { likedJobs } = useStore();
  const title = useVariant(RM.title);
  const subtitleTail = useVariant(RM.subtitleTail);
  const standingH = useVariant(RM.standing);
  const drawnToH = useVariant(RM.drawnTo);
  const competitionH = useVariant(RM.competition);
  const rankNote = useVariant(RM.rankNote);
  const rankNoteTail = useVariant(RM.rankNoteTail);
  const recruiter = getRecruiter(ACTIVE_RECRUITER_ID);
  const stats = marketStats();
  const standing = recruiterStanding(ACTIVE_RECRUITER_ID, likedJobs);
  const popular = trendingJobs(likedJobs, 6);
  const competition = competitorJobs(ACTIVE_RECRUITER_ID, likedJobs).slice(0, 8);

  const payDelta = standing.avgPayMax - standing.marketAvgPayMax;
  const likeDelta = standing.avgLikes - standing.marketAvgLikes;

  return (
    <div className="space-y-10">
      {/* Market highlight */}
      <section className="space-y-4">
        <div>
          <h1 className="h-display">{title}</h1>
          <p className="mt-1 text-muted">
            {RM.subtitlePrefix} {recruiter?.company}&apos;s {subtitleTail}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Your standing */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{standingH}</h2>
        <FadeUp>
          <div className="card space-y-4 p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat
                value={`${standing.postings}`}
                label={RM.openPostings}
                sub={RM.ofMarket(standing.totalMarket)}
              />
              <Stat
                value={`$${Math.round(standing.avgPayMax / 1000)}k`}
                label={RM.avgPay}
                sub={`${payDelta >= 0 ? "+" : "-"}$${Math.abs(Math.round(payDelta / 1000))}k vs market`}
                tone={payDelta >= 0 ? "positive" : "negative"}
              />
              <Stat
                value={`${standing.avgLikes}`}
                label={RM.avgInterest}
                sub={`${likeDelta >= 0 ? "+" : "-"}${Math.abs(likeDelta)} vs market`}
                tone={likeDelta >= 0 ? "positive" : "negative"}
              />
            </div>

            {standing.bestRank !== null && (
              <p className="text-sm text-muted">
                {rankNote}{" "}
                <span className="font-semibold text-fg">#{standing.bestRank}</span> of{" "}
                {standing.totalMarket} {rankNoteTail}
              </p>
            )}

            <ul className="divide-y divide-border">
              {standing.ownRanked.map(({ job, rank }) => (
                <li key={job.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted">
                      ${Math.round(job.salaryMin / 1000)}k-${Math.round(job.salaryMax / 1000)}k ·{" "}
                      {popularityLabel(job)}
                    </p>
                  </div>
                  <span className="chip shrink-0">#{rank} in market</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </section>

      {/* Popular postings */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{drawnToH}</h2>
        <StaggerList className="grid gap-3 sm:grid-cols-2">
          {popular.map((job) => (
            <FadeUp key={job.id}>
              <MarketJobCard job={job} mine={job.recruiterId === ACTIVE_RECRUITER_ID} />
            </FadeUp>
          ))}
        </StaggerList>
      </section>

      {/* Competition */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{competitionH}</h2>
        <StaggerList className="space-y-2">
          {competition.map((job) => (
            <FadeUp key={job.id}>
              <article className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{job.title}</p>
                  <p className="text-sm text-muted">
                    {job.company} · {job.location}
                    {job.remote ? " · Remote" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-accent">
                    ${Math.round(job.salaryMin / 1000)}k-${Math.round(job.salaryMax / 1000)}k
                  </span>
                  <span className="text-sm text-muted">{popularityLabel(job)}</span>
                </div>
              </article>
            </FadeUp>
          ))}
        </StaggerList>
      </section>
    </div>
  );
}

function MarketJobCard({ job, mine }: { job: Job; mine: boolean }) {
  return (
    <article className="card flex h-full flex-col gap-2 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">{job.title}</p>
          <p className="text-sm text-muted">
            {job.company} · {job.location}
            {job.remote ? " · Remote" : ""}
          </p>
        </div>
        {mine && <span className="chip shrink-0 !text-accent">{RM.yours}</span>}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="text-sm font-medium text-accent">
          ${Math.round(job.salaryMin / 1000)}k-${Math.round(job.salaryMax / 1000)}k
        </span>
        <span className="text-sm text-muted">{popularityLabel(job)}</span>
      </div>
    </article>
  );
}

/** Read-only popularity badge — recruiters observe demand, they don't cast likes. */
function popularityLabel(job: Job): string {
  return `♥ ${baseLikes(job).toLocaleString()}`;
}

function Stat({
  value,
  label,
  sub,
  tone = "neutral",
}: {
  value: string;
  label: string;
  sub?: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-xl bg-surface2 p-3">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted">{label}</p>
      {sub && (
        <p
          className={`mt-0.5 text-xs ${
            tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-muted"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
