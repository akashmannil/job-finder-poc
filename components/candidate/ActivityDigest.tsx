"use client";

import { FadeUp } from "@/components/common/Motion";
import { activityDigest } from "@/lib/activity";
import { useStore } from "@/store/store";

// A calm recap of what actually changed since the last visit. No counts of views
// or "people are looking at you" bait — it renders nothing unless a real decision
// landed on one of your applications.
export function ActivityDigest() {
  const { applications, previousSeenAt } = useStore();
  const items = activityDigest(applications, previousSeenAt);

  if (items.length === 0) return null;

  return (
    <FadeUp>
      <section className="card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          While you were away
        </h2>
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-sm">
              <span
                aria-hidden
                className={
                  it.tone === "positive"
                    ? "text-success"
                    : it.tone === "negative"
                      ? "text-danger"
                      : "text-accent"
                }
              >
                •
              </span>
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </FadeUp>
  );
}
