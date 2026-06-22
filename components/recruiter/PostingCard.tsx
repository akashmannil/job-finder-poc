"use client";

import { useState } from "react";
import { ApplicantCard } from "@/components/recruiter/ApplicantCard";
import { isTerminal } from "@/lib/applications";
import { isOverdue } from "@/lib/sla";
import { useStore } from "@/store/store";
import type { Application, Job } from "@/types";

export function PostingCard({
  job,
  applications,
}: {
  job: Job;
  applications: Application[];
}) {
  const { now } = useStore();
  const [open, setOpen] = useState(true);
  const t = now();

  const pending = applications.filter((a) => !isTerminal(a.status));
  const overdue = applications.filter((a) => isOverdue(a, t)).length;

  return (
    <div className="card overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-muted">
            {applications.length} applicant{applications.length === 1 ? "" : "s"} ·{" "}
            {pending.length} pending
            {overdue > 0 && <span className="text-danger"> · {overdue} overdue</span>}
          </p>
        </div>
        <span className="text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-2 border-t border-border p-4">
          {applications.length === 0 && (
            <p className="text-sm text-muted">No applicants yet.</p>
          )}
          {applications.map((a) => (
            <ApplicantCard key={a.id} application={a} />
          ))}
        </div>
      )}
    </div>
  );
}
