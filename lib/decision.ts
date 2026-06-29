import { getJob } from "@/lib/jobs";
import type { Application, ApplicationStatus } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Local, deterministic decision drafting (no AI). Templates per reason code,
// personalized from the application's consented data. The recruiter edits before
// sending - the template removes the effort, the human keeps control.
// ─────────────────────────────────────────────────────────────────────────────

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

/** Compose a warm, specific decision message from the consented application data. */
export function draftDecision(application: Application, reasonCode: ReasonCode): DraftResult {
  const job = getJob(application.jobId);
  const role = job?.title ?? "the role";
  const company = job?.company ?? "our team";
  const name = application.candidateName || "there";
  const skill = application.consent.profile.skills[0]?.name;
  const withSkill = skill ? ` in ${skill}` : "";

  switch (reasonCode) {
    case "moving_forward":
      return {
        subject: `Next steps for the ${role} role`,
        body: `Hi ${name}, thanks for applying to ${role} at ${company}. Your experience${withSkill} stood out and we'd love to move forward. We'll reach out shortly to set up a conversation.`,
      };
    case "skills_gap":
      return {
        subject: `Update on your ${role} application`,
        body: `Hi ${name}, thank you for applying to ${role} at ${company}. After a careful review we've decided not to move forward this time - the role needs deeper experience in a few must-have areas. We really valued your background${withSkill} and would welcome a future application as you grow those skills.`,
      };
    case "role_filled":
      return {
        subject: `Update on your ${role} application`,
        body: `Hi ${name}, thank you for your interest in ${role} at ${company}. We've filled this position, so we won't be moving forward - but we were impressed by your background${withSkill} and will keep you in mind for similar openings.`,
      };
    case "seniority_mismatch":
      return {
        subject: `Update on your ${role} application`,
        body: `Hi ${name}, thank you for applying to ${role} at ${company}. The scope of this role didn't quite line up with the level we're hiring for right now. Your background${withSkill} is strong, and we'd genuinely welcome an application for a role that better matches your level.`,
      };
  }
}
