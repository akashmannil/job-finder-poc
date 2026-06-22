"use client";

import { useStore } from "@/store/store";

/** Demo affordance: fast-forward the clock to watch SLAs lapse and conduct shift. */
export function TimeControls() {
  const { clockOffset, advanceClock, resetClock, hydrated } = useStore();
  if (!hydrated) return null;

  const days = Math.round(clockOffset / 86_400_000);

  return (
    <div className="hidden items-center gap-1 rounded-xl border border-border bg-surface2 px-2 py-1 text-xs sm:flex">
      <span className="text-muted" title="Simulated clock for demoing SLAs">
        ⏱ {days > 0 ? `+${days}d` : "now"}
      </span>
      <button className="rounded-lg px-1.5 py-0.5 hover:bg-surface" onClick={() => advanceClock(1)}>
        +1d
      </button>
      <button className="rounded-lg px-1.5 py-0.5 hover:bg-surface" onClick={() => advanceClock(3)}>
        +3d
      </button>
      {days > 0 && (
        <button className="rounded-lg px-1.5 py-0.5 text-muted hover:bg-surface" onClick={resetClock}>
          reset
        </button>
      )}
    </div>
  );
}
