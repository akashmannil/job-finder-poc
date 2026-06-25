"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FadeUp } from "@/components/common/Motion";
import { reskillPage } from "@/lib/reskill";
import { useStore } from "@/store/store";
import type { ReskillItem } from "@/lib/reskill";

const MAX_PAGES = 40; // generous cap — the feed feels endless without unbounded growth

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

  return (
    <section className="space-y-4">
      <div>
        <h1 className="h-display">Reskilling</h1>
        <p className="mt-1 text-muted">
          An endless feed of skills worth growing into — pulled from your gaps and what the market
          wants. Marking one <em>in progress</em> shows recruiters you’re actively leveling up.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-medium">You’re remarkably well-rounded</p>
          <p className="mt-1 text-sm text-muted">
            No obvious gaps right now. Run a match from <span className="text-fg">Matches</span> to
            surface role-specific skills to grow.
          </p>
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
          <p className="pb-4 text-center text-xs text-muted">Keep scrolling — there’s always more to learn.</p>
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
          <p className="text-sm text-muted">
            No course on file yet — mark it in progress to flag your intent to grow.
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onToggle}
            className={reskilling ? "btn-primary text-sm" : "btn-soft text-sm"}
          >
            {reskilling ? "Reskilling ✓" : "Start reskilling"}
          </button>
          {reskilling && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-accent"
            >
              Shown on your profile as “currently reskilling”.
            </motion.span>
          )}
        </div>
      </div>
    </article>
  );
}
