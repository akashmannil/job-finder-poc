import { questionsForSkill } from "@/lib/skills/questionBank";
import type { AnsweredItem, Assessment, GradeResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Local, deterministic assessment engine (no AI). Pulls questions from the
// predefined bank, shuffles options for display, and grades by matching the
// selected option's text against the known answer — so the answer key never
// leaves the server.
// ─────────────────────────────────────────────────────────────────────────────

const QUESTION_COUNT = 4;
const PASS_THRESHOLD = 70;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build an assessment for a skill from the bank (answers stripped, options shuffled). */
export function generateAssessment(skill: string): Assessment {
  const bank = questionsForSkill(skill).slice(0, QUESTION_COUNT);
  return {
    skill,
    questions: bank.map((q, i) => ({
      id: `q${i + 1}`,
      question: q.question,
      options: shuffle(q.options),
    })),
  };
}

/** Grade by matching each selected option's text to the bank's known answer. */
export function gradeAssessment(skill: string, items: AnsweredItem[]): GradeResult {
  const answers = new Map(questionsForSkill(skill).map((q) => [q.question, q.answer]));
  const total = items.length || 1;
  const correct = items.filter((it) => answers.get(it.question) === it.selected).length;
  const score = Math.round((100 * correct) / total);
  const passed = score >= PASS_THRESHOLD;
  return {
    passed,
    score,
    rationale: passed
      ? `Answered ${correct}/${total} correctly — a solid grasp of ${skill}.`
      : `Answered ${correct}/${total} correctly — review ${skill} fundamentals and try again.`,
  };
}
