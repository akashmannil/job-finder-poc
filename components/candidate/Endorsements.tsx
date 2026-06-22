"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  createEndorsement,
  RELATIONSHIP_WEIGHT,
  validateEndorsement,
} from "@/lib/endorsements";
import { useStore } from "@/store/store";
import type { EndorsementRelationship } from "@/types";

const RELATIONSHIPS = Object.keys(RELATIONSHIP_WEIGHT) as EndorsementRelationship[];

export function Endorsements() {
  const { profile, endorsements, addEndorsement, removeEndorsement } = useStore();
  const [skill, setSkill] = useState("");
  const [endorserName, setEndorserName] = useState("");
  const [relationship, setRelationship] = useState<EndorsementRelationship>("manager");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const input = { skill, endorserName, relationship, evidence };
    const check = validateEndorsement(input);
    if (!check.ok) {
      setError(check.error ?? "Invalid endorsement.");
      return;
    }
    addEndorsement(createEndorsement(input));
    setSkill("");
    setEndorserName("");
    setRelationship("manager");
    setEvidence("");
    setError("");
  }

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="font-semibold">Endorsements</h2>
        <p className="text-sm text-muted">
          No one-tap skills. Each endorsement needs a real relationship and specific evidence.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <select
          className="input"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          aria-label="Skill to endorse"
        >
          <option value="">Skill to endorse…</option>
          {profile.skills.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Endorser's name"
          value={endorserName}
          onChange={(e) => setEndorserName(e.target.value)}
        />
        <select
          className="input"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value as EndorsementRelationship)}
          aria-label="Relationship"
        >
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>
              {RELATIONSHIP_WEIGHT[r].label}
            </option>
          ))}
        </select>
        <textarea
          className="input sm:col-span-2"
          rows={2}
          placeholder="Specific evidence — what did they see you do?"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button className="btn-primary" onClick={submit}>
        Add endorsement
      </button>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {endorsements.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="rounded-xl border border-border bg-surface2 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{e.skill}</span>
                  <span className="chip">{RELATIONSHIP_WEIGHT[e.relationship].label}</span>
                  <span
                    className={`chip ${
                      RELATIONSHIP_WEIGHT[e.relationship].weight === "strong"
                        ? "!text-success"
                        : RELATIONSHIP_WEIGHT[e.relationship].weight === "moderate"
                          ? "!text-accent"
                          : "!text-muted"
                    }`}
                  >
                    {RELATIONSHIP_WEIGHT[e.relationship].weight} weight
                  </span>
                </div>
                <button
                  className="text-muted hover:text-danger"
                  aria-label="Remove endorsement"
                  onClick={() => removeEndorsement(e.id)}
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">
                “{e.evidence}” — {e.endorserName}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
        {endorsements.length === 0 && (
          <li className="text-sm text-muted">No endorsements yet.</li>
        )}
      </ul>
    </section>
  );
}
