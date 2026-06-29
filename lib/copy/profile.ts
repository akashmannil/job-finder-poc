// Candidate profile, consent dialog, and skill-assessment copy. Variant arrays are
// picked at random per mount; single strings are atomic labels/placeholders kept
// stable on purpose. Edit text here, not in the components.

export const profileCopy = {
  title: ["Your profile", "Your profile, your way", "This is you"],
  subtitle: [
    "This, not a résumé, is what gets matched. Evidence beats claims.",
    "Matched on this, not a résumé. Evidence beats claims.",
  ],
  previewBtn: "Preview as recruiter",
  backToEditing: "Back to editing",
  previewNote: [
    "This is exactly what a recruiter sees: no edit controls, no vanity metrics.",
    "Exactly the recruiter's view: no edit controls, no vanity metrics.",
  ],
  emptyNote: [
    "Empty profile. Load a sample to see how it looks, then make it yours.",
    "Nothing here yet. Load a sample, then make it your own.",
  ],
  loadSample: "Load sample profile",

  sIdentity: "Identity",
  sSkills: "Skills & evidence",
  sSkillsSub: [
    "Strongest evidence first. Prove a skill to upgrade it.",
    "Best-evidenced first. Prove one to level it up.",
  ],
  sExperience: "Experience",
  sProjects: "Projects",
  sEndorsements: "Endorsements",
  sEndorsementsSub: [
    "No one-tap skills. Each needs a real relationship and specific evidence.",
    "No one-tap endorsements: a real relationship plus specific evidence.",
  ],

  unnamed: "Unnamed candidate",
  phName: "Your name",
  phLocation: "City / Remote",
  phHeadline: "One line on who you are",

  phSkill: "Add a skill (e.g. React)",
  addBtn: "Add",
  noSkillsEdit: ["No skills yet, add a few above.", "Nothing yet, add a few skills above."],
  noSkillsView: ["No skills listed yet. Click Edit to add some.", "No skills yet. Hit Edit to add a few."],
  prove: "Prove",

  noExperience: ["No roles added yet. Click Edit to add your history.", "No history yet. Hit Edit to add roles."],
  addRole: "+ Add role",
  phTitle: "Title",
  phCompany: "Company",
  phYears: "Years",
  phRoleSummary: "One-line summary",
  remove: "Remove",

  noProjects: ["No projects added yet. Click Edit to showcase work.", "No projects yet. Hit Edit to show your work."],
  addProject: "+ Add project",
  phProjectName: "Project name",
  phProjectDesc: "Description",
  phProjectLink: "Link (optional)",

  add: "Add",
  manage: "Manage",
  noEndorsements: ["No endorsements yet. Click Add to request one.", "None yet. Hit Add to request one."],
  skillToEndorse: "Skill to endorse…",
  phEndorser: "Endorser's name",
  phEvidence: "Specific evidence: what did they see you do?",
  addEndorsement: "Add endorsement",
} as const;

export const consentCopy = {
  applyPrefix: "Apply",
  subtitle: ["You control exactly what they see.", "You decide exactly what's shared."],
  share: "Share",
  revokeNote: ["Revoke anytime, they only ever see this snapshot.", "Revoke anytime; they only see this snapshot."],
  preview: "Recruiter preview",
  cancel: "Cancel",
  submit: "Submit application",
} as const;

export const assessmentCopy = {
  titlePrefix: "Assess",
  generating: ["Generating a fair assessment…", "Putting together a fair quiz…"],
  grading: ["Grading your answers…", "Checking your answers…"],
  submit: "Submit answers",
  passedSuffix: "Passed",
  notYetSuffix: "Not yet",
  verifiedNote: [
    "is now assessment-verified on your profile.",
    "is verified by assessment on your profile now.",
  ],
  tryAgain: ["Reskill and try again, you've got this.", "Brush up and retry, you've got this."],
  done: "Done",
} as const;
