"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IdentityPage } from "@/components/common/IdentityPage";
import { applyConsent, CONSENT_FIELDS, DEFAULT_CONSENT } from "@/lib/consent";
import { consentCopy as C } from "@/lib/copy/profile";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { Application, ConsentChoices, Job } from "@/types";

export function ConsentShare({ job, onClose }: { job: Job; onClose: () => void }) {
  const { profile, endorsements, addApplication } = useStore();
  const [choices, setChoices] = useState<ConsentChoices>(DEFAULT_CONSENT);
  const subtitle = useVariant(C.subtitle);
  const revokeNote = useVariant(C.revokeNote);

  const snapshot = applyConsent(profile, endorsements, choices);

  function submit() {
    const app: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobId: job.id,
      recruiterId: job.recruiterId,
      candidateName: profile.name || "You",
      consent: snapshot,
      status: "received",
      createdAt: Date.now(),
      candidateInterested: true,
      recruiterInterested: false,
      own: true,
    };
    addApplication(app);
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="card max-h-[88vh] w-full max-w-3xl overflow-hidden p-0"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h3 className="font-semibold">
                {C.applyPrefix}: {job.title}
              </h3>
              <p className="text-sm text-muted">
                {job.company}. {subtitle}
              </p>
            </div>
            <button className="text-muted hover:text-fg" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="grid max-h-[64vh] gap-0 overflow-auto md:grid-cols-[14rem_1fr]">
            <div className="space-y-3 border-b border-border p-4 md:border-b-0 md:border-r">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{C.share}</h4>
              {CONSENT_FIELDS.map((f) => (
                <label key={f.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={choices[f.key]}
                    onChange={(e) => setChoices((c) => ({ ...c, [f.key]: e.target.checked }))}
                  />
                  {f.label}
                </label>
              ))}
              <p className="pt-2 text-xs text-muted">{revokeNote}</p>
            </div>

            <div className="space-y-2 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {C.preview}
              </h4>
              <div className="rounded-xl bg-surface2 p-3">
                <IdentityPage profile={snapshot.profile} endorsements={snapshot.endorsements} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border p-4">
            <button className="btn-ghost" onClick={onClose}>
              {C.cancel}
            </button>
            <button className="btn-primary" onClick={submit}>
              {C.submit}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
