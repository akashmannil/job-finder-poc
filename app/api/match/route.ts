import { NextResponse } from "next/server";
import { matchProfileToJobs } from "@/lib/matcher";
import type { Profile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let profile: Profile;
  try {
    const body = (await req.json()) as { profile?: Profile };
    if (!body.profile) throw new Error("missing profile");
    profile = body.profile;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!profile.skills || profile.skills.length === 0) {
    return NextResponse.json(
      { error: "Add at least one skill to your profile before matching." },
      { status: 400 },
    );
  }

  try {
    const results = matchProfileToJobs(profile);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Matching failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
