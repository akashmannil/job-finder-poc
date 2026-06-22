import { callStructured, MODEL, type StructuredRequest } from "@/lib/anthropic";
import { getJobs, getJob } from "@/lib/jobs";
import { MATCH_RESULT_SCHEMA } from "@/lib/schema";
import type { MatchResult, MatchResultRaw, Profile } from "@/types";

const SYSTEM_PROMPT = `You are an expert technical recruiter scoring how well a candidate fits each open role.

Score HONESTLY. Do not inflate. A weak fit must get a low score.

Rules:
- Weight VERIFIED evidence above self-asserted claims. Evidence tiers, strongest to weakest:
  reference_verified > assessment_passed > portfolio > self_asserted. A self-asserted skill is a
  claim, not proof — treat it with appropriate skepticism.
- A job's "must_have" requirements matter far more than "nice_to_have" ones. Missing a must_have
  should heavily reduce the score; missing a nice_to_have should only slightly reduce it.
- Never reward keyword matching. Judge whether the candidate can actually do the job.
- "currentlyReskilling" on a skill is a positive growth signal: it slightly softens a gap.

For every job, return:
- fitScore: integer 0-100 (honest overall fit).
- summary: one sentence on the overall fit.
- metRequirements: the job requirements the candidate genuinely meets, each with the specific
  evidence from their profile that satisfies it (cite the skill + its evidence tier).
- gaps: requirements the candidate is missing or weak on, each tagged must_have or nice_to_have.

Return a result for EVERY job provided.`;

/** Compact, stable representation of the job list — goes first so it can be cached. */
function jobsBlock(): string {
  const jobs = getJobs().map((j) => ({
    id: j.id,
    title: j.title,
    seniority: j.seniority,
    remote: j.remote,
    description: j.description,
    requirements: j.requirements,
  }));
  return `JOBS (score the candidate against every one):\n${JSON.stringify(jobs)}`;
}

function profileBlock(profile: Profile): string {
  return `CANDIDATE PROFILE:\n${JSON.stringify(profile)}`;
}

/** Run the candidate's profile against every job and return ranked, joined matches. */
export async function matchProfileToJobs(profile: Profile): Promise<MatchResult[]> {
  const req: StructuredRequest = {
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          // Stable prefix first, cached so repeated matches are cheaper/faster.
          { type: "text", text: jobsBlock(), cache_control: { type: "ephemeral" } },
          { type: "text", text: profileBlock(profile) },
        ],
      },
    ],
    output_config: { format: { type: "json_schema", schema: MATCH_RESULT_SCHEMA } },
  };

  const parsed = await callStructured<{ results: MatchResultRaw[] }>(req);
  const results = Array.isArray(parsed.results) ? parsed.results : [];

  return results
    .map((r) => {
      const job = getJob(r.jobId);
      return job ? ({ ...r, job } satisfies MatchResult) : null;
    })
    .filter((r): r is MatchResult => r !== null)
    .sort((a, b) => b.fitScore - a.fitScore);
}
