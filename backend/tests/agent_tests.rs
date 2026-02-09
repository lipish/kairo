#[cfg(test)]
mod tests {
    use kairo_backend::agent::{AgentManager, AgentStatus};
    use tokio::time::{sleep, Duration};

    #[tokio::test]
    async fn spawn_and_list_agent() {
        let mgr = AgentManager::new();
        let info = mgr
            .spawn_agent("test".into(), "echo".into(), vec!["hello".into()])
            .await
            .unwrap();

        assert_eq!(info.name, "test");
        assert_eq!(info.command, "echo");
        assert_eq!(info.status, AgentStatus::Running);

        // Wait for the echo process to finish
        sleep(Duration::from_millis(200)).await;

        let agents = mgr.list_agents().await;
        assert_eq!(agents.len(), 1);
        assert_eq!(agents[0].status, AgentStatus::Stopped);
    }

    #[tokio::test]
    async fn spawn_and_stop_agent() {
        let mgr = AgentManager::new();
        let info = mgr
            .spawn_agent("sleeper".into(), "sleep".into(), vec!["60".into()])
            .await
            .unwrap();

        assert_eq!(info.status, AgentStatus::Running);

        mgr.stop_agent(&info.id).await.unwrap();

        sleep(Duration::from_millis(200)).await;

        let agents = mgr.list_agents().await;
        assert_eq!(agents.len(), 1);
        // After SIGKILL, the watcher may set it to Failed (non-zero exit)
        assert!(
            agents[0].status == AgentStatus::Stopped
                || agents[0].status == AgentStatus::Failed
        );
    }

    #[tokio::test]
    async fn send_input_to_agent() {
        let mgr = AgentManager::new();
        let info = mgr
            .spawn_agent("cat-test".into(), "cat".into(), vec![])
            .await
            .unwrap();

        // Subscribe to events
        let mut rx = mgr.subscribe();

        mgr.send_input(&info.id, "hello world").await.unwrap();

        // We should receive the output event (cat echoes stdin to stdout)
        let mut found_output = false;
        for _ in 0..10 {
            if let Ok(event) = tokio::time::timeout(Duration::from_millis(500), rx.recv()).await {
                if let Ok(kairo_backend::agent::AgentEvent::Output { line, .. }) = event {
                    if line == "hello world" {
                        found_output = true;
                        break;
                    }
                }
            }
        }

        mgr.stop_agent(&info.id).await.unwrap();
        assert!(found_output, "Expected to receive echoed output from cat");
    }

    #[tokio::test]
    async fn spawn_nonexistent_command_fails() {
        let mgr = AgentManager::new();
        let result = mgr
            .spawn_agent(
                "bad".into(),
                "nonexistent_command_xyz".into(),
                vec![],
            )
            .await;

        assert!(result.is_err());
    }

    #[tokio::test]
    async fn subscribe_receives_status_events() {
        let mgr = AgentManager::new();
        let mut rx = mgr.subscribe();

        let info = mgr
            .spawn_agent("echo-test".into(), "echo".into(), vec!["hi".into()])
            .await
            .unwrap();

        // Should receive at least a Running status event
        let mut got_running = false;
        for _ in 0..10 {
            if let Ok(Ok(event)) =
                tokio::time::timeout(Duration::from_millis(500), rx.recv()).await
            {
                if let kairo_backend::agent::AgentEvent::StatusChanged {
                    agent_id,
                    status,
                } = event
                {
                    if agent_id == info.id && status == AgentStatus::Running {
                        got_running = true;
                        break;
                    }
                }
            }
        }

        assert!(got_running, "Expected Running status event");
    }
}
