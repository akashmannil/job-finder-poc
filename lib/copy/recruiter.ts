// Recruiter-side UI copy. Variant arrays are picked at random per mount; single
// strings are atomic labels kept stable. Edit text here, not in the components.

export const marketCopy = {
  title: ["The market, right now", "Today in the market", "Where the market sits"],
  subtitlePrefix: "Where", // "Where {company}'s roles stand, ..."
  subtitleTail: [
    "roles stand, what candidates are drawn to, and what your competition is offering.",
    "roles rank, what's drawing candidates, and what rivals are putting on the table.",
  ],
  standing: ["Your standing", "How you stack up", "Where you rank"],
  drawnTo: ["What candidates are drawn to", "Pulling candidate interest", "Catching candidates' eyes"],
  competition: ["Your competition", "Who you're up against", "Rival postings"],
  yours: "Yours",
  openPostings: "open postings",
  avgPay: "avg top pay",
  avgInterest: "avg interest / role",
  ofMarket: (n: number) => `of ${n} in market`,
  rankNote: [
    "Your strongest posting ranks",
    "Your top posting sits at",
  ],
  rankNoteTail: ["on overall appeal (pay, interest, remote).", "for overall appeal (pay, interest, remote)."],
} as const;

export const talentCopy = {
  title: ["Talent", "Find talent", "Your talent pool"],
  subtitle: [
    "Candidates who fit your roles, ranked on verified evidence. Inviting signals interest; they still choose to apply.",
    "People who fit your roles, ranked on real evidence. An invite signals interest; they decide whether to apply.",
  ],
  invite: "Invite to apply",
  invited: "Invited",
  inviteNote: [
    "They'll see your interest and choose whether to apply; contact unlocks only if they do.",
    "They see your interest and decide whether to apply; contact opens only if they do.",
  ],
  gaps: "Gaps:",
  development: ["Talent development", "Grow the pipeline", "Skills to sponsor"],
  developmentSub: [
    "Where your required skills are scarce in the market: training you could sponsor to grow the candidates you need.",
    "The required skills in short supply, with training you could sponsor to build them.",
  ],
  inPool: (n: number) => `${n} in pool`,
  noPostings: ["No postings to source for yet.", "Add a posting to start sourcing."],
  noCourse: ["No course on file for this skill yet.", "No course listed for this skill yet."],
} as const;

export const standingCopy = {
  hiringTeam: "Hiring team",
  responseScore: ["Public response score", "Your response score"],
  vanityNote: [
    "No followers, ratings, or vanity metrics: a recruiter's reputation here is how they treat applicants. Decide, and decide on time.",
    "No followers or ratings here. Reputation is how you treat applicants: decide, and decide on time.",
  ],
  openPostings: "open postings",
  applicants: "applicants",
  medianResponse: "median response",
  overdue: "overdue",
  needsDecision: ["Needs your decision", "Waiting on you", "Decisions you owe"],
  review: "Review in Postings",
  allCaught: [
    "You're all caught up. Nothing is waiting on you, which is exactly how the response score stays high.",
    "Nothing waiting on you right now. That's how the score stays high.",
  ],
} as const;

export const dashboardCopy = {
  dashboard: ["Hiring dashboard", "Your hiring desk", "Applicant review"],
  dashboardTail: ["Answer on the clock; your response score is public.", "Decide on time; your response score is public."],
  responseScore: "Your response score",
  noApplicants: [
    "No applicants yet. Switch to the Candidate role, apply to a role at",
    "Nothing in the queue yet. Switch to Candidate, apply to a role at",
  ],
  noApplicantsTail: "then come back.",
  applicants: ["Applicants", "Your applicants", "In the queue"],
  list: "List",
  reviewReel: "Review reel",
} as const;
