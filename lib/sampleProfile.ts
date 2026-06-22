import type { Profile } from "@/types";

/** A realistic profile so a reviewer can demo the whole flow in one click. */
export const SAMPLE_PROFILE: Profile = {
  name: "Riya Sharma",
  headline: "Frontend engineer who loves design systems & performance",
  location: "Remote (US)",
  remotePref: "remote",
  skills: [
    { name: "React", evidence: "assessment_passed" },
    { name: "TypeScript", evidence: "portfolio" },
    { name: "JavaScript", evidence: "reference_verified" },
    { name: "Next.js", evidence: "self_asserted" },
    { name: "Accessibility", evidence: "portfolio" },
    { name: "Testing", evidence: "self_asserted" },
    { name: "Node.js", evidence: "self_asserted", currentlyReskilling: true },
  ],
  experience: [
    {
      title: "Frontend Engineer",
      company: "Pixelio",
      years: 3,
      summary: "Built and maintained a component library used across 4 product teams.",
    },
    {
      title: "Junior Web Developer",
      company: "Studio Nine",
      years: 2,
      summary: "Shipped marketing sites and internal tools in React.",
    },
  ],
  projects: [
    {
      name: "a11y-checker",
      description: "Open-source accessibility linter for React with 1.2k stars.",
      link: "https://example.com/a11y-checker",
    },
  ],
};
