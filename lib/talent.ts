import { coursesForSkill } from "@/lib/courses";
import { getRecruiterJobs } from "@/lib/jobs";
import { matchProfileToJob } from "@/lib/matcher";
import { normalizeSkill } from "@/lib/skills/catalog";
import type { Course, Endorsement, Job, MatchResult, Profile } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// A small sourcing directory: candidate profiles the recruiter could reach out to,
// independent of who has applied. Mirrors the candidate's "possible matches" - the
// recruiter sees who fits their open roles. Seed data, easy to expand.
// ─────────────────────────────────────────────────────────────────────────────

export interface TalentCandidate {
  id: string;
  profile: Profile;
  endorsements: Endorsement[];
}

function cand(
  id: string,
  name: string,
  headline: string,
  location: string,
  remotePref: Profile["remotePref"],
  skills: Profile["skills"],
): TalentCandidate {
  return {
    id,
    endorsements: [],
    profile: { name, headline, location, remotePref, skills, experience: [], projects: [] },
  };
}

export const TALENT_POOL: TalentCandidate[] = [
  cand("tal-1", "Maya Rao", "Senior frontend engineer", "Remote (US)", "remote", [
    { name: "React", evidence: "reference_verified" },
    { name: "TypeScript", evidence: "assessment_passed" },
    { name: "Next.js", evidence: "portfolio" },
    { name: "Accessibility", evidence: "portfolio" },
  ]),
  cand("tal-2", "Diego Santos", "Backend engineer, distributed systems", "Austin, TX", "hybrid", [
    { name: "Go", evidence: "assessment_passed" },
    { name: "System Design", evidence: "reference_verified" },
    { name: "Kubernetes", evidence: "portfolio" },
    { name: "PostgreSQL", evidence: "self_asserted" },
  ]),
  cand("tal-3", "Priya Sharma", "Data engineer", "Remote (EU)", "remote", [
    { name: "Python", evidence: "reference_verified" },
    { name: "SQL", evidence: "assessment_passed" },
    { name: "Spark", evidence: "portfolio" },
    { name: "Airflow", evidence: "self_asserted", currentlyReskilling: true },
  ]),
  cand("tal-4", "Tom Becker", "Full-stack engineer", "Berlin", "hybrid", [
    { name: "TypeScript", evidence: "assessment_passed" },
    { name: "Node.js", evidence: "portfolio" },
    { name: "React", evidence: "portfolio" },
    { name: "GraphQL", evidence: "self_asserted" },
  ]),
  cand("tal-5", "Aisha Khan", "ML engineer", "Remote (US)", "remote", [
    { name: "Python", evidence: "reference_verified" },
    { name: "Machine Learning", evidence: "assessment_passed" },
    { name: "PyTorch", evidence: "portfolio" },
    { name: "AWS", evidence: "self_asserted", currentlyReskilling: true },
  ]),
  cand("tal-6", "Leo Martin", "Platform / DevOps engineer", "Remote (US)", "remote", [
    { name: "AWS", evidence: "reference_verified" },
    { name: "Terraform", evidence: "assessment_passed" },
    { name: "Docker", evidence: "portfolio" },
    { name: "CI/CD", evidence: "portfolio" },
  ]),
];

export interface TalentMatch {
  candidate: TalentCandidate;
  match: MatchResult;
}

/** Rank the sourcing pool against a posting, best fit first. */
export function talentForJob(job: Job): TalentMatch[] {
  return TALENT_POOL.map((candidate) => ({ candidate, match: matchProfileToJob(candidate.profile, job) })).sort(
    (a, b) => b.match.fitScore - a.match.fitScore,
  );
}

// ── Talent development (training the recruiter could provide) ──────────────────

export interface SkillSupplyGap {
  skill: string;
  /** Weighted demand across the recruiter's postings (must-have = 2). */
  demand: number;
  /** Pool candidates who already hold the skill (directly). */
  supply: number;
  courses: Course[];
}

/**
 * Where the recruiter's required skills are scarce in the talent pool - the case
 * for offering training. High demand + low supply rises to the top, with the
 * courses that would build that skill in candidates.
 */
export function talentDevelopment(recruiterId: string): SkillSupplyGap[] {
  const jobs = getRecruiterJobs(recruiterId);

  const demand = new Map<string, number>();
  for (const job of jobs) {
    for (const req of job.requirements) {
      if (req.kind === "disqualifier") continue;
      const key = normalizeSkill(req.skill);
      demand.set(key, (demand.get(key) ?? 0) + (req.kind === "must_have" ? 2 : 1));
    }
  }

  const supply = new Map<string, number>();
  for (const c of TALENT_POOL) {
    const have = new Set(c.profile.skills.map((s) => normalizeSkill(s.name)));
    for (const skill of have) supply.set(skill, (supply.get(skill) ?? 0) + 1);
  }

  return [...demand.entries()]
    .map(([skill, d]) => ({
      skill,
      demand: d,
      supply: supply.get(skill) ?? 0,
      courses: coursesForSkill(skill),
    }))
    // Scarcest-relative-to-demand first.
    .sort((a, b) => b.demand - b.supply - (a.demand - a.supply))
    .slice(0, 6);
}
