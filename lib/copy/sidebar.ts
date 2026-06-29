// ─────────────────────────────────────────────────────────────────────────────
// Copy for the workspace shell's side rails: the vertical nav lives in
// WorkspaceShell; the right-hand context cards (CandidateRail / RecruiterRail)
// summarize current state and offer one-tap jumps into the relevant tab.
// Arrays are variant headings picked per mount (via useVariant); single strings
// are stable labels/CTAs. Edit text here, not in the components.
// ─────────────────────────────────────────────────────────────────────────────

export const railCopy = {
  // ---- candidate context rail ----
  youHeading: ["You", "Your profile", "At a glance"],
  engagementLabel: "Engagement",
  viewProfile: "View profile",
  noProfile: "No profile yet - build one to start matching.",
  buildProfile: "Build profile",
  demandHeading: ["In demand now", "Hot skills", "What the market wants"],
  openReskill: "Open reskilling",
  trackingHeading: ["Tracking", "Your activity", "Keeping tabs"],
  applicationsLabel: "Applications",
  savedLabel: "Saved",

  // ---- recruiter context rail ----
  standingHeading: ["Your standing", "Where you stand", "Your team"],
  responseLabel: "Response score",
  postingsLabel: "open postings",
  viewStanding: "View standing",
  owedHeading: ["Decisions owed", "Awaiting you", "On your desk"],
  overdueLabel: "overdue",
  review: "Review now",
  pulseHeading: ["Market pulse", "Skills in demand", "Talent signals"],
  openMarket: "Open market",
} as const;
