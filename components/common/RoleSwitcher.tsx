"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import type { Role } from "@/types";

const ROLES: { id: Role; label: string }[] = [
  { id: "candidate", label: "Candidate" },
  { id: "recruiter", label: "Recruiter" },
];

export function RoleSwitcher() {
  const { role, setRole } = useStore();

  return (
    <div
      role="tablist"
      aria-label="Switch role"
      className="relative inline-flex rounded-[11px] bg-surface2 p-1"
    >
      {ROLES.map((r) => {
        const active = role === r.id;
        return (
          <button
            key={r.id}
            role="tab"
            aria-selected={active}
            onClick={() => setRole(r.id)}
            className={`relative z-10 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              active ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId="role-pill"
                className="absolute inset-0 -z-10 rounded-[8px] bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
