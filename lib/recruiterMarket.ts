import { getRecruiterJobs, JOBS } from "@/lib/jobs";
import { attractiveness, baseLikes } from "@/lib/likes";
import type { Job } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// The recruiter-side market lens: how a recruiter's own postings stack up against
// the rest of the market, plus the competing and popular postings they should be
// aware of. All derived from the seed jobs - the mirror of the candidate Discover.
// ─────────────────────────────────────────────────────────────────────────────

/** Postings owned by other recruiters, ranked by market attractiveness. */
export function competitorJobs(recruiterId: string, likedJobs: string[] = []): Job[] {
  return JOBS.filter((j) => j.recruiterId !== recruiterId).sort(
    (a, b) => attractiveness(b, likedJobs) - attractiveness(a, likedJobs),
  );
}

/** Every posting ranked by attractiveness - used to place a recruiter's roles. */
function rankedMarket(likedJobs: string[] = []): Job[] {
  return [...JOBS].sort((a, b) => attractiveness(b, likedJobs) - attractiveness(a, likedJobs));
}

export interface RankedOwnJob {
  job: Job;
  /** 1-based rank across all postings in the market. */
  rank: number;
}

export interface RecruiterStanding {
  postings: number;
  totalMarket: number;
  avgPayMax: number;
  marketAvgPayMax: number;
  avgLikes: number;
  marketAvgLikes: number;
  /** The recruiter's own postings with their market rank, best first. */
  ownRanked: RankedOwnJob[];
  /** Best (lowest) market rank among the recruiter's postings, or null if none. */
  bestRank: number | null;
}

/** How this recruiter's postings compare to the whole market. */
export function recruiterStanding(recruiterId: string, likedJobs: string[] = []): RecruiterStanding {
  const mine = getRecruiterJobs(recruiterId);
  const ranked = rankedMarket(likedJobs);
  const rankOf = new Map(ranked.map((j, i) => [j.id, i + 1]));

  const ownRanked: RankedOwnJob[] = mine
    .map((job) => ({ job, rank: rankOf.get(job.id) ?? ranked.length }))
    .sort((a, b) => a.rank - b.rank);

  return {
    postings: mine.length,
    totalMarket: JOBS.length,
    avgPayMax: avg(mine.map((j) => j.salaryMax)),
    marketAvgPayMax: avg(JOBS.map((j) => j.salaryMax)),
    avgLikes: avg(mine.map(baseLikes)),
    marketAvgLikes: avg(JOBS.map(baseLikes)),
    ownRanked,
    bestRank: ownRanked.length > 0 ? ownRanked[0].rank : null,
  };
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);
}
