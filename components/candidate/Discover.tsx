"use client";

import { useState } from "react";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { LikeButton } from "@/components/candidate/LikeButton";
import { ConsentShare } from "@/components/candidate/ConsentShare";
import { ActivityDigest } from "@/components/candidate/ActivityDigest";
import { SavedRoles } from "@/components/candidate/SavedRoles";
import { getJob } from "@/lib/jobs";
import { marketStats, topSkillsInDemand, trendingJobs } from "@/lib/likes";
import { useStore } from "@/store/store";
import type { Job } from "@/types";

// The landing surface: lead with the market's most attractive offer and trending
// roles (with likes), so the app pulls the user in before asking them to do work.
export function Discover({ onGoReskill }: { onGoReskill: () => void }) {
  const { likedJobs, applications } = useStore();
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const ranked = trendingJobs(likedJobs);
  const hero = ranked[0];
  const rest = ranked.slice(1, 7);
  const stats = marketStats();
  const hotSkills = topSkillsInDemand(5);

  const isApplied = (id: string) => applications.some((a) => a.jobId === id && a.own);

  if (!hero) return null;

  return (
    <div className="space-y-10">
      <ActivityDigest />

      {/* Industry highlight */}
      <section className="space-y-4">
        <div>
          <h1 className="h-display">The market, right now</h1>
          <p className="mt-1 text-muted">
            Live highlights from open roles — the offers and skills drawing the most interest today.
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

      {/* Hero — most attractive offer */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Offer of the moment
        </h2>
        <FadeUp>
          <article className="card overflow-hidden p-0">
            <div className="bg-accent-soft px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Top-rated opening
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{hero.title}</h3>
              <p className="text-muted">
                {hero.company} · {hero.location}
                {hero.remote ? " · Remote" : ""}
              </p>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-xl font-semibold text-accent">
                ${Math.round(hero.salaryMin / 1000)}k–${Math.round(hero.salaryMax / 1000)}k
              </p>
              <p className="text-sm">{hero.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={isApplied(hero.id) ? "btn-ghost" : "btn-primary"}
                  disabled={isApplied(hero.id)}
                  onClick={() => setApplyJob(hero)}
                >
                  {isApplied(hero.id) ? "Applied ✓" : "Apply now"}
                </button>
                <LikeButton job={hero} />
              </div>
            </div>
          </article>
        </FadeUp>
      </section>

      {/* Trending roles */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Trending roles</h2>
        <StaggerList className="grid gap-3 sm:grid-cols-2">
          {rest.map((job) => (
            <FadeUp key={job.id}>
              <article className="card flex h-full flex-col gap-3 p-5">
                <div className="flex-1">
                  <h3 className="font-semibold leading-tight">{job.title}</h3>
                  <p className="text-sm text-muted">
                    {job.company} · {job.location}
                    {job.remote ? " · Remote" : ""}
                  </p>
                  <p className="mt-2 text-sm font-medium text-accent">
                    ${Math.round(job.salaryMin / 1000)}k–${Math.round(job.salaryMax / 1000)}k
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <LikeButton job={job} size="sm" />
                  <button
                    className={isApplied(job.id) ? "btn-ghost text-sm" : "btn-soft text-sm"}
                    disabled={isApplied(job.id)}
                    onClick={() => setApplyJob(job)}
                  >
                    {isApplied(job.id) ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              </article>
            </FadeUp>
          ))}
        </StaggerList>
      </section>

      {/* Saved roles (watchlist) */}
      <SavedRoles onApply={(id) => setApplyJob(getJob(id) ?? null)} />

      {/* Reskill teaser → reel tab */}
      <section>
        <FadeUp>
          <button
            onClick={onGoReskill}
            className="card group flex w-full items-center justify-between gap-4 p-6 text-left transition-transform hover:scale-[1.01]"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Stay in demand
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">
                Skills the market wants — that you don&apos;t have yet
              </h3>
              <p className="mt-1 text-sm text-muted">
                {hotSkills.map((s) => s.skill).slice(0, 4).join(" · ")} … and more. Swipe through a
                personalized reskilling feed.
              </p>
            </div>
            <span className="shrink-0 text-2xl text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </FadeUp>
      </section>

      {applyJob && <ConsentShare job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}
