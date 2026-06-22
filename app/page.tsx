"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { motion } from "@/components/common/Motion";
import { IdentityPage } from "@/components/common/IdentityPage";
import { ProfileBuilder } from "@/components/candidate/ProfileBuilder";
import { SkillPassport } from "@/components/candidate/SkillPassport";
import { Endorsements } from "@/components/candidate/Endorsements";
import { MatchResults } from "@/components/candidate/MatchResults";
import { ReskillPanel } from "@/components/candidate/ReskillPanel";
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

function CandidateWorkspace() {
  const { profile, endorsements, applications } = useStore();
  const [view, setView] = useState<"workspace" | "profile">("workspace");
  const myConduct = candidateConduct(applications.filter((a) => a.own)).score;

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-[11px] bg-surface2 p-1">
        {(["workspace", "profile"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`relative z-10 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              view === v ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {view === v && (
              <motion.span
                layoutId="cand-view-pill"
                className="absolute inset-0 -z-10 rounded-[8px] bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {v === "workspace" ? "Workspace" : "Public profile"}
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
          {view === "workspace" ? (
            <div className="space-y-10">
              <ProfileBuilder />
              <SkillPassport />
              <Endorsements />
              <MatchResults />
              <ReskillPanel />
              <ApplicationTracker />
            </div>
          ) : (
            <IdentityPage profile={profile} endorsements={endorsements} conduct={myConduct} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RecruiterWorkspace() {
  return <RecruiterDashboard />;
}
