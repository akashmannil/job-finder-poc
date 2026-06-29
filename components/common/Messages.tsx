"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatRelative } from "@/lib/applications";
import {
  applicationThreads,
  currentUserId,
  threadMessages,
  unreadCount,
} from "@/lib/messaging";
import {
  activePeerThreadViews,
  buildPeerRequest,
  connectedPeerIds,
  incomingRequests,
  isVisible,
  otherOf,
  outgoingRequests,
  searchPeers,
  selfParticipant,
} from "@/lib/peers";
import { useStore } from "@/store/store";
import type { ThreadView } from "@/lib/messaging";
import type { PeerParticipant } from "@/types";

// Shared, consent-gated messaging surface used by both roles. The viewer's identity
// (and therefore which threads exist and which bubbles are "mine") comes from the
// current role. Two channels, both opt-in: mutual-interest application threads, and
// peer connections that start as a request with a stated reason.
export function Messages() {
  const {
    role,
    applications,
    messages,
    threadReads,
    peerThreads,
    networkVisibility,
    sendMessage,
    markThreadRead,
    respondToConnection,
    setVisibility,
  } = useStore();
  const me = currentUserId(role);
  const myVisible = isVisible(me, networkVisibility);

  const threads = useMemo<ThreadView[]>(
    () => [...applicationThreads(applications, role), ...activePeerThreadViews(peerThreads, role)],
    [applications, role, peerThreads],
  );
  const incoming = useMemo(() => incomingRequests(peerThreads, role), [peerThreads, role]);
  const outgoing = useMemo(() => outgoingRequests(peerThreads, role), [peerThreads, role]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const selected = threads.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="h-display">Messages</h1>
          <p className="mt-1 text-muted">
            Consent-gated by design — every thread is a connection both sides opted into. No cold
            outreach, no open inbox.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVisibility(me, !myVisible)}
            aria-pressed={myVisible}
            title={
              myVisible
                ? "You're discoverable — peers can find and request you"
                : "You're hidden — peers can't find you in search"
            }
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${myVisible ? "bg-success" : "bg-muted"}`} />
            {myVisible ? "Discoverable" : "Hidden"}
          </button>
          <button className="btn-soft text-sm" onClick={() => setComposing((v) => !v)}>
            {composing ? "Close" : "New connection"}
          </button>
        </div>
      </div>

      {composing && <NewConnection onDone={() => setComposing(false)} />}

      <div className="grid gap-4 md:grid-cols-[clamp(230px,32%,320px)_minmax(0,1fr)]">
        {/* Left column: requests + threads */}
        <aside className={selected ? "hidden md:block" : "block"}>
          {incoming.length > 0 && (
            <div className="mb-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Connection requests
              </p>
              {incoming.map((t) => {
                const o = otherOf(t, role);
                return (
                  <div key={t.id} className="card p-3">
                    <p className="text-sm font-medium">{o?.name}</p>
                    {o?.subtitle && <p className="text-xs text-muted">{o.subtitle}</p>}
                    <p className="mt-1 text-sm">“{t.reason}”</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="btn-primary text-xs"
                        onClick={() => respondToConnection(t.id, true)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => respondToConnection(t.id, false)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {threads.length === 0 ? (
            <div className="card p-6 text-center text-sm text-muted">
              No conversations yet. Messaging unlocks on mutual interest, or start a peer connection
              above.
            </div>
          ) : (
            <ul className="space-y-1">
              {threads.map((t) => {
                const unread = unreadCount(messages, t.id, me, threadReads);
                const isActive = t.id === selected?.id;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setSelectedId(t.id)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        isActive ? "border-border bg-surface2" : "border-transparent hover:bg-surface2"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate font-medium">{t.otherName}</span>
                          {t.kind === "peer" && (
                            <span className="chip shrink-0 !px-1.5 !py-0 text-[10px]">peer</span>
                          )}
                        </span>
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
          )}

          {outgoing.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Pending sent</p>
              {outgoing.map((t) => {
                const o = otherOf(t, role);
                return (
                  <div key={t.id} className="rounded-xl px-3 py-2 text-sm text-muted">
                    {o?.name} · request sent, waiting
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right column: conversation */}
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
          <div className="hidden place-items-center md:grid card p-10 text-center text-sm text-muted">
            Select a conversation to read and reply.
          </div>
        )}
      </div>
    </div>
  );
}

function NewConnection({ onDone }: { onDone: () => void }) {
  const { role, profile, peerThreads, networkVisibility, requestConnection } = useStore();
  const connected = connectedPeerIds(peerThreads, role);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<PeerParticipant | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const results = searchPeers(role, query, networkVisibility, connected);

  function send() {
    if (!target) return;
    if (reason.trim().length < 10) {
      return setError("Add a real reason (≥ 10 characters) — no cold DMs.");
    }
    requestConnection(buildPeerRequest(selfParticipant(role, profile), target, reason.trim()));
    onDone();
  }

  return (
    <div className="card space-y-3 p-4">
      <p className="text-sm font-medium">
        Connect with a {role === "recruiter" ? "fellow recruiter" : "peer"}
      </p>

      {target ? (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-surface2 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{target.name}</p>
            {target.subtitle && <p className="truncate text-xs text-muted">{target.subtitle}</p>}
          </div>
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              setTarget(null);
              setQuery("");
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            className="input"
            placeholder={`Search ${role === "recruiter" ? "recruiters" : "people"} by name…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query.trim() &&
            (results.length === 0 ? (
              <p className="text-sm text-muted">
                No discoverable matches. People who turn off network visibility don&apos;t appear in
                search.
              </p>
            ) : (
              <ul className="max-h-48 space-y-1 overflow-auto">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      className="w-full rounded-lg px-3 py-2 text-left hover:bg-surface2"
                      onClick={() => {
                        setTarget(p);
                        setError("");
                      }}
                    >
                      <p className="text-sm font-medium">{p.name}</p>
                      {p.subtitle && <p className="text-xs text-muted">{p.subtitle}</p>}
                    </button>
                  </li>
                ))}
              </ul>
            ))}
        </div>
      )}

      {target && (
        <>
          <textarea
            className="input"
            rows={2}
            placeholder="Why do you want to connect? They'll see this before accepting."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end">
            <button className="btn-primary text-sm" onClick={send}>
              Send request
            </button>
          </div>
        </>
      )}
    </div>
  );
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
                  mine ? "bg-accent text-accent-contrast" : "bg-surface2 text-fg"
                }`}
              >
                <p>{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-accent-contrast/70" : "text-muted"}`}>
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
