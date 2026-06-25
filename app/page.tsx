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

type TopView = "workspace" | "applications" | "profile";

const SECTIONS = [
  { id: "profile", label: "Profile", node: <ProfileBuilder /> },
  { id: "passport", label: "Skill passport", node: <SkillPassport /> },
  { id: "endorsements", label: "Endorsements", node: <Endorsements /> },
  { id: "matches", label: "Matches", node: <MatchResults /> },
  { id: "reskill", label: "Reskilling", node: <ReskillPanel /> },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function CandidateWorkspace() {
  const { profile, endorsements, applications } = useStore();
  const [view, setView] = useState<TopView>("workspace");
  const [section, setSection] = useState<SectionId>("profile");
  const myConduct = candidateConduct(applications.filter((a) => a.own)).score;
  const openApps = applications.filter((a) => a.own).length;

  const tabs: { id: TopView; label: string; badge?: number }[] = [
    { id: "workspace", label: "Workspace" },
    { id: "applications", label: "Applications", badge: openApps || undefined },
    { id: "profile", label: "Public profile" },
  ];

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-[11px] bg-surface2 p-1">
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
          {view === "workspace" ? (
            <WorkspaceSections section={section} setSection={setSection} />
          ) : view === "applications" ? (
            <ApplicationTracker />
          ) : (
            <IdentityPage profile={profile} endorsements={endorsements} conduct={myConduct} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WorkspaceSections({
  section,
  setSection,
}: {
  section: SectionId;
  setSection: (id: SectionId) => void;
}) {
  const active = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];

  return (
    <div className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <nav className="md:sticky md:top-20 md:self-start">
        <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {SECTIONS.map((s) => {
            const isActive = s.id === active.id;
            return (
              <li key={s.id} className="shrink-0">
                <button
                  onClick={() => setSection(s.id)}
                  className={`relative w-full whitespace-nowrap rounded-[10px] px-3.5 py-2 text-left text-[14px] font-medium transition-colors ${
                    isActive ? "text-accent" : "text-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="cand-section-pill"
                      className="absolute inset-0 -z-10 rounded-[10px] bg-accent-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {active.node}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RecruiterWorkspace() {
  return <RecruiterDashboard />;
}
