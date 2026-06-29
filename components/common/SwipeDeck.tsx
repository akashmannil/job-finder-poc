"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// A reusable Tinder-style swipe deck. The top card is draggable horizontally:
// fling/drag right to take the positive action, left to dismiss. Also driven by
// the ← → keys and the tap buttons, so it works on desktop and for keyboard users.
// Presentation only - callers own what a swipe *means* via onSwipe.
// ─────────────────────────────────────────────────────────────────────────────

export interface SwipeMeta {
  label: string;
  /** A CSS color (e.g. "var(--success)") used for the overlay stamp + action button. */
  color: string;
  /** Glyph shown on the action button. */
  glyph: string;
}

type Direction = "left" | "right";

interface SwipeDeckProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, active: boolean) => React.ReactNode;
  onSwipe: (item: T, dir: Direction) => void;
  right: SwipeMeta;
  left: SwipeMeta;
  /** Shown when there is nothing to swipe at all. */
  empty?: React.ReactNode;
  /** Shown once every card has been swiped. */
  done?: React.ReactNode;
}

export function SwipeDeck<T>({
  items,
  getKey,
  renderCard,
  onSwipe,
  right,
  left,
  empty,
  done,
}: SwipeDeckProps<T>) {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-14, 14]);
  const rightOpacity = useTransform(x, [40, 140], [0, 1]);
  const leftOpacity = useTransform(x, [-140, -40], [1, 0]);

  const current = items[index];

  const commit = useCallback(
    (dir: Direction) => {
      if (!current) return;
      const w = typeof window !== "undefined" ? window.innerWidth : 800;
      animate(x, dir === "right" ? w : -w, {
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          onSwipe(current, dir);
          setIndex((i) => i + 1);
          x.set(0);
        },
      });
    },
    [current, onSwipe, x],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!current) return;
      if (e.key === "ArrowRight") commit("right");
      else if (e.key === "ArrowLeft") commit("left");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commit, current]);

  if (items.length === 0) return <>{empty}</>;
  if (!current) return <>{done}</>;

  const next = items[index + 1];

  return (
    <div className="space-y-5">
      <div className="relative mx-auto h-[clamp(440px,64vh,580px)] w-full max-w-md select-none">
        {next && (
          <div
            key={getKey(next)}
            aria-hidden
            className="absolute inset-0 scale-[0.94] opacity-60"
            style={{ transformOrigin: "center bottom" }}
          >
            <div className="h-full">{renderCard(next, false)}</div>
          </div>
        )}

        <motion.div
          key={getKey(current)}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (info.offset.x > 120 || info.velocity.x > 600) commit("right");
            else if (info.offset.x < -120 || info.velocity.x < -600) commit("left");
            else animate(x, 0, { type: "spring", stiffness: 400, damping: 32 });
          }}
        >
          <motion.div
            style={{ opacity: rightOpacity, borderColor: right.color, color: right.color }}
            className="pointer-events-none absolute left-5 top-5 z-10 -rotate-12 rounded-xl border-[3px] px-3 py-1 text-2xl font-extrabold uppercase tracking-wider"
          >
            {right.label}
          </motion.div>
          <motion.div
            style={{ opacity: leftOpacity, borderColor: left.color, color: left.color }}
            className="pointer-events-none absolute right-5 top-5 z-10 rotate-12 rounded-xl border-[3px] px-3 py-1 text-2xl font-extrabold uppercase tracking-wider"
          >
            {left.label}
          </motion.div>
          <div className="h-full">{renderCard(current, true)}</div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => commit("left")}
          aria-label={left.label}
          className="grid h-14 w-14 place-items-center rounded-full border border-border bg-surface text-2xl shadow-card transition-transform hover:scale-110 active:scale-95"
          style={{ color: left.color }}
        >
          {left.glyph}
        </button>
        <span className="min-w-[3.5rem] text-center text-xs font-medium text-muted">
          {index + 1} / {items.length}
        </span>
        <button
          onClick={() => commit("right")}
          aria-label={right.label}
          className="grid h-14 w-14 place-items-center rounded-full text-2xl text-accent-contrast shadow-card transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: right.color }}
        >
          {right.glyph}
        </button>
      </div>
      <p className="text-center text-xs text-muted">
        Drag the card, use ← → keys, or tap the buttons.
      </p>
    </div>
  );
}
