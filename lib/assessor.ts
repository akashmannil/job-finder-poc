import { callStructured, MODEL, type StructuredRequest } from "@/lib/anthropic";
import type { AnsweredItem, Assessment, AssessmentQuestion, GradeResult } from "@/types";

// Schemas live beside the calls they constrain.
const GENERATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
        },
        required: ["question", "options"],
      },
    },
  },
  required: ["questions"],
} as const;

const GRADE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    passed: { type: "boolean" },
    score: { type: "integer" },
    rationale: { type: "string" },
  },
  required: ["passed", "score", "rationale"],
} as const;

/** Generate a short multiple-choice assessment for a skill (no answer key returned). */
export async function generateAssessment(skill: string): Promise<Assessment> {
  const req: StructuredRequest = {
    model: MODEL,
    max_tokens: 2000,
    system:
      "You write short, fair skill assessments. Produce exactly 4 multiple-choice questions " +
      "that genuinely test practical competence in the given skill. Each question has exactly 4 " +
      "options, with exactly one correct. Do not reveal which option is correct.",
    messages: [
      { role: "user", content: [{ type: "text", text: `Skill to assess: ${skill}` }] },
    ],
    output_config: { format: { type: "json_schema", schema: GENERATE_SCHEMA } },
  };
  const parsed = await callStructured<{ questions: Omit<AssessmentQuestion, "id">[] }>(req);
  return {
    skill,
    questions: parsed.questions.map((q, i) => ({ ...q, id: `q${i + 1}` })),
  };
}

/** Grade answered questions server-side. Pass threshold is 70. */
export async function gradeAssessment(
  skill: string,
  items: AnsweredItem[],
): Promise<GradeResult> {
  const req: StructuredRequest = {
    model: MODEL,
    max_tokens: 1500,
    system:
      "You are grading a skill assessment. For each item you are given the question, its options, " +
      "and the candidate's selected answer. Decide correctness yourself. Return an integer score " +
      "0-100 (percentage correct), passed = (score >= 70), and a one-sentence rationale.",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Skill: ${skill}\nAnswers:\n${JSON.stringify(items, null, 2)}` },
        ],
      },
    ],
    output_config: { format: { type: "json_schema", schema: GRADE_SCHEMA } },
  };
  return callStructured<GradeResult>(req);
}
