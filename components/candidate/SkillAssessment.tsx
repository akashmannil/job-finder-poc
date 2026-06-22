"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { AnsweredItem, Assessment, GradeResult } from "@/types";

type Phase = "loading" | "taking" | "grading" | "done" | "error";

export function SkillAssessment({
  skill,
  onClose,
  onPassed,
}: {
  skill: string;
  onClose: () => void;
  onPassed: (skill: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/assess", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "generate", skill }),
        });
        const data = (await res.json()) as { assessment?: Assessment; error?: string };
        if (!res.ok || !data.assessment) throw new Error(data.error ?? "Could not load assessment.");
        if (active) {
          setAssessment(data.assessment);
          setPhase("taking");
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : "Failed.");
          setPhase("error");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [skill]);

  const allAnswered =
    assessment !== null && assessment.questions.every((q) => answers[q.id] !== undefined);

  async function submit() {
    if (!assessment) return;
    setPhase("grading");
    try {
      const items: AnsweredItem[] = assessment.questions.map((q) => ({
        question: q.question,
        options: q.options,
        selected: answers[q.id],
      }));
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "grade", skill, items }),
      });
      const data = (await res.json()) as { result?: GradeResult; error?: string };
      if (!res.ok || !data.result) throw new Error(data.error ?? "Grading failed.");
      setResult(data.result);
      setPhase("done");
      if (data.result.passed) onPassed(skill);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
      setPhase("error");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="card max-h-[85vh] w-full max-w-lg overflow-auto p-6"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Assess: {skill}</h3>
            <button className="text-muted hover:text-fg" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>

          {phase === "loading" && <p className="text-sm text-muted">Generating a fair assessment…</p>}
          {phase === "grading" && <p className="text-sm text-muted">Grading your answers…</p>}
          {phase === "error" && <p className="text-sm text-danger">{error}</p>}

          {phase === "taking" && assessment && (
            <div className="space-y-5">
              {assessment.questions.map((q, qi) => (
                <fieldset key={q.id} className="space-y-2">
                  <legend className="text-sm font-medium">
                    {qi + 1}. {q.question}
                  </legend>
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                        answers[q.id] === opt
                          ? "border-accent bg-accent-soft"
                          : "border-border hover:bg-surface2"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      />
                      {opt}
                    </label>
                  ))}
                </fieldset>
              ))}
              <button className="btn-primary w-full" disabled={!allAnswered} onClick={submit}>
                Submit answers
              </button>
            </div>
          )}

          {phase === "done" && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3 text-center"
            >
              <div className="text-4xl">{result.passed ? "🎉" : "💪"}</div>
              <p className="text-2xl font-bold" style={{ color: result.passed ? "var(--success)" : "var(--danger)" }}>
                {result.score}/100 {result.passed ? "— Passed" : "— Not yet"}
              </p>
              <p className="text-sm text-muted">{result.rationale}</p>
              {result.passed ? (
                <p className="text-sm text-success">
                  “{skill}” is now <strong>assessment-verified</strong> on your profile.
                </p>
              ) : (
                <p className="text-sm text-muted">Reskill and try again — you’ve got this.</p>
              )}
              <button className="btn-primary w-full" onClick={onClose}>
                Done
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
