"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { motion } from "@/components/common/Motion";
import { Discover } from "@/components/candidate/Discover";
import { CandidateProfile } from "@/components/candidate/CandidateProfile";
import { MatchResults } from "@/components/candidate/MatchResults";
import { ReskillReel } from "@/components/candidate/ReskillReel";
import { ApplicationTracker } from "@/components/candidate/ApplicationTracker";
import { RecruiterDashboard } from "@/components/recruiter/RecruiterDashboard";
import { candidateConduct } from "@/lib/conductScore";
import { useStore } from "@/store/store";

export default function Home() {
  const { role, hydrated } = useStore();

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface2" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        {role === "candidate" ? <CandidateWorkspace /> : <RecruiterWorkspace />}
      </motion.div>
    </AnimatePresence>
  );
}

type TopView = "discover" | "profile" | "matches" | "reskill" | "applications";

function CandidateWorkspace() {
  const { applications } = useStore();
  const [view, setView] = useState<TopView>("discover");
  const myConduct = candidateConduct(applications.filter((a) => a.own)).score;
  const openApps = applications.filter((a) => a.own).length;

  const tabs: { id: TopView; label: string; badge?: number }[] = [
    { id: "discover", label: "Discover" },
    { id: "profile", label: "Profile" },
    { id: "matches", label: "Matches" },
    { id: "reskill", label: "Reskilling" },
    { id: "applications", label: "Applications", badge: openApps || undefined },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 rounded-[11px] bg-surface2 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={`relative z-10 inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              view === t.id ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {view === t.id && (
              <motion.span
                layoutId="cand-view-pill"
                className="absolute inset-0 -z-10 rounded-[8px] bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {t.label}
            {t.badge ? (
              <span className="rounded-full bg-accent-soft px-1.5 text-[11px] font-semibold text-accent">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {view === "discover" ? (
            <Discover onGoReskill={() => setView("reskill")} />
          ) : view === "profile" ? (
            <CandidateProfile conduct={myConduct} />
          ) : view === "matches" ? (
            <MatchResults />
          ) : view === "reskill" ? (
            <ReskillReel />
          ) : (
            <ApplicationTracker />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RecruiterWorkspace() {
  return <RecruiterDashboard />;
}
