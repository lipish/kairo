import { useState, useEffect, useCallback, useRef } from "react";
import {
  AgentInfo,
  AgentWebSocket,
  ServerMessage,
  spawnAgent as apiSpawnAgent,
  listAgents as apiListAgents,
  stopAgent as apiStopAgent,
  sendAgentInput as apiSendInput,
} from "@/services/agentService";

export interface AgentOutput {
  agentId: string;
  line: string;
  timestamp: number;
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [outputs, setOutputs] = useState<AgentOutput[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<AgentWebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    const ws = new AgentWebSocket();
    wsRef.current = ws;

    const unsubscribe = ws.subscribe((msg: ServerMessage) => {
      switch (msg.type) {
        case "agent_output":
          setOutputs((prev) => [
            ...prev,
            {
              agentId: msg.agent_id,
              line: msg.line,
              timestamp: Date.now(),
            },
          ]);
          break;
        case "agent_status":
          setAgents((prev) =>
            prev.map((a) =>
              a.id === msg.agent_id
                ? { ...a, status: msg.status as AgentInfo["status"] }
                : a,
            ),
          );
          break;
      }
    });

    ws.connect();
    setConnected(true);

    return () => {
      unsubscribe();
      ws.disconnect();
      setConnected(false);
    };
  }, []);

  // Load agents on mount
  useEffect(() => {
    apiListAgents()
      .then(setAgents)
      .catch(() => {
        /* backend may not be running */
      });
  }, []);

  const spawnAgent = useCallback(
    async (name: string, command: string, args: string[] = []) => {
      const agent = await apiSpawnAgent({ name, command, args });
      setAgents((prev) => [...prev, agent]);
      return agent;
    },
    [],
  );

  const stopAgent = useCallback(async (agentId: string) => {
    await apiStopAgent(agentId);
  }, []);

  const sendInput = useCallback(async (agentId: string, input: string) => {
    // Use WebSocket for real-time, fall back to REST
    if (wsRef.current) {
      wsRef.current.sendInput(agentId, input);
    } else {
      await apiSendInput(agentId, input);
    }
  }, []);

  const getAgentOutputs = useCallback(
    (agentId: string) => outputs.filter((o) => o.agentId === agentId),
    [outputs],
  );

  const clearOutputs = useCallback((agentId?: string) => {
    if (agentId) {
      setOutputs((prev) => prev.filter((o) => o.agentId !== agentId));
    } else {
      setOutputs([]);
    }
  }, []);

  return {
    agents,
    outputs,
    connected,
    spawnAgent,
    stopAgent,
    sendInput,
    getAgentOutputs,
    clearOutputs,
  };
}
