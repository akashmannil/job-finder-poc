"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { MatchCard } from "@/components/candidate/MatchCard";
import { MatchReel } from "@/components/candidate/MatchReel";
import { aggregateGaps } from "@/lib/reskill";
import { matchesCopy as M } from "@/lib/copy/candidate";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { MatchResult } from "@/types";

export function MatchResults() {
  const { profile, setMatchGaps } = useStore();
  const title = useVariant(M.title);
  const subtitle = useVariant(M.subtitle);
  const needSkill = useVariant(M.needSkill);
  const noneMsg = useVariant(M.none);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "reel">("list");

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
      const matched = data.results ?? [];
      setResults(matched);
      setMatchGaps(aggregateGaps(matched));
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
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {results && results.length > 0 && (
            <div className="inline-flex rounded-[11px] bg-surface2 p-1">
              {(["list", "reel"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-[8px] px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                    mode === m ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
          <button className="btn-primary" onClick={runMatch} disabled={!canMatch || loading}>
            {loading ? `${M.matching}…` : results ? M.rerun : M.find}
          </button>
        </div>
      </div>

      {!canMatch && <p className="text-sm text-muted">{needSkill}</p>}

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

      {results && !loading && results.length === 0 && (
        <p className="text-sm text-muted">{noneMsg}</p>
      )}

      {results && !loading && results.length > 0 && mode === "reel" && (
        <MatchReel results={results} />
      )}

      {results && !loading && results.length > 0 && mode === "list" && (
        <StaggerList className="space-y-3">
          {results.map((r, i) => (
            <FadeUp key={r.jobId}>
              <MatchCard result={r} top={i === 0} />
            </FadeUp>
          ))}
        </StaggerList>
      )}
    </section>
  );
}
