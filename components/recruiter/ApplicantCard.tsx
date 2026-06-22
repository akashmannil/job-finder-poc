"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IdentityPage } from "@/components/common/IdentityPage";
import { formatRelative, isTerminal, STATUS_META } from "@/lib/applications";
import { slaLabel } from "@/lib/sla";
import { useStore } from "@/store/store";
import type { Application } from "@/types";

export function ApplicantCard({ application }: { application: Application }) {
  const { now } = useStore();
  const [open, setOpen] = useState(false);
  const t = now();
  const meta = STATUS_META[application.status];
  const { consent } = application;

  const topSkills = consent.profile.skills.slice(0, 4).map((s) => s.name).join(", ");

  return (
    <div className="rounded-xl border border-border bg-surface2 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">{application.candidateName}</p>
          <p className="truncate text-sm text-muted">
            {consent.profile.headline || topSkills || "Consented profile"}
          </p>
          <p className="text-xs text-muted">applied {formatRelative(application.createdAt, t)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}>
            {meta.label}
          </span>
          {!isTerminal(application.status) && (
            <span className="text-xs text-muted">{slaLabel(application, t)}</span>
          )}
        </div>
      </div>

      <button
        className="mt-2 text-sm font-medium text-accent hover:underline"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide" : "View"} consented profile
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl bg-surface p-3">
              <IdentityPage profile={consent.profile} endorsements={consent.endorsements} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
