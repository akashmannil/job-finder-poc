import Anthropic from "@anthropic-ai/sdk";
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
      const assessment = await generateAssessment(body.skill);
      return NextResponse.json({ assessment });
    }
    if (body.action === "grade") {
      const result = await gradeAssessment(body.skill, body.items ?? []);
      return NextResponse.json({ result });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error: ${err.message}` },
        { status: err.status ?? 502 },
      );
    }
    const message = err instanceof Error ? err.message : "Assessment failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
