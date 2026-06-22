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

/** Which side of the marketplace the user is currently acting as. */
export type Role = "candidate" | "recruiter";

// ── Matching ────────────────────────────────────────────────────────────────

/** A requirement the candidate satisfies, with the evidence that satisfied it. */
export interface MetRequirement {
  requirement: string;
  evidence: string;
}

/** A missing/weak requirement, tagged by how much it matters. */
export interface GapItem {
  skill: string;
  severity: "must_have" | "nice_to_have";
}

/** The per-job result Claude returns (structured output). */
export interface MatchResultRaw {
  jobId: string;
  fitScore: number;
  summary: string;
  metRequirements: MetRequirement[];
  gaps: GapItem[];
}

/** A match joined back to its full job, for rendering. */
export interface MatchResult extends MatchResultRaw {
  job: Job;
}

// ── Assessment ────────────────────────────────────────────────────────────────

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface Assessment {
  skill: string;
  questions: AssessmentQuestion[];
}

/** One answered question, sent back for grading (no answer key on the client). */
export interface AnsweredItem {
  question: string;
  options: string[];
  selected: string;
}

export interface GradeResult {
  passed: boolean;
  score: number;
  rationale: string;
}

// ── Endorsements ──────────────────────────────────────────────────────────────

export type EndorsementRelationship =
  | "manager"
  | "colleague"
  | "report"
  | "client"
  | "mentor"
  | "other";

/** An endorsement requires a stated relationship and specific evidence — no one-tap skills. */
export interface Endorsement {
  id: string;
  skill: string;
  endorserName: string;
  relationship: EndorsementRelationship;
  evidence: string;
  createdAt: number;
}

// ── Applications & consent ────────────────────────────────────────────────────

/** What the candidate chooses to share with a recruiter when applying. */
export interface ConsentChoices {
  skills: boolean;
  endorsements: boolean;
  reskilling: boolean;
  experience: boolean;
  projects: boolean;
}

/** The exact, filtered view a recruiter receives — the candidate's consented data. */
export interface ConsentSnapshot {
  profile: Profile;
  endorsements: Endorsement[];
  choices: ConsentChoices;
}

export type ApplicationStatus =
  | "received"
  | "reviewing"
  | "offer"
  | "rejected"
  | "auto_closed";

export interface Application {
  id: string;
  jobId: string;
  recruiterId: string;
  candidateName: string;
  consent: ConsentSnapshot;
  status: ApplicationStatus;
  createdAt: number;
  /** When the recruiter first moved it past "received" — used for the conduct score. */
  respondedAt?: number;
  decisionReason?: string;
  decisionMessage?: string;
  candidateInterested: boolean;
  recruiterInterested: boolean;
  /** True for applications the current candidate created (vs. seeded other candidates). */
  own: boolean;
}
