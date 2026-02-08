import { useState } from "react";
import { Check, Clock, AlertCircle, Filter } from "lucide-react";

interface InboxItem {
  id: string;
  title: string;
  workspace: string;
  status: "completed" | "running" | "failed";
  time: string;
  unread?: boolean;
}

const InboxPanel = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const items: InboxItem[] = [
    { id: "1", title: "Dashboard UI Refinements completed", workspace: "llm-link", status: "completed", time: "2m ago", unread: true },
    { id: "2", title: "API Integration still running", workspace: "nebula", status: "running", time: "5m ago", unread: true },
    { id: "3", title: "Test Suite execution failed", workspace: "nebula", status: "failed", time: "12m ago", unread: false },
    { id: "4", title: "Code Review completed", workspace: "llm-link", status: "completed", time: "1h ago", unread: false },
    { id: "5", title: "Documentation Update completed", workspace: "nebula", status: "completed", time: "2h ago", unread: false },
  ];

  const filteredItems = filter === "unread" ? items.filter(i => i.unread) : items;

  const getStatusIcon = (status: InboxItem["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-accent" />;
      case "running":
        return <Clock className="w-4 h-4 text-traffic-yellow animate-pulse" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Inbox</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === "unread" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Unread ({items.filter(i => i.unread).length})
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p>No unread notifications</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  item.unread ? "bg-muted/50 hover:bg-muted" : "hover:bg-muted/30"
                }`}
              >
                {getStatusIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${item.unread ? "font-medium" : ""}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.workspace}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>
                {item.unread && (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPanel;
