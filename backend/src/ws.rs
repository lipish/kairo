use axum::extract::ws::{Message, WebSocket};
use axum::extract::{State, WebSocketUpgrade};
use axum::response::IntoResponse;
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};

use crate::agent::{AgentEvent, AgentManager};

/// Inbound messages from the frontend.
#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum WsClientMessage {
    /// Send text input to a running agent.
    #[serde(rename = "send_input")]
    SendInput { agent_id: String, input: String },
}

/// Outbound messages to the frontend.
#[derive(Debug, Serialize)]
#[serde(tag = "type")]
pub enum WsServerMessage {
    /// Agent produced a line of output.
    #[serde(rename = "agent_output")]
    AgentOutput { agent_id: String, line: String },
    /// Agent status changed.
    #[serde(rename = "agent_status")]
    AgentStatus {
        agent_id: String,
        status: String,
    },
    /// Error message.
    #[serde(rename = "error")]
    Error { message: String },
}

/// HTTP handler that upgrades to WebSocket.
pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(manager): State<AgentManager>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, manager))
}

async fn handle_socket(socket: WebSocket, manager: AgentManager) {
    let (mut ws_tx, mut ws_rx) = socket.split();
    let mut event_rx = manager.subscribe();

    // Channel for outbound messages (used by both event forwarder and recv handler)
    let (out_tx, mut out_rx) = tokio::sync::mpsc::channel::<WsServerMessage>(64);

    // Forward agent events to the outbound channel
    let out_tx_events = out_tx.clone();
    let event_task = tokio::spawn(async move {
        while let Ok(event) = event_rx.recv().await {
            let msg = match event {
                AgentEvent::Output { agent_id, line } => {
                    WsServerMessage::AgentOutput { agent_id, line }
                }
                AgentEvent::StatusChanged { agent_id, status } => {
                    WsServerMessage::AgentStatus {
                        agent_id,
                        status: serde_json::to_value(&status)
                            .ok()
                            .and_then(|v| v.as_str().map(String::from))
                            .unwrap_or_else(|| format!("{status:?}")),
                    }
                }
                AgentEvent::Input { .. } => continue,
            };
            if out_tx_events.send(msg).await.is_err() {
                break;
            }
        }
    });

    // Send outbound messages to the WebSocket
    let send_task = tokio::spawn(async move {
        while let Some(msg) = out_rx.recv().await {
            let text = match serde_json::to_string(&msg) {
                Ok(t) => t,
                Err(_) => continue,
            };
            if ws_tx.send(Message::Text(text.into())).await.is_err() {
                break;
            }
        }
    });

    // Receive messages from the WebSocket client
    let mgr = manager.clone();
    let out_tx_recv = out_tx.clone();
    let recv_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = ws_rx.next().await {
            match msg {
                Message::Text(text) => {
                    let parsed: Result<WsClientMessage, _> =
                        serde_json::from_str(&text);
                    match parsed {
                        Ok(WsClientMessage::SendInput { agent_id, input }) => {
                            if let Err(e) = mgr.send_input(&agent_id, &input).await {
                                tracing::warn!("send_input error: {e}");
                                let _ = out_tx_recv
                                    .send(WsServerMessage::Error {
                                        message: e.to_string(),
                                    })
                                    .await;
                            }
                        }
                        Err(e) => {
                            tracing::warn!("Invalid WS message: {e}");
                            let _ = out_tx_recv
                                .send(WsServerMessage::Error {
                                    message: format!("Invalid message: {e}"),
                                })
                                .await;
                        }
                    }
                }
                Message::Close(_) => break,
                _ => {}
            }
        }
    });

    // Wait for either task to finish, then abort the others
    tokio::select! {
        _ = event_task => {},
        _ = send_task => {},
        _ = recv_task => {},
    }
}
