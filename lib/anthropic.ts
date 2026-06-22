import Anthropic from "@anthropic-ai/sdk";

// Server-only. The key is read from the environment and never shipped to the client.
export const MODEL = "claude-opus-4-8";

let client: Anthropic | null = null;

/** Lazily construct the client; throw a clear error if the key is missing. */
export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key.",
    );
  }
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

/**
 * Structured-output request shape. We type it locally and cast at the call site
 * because `output_config` and per-block `cache_control` may be ahead of the
 * installed SDK's static types; the SDK still forwards them on the wire.
 */
export interface StructuredRequest {
  model: string;
  max_tokens: number;
  system: string;
  messages: {
    role: "user";
    content: {
      type: "text";
      text: string;
      cache_control?: { type: "ephemeral" };
    }[];
  }[];
  output_config: { format: { type: "json_schema"; schema: object } };
}

/**
 * Call Claude with a JSON-schema-constrained response and return the parsed JSON.
 * Throws on a refusal or if no text block is returned.
 */
export async function callStructured<T>(req: StructuredRequest): Promise<T> {
  const res = (await getAnthropic().messages.create(
    req as unknown as Anthropic.MessageCreateParams,
  )) as Anthropic.Message;

  // `refusal` may be newer than the installed SDK's stop_reason union.
  if ((res.stop_reason as string) === "refusal") {
    throw new Error("The model declined to respond to this request.");
  }
  const text = res.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  )?.text;
  if (!text) throw new Error("The model returned no text content.");

  return JSON.parse(text) as T;
}
