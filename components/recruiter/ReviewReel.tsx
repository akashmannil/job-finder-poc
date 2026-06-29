"use client";

import { useState } from "react";
import { SwipeDeck } from "@/components/common/SwipeDeck";
import { formatRelative, isTerminal } from "@/lib/applications";
import { DECISION_REASONS, draftDecision, outcomeFor, type ReasonCode } from "@/lib/decision";
import { getJob } from "@/lib/jobs";
import { useStore } from "@/store/store";
import type { Application } from "@/types";

// Swipe-to-decide triage over the recruiter's open applicants. Right = shortlist
// (moving forward), left = pass. Each swipe sends the same templated decision the
// list view's DecisionPanel would - recruiters still answer on the clock, just faster.
const REASON: Record<"left" | "right", ReasonCode> = {
  right: "moving_forward",
  left: "skills_gap",
};

export function ReviewReel({ recruiterId }: { recruiterId: string }) {
  const { applications, updateApplication, now } = useStore();
  // Snapshot the open queue once so decisions don't reshuffle the deck mid-swipe.
  const [queue] = useState(() =>
    applications.filter((a) => a.recruiterId === recruiterId && !isTerminal(a.status)),
  );

  function decide(app: Application, dir: "left" | "right") {
    const code = REASON[dir];
    const draft = draftDecision(app, code);
    updateApplication(app.id, {
      status: outcomeFor(code),
      respondedAt: now(),
      decisionReason: DECISION_REASONS.find((r) => r.code === code)?.label,
      decisionMessage: draft.body,
      recruiterInterested: code === "moving_forward" ? true : app.recruiterInterested,
    });
  }

  return (
    <SwipeDeck
      items={queue}
      getKey={(a) => a.id}
      right={{ label: "Shortlist", color: "var(--success)", glyph: "♥" }}
      left={{ label: "Pass", color: "var(--danger)", glyph: "✕" }}
      onSwipe={decide}
      renderCard={(a) => <ReelApplicantCard application={a} />}
      empty={
        <div className="card p-6 text-sm text-muted">
          No open applicants to review. New applications show up here.
        </div>
      }
      done={
        <div className="card grid place-items-center p-10 text-center">
          <p className="text-lg font-semibold">Queue cleared</p>
          <p className="mt-1 text-sm text-muted">
            Every open applicant has a decision. Refine the wording in the list view if needed.
          </p>
        </div>
      }
    />
  );
}

function ReelApplicantCard({ application }: { application: Application }) {
  const { now } = useStore();
  const { consent } = application;
  const job = getJob(application.jobId);
  const skills = consent.profile.skills.slice(0, 6);

  return (
    <article className="card flex h-full flex-col gap-4 overflow-hidden p-6">
      <header>
        <h3 className="text-xl font-semibold leading-tight">{application.candidateName}</h3>
        <p className="text-sm text-muted">
          {consent.profile.headline || "Consented profile"}
        </p>
        <p className="mt-1 text-xs text-muted">
          for {job?.title ?? "a role"} · applied {formatRelative(application.createdAt, now())}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        {skills.length > 0 && (
          <>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Skills</h4>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <li key={i} className="chip">
                  {s.name}
                </li>
              ))}
            </ul>
          </>
        )}

        {consent.endorsements.length > 0 && (
          <>
            <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Endorsements ({consent.endorsements.length})
            </h4>
            <ul className="mt-1.5 space-y-1.5">
              {consent.endorsements.slice(0, 3).map((e) => (
                <li key={e.id} className="text-sm">
                  <span className="font-medium">{e.skill}</span>
                  <span className="text-muted"> - {e.endorserName} ({e.relationship})</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {consent.profile.experience.length > 0 && (
          <>
            <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Experience
            </h4>
            <ul className="mt-1.5 space-y-1.5">
              {consent.profile.experience.slice(0, 2).map((x, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{x.title}</span>
                  <span className="text-muted"> · {x.company} · {x.years}y</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
