import { callStructured, MODEL, type StructuredRequest } from "@/lib/anthropic";
import { getJob } from "@/lib/jobs";
import type { Application, ApplicationStatus } from "@/types";

export const DECISION_REASONS = [
  { code: "moving_forward", label: "Moving forward", outcome: "offer" },
  { code: "skills_gap", label: "Skills gap", outcome: "rejected" },
  { code: "role_filled", label: "Role filled", outcome: "rejected" },
  { code: "seniority_mismatch", label: "Seniority mismatch", outcome: "rejected" },
] as const;

export type ReasonCode = (typeof DECISION_REASONS)[number]["code"];

export function outcomeFor(code: ReasonCode): ApplicationStatus {
  return DECISION_REASONS.find((r) => r.code === code)?.outcome ?? "rejected";
}

export interface DraftResult {
  subject: string;
  body: string;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
  },
  required: ["subject", "body"],
} as const;

/** Draft a brief, kind, specific decision message — making closure one click away. */
export async function draftDecision(
  application: Application,
  reasonCode: ReasonCode,
): Promise<DraftResult> {
  const job = getJob(application.jobId);
  const reason = DECISION_REASONS.find((r) => r.code === reasonCode);
  const skills = application.consent.profile.skills.map((s) => s.name).join(", ");

  const req: StructuredRequest = {
    model: MODEL,
    max_tokens: 700,
    system:
      "You are a recruiter writing a short, warm, specific decision message to a candidate. " +
      "2–4 sentences. Reference something concrete from their profile. If it's a rejection, be " +
      "kind and encouraging and name the reason honestly; if moving forward, be enthusiastic and " +
      "state the next step. Never be generic or cold. Return a subject and body.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              `Candidate: ${application.candidateName}`,
              `Role: ${job?.title ?? application.jobId} at ${job?.company ?? ""}`,
              `Candidate skills: ${skills || "n/a"}`,
              `Decision: ${reason?.label} (${reason?.outcome})`,
            ].join("\n"),
          },
        ],
      },
    ],
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
  };

  return callStructured<DraftResult>(req);
}
