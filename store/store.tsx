"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SEED_APPLICATIONS } from "@/lib/seedApplications";
import { SEED_MESSAGES } from "@/lib/seedMessages";
import { SEED_PEER_THREADS } from "@/lib/seedPeers";
import { autoResolveLapsed, DAY } from "@/lib/sla";
import type {
  Application,
  Endorsement,
  GapItem,
  Message,
  PeerThread,
  Profile,
  Role,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// The single client-side store both sides of the marketplace read and write.
// Persisted to localStorage so the two-sided demo survives a refresh.
// Feature slices (applications, endorsements, simulated clock) are added to this
// store in the commits that introduce them.
// ─────────────────────────────────────────────────────────────────────────────

export const EMPTY_PROFILE: Profile = {
  name: "",
  headline: "",
  location: "",
  remotePref: "any",
  skills: [],
  experience: [],
  projects: [],
};

interface AppState {
  role: Role;
  profile: Profile;
  /** Deduped gaps from the latest match — feeds the reskilling recommendations. */
  matchGaps: GapItem[];
  endorsements: Endorsement[];
  applications: Application[];
  /** All messages across consent-gated threads (application + peer). */
  messages: Message[];
  /** Peer connections (request/accept) between same-role users. */
  peerThreads: PeerThread[];
  /** Network discoverability per participant id; absent = visible. `false` = hidden from search. */
  networkVisibility: Record<string, boolean>;
  /** Per-viewer read marks, keyed `${userId}:${threadId}` → last-read timestamp. */
  threadReads: Record<string, number>;
  /** Job ids the candidate has liked — a market-demand signal on postings (not on people). */
  likedJobs: string[];
  /** Wall-clock of the last session, used for an honest "since you were here" digest. */
  lastSeenAt: number;
  /** Simulated-clock offset (ms) so SLA expiry can be demoed in seconds. */
  clockOffset: number;
}

interface StoreValue extends AppState {
  /** True once persisted state has been loaded — gate UI on this to avoid hydration flicker. */
  hydrated: boolean;
  /** The previous session's `lastSeenAt` (0 on first ever visit) — drives the digest. */
  previousSeenAt: number;
  setRole: (role: Role) => void;
  setProfile: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  setMatchGaps: (gaps: GapItem[]) => void;
  addEndorsement: (e: Endorsement) => void;
  removeEndorsement: (id: string) => void;
  addApplication: (a: Application) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  /** Append a message to a thread (sender is the current viewer). */
  sendMessage: (threadId: string, senderId: string, body: string) => void;
  /** Mark a thread read by a viewer up to now. */
  markThreadRead: (threadId: string, userId: string) => void;
  /** Send a peer connection request (a pending PeerThread). */
  requestConnection: (thread: PeerThread) => void;
  /** Accept (→ active) or decline (→ removed) a pending peer request. */
  respondToConnection: (id: string, accept: boolean) => void;
  /** Set whether a participant is discoverable to the whole network. */
  setVisibility: (userId: string, visible: boolean) => void;
  /** Toggle a like on a job posting. */
  toggleLike: (jobId: string) => void;
  /** Current (possibly simulated) time = Date.now() + clockOffset. */
  now: () => number;
  advanceClock: (days: number) => void;
  resetClock: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const STORAGE_KEY = "jm-state-v1";

const INITIAL: AppState = {
  role: "candidate",
  profile: EMPTY_PROFILE,
  matchGaps: [],
  endorsements: [],
  applications: SEED_APPLICATIONS,
  messages: SEED_MESSAGES,
  peerThreads: SEED_PEER_THREADS,
  // Two seed peers opt out of discovery, so search visibly respects the consent.
  networkVisibility: { "tal-3": false, "rec-4": false },
  threadReads: {},
  likedJobs: [],
  lastSeenAt: 0,
  clockOffset: 0,
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [previousSeenAt, setPreviousSeenAt] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    let next = INITIAL;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) next = { ...INITIAL, ...(JSON.parse(raw) as Partial<AppState>) };
    } catch {
      /* ignore corrupt state */
    }
    // Remember the prior session, then stamp this one — the digest reads the gap.
    setPreviousSeenAt(next.lastSeenAt ?? 0);
    setState({ ...next, lastSeenAt: Date.now() });
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — non-fatal for a POC */
    }
  }, [state]);

  const setRole = useCallback((role: Role) => setState((s) => ({ ...s, role })), []);
  const setProfile = useCallback(
    (profile: Profile) => setState((s) => ({ ...s, profile })),
    [],
  );
  const updateProfile = useCallback(
    (patch: Partial<Profile>) =>
      setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
    [],
  );
  const setMatchGaps = useCallback(
    (matchGaps: GapItem[]) => setState((s) => ({ ...s, matchGaps })),
    [],
  );
  const addEndorsement = useCallback(
    (e: Endorsement) => setState((s) => ({ ...s, endorsements: [e, ...s.endorsements] })),
    [],
  );
  const removeEndorsement = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, endorsements: s.endorsements.filter((e) => e.id !== id) })),
    [],
  );
  const addApplication = useCallback(
    (a: Application) => setState((s) => ({ ...s, applications: [a, ...s.applications] })),
    [],
  );
  const updateApplication = useCallback(
    (id: string, patch: Partial<Application>) =>
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      })),
    [],
  );
  const sendMessage = useCallback(
    (threadId: string, senderId: string, body: string) =>
      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            threadId,
            senderId,
            body,
            createdAt: Date.now(),
          },
        ],
        // Sending implicitly catches the sender up on the thread.
        threadReads: { ...s.threadReads, [`${senderId}:${threadId}`]: Date.now() },
      })),
    [],
  );
  const markThreadRead = useCallback(
    (threadId: string, userId: string) =>
      setState((s) => ({
        ...s,
        threadReads: { ...s.threadReads, [`${userId}:${threadId}`]: Date.now() },
      })),
    [],
  );
  const requestConnection = useCallback(
    (thread: PeerThread) =>
      setState((s) => ({ ...s, peerThreads: [thread, ...s.peerThreads] })),
    [],
  );
  const respondToConnection = useCallback(
    (id: string, accept: boolean) =>
      setState((s) => ({
        ...s,
        peerThreads: accept
          ? s.peerThreads.map((t) => (t.id === id ? { ...t, status: "active" as const } : t))
          : s.peerThreads.filter((t) => t.id !== id),
      })),
    [],
  );
  const setVisibility = useCallback(
    (userId: string, visible: boolean) =>
      setState((s) => ({
        ...s,
        networkVisibility: { ...s.networkVisibility, [userId]: visible },
      })),
    [],
  );
  const toggleLike = useCallback(
    (jobId: string) =>
      setState((s) => ({
        ...s,
        likedJobs: s.likedJobs.includes(jobId)
          ? s.likedJobs.filter((id) => id !== jobId)
          : [jobId, ...s.likedJobs],
      })),
    [],
  );
  const now = useCallback(() => Date.now() + state.clockOffset, [state.clockOffset]);
  const advanceClock = useCallback(
    (days: number) =>
      setState((s) => {
        const clockOffset = s.clockOffset + days * DAY;
        return {
          ...s,
          clockOffset,
          applications: autoResolveLapsed(s.applications, Date.now() + clockOffset),
        };
      }),
    [],
  );
  const resetClock = useCallback(() => setState((s) => ({ ...s, clockOffset: 0 })), []);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        hydrated,
        previousSeenAt,
        setRole,
        setProfile,
        updateProfile,
        setMatchGaps,
        addEndorsement,
        removeEndorsement,
        addApplication,
        updateApplication,
        sendMessage,
        markThreadRead,
        requestConnection,
        respondToConnection,
        setVisibility,
        toggleLike,
        now,
        advanceClock,
        resetClock,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
