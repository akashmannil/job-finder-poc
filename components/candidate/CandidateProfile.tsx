"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ConductScore } from "@/components/common/ConductScore";
import { EvidenceBadge } from "@/components/common/EvidenceBadge";
import { IdentityPage } from "@/components/common/IdentityPage";
import { SkillAssessment } from "@/components/candidate/SkillAssessment";
import {
  createEndorsement,
  RELATIONSHIP_WEIGHT,
  validateEndorsement,
} from "@/lib/endorsements";
import { SAMPLE_PROFILE } from "@/lib/sampleProfile";
import { profileCopy as P } from "@/lib/copy/profile";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import {
  EVIDENCE_LABEL,
  EVIDENCE_RANK,
  type EndorsementRelationship,
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
const VERIFIED: EvidenceTier[] = ["assessment_passed", "reference_verified"];
const RELATIONSHIPS = Object.keys(RELATIONSHIP_WEIGHT) as EndorsementRelationship[];

type SectionId = "identity" | "skills" | "experience" | "projects" | "endorsements";

/**
 * Display-first candidate profile (LinkedIn/Facebook style): the data is shown
 * meaningfully by default; each section reveals its editor only on an explicit
 * Edit click. Editing writes straight to the store (live save), so "Done" simply
 * returns the section to its read view.
 */
export function CandidateProfile({ conduct }: { conduct: number | null }) {
  const { profile, endorsements, setProfile } = useStore();
  const [editing, setEditing] = useState<SectionId | null>(null);
  const [preview, setPreview] = useState(false);
  const title = useVariant(P.title);
  const subtitle = useVariant(P.subtitle);
  const previewNote = useVariant(P.previewNote);
  const emptyNote = useVariant(P.emptyNote);

  const toggle = (id: SectionId) => setEditing((cur) => (cur === id ? null : id));
  const isEmpty =
    !profile.name && profile.skills.length === 0 && profile.experience.length === 0;

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface2 px-4 py-3">
          <p className="text-sm text-muted">{previewNote}</p>
          <button className="btn-soft text-sm" onClick={() => setPreview(false)}>
            {P.backToEditing}
          </button>
        </div>
        <IdentityPage profile={profile} endorsements={endorsements} conduct={conduct} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-display">{title}</h1>
          <p className="mt-1 text-muted">{subtitle}</p>
        </div>
        <button className="btn-ghost text-sm" onClick={() => setPreview(true)}>
          {P.previewBtn}
        </button>
      </div>

      {isEmpty && (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-sm text-muted">{emptyNote}</p>
          <button className="btn-soft text-sm" onClick={() => setProfile(SAMPLE_PROFILE)}>
            {P.loadSample}
          </button>
        </div>
      )}

      <IdentitySection
        conduct={conduct}
        editing={editing === "identity"}
        onToggle={() => toggle("identity")}
      />
      <SkillsSection editing={editing === "skills"} onToggle={() => toggle("skills")} />
      <ExperienceSection
        editing={editing === "experience"}
        onToggle={() => toggle("experience")}
      />
      <ProjectsSection editing={editing === "projects"} onToggle={() => toggle("projects")} />
      <EndorsementsSection
        editing={editing === "endorsements"}
        onToggle={() => toggle("endorsements")}
      />
    </div>
  );
}

