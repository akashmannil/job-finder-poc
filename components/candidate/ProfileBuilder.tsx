"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EvidenceBadge } from "@/components/common/EvidenceBadge";
import { SAMPLE_PROFILE } from "@/lib/sampleProfile";
import { useStore } from "@/store/store";
import {
  EVIDENCE_LABEL,
  type EvidenceTier,
  type ExperienceItem,
  type Project,
  type RemotePref,
  type Skill,
} from "@/types";

const TIERS: EvidenceTier[] = [
  "self_asserted",
  "portfolio",
  "assessment_passed",
  "reference_verified",
];
const REMOTE: RemotePref[] = ["remote", "hybrid", "onsite", "any"];

export function ProfileBuilder() {
  const { profile, updateProfile, setProfile } = useStore();
  const [skillName, setSkillName] = useState("");
  const [skillTier, setSkillTier] = useState<EvidenceTier>("self_asserted");

  const setSkills = (skills: Skill[]) => updateProfile({ skills });
  const setExperience = (experience: ExperienceItem[]) => updateProfile({ experience });
  const setProjects = (projects: Project[]) => updateProfile({ projects });

  const addSkill = () => {
    const name = skillName.trim();
    if (!name || profile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setSkills([...profile.skills, { name, evidence: skillTier }]);
    setSkillName("");
    setSkillTier("self_asserted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your verified profile</h1>
          <p className="text-sm text-muted">
            This — not a résumé — is what gets matched. Evidence beats claims.
          </p>
        </div>
        <button className="btn-soft" onClick={() => setProfile(SAMPLE_PROFILE)}>
          Load sample profile
        </button>
      </div>

      {/* Identity */}
      <section className="card space-y-4 p-5">
        <h2 className="font-semibold">Identity</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className="input"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="Your name"
            />
          </Field>
          <Field label="Location">
            <input
              className="input"
              value={profile.location}
              onChange={(e) => updateProfile({ location: e.target.value })}
              placeholder="City / Remote"
            />
          </Field>
          <Field label="Headline" className="sm:col-span-2">
            <input
              className="input"
              value={profile.headline}
              onChange={(e) => updateProfile({ headline: e.target.value })}
              placeholder="One line on who you are"
            />
          </Field>
          <Field label="Work preference">
            <select
              className="input"
              value={profile.remotePref}
              onChange={(e) => updateProfile({ remotePref: e.target.value as RemotePref })}
            >
              {REMOTE.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Skills */}
      <section className="card space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Skills &amp; evidence</h2>
          <span className="text-xs text-muted">{profile.skills.length} added</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            className="input flex-1 min-w-[10rem]"
            value={skillName}
            placeholder="Add a skill (e.g. React)"
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <select
            className="input w-auto"
            value={skillTier}
            onChange={(e) => setSkillTier(e.target.value as EvidenceTier)}
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {EVIDENCE_LABEL[t]}
              </option>
            ))}
          </select>
          <button className="btn-primary" onClick={addSkill}>
            Add
          </button>
        </div>

        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {profile.skills.map((s, i) => (
              <motion.li
                key={s.name}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface2 px-3 py-2"
              >
                <span className="font-medium">{s.name}</span>
                {s.currentlyReskilling && (
                  <span className="chip text-accent">reskilling</span>
                )}
                <span className="ml-auto flex items-center gap-2">
                  <EvidenceBadge tier={s.evidence} />
                  <select
                    aria-label={`Evidence for ${s.name}`}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs"
                    value={s.evidence}
                    onChange={(e) => {
                      const next = [...profile.skills];
                      next[i] = { ...s, evidence: e.target.value as EvidenceTier };
                      setSkills(next);
                    }}
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {EVIDENCE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-muted hover:text-danger"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => setSkills(profile.skills.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
          {profile.skills.length === 0 && (
            <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
              No skills yet — add a few, or load the sample profile.
            </li>
          )}
        </ul>
      </section>

      {/* Experience */}
      <section className="card space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Experience</h2>
          <button
            className="btn-ghost text-sm"
            onClick={() =>
              setExperience([
                ...profile.experience,
                { title: "", company: "", years: 1, summary: "" },
              ])
            }
          >
            + Add role
          </button>
        </div>
        <div className="space-y-3">
          {profile.experience.map((x, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
              <input
                className="input"
                placeholder="Title"
                value={x.title}
                onChange={(e) => editAt(profile.experience, setExperience, i, { title: e.target.value })}
              />
              <input
                className="input"
                placeholder="Company"
                value={x.company}
                onChange={(e) => editAt(profile.experience, setExperience, i, { company: e.target.value })}
              />
              <input
                className="input"
                type="number"
                min={0}
                placeholder="Years"
                value={x.years}
                onChange={(e) =>
                  editAt(profile.experience, setExperience, i, { years: Number(e.target.value) })
                }
              />
              <input
                className="input sm:col-span-2"
                placeholder="One-line summary"
                value={x.summary}
                onChange={(e) => editAt(profile.experience, setExperience, i, { summary: e.target.value })}
              />
              <button
                className="justify-self-start text-xs text-muted hover:text-danger"
                onClick={() => setExperience(profile.experience.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          {profile.experience.length === 0 && (
            <p className="text-sm text-muted">No roles added yet.</p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="card space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Projects</h2>
          <button
            className="btn-ghost text-sm"
            onClick={() => setProjects([...profile.projects, { name: "", description: "", link: "" }])}
          >
            + Add project
          </button>
        </div>
        <div className="space-y-3">
          {profile.projects.map((p, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-border p-3">
              <input
                className="input"
                placeholder="Project name"
                value={p.name}
                onChange={(e) => editAt(profile.projects, setProjects, i, { name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Description"
                value={p.description}
                onChange={(e) => editAt(profile.projects, setProjects, i, { description: e.target.value })}
              />
              <input
                className="input"
                placeholder="Link (optional)"
                value={p.link ?? ""}
                onChange={(e) => editAt(profile.projects, setProjects, i, { link: e.target.value })}
              />
              <button
                className="justify-self-start text-xs text-muted hover:text-danger"
                onClick={() => setProjects(profile.projects.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          {profile.projects.length === 0 && (
            <p className="text-sm text-muted">No projects added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1 ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

/** Immutably patch item `i` of an array and push it through a setter. */
function editAt<T>(arr: T[], set: (next: T[]) => void, i: number, patch: Partial<T>) {
  const next = [...arr];
  next[i] = { ...next[i], ...patch };
  set(next);
}
