import { getJobs } from "@/lib/jobs";
import { areRelated, normalizeSkill } from "@/lib/skills/catalog";
import {
  EVIDENCE_LABEL,
  EVIDENCE_RANK,
  type EvidenceTier,
  type GapItem,
  type Job,
  type MatchResult,
  type MetRequirement,
  type Profile,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Local, deterministic matching engine (no AI). Scores a profile against each job
// using the predefined skill catalog. Verified evidence outweighs claims; must-haves
// outweigh nice-to-haves; related skills earn transferable partial credit.
// ─────────────────────────────────────────────────────────────────────────────

const KIND_WEIGHT = { must_have: 3, nice_to_have: 1 } as const;

const EVIDENCE_FACTOR: Record<EvidenceTier, number> = {
  self_asserted: 0.6,
  portfolio: 0.8,
  assessment_passed: 1.0,
  reference_verified: 1.0,
};

const TRANSFER_FACTOR = 0.5; // credit when only a related skill is present
const RESKILL_BONUS = 0.1; // small boost for a self-asserted skill being actively grown

interface CandSkill {
  tier: EvidenceTier;
  reskilling: boolean;
}

function candidateMap(profile: Profile): Map<string, CandSkill> {
  const map = new Map<string, CandSkill>();
  for (const s of profile.skills) {
    const key = normalizeSkill(s.name);
    const prev = map.get(key);
    if (!prev || EVIDENCE_RANK[s.evidence] > EVIDENCE_RANK[prev.tier]) {
      map.set(key, { tier: s.evidence, reskilling: !!s.currentlyReskilling });
    }
  }
  return map;
}

function scoreJob(job: Job, cand: Map<string, CandSkill>): MatchResult {
  let possible = 0;
  let earned = 0;
  let disqualified = false;
  let mustTotal = 0;
  let mustMet = 0;
  const metRequirements: MetRequirement[] = [];
  const gaps: GapItem[] = [];

  for (const req of job.requirements) {
    const reqCanon = normalizeSkill(req.skill);

    if (req.kind === "disqualifier") {
      if (cand.has(reqCanon)) disqualified = true;
      continue;
    }

    const weight = KIND_WEIGHT[req.kind];
    possible += weight;
    if (req.kind === "must_have") mustTotal++;

    const direct = cand.get(reqCanon);
    if (direct) {
      let factor = EVIDENCE_FACTOR[direct.tier];
      if (direct.reskilling && direct.tier === "self_asserted") factor += RESKILL_BONUS;
      earned += weight * Math.min(factor, 1);
      if (req.kind === "must_have") mustMet++;
      metRequirements.push({
        requirement: req.skill,
        evidence: `${reqCanon} — ${EVIDENCE_LABEL[direct.tier]}${
          direct.reskilling ? " · reskilling" : ""
        }`,
      });
      continue;
    }

    // Transferable: a related skill the candidate does have.
    let transfer: string | null = null;
    for (const have of cand.keys()) {
      if (areRelated(have, reqCanon)) {
        transfer = have;
        break;
      }
    }
    if (transfer) {
      const t = cand.get(transfer)!;
      earned += weight * TRANSFER_FACTOR * EVIDENCE_FACTOR[t.tier];
      if (req.kind === "must_have") mustMet++;
      metRequirements.push({ requirement: req.skill, evidence: `transferable from ${transfer}` });
    } else {
      gaps.push({ skill: req.skill, severity: req.kind });
    }
  }

  const raw = possible > 0 ? Math.round((100 * earned) / possible) : 0;
  const fitScore = disqualified ? 0 : Math.max(0, Math.min(100, raw));

  return { jobId: job.id, fitScore, summary: summarize(job, fitScore, mustMet, mustTotal, disqualified), metRequirements, gaps, job };
}

function summarize(
  job: Job,
  score: number,
  mustMet: number,
  mustTotal: number,
  disqualified: boolean,
): string {
  if (disqualified) return "Not a fit — a disqualifying requirement applies.";
  const band =
    score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : score >= 40 ? "Partial fit" : "Weak fit";
  return `${band} — meets ${mustMet}/${mustTotal} must-have${mustTotal === 1 ? "" : "s"} for this ${job.seniority} role.`;
}

/** Score the profile against every job and return ranked, joined matches. */
export function matchProfileToJobs(profile: Profile): MatchResult[] {
  const cand = candidateMap(profile);
  return getJobs()
    .map((job) => scoreJob(job, cand))
    .sort((a, b) => b.fitScore - a.fitScore);
}

/** Score a single profile against a single job — used by the recruiter talent view. */
export function matchProfileToJob(profile: Profile, job: Job): MatchResult {
  return scoreJob(job, candidateMap(profile));
}
