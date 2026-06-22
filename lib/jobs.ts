import jobsData from "@/data/jobs.json";
import type { Job, Recruiter } from "@/types";

// jobs.json is the seed dataset; assert its shape once here.
export const JOBS = jobsData as Job[];

/** The recruiters who own the seed postings (the recruiter side acts as one of these). */
export const RECRUITERS: Recruiter[] = [
  { id: "rec-1", name: "Dana Okafor", company: "Northwind Labs" },
  { id: "rec-2", name: "Sam Rivera", company: "Brightwave" },
  { id: "rec-3", name: "Priya Nair", company: "Cobalt Systems" },
  { id: "rec-4", name: "Marco Bianchi", company: "Lumen Health" },
];

/** The recruiter whose dashboard the recruiter view shows in this POC. */
export const ACTIVE_RECRUITER_ID = "rec-1";

export function getJobs(): Job[] {
  return JOBS;
}

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}

export function getRecruiter(id: string): Recruiter | undefined {
  return RECRUITERS.find((r) => r.id === id);
}

export function getRecruiterJobs(recruiterId: string): Job[] {
  return JOBS.filter((j) => j.recruiterId === recruiterId);
}
