"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatRelative } from "@/lib/applications";
import {
  applicationThreads,
  currentUserId,
  threadMessages,
  unreadCount,
} from "@/lib/messaging";
import { useStore } from "@/store/store";
import type { ThreadView } from "@/lib/messaging";

// Shared, consent-gated messaging surface used by both roles. The viewer's identity
// (and therefore which threads exist and which bubbles are "mine") comes from the
// current role. Threads are mutual-interest application conversations only.
export function Messages() {
  const { role, applications, messages, threadReads, sendMessage, markThreadRead } = useStore();
  const me = currentUserId(role);

  const threads = useMemo(() => applicationThreads(applications, role), [applications, role]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  if (threads.length === 0) {
    return (
      <div className="space-y-4">
        <Header />
        <div className="card p-8 text-center">
          <p className="font-medium">No conversations yet</p>
          <p className="mt-1 text-sm text-muted">
            Messaging unlocks only when both sides express interest. {whenHint(role)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Header />
      <div className="grid gap-4 md:grid-cols-[clamp(220px,30%,300px)_minmax(0,1fr)]">
        {/* Thread list — hidden on mobile once a thread is open */}
        <aside className={selected ? "hidden md:block" : "block"}>
          <ul className="space-y-1">
            {threads.map((t) => {
              const unread = unreadCount(messages, t.id, me, threadReads);
              const isActive = t.id === selected?.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "border-border bg-surface2"
                        : "border-transparent hover:bg-surface2"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{t.otherName}</span>
                      {unread > 0 && (
                        <span className="shrink-0 rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-contrast">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted">{t.context}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Conversation */}
        {selected ? (
          <Conversation
            key={selected.id}
            thread={selected}
            me={me}
            onBack={() => setSelectedId(null)}
            onSend={(body) => sendMessage(selected.id, me, body)}
            onRead={() => markThreadRead(selected.id, me)}
          />
        ) : (
          <div className="hidden md:grid card place-items-center p-10 text-center text-sm text-muted">
            Select a conversation to read and reply.
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="h-display">Messages</h1>
      <p className="mt-1 text-muted">
        Consent-gated by design — every thread is a connection both sides opted into. No cold
        outreach, no open inbox.
      </p>
    </div>
  );
}

function whenHint(role: string): string {
  return role === "recruiter"
    ? "Express interest in an applicant (Postings) and they apply — then you can talk."
    : "Apply to a role and the recruiter expresses interest — then you can talk.";
}

function Conversation({
  thread,
  me,
  onBack,
  onSend,
  onRead,
}: {
  thread: ThreadView;
  me: string;
  onBack: () => void;
  onSend: (body: string) => void;
  onRead: () => void;
}) {
  const { messages, now } = useStore();
  const [draft, setDraft] = useState("");
  const items = threadMessages(messages, thread.id);
  const scroller = useRef<HTMLDivElement | null>(null);

  // Mark read on open and whenever new messages arrive while viewing.
  useEffect(() => {
    onRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.id, items.length]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [items.length]);

  function submit() {
    const body = draft.trim();
    if (!body) return;
    onSend(body);
    setDraft("");
  }

  return (
    <section className="card flex h-[clamp(420px,60vh,640px)] flex-col p-0">
      <header className="flex items-center gap-3 border-b border-border p-4">
        <button className="text-muted hover:text-fg md:hidden" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="min-w-0">
          <p className="truncate font-semibold">{thread.otherName}</p>
          <p className="truncate text-xs text-muted">{thread.context}</p>
        </div>
      </header>

      <div ref={scroller} className="flex-1 space-y-2 overflow-auto p-4">
        {items.map((m) => {
          const mine = m.senderId === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine
                    ? "bg-accent text-accent-contrast"
                    : "bg-surface2 text-fg"
                }`}
              >
                <p>{m.body}</p>
                <p
                  className={`mt-1 text-[10px] ${mine ? "text-accent-contrast/70" : "text-muted"}`}
                >
                  {formatRelative(m.createdAt, now())}
                </p>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-center text-sm text-muted">
            No messages yet — say hello. You both opted in.
          </p>
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-border p-3">
        <textarea
          className="input min-h-[2.5rem] flex-1 resize-none"
          rows={1}
          placeholder="Write a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button className="btn-primary" onClick={submit} disabled={!draft.trim()}>
          Send
        </button>
      </div>
    </section>
  );
}
