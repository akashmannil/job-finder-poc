import { DEFAULT_CONSENT } from "@/lib/consent";
import type { Application, ConsentSnapshot, Profile } from "@/types";

const DAY = 86_400_000;
const now = Date.now();

function snapshot(profile: Profile, endorsements: ConsentSnapshot["endorsements"] = []): ConsentSnapshot {
  return { profile, endorsements, choices: DEFAULT_CONSENT };
}

/**
 * A few applications from other candidates so the recruiter dashboard (rec-1) is
 * populated on first load - including one nearing its SLA, to demo auto-close.
 */
export const SEED_APPLICATIONS: Application[] = [
  {
    id: "app-seed-1",
    jobId: "job-001",
    recruiterId: "rec-1",
    candidateName: "Alex Chen",
    status: "received",
    createdAt: now - 1 * DAY,
    candidateInterested: true,
    recruiterInterested: false,
    own: false,
    consent: snapshot({
      name: "Alex Chen",
      headline: "Frontend engineer, design systems",
      location: "Remote (US)",
      remotePref: "remote",
      skills: [
        { name: "React", evidence: "assessment_passed" },
        { name: "TypeScript", evidence: "portfolio" },
        { name: "Next.js", evidence: "self_asserted" },
        { name: "Accessibility", evidence: "portfolio" },
      ],
      experience: [
        { title: "Frontend Engineer", company: "Vela", years: 4, summary: "Owned the design system." },
      ],
      projects: [],
    }),
  },
  {
    id: "app-seed-2",
    jobId: "job-002",
    recruiterId: "rec-1",
    candidateName: "Jordan Patel",
    status: "reviewing",
    createdAt: now - 4 * DAY,
    respondedAt: now - 3 * DAY,
    candidateInterested: true,
    recruiterInterested: true,
    own: false,
    consent: snapshot(
      {
        name: "Jordan Patel",
        headline: "Full-stack engineer",
        location: "Austin, TX",
        remotePref: "hybrid",
        skills: [
          { name: "TypeScript", evidence: "reference_verified" },
          { name: "Node.js", evidence: "assessment_passed" },
          { name: "React", evidence: "portfolio" },
          { name: "PostgreSQL", evidence: "self_asserted", currentlyReskilling: true },
        ],
        experience: [
          { title: "Software Engineer", company: "Loop", years: 3, summary: "Shipped across the stack." },
        ],
        projects: [],
      },
      [
        {
          id: "end-seed-1",
          skill: "TypeScript",
          endorserName: "Dana M.",
          relationship: "manager",
          evidence: "Led our migration to a strict TypeScript monorepo end to end.",
          createdAt: now - 30 * DAY,
        },
      ],
    ),
  },
  {
    // The candidate user's own application that reached mutual interest - gives the
    // candidate side a live message thread on first load (see lib/seedMessages.ts).
    id: "app-seed-own",
    jobId: "job-002",
    recruiterId: "rec-1",
    candidateName: "You",
    status: "reviewing",
    createdAt: now - 2 * DAY,
    respondedAt: now - 1 * DAY,
    candidateInterested: true,
    recruiterInterested: true,
    own: true,
    consent: snapshot({
      name: "You",
      headline: "Frontend engineer",
      location: "Remote",
      remotePref: "remote",
      skills: [
        { name: "React", evidence: "portfolio" },
        { name: "TypeScript", evidence: "self_asserted" },
      ],
      experience: [],
      projects: [],
    }),
  },
  {
    id: "app-seed-3",
    jobId: "job-003",
    recruiterId: "rec-1",
    candidateName: "Sam Lee",
    status: "received",
    createdAt: now - 6 * DAY,
    candidateInterested: true,
    recruiterInterested: false,
    own: false,
    consent: snapshot({
      name: "Sam Lee",
      headline: "Backend engineer, distributed systems",
      location: "Remote (US)",
      remotePref: "remote",
      skills: [
        { name: "Go", evidence: "portfolio" },
        { name: "System Design", evidence: "self_asserted" },
        { name: "Kubernetes", evidence: "self_asserted" },
      ],
      experience: [
        { title: "Backend Engineer", company: "Mesh", years: 5, summary: "Built low-latency services." },
      ],
      projects: [],
    }),
  },
];
