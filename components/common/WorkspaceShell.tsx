"use client";

import type { ReactNode } from "react";
import { motion } from "@/components/common/Motion";

export interface ShellTab<V extends string> {
  id: V;
  label: string;
  badge?: number;
}

// The shared layout for both workspaces. It reclaims the wide side gutters: the tab
// menu becomes a sticky vertical rail on lg+ (a horizontal segmented control below
// that), and an optional context rail sits on the right at xl+. Below xl the right
// rail is hidden and the layout collapses back to a single readable column, so the
// extra chrome only appears when there is genuinely room for it.
export function WorkspaceShell<V extends string>({
  tabs,
  view,
  onSelect,
  pillId,
  aside,
  children,
}: {
  tabs: ShellTab<V>[];
  view: V;
  onSelect: (v: V) => void;
  pillId: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="lg:grid lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[200px_minmax(0,1fr)_300px]">
      {/* Navigation: segmented control on small screens, sticky vertical rail on lg+ */}
      <nav className="flex gap-1 overflow-x-auto rounded-[11px] bg-surface2 p-1 lg:sticky lg:top-20 lg:h-max lg:flex-col lg:gap-0.5 lg:overflow-visible lg:rounded-2xl lg:bg-transparent lg:p-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-colors lg:w-full lg:justify-start lg:rounded-xl lg:px-3 lg:py-2 lg:text-sm ${
              view === t.id ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {view === t.id && (
              <motion.span
                layoutId={pillId}
                className="absolute inset-0 -z-10 rounded-[8px] bg-surface shadow-sm lg:rounded-xl"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {t.label}
            {t.badge ? (
              <span className="rounded-full bg-accent-soft px-1.5 text-[11px] font-semibold text-accent lg:ml-auto">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      {/* Active view */}
      <div className="mt-6 min-w-0 lg:mt-0">{children}</div>

      {/* Context rail - only where there is space for it */}
      {aside ? (
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-4">{aside}</div>
        </aside>
      ) : null}
    </div>
  );
}
