import { NextResponse } from "next/server";
import { generateAssessment, gradeAssessment } from "@/lib/assessor";
import type { AnsweredItem } from "@/types";

export const runtime = "nodejs";

type Body =
  | { action: "generate"; skill: string }
  | { action: "grade"; skill: string; items: AnsweredItem[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
    if (!body.skill) throw new Error("missing skill");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    if (body.action === "generate") {
      return NextResponse.json({ assessment: generateAssessment(body.skill) });
    }
    if (body.action === "grade") {
      return NextResponse.json({ result: gradeAssessment(body.skill, body.items ?? []) });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Assessment failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
