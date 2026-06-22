"use client";

import { AnimatePresence } from "framer-motion";
import { FadeUp, StaggerList, motion } from "@/components/common/Motion";
import { ProfileBuilder } from "@/components/candidate/ProfileBuilder";
import { MatchResults } from "@/components/candidate/MatchResults";
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
  return (
    <div className="space-y-10">
      <ProfileBuilder />
      <MatchResults />
    </div>
  );
}

function RecruiterWorkspace() {
  return (
    <StaggerList className="space-y-6">
      <FadeUp className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your recruiter workspace</h1>
        <p className="text-muted">
          Review consented applicants, decide with one click, and answer on the clock.
        </p>
      </FadeUp>
      <FadeUp>
        <div className="card p-6 text-sm text-muted">
          The posting dashboard arrives in a later commit.
        </div>
      </FadeUp>
    </StaggerList>
  );
}
