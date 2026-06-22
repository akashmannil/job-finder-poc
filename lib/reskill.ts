import { coursesForSkill } from "@/lib/courses";
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
