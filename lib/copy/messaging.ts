// Messaging + peer-connection UI copy. Variant arrays picked at random per mount;
// single strings are atomic labels. Edit text here, not in the component.

export const messagesCopy = {
  title: ["Messages", "Your messages", "Inbox"],
  subtitle: [
    "Consent-gated by design: every thread is a connection both sides opted into. No cold outreach, no open inbox.",
    "Every thread is a mutual opt-in. No cold outreach, no open inbox.",
  ],
  discoverable: "Discoverable",
  hidden: "Hidden",
  discoverableTitle: "You're discoverable, peers can find and request you",
  hiddenTitle: "You're hidden, peers can't find you in search",
  newConnection: "New connection",
  close: "Close",
  requests: ["Connection requests", "Requests to you", "Pending invites"],
  accept: "Accept",
  decline: "Decline",
  empty: [
    "No conversations yet. Messaging unlocks on mutual interest, or start a peer connection above.",
    "Nothing here yet. Mutual interest opens a thread, or start a peer connection above.",
  ],
  pendingSent: ["Pending sent", "Awaiting reply", "Requests you sent"],
  requestSent: "request sent, waiting",
  selectPrompt: ["Select a conversation to read and reply.", "Pick a conversation to read and reply."],
  connectWithPeer: "peer",
  connectWithRecruiter: "fellow recruiter",
  connectPrefix: "Connect with a",
  searchPeople: "Search people by name…",
  searchRecruiters: "Search recruiters by name…",
  noMatches: [
    "No discoverable matches. People who turn off network visibility don't appear in search.",
    "No matches. People who hide from discovery won't show up here.",
  ],
  change: "Change",
  reasonPlaceholder: "Why do you want to connect? They'll see this before accepting.",
  reasonError: "Add a real reason (at least 10 characters), no cold DMs.",
  sendRequest: "Send request",
  emptyThread: ["No messages yet, say hello. You both opted in.", "No messages yet. Say hello, you both opted in."],
  writeMessage: "Write a message…",
  send: "Send",
} as const;
