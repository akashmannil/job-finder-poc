// ─────────────────────────────────────────────────────────────────────────────
// Domain model. Single source of truth for the data shapes the whole app shares.
// Feature-specific types (matches, endorsements, applications, conduct) are added
// in the commit that introduces the feature.
// ─────────────────────────────────────────────────────────────────────────────

/** How well a skill claim is backed — the matcher weights these very differently. */
export type EvidenceTier =
  | "self_asserted"
  | "portfolio"
  | "assessment_passed"
  | "reference_verified";

export const EVIDENCE_RANK: Record<EvidenceTier, number> = {
  self_asserted: 0,
  portfolio: 1,
  assessment_passed: 2,
  reference_verified: 3,
};

export const EVIDENCE_LABEL: Record<EvidenceTier, string> = {
  self_asserted: "Self-asserted",
  portfolio: "Portfolio",
  assessment_passed: "Assessment passed",
  reference_verified: "Reference verified",
};

export interface Skill {
  name: string;
  evidence: EvidenceTier;
  /** Set when the candidate is actively reskilling this — a positive growth signal. */
  currentlyReskilling?: boolean;
}

export interface ExperienceItem {
  title: string;
  company: string;
  years: number;
  summary: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
}

export type RemotePref = "remote" | "hybrid" | "onsite" | "any";

export interface Profile {
  name: string;
  headline: string;
  location: string;
  remotePref: RemotePref;
  skills: Skill[];
  experience: ExperienceItem[];
  projects: Project[];
}

export type Seniority = "junior" | "mid" | "senior" | "lead" | "principal";

/** A job requirement, classified so matching weights must-haves over fluff. */
export type RequirementKind = "must_have" | "nice_to_have" | "disqualifier";

export interface Requirement {
  skill: string;
  kind: RequirementKind;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  seniority: Seniority;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: Requirement[];
  recruiterId: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  skill: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  url: string;
}

export interface Recruiter {
  id: string;
  name: string;
  company: string;
}
