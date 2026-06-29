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
  // Peer (candidate ↔ candidate) — active connection with Maya Rao.
  {
    id: "msg-seed-4",
    threadId: "peer:maya",
    senderId: "tal-1",
    body: "Thanks for connecting! Want to swap portfolio feedback this week?",
    createdAt: now - 3 * DAY + 2 * HOUR,
  },
  // Peer (recruiter ↔ recruiter) — active connection with Sam Rivera.
  {
    id: "msg-seed-5",
    threadId: "peer:rec2",
    senderId: "rec-2",
    body: "Hey Dana — are you seeing the same FE salary pressure we are?",
    createdAt: now - 2 * DAY + 4 * HOUR,
  },
];
