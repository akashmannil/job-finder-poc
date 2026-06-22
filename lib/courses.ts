import coursesData from "@/data/courses.json";
import type { Course } from "@/types";

export const COURSES = coursesData as Course[];

export function getCourses(): Course[] {
  return COURSES;
}

/** Courses that teach a given skill (case-insensitive). */
export function coursesForSkill(skill: string): Course[] {
  const s = skill.toLowerCase();
  return COURSES.filter((c) => c.skill.toLowerCase() === s);
}
