# OmniAgent

A lightweight agent orchestration platform with a React frontend and Rust backend.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│  Port 8080 (dev)                                    │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │  useAgents   │  │  AgentWebSocket client     │   │
│  │  React Hook  │──│  (real-time event stream)  │   │
│  └──────────────┘  └─────────┬──────────────────┘   │
│        │ REST                │ WebSocket             │
└────────┼─────────────────────┼──────────────────────┘
         │  /api/*             │  /ws
┌────────┼─────────────────────┼──────────────────────┐
│        ▼                     ▼                      │
│  ┌──────────┐         ┌────────────┐                │
│  │ REST API │         │ WebSocket  │   Rust Backend  │
│  │  (axum)  │         │  Handler   │   Port 3001     │
│  └────┬─────┘         └─────┬──────┘                │
│       │                     │                       │
│       ▼                     ▼                       │
│  ┌──────────────────────────────────────┐           │
│  │          Agent Manager               │           │
│  │  - Spawn processes (codex, claude…)  │           │
│  │  - Stream stdout/stderr to frontend  │           │
│  │  - Accept stdin from frontend        │           │
│  │  - Track lifecycle (run/stop/fail)   │           │
│  └──────┬───────────┬──────────┬────────┘           │
│         │           │          │                    │
│    ┌────▼───┐ ┌─────▼────┐ ┌──▼──────┐             │
│    │ Agent1 │ │  Agent2  │ │ AgentN  │  Subprocesses│
│    │ codex  │ │ claude   │ │  ...    │              │
│    └────────┘ └──────────┘ └─────────┘              │
└─────────────────────────────────────────────────────┘
```

### REST API

| Method | Path                     | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/agents`            | Spawn a new agent       |
| GET    | `/api/agents`            | List all agents         |
| POST   | `/api/agents/:id/input`  | Send input to an agent  |
| POST   | `/api/agents/:id/stop`   | Stop an agent           |

### WebSocket (`/ws`)

Real-time bidirectional communication:
- **Server → Client**: `agent_output` (stdout/stderr lines), `agent_status` (lifecycle changes)
- **Client → Server**: `send_input` (write to agent stdin)

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.70+

### Backend

```bash
cd backend
cargo run
# Starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:8080, proxies /api and /ws to backend
```

### Example: Spawn an Agent

```bash
curl -X POST http://localhost:3001/api/agents \
  -H 'Content-Type: application/json' \
  -d '{"name": "my-codex", "command": "codex", "args": ["--mode", "auto"]}'
```