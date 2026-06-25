import { coursesForSkill } from "@/lib/courses";
import { relatedOf } from "@/lib/skills/catalog";
import { topSkillsInDemand } from "@/lib/likes";
import type { Course, GapItem, MatchResult } from "@/types";

export interface ReskillSuggestion {
  skill: string;
  severity: GapItem["severity"];
  courses: Course[];
}

/** Dedupe gaps across all matches, keeping the most severe occurrence of each skill. */
export function aggregateGaps(results: MatchResult[]): GapItem[] {
  const bySkill = new Map<string, GapItem>();
  for (const r of results) {
    for (const g of r.gaps) {
      const existing = bySkill.get(g.skill);
      if (!existing || (existing.severity === "nice_to_have" && g.severity === "must_have")) {
        bySkill.set(g.skill, g);
      }
    }
  }
  // Must-haves first.
  return [...bySkill.values()].sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === "must_have" ? -1 : 1,
  );
}

/** Map gaps to the courses that teach them (must-haves first). */
export function recommendCourses(gaps: GapItem[]): ReskillSuggestion[] {
  return gaps.map((g) => ({
    skill: g.skill,
    severity: g.severity,
    courses: coursesForSkill(g.skill),
  }));
}

// ── Reskill reel (infinite, advertising-style feed) ───────────────────────────

type ReskillSource = "gap_must" | "gap_nice" | "adjacent" | "trending";

export interface ReskillItem {
  /** Unique per rendered card (skill + cycle), so infinite repeats get stable keys. */
  key: string;
  skill: string;
  badge: string;
  pitch: string;
  severity?: GapItem["severity"];
  courses: Course[];
}

const BADGE: Record<ReskillSource, string> = {
  gap_must: "Closes a must-have gap",
  gap_nice: "Closes a gap",
  adjacent: "Builds on your stack",
  trending: "🔥 In demand",
};

// Several pitches per source so cycling the pool keeps the feed feeling fresh.
const PITCHES: Record<ReskillSource, string[]> = {
  gap_must: [
    "Recruiters mark this as required — owning it flips a “no” into a “yes”.",
    "A must-have you’re missing on real roles. Close it and unlock matches.",
    "This is the gate on roles you almost qualify for. Walk through it.",
  ],
  gap_nice: [
    "Not required — but it’s the tie-breaker on great roles.",
    "A nice-to-have that tips close calls your way.",
    "Small lift, real edge: this is what separates two equal candidates.",
  ],
  adjacent: [
    "You’re one step away — it builds right on what you already know.",
    "Adjacent to your stack: the fastest new skill you’ll ever pick up.",
    "Natural next move from your current skills. Low effort, high payoff.",
  ],
  trending: [
    "One of the most-requested skills on the market right now.",
    "Hot in postings this quarter — get ahead of the demand.",
    "Employers are competing for this one. Be what they’re searching for.",
  ],
};

/** Stable index from a string, used to vary copy deterministically. */
function pick(seed: string, len: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % Math.max(len, 1);
}

interface PoolEntry {
  skill: string;
  source: ReskillSource;
  severity?: GapItem["severity"];
}

/**
 * The ordered base pool of things worth learning, derived from the candidate:
 * 1) gaps from the last match (must-haves first), 2) skills adjacent to what they
 * already have, 3) the most in-demand skills on the market they don't yet hold.
 */
function buildPool(gaps: GapItem[], ownedSkills: string[]): PoolEntry[] {
  const owned = new Set(ownedSkills.map((s) => s.toLowerCase()));
  const seen = new Set<string>();
  const pool: PoolEntry[] = [];

  const add = (skill: string, source: ReskillSource, severity?: GapItem["severity"]) => {
    const key = skill.toLowerCase();
    if (owned.has(key) || seen.has(key)) return;
    seen.add(key);
    pool.push({ skill, source, severity });
  };

  for (const g of gaps) {
    add(g.skill, g.severity === "must_have" ? "gap_must" : "gap_nice", g.severity);
  }
  for (const ow of ownedSkills) {
    for (const rel of relatedOf(ow)) add(rel, "adjacent");
  }
  for (const d of topSkillsInDemand()) add(d.skill, "trending");

  return pool;
}

/**
 * One page of the infinite reskilling reel. The base pool is cycled endlessly;
 * each time a skill reappears it gets a different pitch, so the feed never runs
 * dry even for a candidate with few gaps.
 */
export function reskillPage(
  gaps: GapItem[],
  ownedSkills: string[],
  page: number,
  pageSize = 6,
): ReskillItem[] {
  const pool = buildPool(gaps, ownedSkills);
  if (pool.length === 0) return [];

  const items: ReskillItem[] = [];
  const start = page * pageSize;
  for (let i = start; i < start + pageSize; i++) {
    const entry = pool[i % pool.length];
    const cycle = Math.floor(i / pool.length);
    const pitches = PITCHES[entry.source];
    items.push({
      key: `${entry.skill}-${cycle}`,
      skill: entry.skill,
      badge: BADGE[entry.source],
      pitch: pitches[(pick(entry.skill, pitches.length) + cycle) % pitches.length],
      severity: entry.severity,
      courses: coursesForSkill(entry.skill),
    });
  }
  return items;
}
