"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerList } from "@/components/common/Motion";
import { recommendCourses } from "@/lib/reskill";
import { useStore } from "@/store/store";

export function ReskillPanel() {
  const { matchGaps, profile, updateProfile } = useStore();

  if (matchGaps.length === 0) {
    return (
      <section className="card p-5">
        <h2 className="font-semibold">Reskilling</h2>
        <p className="mt-1 text-sm text-muted">
          Run a match to see which skills to grow — and the courses that close each gap.
        </p>
      </section>
    );
  }

  const suggestions = recommendCourses(matchGaps);

  const isReskilling = (skill: string) =>
    profile.skills.some(
      (s) => s.name.toLowerCase() === skill.toLowerCase() && s.currentlyReskilling,
    );

  function toggleReskilling(skill: string) {
    const exists = profile.skills.find(
      (s) => s.name.toLowerCase() === skill.toLowerCase(),
    );
    if (exists) {
      updateProfile({
        skills: profile.skills.map((s) =>
          s.name === exists.name ? { ...s, currentlyReskilling: !s.currentlyReskilling } : s,
        ),
      });
    } else {
      updateProfile({
        skills: [...profile.skills, { name: skill, evidence: "self_asserted", currentlyReskilling: true }],
      });
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Reskilling</h2>
        <p className="text-sm text-muted">
          Close your gaps. Marking a skill <em>in progress</em> shows recruiters you’re actively
          growing — a signal a résumé can’t carry.
        </p>
      </div>

      <StaggerList className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((s) => {
          const reskilling = isReskilling(s.skill);
          return (
            <FadeUp key={s.skill}>
              <div className="card h-full space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.skill}</span>
                    <span
                      className={`chip ${
                        s.severity === "must_have" ? "!text-danger" : "!text-warning"
                      }`}
                    >
                      {s.severity === "must_have" ? "must-have" : "nice-to-have"}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleReskilling(s.skill)}
                    className={reskilling ? "btn-primary text-xs" : "btn-ghost text-xs"}
                  >
                    {reskilling ? "Reskilling ✓" : "Mark in progress"}
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {s.courses.map((c) => (
                    <li key={c.id} className="text-sm">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {c.title}
                      </a>
                      <span className="text-muted">
                        {" "}
                        · {c.provider} · {c.hours}h · {c.level}
                      </span>
                    </li>
                  ))}
                  {s.courses.length === 0 && (
                    <li className="text-sm text-muted">No course on file for this skill yet.</li>
                  )}
                </ul>

                {reskilling && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-accent"
                  >
                    Shown on your profile as “currently reskilling”.
                  </motion.p>
                )}
              </div>
            </FadeUp>
          );
        })}
      </StaggerList>
    </section>
  );
}
