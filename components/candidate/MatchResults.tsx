"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { MatchCard } from "@/components/candidate/MatchCard";
import { useStore } from "@/store/store";
import type { MatchResult } from "@/types";

export function MatchResults() {
  const { profile } = useStore();
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canMatch = profile.skills.length > 0;

  async function runMatch() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = (await res.json()) as { results?: MatchResult[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Matching failed.");
      setResults(data.results ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Matching failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Matches</h2>
          <p className="text-sm text-muted">
            Ranked by honest fit — verified evidence and must-haves carry the most weight.
          </p>
        </div>
        <button className="btn-primary" onClick={runMatch} disabled={!canMatch || loading}>
          {loading ? "Matching…" : results ? "Re-run match" : "Find matches"}
        </button>
      </div>

      {!canMatch && (
        <p className="text-sm text-muted">Add at least one skill to your profile to match.</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-danger/40 bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-4 py-3 text-sm text-danger"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface2" />
          ))}
        </div>
      )}

      {results && !loading && (
        <StaggerList className="space-y-3">
          {results.map((r, i) => (
            <FadeUp key={r.jobId}>
              <MatchCard result={r} top={i === 0} />
            </FadeUp>
          ))}
          {results.length === 0 && (
            <p className="text-sm text-muted">No matches returned.</p>
          )}
        </StaggerList>
      )}
    </section>
  );
}
