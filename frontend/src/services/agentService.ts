// Types matching the Rust backend API
export interface AgentInfo {
  id: string;
  name: string;
  command: string;
  args: string[];
  status: "running" | "stopped" | "failed";
}

export interface SpawnAgentRequest {
  name: string;
  command: string;
  args?: string[];
}

export interface AgentOutputEvent {
  type: "agent_output";
  agent_id: string;
  line: string;
}

export interface AgentStatusEvent {
  type: "agent_status";
  agent_id: string;
  status: string;
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export type ServerMessage = AgentOutputEvent | AgentStatusEvent | ErrorEvent;

const API_BASE = "/api";

// ---------- REST helpers ----------

export async function spawnAgent(req: SpawnAgentRequest): Promise<AgentInfo> {
  const res = await fetch(`${API_BASE}/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listAgents(): Promise<AgentInfo[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendAgentInput(
  agentId: string,
  input: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function stopAgent(agentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/stop`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
}

// ---------- WebSocket client ----------

export type MessageHandler = (msg: ServerMessage) => void;

export class AgentWebSocket {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  connect(): void {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws`;
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data);
        this.handlers.forEach((h) => h(msg));
      } catch (e) {
        console.warn("Failed to parse WebSocket message:", event.data, e);
      }
    };

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  sendInput(agentId: string, input: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ type: "send_input", agent_id: agentId, input }),
      );
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
