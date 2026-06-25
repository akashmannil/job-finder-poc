"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";
import { formatRelative, isTerminal, STATUS_META } from "@/lib/applications";
import { slaLabel } from "@/lib/sla";
import { getJob } from "@/lib/jobs";
import { useStore } from "@/store/store";

export function ApplicationTracker() {
  const { applications, now } = useStore();
  const t = now();
  const mine = applications.filter((a) => a.own);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Your applications</h2>
        <p className="text-sm text-muted">
          Live status — recruiters answer on the clock, so you’re never left guessing.
        </p>
      </div>
      {mine.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-medium">No applications yet</p>
          <p className="mt-1 text-sm text-muted">
            Head to <span className="text-fg">Workspace → Matches</span> and apply to a role — it
            will appear here with a live SLA countdown.
          </p>
        </div>
      )}
      <StaggerList className="space-y-3">
        {mine.map((a) => {
          const job = getJob(a.jobId);
          const meta = STATUS_META[a.status];
          return (
            <FadeUp key={a.id}>
              <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{job?.title ?? a.jobId}</p>
                  <p className="text-sm text-muted">
                    {job?.company} · applied {formatRelative(a.createdAt, t)}
                  </p>
                  {a.decisionMessage && (
                    <p className="mt-1 max-w-prose text-sm">{a.decisionMessage}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${meta.className}`}>
                    {meta.label}
                  </span>
                  {!isTerminal(a.status) && (
                    <span className="text-xs text-muted">{slaLabel(a, t)}</span>
                  )}
                </div>
              </div>
            </FadeUp>
          );
        })}
      </StaggerList>
    </section>
  );
}
