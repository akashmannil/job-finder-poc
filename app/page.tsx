"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { motion } from "@/components/common/Motion";
import { WorkspaceShell } from "@/components/common/WorkspaceShell";
import { Discover } from "@/components/candidate/Discover";
import { CandidateProfile } from "@/components/candidate/CandidateProfile";
import { CandidateRail } from "@/components/candidate/CandidateRail";
import { MatchResults } from "@/components/candidate/MatchResults";
import { ReskillReel } from "@/components/candidate/ReskillReel";
import { ApplicationTracker } from "@/components/candidate/ApplicationTracker";
import { RecruiterDashboard } from "@/components/recruiter/RecruiterDashboard";
import { RecruiterMarket } from "@/components/recruiter/RecruiterMarket";
import { RecruiterRail } from "@/components/recruiter/RecruiterRail";
import { RecruiterTalent } from "@/components/recruiter/RecruiterTalent";
import { RecruiterStanding } from "@/components/recruiter/RecruiterStanding";
import { Messages } from "@/components/common/Messages";
import { candidateConduct } from "@/lib/conductScore";
import { messagesBadge } from "@/lib/peers";
import { useStore } from "@/store/store";

export default function Home() {
  const { role, hydrated } = useStore();

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface2" />;
  }

  // NOTE: no AnimatePresence here. Each workspace has its own inner
  // `AnimatePresence mode="wait"` for tab switching; nesting another
  // `mode="wait"` around them deadlocks the outer exit promise on a role
  // switch, leaving a blank page when returning to the candidate view. A
  // key-ed motion.div remounts the workspace and plays its enter animation
  // on every role change without that nesting hazard.
  return (
    <motion.div
      key={role}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {role === "candidate" ? <CandidateWorkspace /> : <RecruiterWorkspace />}
    </motion.div>
  );
}

export type TopView = "discover" | "profile" | "matches" | "reskill" | "applications" | "messages";

function CandidateWorkspace() {
  const { applications, messages, threadReads, peerThreads } = useStore();
  const [view, setView] = useState<TopView>("discover");
  const myConduct = candidateConduct(applications.filter((a) => a.own)).score;
  const openApps = applications.filter((a) => a.own).length;
  const unreadMsgs = messagesBadge("candidate", applications, peerThreads, messages, threadReads);

  const tabs: { id: TopView; label: string; badge?: number }[] = [
    { id: "discover", label: "Discover" },
    { id: "profile", label: "Profile" },
    { id: "matches", label: "Matches" },
    { id: "reskill", label: "Reskilling" },
    { id: "applications", label: "Applications", badge: openApps || undefined },
    { id: "messages", label: "Messages", badge: unreadMsgs || undefined },
  ];

  return (
    <WorkspaceShell
      tabs={tabs}
      view={view}
      onSelect={setView}
      pillId="cand-view-pill"
      aside={<CandidateRail onNavigate={setView} />}
    >
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
          ) : view === "applications" ? (
            <ApplicationTracker />
          ) : (
            <Messages />
          )}
        </motion.div>
      </AnimatePresence>
    </WorkspaceShell>
  );
}

export type RecruiterView = "market" | "talent" | "postings" | "standing" | "messages";

function RecruiterWorkspace() {
  const { applications, messages, threadReads, peerThreads } = useStore();
  const [view, setView] = useState<RecruiterView>("market");
  const unreadMsgs = messagesBadge("recruiter", applications, peerThreads, messages, threadReads);

  const tabs: { id: RecruiterView; label: string; badge?: number }[] = [
    { id: "market", label: "Market" },
    { id: "talent", label: "Talent" },
    { id: "postings", label: "Postings" },
    { id: "standing", label: "Standing" },
    { id: "messages", label: "Messages", badge: unreadMsgs || undefined },
  ];

  return (
    <WorkspaceShell
      tabs={tabs}
      view={view}
      onSelect={setView}
      pillId="rec-view-pill"
      aside={<RecruiterRail onNavigate={setView} />}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {view === "market" ? (
            <RecruiterMarket />
          ) : view === "talent" ? (
            <RecruiterTalent />
          ) : view === "postings" ? (
            <RecruiterDashboard />
          ) : view === "standing" ? (
            <RecruiterStanding onReview={() => setView("postings")} />
          ) : (
            <Messages />
          )}
        </motion.div>
      </AnimatePresence>
    </WorkspaceShell>
  );
}
