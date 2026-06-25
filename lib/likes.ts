import { JOBS } from "@/lib/jobs";
import type { Job } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Likes are a market-demand signal on *postings* — how much interest a role is
// drawing — deliberately distinct from the no-vanity-metrics rule that governs
// people/profiles. Each posting gets a stable, seeded base count so the demo
// looks alive; the candidate's own like adds one on top.
// ─────────────────────────────────────────────────────────────────────────────

/** Tiny deterministic string hash → stable per-job pseudo-randomness. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Seeded base like count for a posting (higher pay trends a little more popular). */
export function baseLikes(job: Job): number {
  const payBoost = Math.round(job.salaryMax / 12000); // ~8–18 for typical bands
  return 40 + (hash(job.id) % 260) + payBoost;
}

/** Total likes shown = seeded base + the candidate's own like, if any. */
export function likeCount(job: Job, liked: boolean): number {
  return baseLikes(job) + (liked ? 1 : 0);
}

/**
 * Market attractiveness — how eye-catching a posting is on the Discover page.
 * Combines pay, popularity, and a remote bonus into a single sortable score.
 * `likedJobs` nudges roles the candidate liked toward the top.
 */
export function attractiveness(job: Job, likedJobs: string[]): number {
  const pay = job.salaryMax / 1000; // ~120–320
  const popularity = baseLikes(job) / 2;
  const remote = job.remote ? 25 : 0;
  const mine = likedJobs.includes(job.id) ? 40 : 0;
  return pay + popularity + remote + mine;
}

/** Postings ranked by attractiveness (most attractive first). */
export function trendingJobs(likedJobs: string[], limit?: number): Job[] {
  const ranked = [...JOBS].sort(
    (a, b) => attractiveness(b, likedJobs) - attractiveness(a, likedJobs),
  );
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export interface MarketStat {
  label: string;
  value: string;
}

/** Headline market facts for the Discover banner — computed from the seed jobs. */
export function marketStats(): MarketStat[] {
  const count = JOBS.length;
  const remote = JOBS.filter((j) => j.remote).length;
  const top = topSkillsInDemand(1)[0];
  const medianMax = median(JOBS.map((j) => j.salaryMax));
  return [
    { label: "Open roles", value: String(count) },
    { label: "Remote-friendly", value: `${Math.round((remote / count) * 100)}%` },
    { label: "Median top pay", value: `$${Math.round(medianMax / 1000)}k` },
    { label: "Most-wanted skill", value: top?.skill ?? "—" },
  ];
}

export interface SkillDemand {
  skill: string;
  count: number;
}

/** Skills ranked by how many postings require them (must-haves weighted double). */
export function topSkillsInDemand(limit?: number): SkillDemand[] {
  const tally = new Map<string, number>();
  for (const job of JOBS) {
    for (const req of job.requirements) {
      if (req.kind === "disqualifier") continue;
      const weight = req.kind === "must_have" ? 2 : 1;
      tally.set(req.skill, (tally.get(req.skill) ?? 0) + weight);
    }
  }
  const ranked = [...tally.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
