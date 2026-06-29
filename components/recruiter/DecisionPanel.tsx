"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { isTerminal } from "@/lib/applications";
import { DECISION_REASONS, outcomeFor, type DraftResult, type ReasonCode } from "@/lib/decision";
import { useStore } from "@/store/store";
import type { Application } from "@/types";

export function DecisionPanel({ application }: { application: Application }) {
  const { updateApplication, now } = useStore();
  const [reason, setReason] = useState<ReasonCode | null>(null);
  const [draft, setDraft] = useState<DraftResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terminal = isTerminal(application.status);
  const mutual = application.candidateInterested && application.recruiterInterested;

  async function pickReason(code: ReasonCode) {
    setReason(code);
    setDraft(null);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/draft-decision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ application, reasonCode: code }),
      });
      const data = (await res.json()) as { draft?: DraftResult; error?: string };
      if (!res.ok || !data.draft) throw new Error(data.error ?? "Drafting failed.");
      setDraft(data.draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Drafting failed.");
    } finally {
      setLoading(false);
    }
  }

  function send() {
    if (!reason || !draft) return;
    const label = DECISION_REASONS.find((r) => r.code === reason)?.label;
    updateApplication(application.id, {
      status: outcomeFor(reason),
      respondedAt: now(),
      decisionReason: label,
      decisionMessage: draft.body,
      recruiterInterested: reason === "moving_forward" ? true : application.recruiterInterested,
    });
    setReason(null);
    setDraft(null);
  }

  if (terminal) {
    return (
      <div className="mt-3 border-t border-border pt-3 text-sm">
        <span className="font-medium">Decision:</span> {application.decisionReason ?? "Resolved"}
        {application.decisionMessage && (
          <p className="mt-1 text-muted">“{application.decisionMessage}”</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        {mutual ? (
          <span className="chip !text-success">Mutual interest ✓ - contact unlocked</span>
        ) : (
          <button
            className="btn-ghost text-xs"
            onClick={() => updateApplication(application.id, { recruiterInterested: true })}
          >
            Express interest
          </button>
        )}
        {application.status === "received" && (
          <button
            className="btn-ghost text-xs"
            onClick={() =>
              updateApplication(application.id, {
                status: "reviewing",
                respondedAt: application.respondedAt ?? now(),
              })
            }
          >
            Start reviewing
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {DECISION_REASONS.map((r) => (
          <button
            key={r.code}
            onClick={() => pickReason(r.code)}
            className={`text-xs ${
              reason === r.code
                ? "btn-primary"
                : r.outcome === "offer"
                  ? "btn-soft"
                  : "btn-ghost"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted">Drafting a kind, specific message…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2 rounded-xl border border-border bg-surface p-3"
          >
            <input
              className="input font-medium"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            />
            <textarea
              className="input"
              rows={4}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button className="btn-ghost text-xs" onClick={() => setDraft(null)}>
                Discard
              </button>
              <button className="btn-primary text-xs" onClick={send}>
                Send decision
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
