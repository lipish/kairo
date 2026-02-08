import { 
  Mail, 
  Plus, 
  ChevronDown, 
  Copy,
  BookOpen, 
  Globe, 
  Settings, 
  MessageSquare,
  Play
} from "lucide-react";
import { useState } from "react";

export type ViewType = "start" | "chat" | "inbox" | "playground";

interface ConversationItem {
  id: string;
  name: string;
  isRunning?: boolean;
}

interface Workspace {
  id: string;
  name: string;
  conversations: ConversationItem[];
  expanded?: boolean;
}

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedConversationId: string | null;
  onSelectConversation: (id: string, workspaceId: string) => void;
  onAddConversation: (workspaceId: string) => void;
}

const Sidebar = ({ 
  currentView, 
  onViewChange, 
  selectedConversationId,
  onSelectConversation,
  onAddConversation
}: SidebarProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "ws-1",
      name: "llm-link",
      expanded: true,
      conversations: [
        { id: "conv-1", name: "Debugging Chat Respons...", isRunning: false },
        { id: "conv-2", name: "Light Theme Login Optimi...", isRunning: false },
        { id: "conv-3", name: "Dashboard UI Refinements", isRunning: false },
      ],
    },
    {
      id: "ws-2",
      name: "nebula",
      expanded: true,
      conversations: [
        { id: "conv-4", name: "Nebula UI Design Proposal", isRunning: true },
        { id: "conv-5", name: "Planning CLI Management...", isRunning: true },
      ],
    },
  ]);

  const toggleWorkspace = (workspaceId: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId ? { ...ws, expanded: !ws.expanded } : ws
      )
    );
  };

  return (
    <div className="w-64 flex flex-col h-full border-r border-border/50">
      {/* Top Navigation */}
      <div className="p-3 space-y-1">
        <div 
          className={`sidebar-item group cursor-pointer ${currentView === "inbox" ? "sidebar-item-active" : ""}`}
          onClick={() => onViewChange("inbox")}
        >
          <Mail className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="flex-1">Inbox</span>
          <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div 
          className={`sidebar-item group cursor-pointer ${currentView === "start" ? "sidebar-item-active" : ""}`}
          onClick={() => onViewChange("start")}
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Start conversation</span>
        </div>
      </div>

      {/* Workspaces Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Workspaces
          </span>
        </div>

        <div className="px-2 space-y-1">
          {workspaces.map((workspace) => (
            <div key={workspace.id}>
              {/* Workspace Header */}
              <div
                className="sidebar-item group justify-between"
                onClick={() => toggleWorkspace(workspace.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      workspace.expanded ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="font-medium">{workspace.name}</span>
                </div>
                <button 
                  className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddConversation(workspace.id);
                  }}
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Workspace Conversations */}
              {workspace.expanded && (
                <div className="ml-2 space-y-0.5">
                  {workspace.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id, workspace.id);
                        onViewChange("chat");
                      }}
                      className={`sidebar-item pl-6 transition-all duration-200 hover:translate-x-1 justify-between ${
                        selectedConversationId === conv.id && currentView === "chat"
                          ? "sidebar-item-active"
                          : ""
                      }`}
                    >
                      <span className="flex-1 truncate text-sm">{conv.name}</span>
                      {conv.isRunning && (
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      )}
                    </div>
                  ))}
                  {workspace.conversations.length > 3 && (
                    <button className="sidebar-item pl-6 text-sm text-muted-foreground hover:text-foreground">
                      See all ({workspace.conversations.length + 5})
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Open Workspace Button */}
          <button className="sidebar-item w-full mt-2">
            <Plus className="w-4 h-4" />
            <span>Open Workspace</span>
          </button>
        </div>

        {/* Playground Section */}
        <div className="px-2 mt-4">
          <div 
            className={`sidebar-item group cursor-pointer justify-between ${currentView === "playground" ? "sidebar-item-active" : ""}`}
            onClick={() => onViewChange("playground")}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Playground</span>
              <span className="text-xs text-muted-foreground">⌘</span>
            </div>
            <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <div className="sidebar-item group cursor-pointer">
          <BookOpen className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Knowledge</span>
        </div>
        <div className="sidebar-item group cursor-pointer">
          <Globe className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Browser</span>
        </div>
        <div className="sidebar-item group cursor-pointer">
          <Settings className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Settings</span>
        </div>
        <div className="sidebar-item group cursor-pointer">
          <MessageSquare className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Provide Feedback</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
