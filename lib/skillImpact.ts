import { JOBS } from "@/lib/jobs";
import { normalizeSkill } from "@/lib/skills/catalog";

// ─────────────────────────────────────────────────────────────────────────────
// The payoff of a skill, computed from the live job set: how many roles want it,
// how common it is, and what those roles pay. This is what turns "learn X" into a
// concrete incentive (more matches, higher pay, more visible in the market).
// ─────────────────────────────────────────────────────────────────────────────

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const MARKET_MEDIAN_MAX = median(JOBS.map((j) => j.salaryMax));

export interface SkillImpact {
  skill: string;
  /** Postings that list this skill (must-have or nice-to-have). */
  roles: number;
  /** Share of all postings that want it, 0-100. */
  demandPct: number;
  /** Median top-of-band pay across the roles that want it. */
  medianPay: number;
  /** medianPay minus the market median (can be negative). */
  payPremium: number;
}

/** Market payoff for learning a given skill. */
export function skillImpact(skill: string): SkillImpact {
  const canon = normalizeSkill(skill);
  const reqJobs = JOBS.filter((j) =>
    j.requirements.some((r) => r.kind !== "disqualifier" && normalizeSkill(r.skill) === canon),
  );
  const roles = reqJobs.length;
  const medianPay = roles > 0 ? median(reqJobs.map((j) => j.salaryMax)) : MARKET_MEDIAN_MAX;
  return {
    skill: canon,
    roles,
    demandPct: Math.round((roles / JOBS.length) * 100),
    medianPay,
    payPremium: Math.round(medianPay - MARKET_MEDIAN_MAX),
  };
}
