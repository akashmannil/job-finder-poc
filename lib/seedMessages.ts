import type { Message } from "@/types";

// Seed conversations so both sides have a populated Messages tab on first load.
// Both threads are mutual-interest applications (the only candidate↔recruiter
// channel), so nothing here bypasses consent.

const DAY = 86_400_000;
const HOUR = 3_600_000;
const now = Date.now();

export const SEED_MESSAGES: Message[] = [
  // Recruiter (rec-1) ↔ Jordan Patel — app-seed-2 has mutual interest.
  {
    id: "msg-seed-1",
    threadId: "app:app-seed-2",
    senderId: "rec-1",
    body: "Hi Jordan — your TypeScript work stood out. Open to a quick chat this week?",
    createdAt: now - 2 * DAY,
  },
  {
    id: "msg-seed-2",
    threadId: "app:app-seed-2",
    senderId: "cand-jordan",
    body: "Thanks! Yes — Tuesday or Wednesday afternoon works for me.",
    createdAt: now - 2 * DAY + 3 * HOUR,
  },
  // Candidate (you) ↔ Northwind Labs — app-seed-own has mutual interest.
  {
    id: "msg-seed-3",
    threadId: "app:app-seed-own",
    senderId: "rec-1",
    body: "Hi — thanks for applying. We'd love to set up a first call. What's your availability?",
    createdAt: now - 1 * DAY,
  },
];
