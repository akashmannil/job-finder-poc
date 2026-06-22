import type { Endorsement, EndorsementRelationship } from "@/types";

/** How much a relationship lends credibility — verifiable, close relationships weigh more. */
export const RELATIONSHIP_WEIGHT: Record<
  EndorsementRelationship,
  { label: string; weight: "strong" | "moderate" | "light" }
> = {
  manager: { label: "Manager", weight: "strong" },
  client: { label: "Client", weight: "strong" },
  report: { label: "Direct report", weight: "moderate" },
  mentor: { label: "Mentor", weight: "moderate" },
  colleague: { label: "Colleague", weight: "moderate" },
  other: { label: "Other", weight: "light" },
};

export const MIN_EVIDENCE_LEN = 20;

export interface EndorsementInput {
  skill: string;
  endorserName: string;
  relationship: EndorsementRelationship;
  evidence: string;
}

/** Enforce that an endorsement carries a relationship and a specific evidence sentence. */
export function validateEndorsement(input: EndorsementInput): { ok: boolean; error?: string } {
  if (!input.skill) return { ok: false, error: "Pick the skill being endorsed." };
  if (!input.endorserName.trim()) return { ok: false, error: "Add the endorser's name." };
  if (input.evidence.trim().length < MIN_EVIDENCE_LEN) {
    return {
      ok: false,
      error: `Describe specific evidence (at least ${MIN_EVIDENCE_LEN} characters).`,
    };
  }
  return { ok: true };
}

export function createEndorsement(input: EndorsementInput): Endorsement {
  return {
    id: `end-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    skill: input.skill,
    endorserName: input.endorserName.trim(),
    relationship: input.relationship,
    evidence: input.evidence.trim(),
    createdAt: Date.now(),
  };
}