// ── Section shell ─────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  editing,
  onToggle,
  editLabel = "Edit",
  children,
}: {
  title: string;
  subtitle?: string;
  editing: boolean;
  onToggle: () => void;
  editLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        <button className="btn-ghost text-sm" onClick={onToggle}>
          {editing ? "Done" : editLabel}
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={editing ? "edit" : "view"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-4"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
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

// ── Identity ──────────────────────────────────────────────────────────────────

function IdentitySection({
  conduct,
  editing,
  onToggle,
}: {
  conduct: number | null;
  editing: boolean;
  onToggle: () => void;
}) {
  const { profile, updateProfile } = useStore();
  const reskilling = profile.skills.filter((s) => s.currentlyReskilling);

  return (
    <Section title={P.sIdentity} editing={editing} onToggle={onToggle}>
      {editing ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              className="input"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder={P.phName}
            />
          </Field>
          <Field label="Location">
            <input
              className="input"
              value={profile.location}
              onChange={(e) => updateProfile({ location: e.target.value })}
              placeholder={P.phLocation}
            />
          </Field>
          <Field label="Headline" className="sm:col-span-2">
            <input
              className="input"
              value={profile.headline}
              onChange={(e) => updateProfile({ headline: e.target.value })}
              placeholder={P.phHeadline}
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
      ) : (
        <div>
          <p className="text-2xl font-semibold tracking-tight">{profile.name || P.unnamed}</p>
          {profile.headline && <p className="mt-1 text-lg text-muted">{profile.headline}</p>}
          <p className="mt-1 text-sm text-muted">
            {profile.location || "Location not set"} · prefers {profile.remotePref}
          </p>
          {reskilling.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted">Currently reskilling:</span>
              {reskilling.map((s) => (
                <span key={s.name} className="chip !text-accent">
                  {s.name}
                </span>
              ))}
            </div>
          )}
          {conduct !== null && (
            <div className="mt-4">
              <ConductScore
                score={conduct}
                label="Conduct"
                detail="responsiveness & follow-through"
              />
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

// ── Skills (+ inline prove / assessment) ──────────────────────────────────────

function SkillsSection({ editing, onToggle }: { editing: boolean; onToggle: () => void }) {
  const { profile, updateProfile } = useStore();
  const sub = useVariant(P.sSkillsSub);
  const noSkillsView = useVariant(P.noSkillsView);
  const noSkillsEdit = useVariant(P.noSkillsEdit);
  const [skillName, setSkillName] = useState("");
  const [skillTier, setSkillTier] = useState<EvidenceTier>("self_asserted");
  const [assessing, setAssessing] = useState<string | null>(null);

  const setSkills = (skills: Skill[]) => updateProfile({ skills });
  const sorted = [...profile.skills].sort(
    (a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence],
  );

  function addSkill() {
    const name = skillName.trim();
    if (!name || profile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setSkills([...profile.skills, { name, evidence: skillTier }]);
    setSkillName("");
    setSkillTier("self_asserted");
  }

  function markPassed(skill: string) {
    updateProfile({
      skills: profile.skills.map((s) =>
        s.name === skill && EVIDENCE_RANK[s.evidence] < EVIDENCE_RANK.assessment_passed
          ? { ...s, evidence: "assessment_passed" }
          : s,
      ),
    });
  }

  return (
    <Section title={P.sSkills} subtitle={sub} editing={editing} onToggle={onToggle}>
      {editing ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              className="input min-w-[10rem] flex-1"
              value={skillName}
              placeholder={P.phSkill}
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
              {P.addBtn}
            </button>
          </div>
          <ul className="space-y-2">
            {profile.skills.map((s, i) => (
              <li
                key={s.name}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface2 px-3 py-2"
              >
                <span className="font-medium">{s.name}</span>
                {s.currentlyReskilling && <span className="chip !text-accent">reskilling</span>}
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
              </li>
            ))}
            {profile.skills.length === 0 && (
              <li className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
                {noSkillsEdit}
              </li>
            )}
          </ul>
        </div>
      ) : profile.skills.length === 0 ? (
        <p className="text-sm text-muted">{noSkillsView}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map((s) => {
            const verified = VERIFIED.includes(s.evidence);
            return (
              <span
                key={s.name}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1 text-sm"
              >
                {s.name}
                <EvidenceBadge tier={s.evidence} />
                {!verified && (
                  <button
                    className="text-xs font-medium text-accent hover:underline"
                    onClick={() => setAssessing(s.name)}
                  >
                    {P.prove}
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {assessing && (
        <SkillAssessment
          skill={assessing}
          onClose={() => setAssessing(null)}
          onPassed={markPassed}
        />
      )}
    </Section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────

function ExperienceSection({ editing, onToggle }: { editing: boolean; onToggle: () => void }) {
  const { profile, updateProfile } = useStore();
  const empty = useVariant(P.noExperience);
  const setExperience = (experience: ExperienceItem[]) => updateProfile({ experience });

  return (
    <Section title={P.sExperience} editing={editing} onToggle={onToggle}>
      {editing ? (
        <div className="space-y-3">
          {profile.experience.map((x, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
              <input
                className="input"
                placeholder={P.phTitle}
                value={x.title}
                onChange={(e) => editAt(profile.experience, setExperience, i, { title: e.target.value })}
              />
              <input
                className="input"
                placeholder={P.phCompany}
                value={x.company}
                onChange={(e) => editAt(profile.experience, setExperience, i, { company: e.target.value })}
              />
              <input
                className="input"
                type="number"
                min={0}
                placeholder={P.phYears}
                value={x.years}
                onChange={(e) =>
                  editAt(profile.experience, setExperience, i, { years: Number(e.target.value) })
                }
              />
              <input
                className="input sm:col-span-2"
                placeholder={P.phRoleSummary}
                value={x.summary}
                onChange={(e) => editAt(profile.experience, setExperience, i, { summary: e.target.value })}
              />
              <button
                className="justify-self-start text-xs text-muted hover:text-danger"
                onClick={() => setExperience(profile.experience.filter((_, j) => j !== i))}
              >
                {P.remove}
              </button>
            </div>
          ))}
          <button
            className="btn-ghost text-sm"
            onClick={() =>
              setExperience([...profile.experience, { title: "", company: "", years: 1, summary: "" }])
            }
          >
            {P.addRole}
          </button>
        </div>
      ) : profile.experience.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {profile.experience.map((x, i) => (
            <li key={i}>
              <p className="text-sm font-medium">
                {x.title} · {x.company} <span className="text-muted">({x.years}y)</span>
              </p>
              {x.summary && <p className="text-sm text-muted">{x.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function ProjectsSection({ editing, onToggle }: { editing: boolean; onToggle: () => void }) {
  const { profile, updateProfile } = useStore();
  const empty = useVariant(P.noProjects);
  const setProjects = (projects: Project[]) => updateProfile({ projects });

  return (
    <Section title={P.sProjects} editing={editing} onToggle={onToggle}>
      {editing ? (
        <div className="space-y-3">
          {profile.projects.map((p, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-border p-3">
              <input
                className="input"
                placeholder={P.phProjectName}
                value={p.name}
                onChange={(e) => editAt(profile.projects, setProjects, i, { name: e.target.value })}
              />
              <input
                className="input"
                placeholder={P.phProjectDesc}
                value={p.description}
                onChange={(e) => editAt(profile.projects, setProjects, i, { description: e.target.value })}
              />
              <input
                className="input"
                placeholder={P.phProjectLink}
                value={p.link ?? ""}
                onChange={(e) => editAt(profile.projects, setProjects, i, { link: e.target.value })}
              />
              <button
                className="justify-self-start text-xs text-muted hover:text-danger"
                onClick={() => setProjects(profile.projects.filter((_, j) => j !== i))}
              >
                {P.remove}
              </button>
            </div>
          ))}
          <button
            className="btn-ghost text-sm"
            onClick={() => setProjects([...profile.projects, { name: "", description: "", link: "" }])}
          >
            {P.addProject}
          </button>
        </div>
      ) : profile.projects.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {profile.projects.map((p, i) => (
            <li key={i}>
              <p className="text-sm font-medium">
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </p>
              {p.description && <p className="text-sm text-muted">{p.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// ── Endorsements ──────────────────────────────────────────────────────────────

function EndorsementsSection({ editing, onToggle }: { editing: boolean; onToggle: () => void }) {
  const { profile, endorsements, addEndorsement, removeEndorsement } = useStore();
  const sub = useVariant(P.sEndorsementsSub);
  const empty = useVariant(P.noEndorsements);
  const [skill, setSkill] = useState("");
  const [endorserName, setEndorserName] = useState("");
  const [relationship, setRelationship] = useState<EndorsementRelationship>("manager");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const input = { skill, endorserName, relationship, evidence };
    const check = validateEndorsement(input);
    if (!check.ok) {
      setError(check.error ?? "Invalid endorsement.");
      return;
    }
    addEndorsement(createEndorsement(input));
    setSkill("");
    setEndorserName("");
    setRelationship("manager");
    setEvidence("");
    setError("");
  }

  return (
    <Section
      title={P.sEndorsements}
      subtitle={sub}
      editing={editing}
      onToggle={onToggle}
      editLabel={endorsements.length === 0 ? P.add : P.manage}
    >
      {editing ? (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              className="input"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              aria-label="Skill to endorse"
            >
              <option value="">{P.skillToEndorse}</option>
              {profile.skills.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder={P.phEndorser}
              value={endorserName}
              onChange={(e) => setEndorserName(e.target.value)}
            />
            <select
              className="input"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as EndorsementRelationship)}
              aria-label="Relationship"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {RELATIONSHIP_WEIGHT[r].label}
                </option>
              ))}
            </select>
            <textarea
              className="input sm:col-span-2"
              rows={2}
              placeholder={P.phEvidence}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button className="btn-primary" onClick={submit}>
            {P.addEndorsement}
          </button>

          {endorsements.length > 0 && (
            <ul className="space-y-2">
              {endorsements.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-border bg-surface2 p-3"
                >
                  <div>
                    <p className="text-sm">“{e.evidence}”</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {e.endorserName} · {RELATIONSHIP_WEIGHT[e.relationship].label} · on{" "}
                      <span className="font-medium">{e.skill}</span>
                    </p>
                  </div>
                  <button
                    className="text-muted hover:text-danger"
                    aria-label="Remove endorsement"
                    onClick={() => removeEndorsement(e.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : endorsements.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {endorsements.map((e) => (
            <li key={e.id} className="border-l-2 border-accent pl-3">
              <p className="text-sm">“{e.evidence}”</p>
              <p className="mt-0.5 text-xs text-muted">
                {e.endorserName} · {RELATIONSHIP_WEIGHT[e.relationship].label} · on{" "}
                <span className="font-medium">{e.skill}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/** Immutably patch item `i` of an array and push it through a setter. */
function editAt<T>(arr: T[], set: (next: T[]) => void, i: number, patch: Partial<T>) {
  const next = [...arr];
  next[i] = { ...next[i], ...patch };
  set(next);
}
