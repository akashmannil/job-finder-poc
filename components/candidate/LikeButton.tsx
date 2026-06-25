"use client";

import { motion } from "framer-motion";
import { likeCount } from "@/lib/likes";
import { useStore } from "@/store/store";
import type { Job } from "@/types";

// A like on a *posting* — a market-demand signal, not a profile vanity metric.
export function LikeButton({ job, size = "md" }: { job: Job; size?: "sm" | "md" }) {
  const { likedJobs, toggleLike } = useStore();
  const liked = likedJobs.includes(job.id);
  const count = likeCount(job, liked);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLike(job.id);
      }}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this role" : "Like this role"}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border transition-colors ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${liked ? "bg-accent-soft text-accent" : "bg-surface text-muted hover:text-fg"}`}
    >
      <motion.span
        key={String(liked)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        aria-hidden
      >
        {liked ? "♥" : "♡"}
      </motion.span>
      <span className="tabular-nums font-medium">{count.toLocaleString()}</span>
    </button>
  );
}
