import type { ConsentChoices, ConsentSnapshot, Endorsement, Profile } from "@/types";

export const DEFAULT_CONSENT: ConsentChoices = {
  skills: true,
  endorsements: true,
  reskilling: true,
  experience: true,
  projects: true,
};

export const CONSENT_FIELDS: { key: keyof ConsentChoices; label: string }[] = [
  { key: "skills", label: "Skills & evidence" },
  { key: "endorsements", label: "Endorsements" },
  { key: "reskilling", label: "Reskilling status" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
];

/** Build the exact view a recruiter will see, honoring the candidate's choices. */
export function applyConsent(
  profile: Profile,
  endorsements: Endorsement[],
  choices: ConsentChoices,
): ConsentSnapshot {
  const skills = !choices.skills
    ? []
    : choices.reskilling
      ? profile.skills
      : profile.skills.map((s) => ({ ...s, currentlyReskilling: false }));

  return {
    profile: {
      ...profile,
      skills,
      experience: choices.experience ? profile.experience : [],
      projects: choices.projects ? profile.projects : [],
    },
    endorsements: choices.endorsements ? endorsements : [],
    choices,
  };
}
