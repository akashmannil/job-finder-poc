// Shared copy used by the public IdentityPage (candidate preview + recruiter view).
// Variant arrays picked per mount; single strings are stable labels.

export const identityCopy = {
  unnamed: "Unnamed candidate",
  reskillingLabel: "Currently reskilling:",
  conductLabel: "Conduct",
  conductDetail: "responsiveness & follow-through",
  proofNote: [
    "No views, followers, or likes here. Reputation is evidence, not reach.",
    "No views, followers, or likes. Here, reputation is evidence, not reach.",
  ],
  skills: "Skills",
  skillsSub: ["Strongest evidence first.", "Best-evidenced first."],
  noSkills: "No skills listed.",
  endorsements: "Endorsements",
  experience: "Experience",
  projects: "Projects",
} as const;
