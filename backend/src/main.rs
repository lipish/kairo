use axum::routing::{get, post};
use axum::Router;
use tower_http::cors::{Any, CorsLayer};

use kairo_backend::agent;
use kairo_backend::api;
use kairo_backend::ws;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let manager = agent::AgentManager::new();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        // WebSocket endpoint for real-time streaming
        .route("/ws", get(ws::ws_handler))
        // REST API for agent lifecycle
        .route("/api/agents", post(api::spawn_agent).get(api::list_agents))
        .route("/api/agents/{id}/input", post(api::send_input))
        .route("/api/agents/{id}/stop", post(api::stop_agent))
        .layer(cors)
        .with_state(manager);

    let addr = "0.0.0.0:3001";
    tracing::info!("Kairo backend listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
