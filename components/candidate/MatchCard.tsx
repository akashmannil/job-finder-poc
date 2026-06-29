"use client";

import { useState } from "react";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { ConsentShare } from "@/components/candidate/ConsentShare";
import { LikeButton } from "@/components/candidate/LikeButton";
import { matchesCopy as M } from "@/lib/copy/candidate";
import { useVariant } from "@/lib/copy/useVariant";
import { projectedFit } from "@/lib/matcher";
import { useStore } from "@/store/store";
import type { MatchResult } from "@/types";

export function MatchCard({ result, top = false }: { result: MatchResult; top?: boolean }) {
  const { job } = result;
  const { applications, profile } = useStore();
  const [applying, setApplying] = useState(false);
  const applied = applications.some((a) => a.jobId === job.id && a.own);
  const topMatch = useVariant(M.topMatch);
  const whyItFits = useVariant(M.whyItFits);
  const skillGaps = useVariant(M.skillGaps);
  const noneMet = useVariant(M.noneMet);
  const noGaps = useVariant(M.noGaps);

  // The single most valuable gap to close, and where it would take the fit score.
  const topGap = result.gaps.find((g) => g.severity === "must_have") ?? result.gaps[0];
  const projected = topGap ? projectedFit(profile, job, topGap.skill) : result.fitScore;
  const showLift = !!topGap && projected > result.fitScore;

  return (
    <article
      className={`card relative p-5 ${top ? "ring-2 ring-accent" : ""}`}
      aria-label={`${job.title} at ${job.company}`}
    >
      {top && (
        <span className="absolute -top-2 left-5 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-contrast">
          {topMatch}
        </span>
      )}
      <div className="flex items-start gap-4">
        <ScoreBadge score={result.fitScore} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{job.title}</h3>
          <p className="text-sm text-muted">
            {job.company} · {job.location}
            {job.remote ? " · Remote" : ""}
          </p>
          <p className="mt-0.5 text-sm font-medium text-accent">
            ${Math.round(job.salaryMin / 1000)}k-${Math.round(job.salaryMax / 1000)}k
          </p>
          <p className="mt-2 text-sm">{result.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            className={applied ? "btn-ghost text-sm" : "btn-primary text-sm"}
            disabled={applied}
            onClick={() => setApplying(true)}
          >
            {applied ? `${M.applied} ✓` : M.apply}
          </button>
          <LikeButton job={job} size="sm" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{whyItFits}</h4>
          <ul className="mt-1.5 space-y-1.5">
            {result.metRequirements.map((m, i) => (
              <li key={i} className="text-sm">
                <span className="mr-1 text-success">✓</span>
                <span className="font-medium">{m.requirement}</span>
                <span className="text-muted"> - {m.evidence}</span>
              </li>
            ))}
            {result.metRequirements.length === 0 && (
              <li className="text-sm text-muted">{noneMet}</li>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{skillGaps}</h4>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {result.gaps.map((g, i) => (
              <li
                key={i}
                className={`chip ${
                  g.severity === "must_have"
                    ? "!border-danger/40 !text-danger"
                    : "!text-warning"
                }`}
                title={g.severity === "must_have" ? "Must-have" : "Nice-to-have"}
              >
                {g.skill}
              </li>
            ))}
            {result.gaps.length === 0 && (
              <li className="text-sm text-success">{noGaps}</li>
            )}
          </ul>
        </div>
      </div>

      {showLift && topGap && (
        <div className="mt-4 rounded-xl bg-accent-soft px-3.5 py-2.5 text-sm text-accent">
          {M.liftLearn} <span className="font-semibold">{topGap.skill}</span> {M.liftTo}{" "}
          <span className="font-semibold">{projected}%</span> {M.liftFit} (+{projected - result.fitScore})
        </div>
      )}

      {applying && <ConsentShare job={job} onClose={() => setApplying(false)} />}
    </article>
  );
}
