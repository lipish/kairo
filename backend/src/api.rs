use axum::extract::State;
use axum::http::StatusCode;
use axum::{extract::Path, Json};
use serde::Deserialize;

use crate::agent::{AgentInfo, AgentManager};

/// Request body for spawning a new agent.
#[derive(Debug, Deserialize)]
pub struct SpawnAgentRequest {
    pub name: String,
    pub command: String,
    #[serde(default)]
    pub args: Vec<String>,
}

/// POST /api/agents — spawn a new agent process.
pub async fn spawn_agent(
    State(manager): State<AgentManager>,
    Json(req): Json<SpawnAgentRequest>,
) -> Result<Json<AgentInfo>, (StatusCode, String)> {
    manager
        .spawn_agent(req.name, req.command, req.args)
        .await
        .map(Json)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e))
}

/// GET /api/agents — list all agents.
pub async fn list_agents(
    State(manager): State<AgentManager>,
) -> Json<Vec<AgentInfo>> {
    Json(manager.list_agents().await)
}

/// Request body for sending input to an agent.
#[derive(Debug, Deserialize)]
pub struct SendInputRequest {
    pub input: String,
}

/// POST /api/agents/:id/input — send input to a running agent.
pub async fn send_input(
    State(manager): State<AgentManager>,
    Path(agent_id): Path<String>,
    Json(req): Json<SendInputRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    manager
        .send_input(&agent_id, &req.input)
        .await
        .map(|_| StatusCode::OK)
        .map_err(|e| (StatusCode::BAD_REQUEST, e))
}

/// POST /api/agents/:id/stop — stop an agent.
pub async fn stop_agent(
    State(manager): State<AgentManager>,
    Path(agent_id): Path<String>,
) -> Result<StatusCode, (StatusCode, String)> {
    manager
        .stop_agent(&agent_id)
        .await
        .map(|_| StatusCode::OK)
        .map_err(|e| (StatusCode::BAD_REQUEST, e))
}
