import { useCallback, useEffect, useRef, useState } from "react";
import { agentApi } from "../api/agent";
import type { AgentRun, MessageAccepted } from "../types/agent";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  error?: boolean;
  /** The completed run behind an assistant message (reasoning, steps, approvals). */
  run?: AgentRun;
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Poll a run until it reaches a terminal state, backing off after the first few tries. */
async function pollRun(eventId: string, runId: string): Promise<AgentRun> {
  for (let attempt = 0; attempt < 150; attempt++) {
    const run = await agentApi.getRun(eventId, runId);
    if (run.status === "completed" || run.status === "failed") return run;
    await delay(attempt < 5 ? 700 : 1500);
  }
  throw new Error("The planner is taking longer than expected. Please try again.");
}

export interface UseAgentConversation {
  messages: ChatMessage[];
  sessionId?: string;
  sending: boolean;
  loadingHistory: boolean;
  latestRun?: AgentRun;
  send: (text: string) => Promise<void>;
  approve: () => Promise<void>;
}

export function useAgentConversation(
  eventId: string,
  opts?: { onComplete?: (run: AgentRun) => void; intro?: string },
): UseAgentConversation {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [latestRun, setLatestRun] = useState<AgentRun>();
  const sessionRef = useRef<string | undefined>(undefined);
  const introSentRef = useRef(false);
  const intro = opts?.intro;

  const patch = useCallback((id: string, next: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...next } : m)));
  }, []);

  const track = useCallback(
    async (kickoff: () => Promise<MessageAccepted>, userLabel?: string) => {
      setSending(true);
      if (userLabel) {
        setMessages((prev) => [...prev, { id: uid(), role: "user", content: userLabel }]);
      }
      const placeholderId = uid();
      setMessages((prev) => [...prev, { id: placeholderId, role: "assistant", content: "", pending: true }]);
      try {
        const accepted = await kickoff();
        sessionRef.current = accepted.session_id;
        const run = await pollRun(eventId, accepted.run_id);
        setLatestRun(run);
        const failed = run.status === "failed";
        patch(placeholderId, {
          pending: false,
          error: failed,
          content: failed ? "Sorry — I couldn't complete that. Please try again." : run.message,
          run,
        });
        opts?.onComplete?.(run);
      } catch (err) {
        patch(placeholderId, {
          pending: false,
          error: true,
          content: err instanceof Error ? err.message : "Something went wrong.",
        });
      } finally {
        setSending(false);
      }
    },
    [eventId, opts, patch],
  );

  const send = useCallback(
    (text: string) => track(() => agentApi.sendMessage(eventId, text, sessionRef.current), text),
    [eventId, track],
  );

  const approve = useCallback(() => {
    const sid = sessionRef.current;
    if (!sid) return Promise.resolve();
    return track(() => agentApi.approve(eventId, sid), "Approve");
  }, [eventId, track]);

  // Keep a stable handle to send so the mount effect need not depend on it.
  const sendRef = useRef(send);
  sendRef.current = send;

  // On mount: restore the latest session's transcript (survives navigation). If
  // there's no prior session and an intake `intro` was passed, send it once.
  // Written to be React-StrictMode-safe: only the surviving effect run acts.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sessions = await agentApi.listSessions(eventId);
        if (cancelled) return;
        const latest = sessions[0]; // ordered -created_at
        if (latest) {
          sessionRef.current = latest.id;
          const turns = await agentApi.transcript(eventId, latest.id);
          if (!cancelled) setMessages(turns.map((t) => ({ id: t.id, role: t.role, content: t.content })));
          if (!cancelled) setLoadingHistory(false);
          return;
        }
        if (!cancelled) setLoadingHistory(false);
        if (!cancelled && intro && !introSentRef.current) {
          introSentRef.current = true;
          await sendRef.current(intro);
        }
      } catch {
        if (!cancelled) setLoadingHistory(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally only on eventId/intro; send is reached via sendRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, intro]);

  return { messages, sessionId: sessionRef.current, sending, loadingHistory, latestRun, send, approve };
}
