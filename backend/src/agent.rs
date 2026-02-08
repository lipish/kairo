use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::process::Command;
use tokio::sync::{broadcast, RwLock};
use uuid::Uuid;

/// Represents the current status of an agent process.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum AgentStatus {
    Running,
    Stopped,
    Failed,
}

/// Metadata and configuration for a spawned agent.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentInfo {
    pub id: String,
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub status: AgentStatus,
}

/// Messages emitted by agents or sent to agents.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum AgentEvent {
    /// A line of output from the agent's stdout/stderr.
    Output { agent_id: String, line: String },
    /// Agent status changed.
    StatusChanged { agent_id: String, status: AgentStatus },
    /// Input sent to the agent's stdin.
    Input { agent_id: String, input: String },
}

/// Internal handle for a running agent process.
struct AgentHandle {
    info: AgentInfo,
    /// The raw OS process id, used for kill.
    pid: Option<u32>,
    /// Agent's stdin for sending input.
    stdin: Option<tokio::process::ChildStdin>,
}

/// Manages the lifecycle of agent sub-processes.
#[derive(Clone)]
pub struct AgentManager {
    agents: Arc<RwLock<HashMap<String, AgentHandle>>>,
    event_tx: broadcast::Sender<AgentEvent>,
}

impl AgentManager {
    pub fn new() -> Self {
        let (event_tx, _) = broadcast::channel(256);
        Self {
            agents: Arc::new(RwLock::new(HashMap::new())),
            event_tx,
        }
    }

    /// Subscribe to agent events (output lines, status changes).
    pub fn subscribe(&self) -> broadcast::Receiver<AgentEvent> {
        self.event_tx.subscribe()
    }

    /// Spawn a new agent process.
    pub async fn spawn_agent(
        &self,
        name: String,
        command: String,
        args: Vec<String>,
    ) -> Result<AgentInfo, String> {
        let id = Uuid::new_v4().to_string();

        let mut child = Command::new(&command)
            .args(&args)
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn process: {e}"))?;

        let pid = child.id();
        let stdin = child.stdin.take();
        let stdout = child.stdout.take();
        let stderr = child.stderr.take();

        let info = AgentInfo {
            id: id.clone(),
            name,
            command,
            args,
            status: AgentStatus::Running,
        };

        let handle = AgentHandle {
            info: info.clone(),
            pid,
            stdin,
        };

        self.agents.write().await.insert(id.clone(), handle);

        // Spawn stdout reader task
        if let Some(stdout) = stdout {
            let tx = self.event_tx.clone();
            let agent_id = id.clone();
            tokio::spawn(async move {
                let reader = BufReader::new(stdout);
                let mut lines = reader.lines();
                while let Ok(Some(line)) = lines.next_line().await {
                    let _ = tx.send(AgentEvent::Output {
                        agent_id: agent_id.clone(),
                        line,
                    });
                }
            });
        }

        // Spawn stderr reader task
        if let Some(stderr) = stderr {
            let tx = self.event_tx.clone();
            let agent_id = id.clone();
            tokio::spawn(async move {
                let reader = BufReader::new(stderr);
                let mut lines = reader.lines();
                while let Ok(Some(line)) = lines.next_line().await {
                    let _ = tx.send(AgentEvent::Output {
                        agent_id: agent_id.clone(),
                        line,
                    });
                }
            });
        }

        // Spawn a task to watch for process exit.
        // We move the `child` (which no longer has stdin/stdout/stderr) into this task.
        {
            let agents = self.agents.clone();
            let tx = self.event_tx.clone();
            let agent_id = id.clone();
            tokio::spawn(async move {
                let status = child.wait().await;
                let new_status = match status {
                    Ok(s) if s.success() => AgentStatus::Stopped,
                    _ => AgentStatus::Failed,
                };
                if let Some(handle) = agents.write().await.get_mut(&agent_id) {
                    handle.info.status = new_status.clone();
                }
                let _ = tx.send(AgentEvent::StatusChanged {
                    agent_id,
                    status: new_status,
                });
            });
        }

        // Notify creation
        let _ = self.event_tx.send(AgentEvent::StatusChanged {
            agent_id: id,
            status: AgentStatus::Running,
        });

        Ok(info)
    }

    /// Send input text to an agent's stdin.
    pub async fn send_input(&self, agent_id: &str, input: &str) -> Result<(), String> {
        let mut agents = self.agents.write().await;
        let handle = agents
            .get_mut(agent_id)
            .ok_or_else(|| format!("Agent {agent_id} not found"))?;

        if handle.info.status != AgentStatus::Running {
            return Err(format!("Agent {agent_id} is not running"));
        }

        if let Some(stdin) = handle.stdin.as_mut() {
            stdin
                .write_all(input.as_bytes())
                .await
                .map_err(|e| format!("Failed to write to stdin: {e}"))?;
            stdin
                .write_all(b"\n")
                .await
                .map_err(|e| format!("Failed to write newline: {e}"))?;
            stdin
                .flush()
                .await
                .map_err(|e| format!("Failed to flush stdin: {e}"))?;
        } else {
            return Err("Agent stdin not available".into());
        }

        let _ = self.event_tx.send(AgentEvent::Input {
            agent_id: agent_id.to_string(),
            input: input.to_string(),
        });

        Ok(())
    }

    /// List all agents.
    pub async fn list_agents(&self) -> Vec<AgentInfo> {
        self.agents
            .read()
            .await
            .values()
            .map(|h| h.info.clone())
            .collect()
    }

    /// Stop an agent process.
    pub async fn stop_agent(&self, agent_id: &str) -> Result<(), String> {
        let pid = {
            let agents = self.agents.read().await;
            let handle = agents
                .get(agent_id)
                .ok_or_else(|| format!("Agent {agent_id} not found"))?;
            handle.pid
        };

        // Send SIGKILL via OS — doesn't need the child handle
        if let Some(pid) = pid {
            let pid = pid as i32;
            unsafe {
                libc::kill(pid, libc::SIGKILL);
            }
        } else {
            return Err("Agent has no PID".into());
        }

        // The exit watcher will update status to Failed/Stopped, but we set it here too
        if let Some(handle) = self.agents.write().await.get_mut(agent_id) {
            handle.info.status = AgentStatus::Stopped;
        }

        let _ = self.event_tx.send(AgentEvent::StatusChanged {
            agent_id: agent_id.to_string(),
            status: AgentStatus::Stopped,
        });

        Ok(())
    }
}
