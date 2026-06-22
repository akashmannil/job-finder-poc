"use client";

import { FadeUp, StaggerList } from "@/components/common/Motion";

const PILLARS = [
  {
    title: "Verified profile, not résumé",
    body: "Trust shifts from gameable marketing copy to evidence-tiered skills the matcher can weight honestly.",
  },
  {
    title: "Accountable hiring",
    body: "Every application has a response SLA and a public conduct score — ghosting has a cost.",
  },
  {
    title: "Proof over reach",
    body: "No likes, no followers, no impressions. Reputation comes from verifiable proof, not performance.",
  },
];

export default function Home() {
  return (
    <StaggerList className="space-y-10">
      <FadeUp className="space-y-4 pt-6 text-center">
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Hiring that runs on <span className="text-accent">proof</span>, not performance.
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-muted">
          A two-sided platform that fixes ghosting, unfit matching, and the gaslit feed — built
          feature by feature, documented commit by commit.
        </p>
      </FadeUp>

      <StaggerList className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <FadeUp key={p.title}>
            <div className="card h-full p-5">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          </FadeUp>
        ))}
      </StaggerList>

      <FadeUp className="text-center text-sm text-muted">
        Scaffold ready. Try the theme picker in the header ↗
      </FadeUp>
    </StaggerList>
  );
}
