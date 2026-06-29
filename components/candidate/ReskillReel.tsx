"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FadeUp } from "@/components/common/Motion";
import { ReskillProgress } from "@/components/candidate/ReskillProgress";
import { reskillPage } from "@/lib/reskill";
import { skillImpact } from "@/lib/skillImpact";
import { reskillCopy as C } from "@/lib/copy/candidate";
import { useVariant } from "@/lib/copy/useVariant";
import { useStore } from "@/store/store";
import type { ReskillItem } from "@/lib/reskill";

const MAX_PAGES = 40; // generous cap - the feed feels endless without unbounded growth

// A reels-style, infinite-scroll reskilling feed: each card advertises a skill the
// candidate is missing (from match gaps, adjacent skills, or market demand) with a
// fun pitch and the courses that close it. Scrolling loads more, forever.
export function ReskillReel() {
  const { matchGaps, profile, updateProfile } = useStore();
  const [pageCount, setPageCount] = useState(2);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const ownedKey = profile.skills.map((s) => s.name.toLowerCase()).sort().join("|");

  const items = useMemo(() => {
    const owned = profile.skills.map((s) => s.name);
    const all: ReskillItem[] = [];
    for (let p = 0; p < pageCount; p++) all.push(...reskillPage(matchGaps, owned, p));
    return all;
    // ownedKey captures profile.skills; matchGaps + pageCount are the other inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchGaps, ownedKey, pageCount]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || items.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPageCount((p) => Math.min(p + 1, MAX_PAGES));
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [items.length]);

  const isReskilling = (skill: string) =>
    profile.skills.some(
      (s) => s.name.toLowerCase() === skill.toLowerCase() && s.currentlyReskilling,
    );

  function toggleReskilling(skill: string) {
    const exists = profile.skills.find((s) => s.name.toLowerCase() === skill.toLowerCase());
    if (exists) {
      updateProfile({
        skills: profile.skills.map((s) =>
          s.name === exists.name ? { ...s, currentlyReskilling: !s.currentlyReskilling } : s,
        ),
      });
    } else {
      updateProfile({
        skills: [
          ...profile.skills,
          { name: skill, evidence: "self_asserted", currentlyReskilling: true },
        ],
      });
    }
  }

  const title = useVariant(C.title);
  const subtitle = useVariant(C.subtitle);
  const emptyTitle = useVariant(C.emptyTitle);
  const emptyBody = useVariant(C.emptyBody);
  const footer = useVariant(C.footer);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="h-display">{title}</h1>
        <p className="mt-1 text-muted">{subtitle}</p>
      </div>

      <ReskillProgress />

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-medium">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted">{emptyBody}</p>
        </div>
      ) : (
        <div className="mx-auto max-w-xl space-y-4">
          {items.map((item) => (
            <FadeUp key={item.key}>
              <ReelCard
                item={item}
                reskilling={isReskilling(item.skill)}
                onToggle={() => toggleReskilling(item.skill)}
              />
            </FadeUp>
          ))}
          <div ref={sentinel} className="h-10" aria-hidden />
          <p className="pb-4 text-center text-xs text-muted">{footer}</p>
        </div>
      )}
    </section>
  );
}

function ReelCard({
  item,
  reskilling,
  onToggle,
}: {
  item: ReskillItem;
  reskilling: boolean;
  onToggle: () => void;
}) {
  const noCourse = useVariant(C.noCourse);
  const onProfileNote = useVariant(C.onProfileNote);
  const impactHeadline = useVariant(C.impactHeadline);
  const impact = skillImpact(item.skill);
  return (
    <article className="card overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 bg-accent-soft px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {item.badge}
        </span>
        {item.severity === "must_have" && <span className="chip !text-danger">must-have</span>}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{item.skill}</h3>
          <p className="mt-1 text-sm text-muted">{item.pitch}</p>
        </div>

        {impact.roles > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {impactHeadline}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <ImpactStat value={`${impact.roles}`} label={C.rolesLabel} />
              <ImpactStat value={`${impact.demandPct}%`} label={C.demandLabel} />
              <ImpactStat value={`$${Math.round(impact.medianPay / 1000)}k`} label={C.payLabel} />
            </div>
            {impact.payPremium >= 1000 && (
              <p className="text-xs font-medium text-success">
                {C.premiumPrefix} ${Math.round(impact.payPremium / 1000)}k {C.premiumSuffix}.
              </p>
            )}
          </div>
        )}

        {item.courses.length > 0 ? (
          <ul className="space-y-1.5">
            {item.courses.map((c) => (
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
          </ul>
        ) : (
          <p className="text-sm text-muted">{noCourse}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onToggle}
            className={reskilling ? "btn-primary text-sm" : "btn-soft text-sm"}
          >
            {reskilling ? `${C.inProgress} ✓` : C.start}
          </button>
          {reskilling && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-accent"
            >
              {onProfileNote}
            </motion.span>
          )}
        </div>
      </div>
    </article>
  );
}

function ImpactStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-surface2 p-2.5 text-center">
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="text-[11px] leading-tight text-muted">{label}</p>
    </div>
  );
}
