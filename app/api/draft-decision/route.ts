import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { draftDecision, type ReasonCode } from "@/lib/decision";
import type { Application } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { application?: Application; reasonCode?: ReasonCode };
  try {
    body = (await req.json()) as { application?: Application; reasonCode?: ReasonCode };
    if (!body.application || !body.reasonCode) throw new Error("missing fields");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const draft = await draftDecision(body.application, body.reasonCode);
    return NextResponse.json({ draft });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error: ${err.message}` },
        { status: err.status ?? 502 },
      );
    }
    const message = err instanceof Error ? err.message : "Drafting failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
