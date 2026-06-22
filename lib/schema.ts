// JSON schema for the match endpoint's structured output. Kept beside the matcher
// as the single source of truth that mirrors the MatchResultRaw TS type.

export const MATCH_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          jobId: { type: "string" },
          fitScore: { type: "integer" },
          summary: { type: "string" },
          metRequirements: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                requirement: { type: "string" },
                evidence: { type: "string" },
              },
              required: ["requirement", "evidence"],
            },
          },
          gaps: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                skill: { type: "string" },
                severity: { type: "string", enum: ["must_have", "nice_to_have"] },
              },
              required: ["skill", "severity"],
            },
          },
        },
        required: ["jobId", "fitScore", "summary", "metRequirements", "gaps"],
      },
    },
  },
  required: ["results"],
} as const;
