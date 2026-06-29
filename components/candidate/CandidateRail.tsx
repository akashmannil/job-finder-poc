"use client";

import { candidateConduct } from "@/lib/conductScore";
import { topSkillsInDemand } from "@/lib/likes";
import { railCopy as R } from "@/lib/copy/sidebar";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { TopView } from "@/app/page";

// The candidate's right-hand context rail (xl+). Three compact, glanceable cards
// that each jump into the relevant tab: who you are, what the market wants, and what
// you're tracking. No vanity metrics - the only number on a person is the conduct
// score (engagement), the same one shown on the profile.
export function CandidateRail({ onNavigate }: { onNavigate: (v: TopView) => void }) {
  const { profile, applications, likedJobs } = useStore();
  const youHeading = useVariant(R.youHeading);
  const demandHeading = useVariant(R.demandHeading);
  const trackingHeading = useVariant(R.trackingHeading);

  const own = applications.filter((a) => a.own);
  const conduct = candidateConduct(own);
  const hotSkills = topSkillsInDemand(6);
  const hasProfile = profile.name.trim().length > 0;
  const initials = hasProfile
    ? profile.name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
      {/* You */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{youHeading}</h3>
        {hasProfile ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{profile.name}</p>
                {profile.headline && (
                  <p className="truncate text-xs text-muted">{profile.headline}</p>
                )}
              </div>
            </div>
            {conduct.score !== null && (
              <p className="mt-3 text-xs text-muted">
                {R.engagementLabel}{" "}
                <span className="font-semibold text-fg">{conduct.score}/100</span>
              </p>
            )}
            <button className="btn-soft mt-3 w-full text-sm" onClick={() => onNavigate("profile")}>
              {R.viewProfile}
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">{R.noProfile}</p>
            <button className="btn-soft mt-3 w-full text-sm" onClick={() => onNavigate("profile")}>
              {R.buildProfile}
            </button>
          </>
        )}
      </section>

      {/* In demand now */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{demandHeading}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotSkills.map((s) => (
            <button
              key={s.skill}
              onClick={() => onNavigate("reskill")}
              className="chip transition-colors hover:!border-accent hover:!text-accent"
            >
              {s.skill}
            </button>
          ))}
        </div>
        <button
          className="mt-3 text-xs font-medium text-accent hover:underline"
          onClick={() => onNavigate("reskill")}
        >
          {R.openReskill} →
        </button>
      </section>

      {/* Tracking */}
      <section className="card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {trackingHeading}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <RailStat value={own.length} label={R.applicationsLabel} onClick={() => onNavigate("applications")} />
          <RailStat value={likedJobs.length} label={R.savedLabel} onClick={() => onNavigate("discover")} />
        </div>
      </section>
    </>
  );
}

function RailStat({
  value,
  label,
  onClick,
}: {
  value: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-surface2 p-3 text-left transition-colors hover:bg-accent-soft"
    >
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </button>
  );
}
