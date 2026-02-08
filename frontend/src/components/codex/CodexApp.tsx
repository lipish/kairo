import { useState } from "react";
import Header from "./Header";
import Sidebar, { ViewType } from "./Sidebar";
import ChatPanel from "./ChatPanel";
import StartConversationPanel from "./StartConversationPanel";
import InboxPanel from "./InboxPanel";
import PlaygroundPanel from "./PlaygroundPanel";

const CodexApp = () => {
  const [currentView, setCurrentView] = useState<ViewType>("start");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("nebula");

  const handleSelectConversation = (conversationId: string, workspaceId: string) => {
    setSelectedConversationId(conversationId);
    // Could update selectedWorkspace based on workspaceId if needed
  };

  const handleAddConversation = (workspaceId: string) => {
    // In a real app, this would create a new conversation
    setCurrentView("start");
  };

  const handleStartConversation = (prompt: string) => {
    console.log("Starting conversation with:", prompt);
    setCurrentView("chat");
  };

  const renderMainPanel = () => {
    switch (currentView) {
      case "start":
        return (
          <StartConversationPanel 
            selectedWorkspace={selectedWorkspace}
            onStartConversation={handleStartConversation}
          />
        );
      case "inbox":
        return <InboxPanel />;
      case "playground":
        return <PlaygroundPanel />;
      case "chat":
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="min-h-screen w-full gradient-bg p-6 flex items-center justify-center">
      {/* Main Container */}
      <div className="w-full max-w-7xl h-[calc(100vh-3rem)] glass-panel rounded-2xl overflow-hidden flex flex-col shadow-glass">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            onViewChange={setCurrentView}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onAddConversation={handleAddConversation}
          />

          {/* Main Panel */}
          {renderMainPanel()}
        </div>
      </div>
    </div>
  );
};

export default CodexApp;
