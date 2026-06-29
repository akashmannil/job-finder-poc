// ─────────────────────────────────────────────────────────────────────────────
// Candidate-side UI copy. Arrays are variant phrasings picked at random per mount
// (via useVariant); single strings are atomic labels/CTAs kept stable on purpose
// (randomizing a button verb hurts usability). Edit text here, not in components.
// ─────────────────────────────────────────────────────────────────────────────

export const discoverCopy = {
  title: [
    "The market, right now",
    "Today in the market",
    "What's moving right now",
  ],
  subtitle: [
    "Live highlights from open roles: the offers and skills drawing the most interest today.",
    "A quick read on where demand is pooling across open roles today.",
    "The roles and skills pulling the most attention this week.",
  ],
  offerKicker: ["Offer of the moment", "Today's standout", "Pick of the day"],
  heroTag: ["Top-rated opening", "High-interest role", "Drawing a crowd"],
  trendingHeading: ["Trending roles", "Getting attention", "Popular right now"],
  reskillTeaserKicker: ["Stay in demand", "Keep your edge", "Grow on purpose"],
  reskillTeaserTitle: [
    "Skills the market wants that you don't have yet",
    "What you're missing for the roles you want",
    "The fastest skills to raise your fit",
  ],
  reskillTeaserTail: ["and more. Open a personalized reskilling feed.", "and more, in a feed built around you."],
  applyNow: "Apply now",
  applied: "Applied",
  apply: "Apply",
} as const;

export const matchesCopy = {
  title: ["Matches", "Your matches", "Roles that fit"],
  subtitle: [
    "Ranked by honest fit. Verified evidence and must-haves carry the most weight.",
    "Sorted by real fit, with verified evidence weighted over claims.",
    "Best fit first, judged on evidence rather than keywords.",
  ],
  needSkill: [
    "Add at least one skill to your profile to match.",
    "Add a skill or two to your profile and we can match you.",
  ],
  none: ["No matches returned.", "Nothing came back this time."],
  find: "Find matches",
  rerun: "Re-run match",
  matching: "Matching",
  whyItFits: ["Why it fits", "What lines up", "Where you match"],
  skillGaps: ["Skill gaps", "What's missing", "Gaps to close"],
  noneMet: ["No requirements clearly met.", "Nothing clearly lined up here."],
  noGaps: ["No gaps, strong fit.", "Nothing missing here.", "Clean match, no gaps."],
  topMatch: ["Top match", "Best fit", "Strongest match"],
  applied: "Applied",
  apply: "Apply",
} as const;

export const matchReelCopy = {
  apply: "Apply",
  skip: "Skip",
  caughtUpTitle: ["You're all caught up", "That's everyone for now", "Nothing left to review"],
  caughtUpBody: [
    "Switch to the list view to revisit any role, or run the match again.",
    "Flip back to the list to revisit a role, or re-run the match.",
  ],
  empty: ["No matches to swipe through yet.", "Nothing to swipe just yet."],
} as const;

export const reskillCopy = {
  title: ["Reskilling", "Level up", "Grow your skills"],
  subtitle: [
    "An endless feed of skills worth growing into, pulled from your gaps and what the market wants. Marking one in progress shows recruiters you're actively leveling up.",
    "Skills worth picking up next, drawn from your gaps and live demand. Flag one in progress to show recruiters you're growing.",
  ],
  emptyTitle: ["You're remarkably well-rounded", "Hard to find a gap here", "You've got broad coverage"],
  emptyBody: [
    "No obvious gaps right now. Run a match from Matches to surface role-specific skills to grow.",
    "Nothing obvious to add yet. Run a match to surface role-specific skills.",
  ],
  footer: [
    "Keep scrolling, there's always more to learn.",
    "More below, there's always somewhere to grow.",
  ],
  start: "Start reskilling",
  inProgress: "Reskilling",
  onProfileNote: [
    "Shown on your profile as currently reskilling.",
    "Now visible on your profile as in progress.",
  ],
  noCourse: [
    "No course on file yet. Mark it in progress to flag your intent to grow.",
    "No course listed yet. Flag it in progress to show you're on it.",
  ],
  impactHeadline: ["What it unlocks", "Why it pays off", "What you'd gain"],
  rolesLabel: "roles want it",
  demandLabel: "of postings",
  payLabel: "roles pay (median)",
  premiumPrefix: "Pays about",
  premiumSuffix: "above the market median",
} as const;

export const reskillProgressCopy = {
  heading: ["Your progress", "Where you stand", "Your growth"],
  skillsLabel: "skills on profile",
  verifiedLabel: "verified by evidence",
  growingLabel: "currently growing",
  inProgress: ["In progress:", "Growing now:", "You're on:"],
} as const;

export const savedRolesCopy = {
  heading: ["Saved roles", "Your shortlist", "Bookmarked roles"],
  applied: "Applied",
  apply: "Apply",
} as const;

export const activityCopy = {
  heading: ["While you were away", "Since your last visit", "Caught up for you"],
} as const;

export const applicationsCopy = {
  title: ["Your applications", "Applications", "Where things stand"],
  subtitle: [
    "Live status, so you're never left guessing. Recruiters answer on the clock.",
    "Real-time status on every application. Recruiters are on the clock.",
  ],
  emptyTitle: ["No applications yet", "Nothing here yet", "No applications so far"],
  emptyBody: [
    "Head to Matches and apply to a role. It will show up here with a live SLA countdown.",
    "Apply to a role from Matches and it lands here with a live response timer.",
  ],
} as const;
