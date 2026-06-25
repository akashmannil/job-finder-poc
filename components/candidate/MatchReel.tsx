"use client";

import { useState } from "react";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { SwipeDeck } from "@/components/common/SwipeDeck";
import { ConsentShare } from "@/components/candidate/ConsentShare";
import { useStore } from "@/store/store";
import type { Job, MatchResult } from "@/types";

// Swipe-to-decide view over the same match results the list shows. Right = apply
// (opens the consent modal — the candidate still controls what they share), left
// = skip. The deck works on a stable snapshot, so applying never reshuffles it.
export function MatchReel({ results }: { results: MatchResult[] }) {
  const { applications } = useStore();
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  return (
    <>
      <SwipeDeck
        items={results}
        getKey={(r) => r.jobId}
        right={{ label: "Apply", color: "var(--success)", glyph: "♥" }}
        left={{ label: "Skip", color: "var(--danger)", glyph: "✕" }}
        onSwipe={(r, dir) => {
          if (dir === "right") setApplyJob(r.job);
        }}
        renderCard={(r) => (
          <ReelJobCard result={r} applied={applications.some((a) => a.jobId === r.jobId && a.own)} />
        )}
        empty={<p className="text-sm text-muted">No matches to swipe through yet.</p>}
        done={
          <div className="card grid place-items-center p-10 text-center">
            <p className="text-lg font-semibold">You&apos;re all caught up</p>
            <p className="mt-1 text-sm text-muted">
              Switch to the list view to revisit any role, or re-run the match.
            </p>
          </div>
        }
      />
      {applyJob && <ConsentShare job={applyJob} onClose={() => setApplyJob(null)} />}
    </>
  );
}

function ReelJobCard({ result, applied }: { result: MatchResult; applied: boolean }) {
  const { job } = result;
  return (
    <article className="card flex h-full flex-col gap-4 overflow-hidden p-6">
      <header className="flex items-start gap-4">
        <ScoreBadge score={result.fitScore} size={64} />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold leading-tight">{job.title}</h3>
          <p className="text-sm text-muted">
            {job.company} · {job.location}
            {job.remote ? " · Remote" : ""}
          </p>
          <p className="mt-1 text-sm font-medium text-accent">
            ${Math.round(job.salaryMin / 1000)}k–${Math.round(job.salaryMax / 1000)}k
          </p>
        </div>
        {applied && <span className="chip !text-success">Applied ✓</span>}
      </header>

      <p className="text-sm">{result.summary}</p>

      <div className="min-h-0 flex-1 overflow-auto">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Why it fits</h4>
        <ul className="mt-1.5 space-y-1.5">
          {result.metRequirements.slice(0, 4).map((m, i) => (
            <li key={i} className="text-sm">
              <span className="mr-1 text-success">✓</span>
              <span className="font-medium">{m.requirement}</span>
              <span className="text-muted"> — {m.evidence}</span>
            </li>
          ))}
          {result.metRequirements.length === 0 && (
            <li className="text-sm text-muted">No requirements clearly met.</li>
          )}
        </ul>

        {result.gaps.length > 0 && (
          <>
            <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Skill gaps
            </h4>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {result.gaps.map((g, i) => (
                <li
                  key={i}
                  className={`chip ${
                    g.severity === "must_have" ? "!border-danger/40 !text-danger" : "!text-warning"
                  }`}
                >
                  {g.skill}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
