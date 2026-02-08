import { useState } from "react";
import { 
  Play, 
  Pause, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Inbox,
  Calendar,
  MoreHorizontal,
  Zap,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NewAutomationDialog from "./NewAutomationDialog";

interface Automation {
  id: string;
  name: string;
  prompt: string;
  schedule: string;
  lastRun?: string;
  status: "active" | "paused" | "running";
  project: string;
}

interface AutomationRun {
  id: string;
  automationName: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
  summary?: string;
  isRead: boolean;
}

const AutomationsPanel = () => {
  const [activeTab, setActiveTab] = useState("triage");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Daily code review",
      prompt: "Review commits from the last 24 hours and suggest improvements",
      schedule: "Every day at 9:00 AM",
      lastRun: "2 hours ago",
      status: "active",
      project: "Codex"
    },
    {
      id: "2", 
      name: "Weekly dependency check",
      prompt: "Check for outdated dependencies and security vulnerabilities",
      schedule: "Every Monday at 10:00 AM",
      lastRun: "3 days ago",
      status: "active",
      project: "ChatGPT"
    },
    {
      id: "3",
      name: "Error monitoring",
      prompt: "Scan telemetry for errors and propose fixes",
      schedule: "Every 6 hours",
      lastRun: "1 hour ago",
      status: "paused",
      project: "Sora"
    }
  ]);

  const [runs] = useState<AutomationRun[]>([
    {
      id: "r1",
      automationName: "Daily code review",
      timestamp: "2 hours ago",
      status: "success",
      summary: "Found 3 code quality improvements in src/components",
      isRead: false
    },
    {
      id: "r2",
      automationName: "Error monitoring",
      timestamp: "4 hours ago", 
      status: "success",
      summary: "No new errors detected",
      isRead: true
    },
    {
      id: "r3",
      automationName: "Daily code review",
      timestamp: "1 day ago",
      status: "failed",
      summary: "Failed to access repository",
      isRead: false
    },
    {
      id: "r4",
      automationName: "Weekly dependency check",
      timestamp: "3 days ago",
      status: "success",
      summary: "2 packages have available updates",
      isRead: true
    }
  ]);

  const filteredRuns = showOnlyUnread ? runs.filter(r => !r.isRead) : runs;
  const unreadCount = runs.filter(r => !r.isRead).length;

  const handleCreateAutomation = (data: {
    name: string;
    prompt: string;
    schedule: string;
    project: string;
  }) => {
    const newAutomation: Automation = {
      id: Date.now().toString(),
      name: data.name,
      prompt: data.prompt,
      schedule: data.schedule,
      project: data.project,
      status: "active",
    };
    setAutomations((prev) => [newAutomation, ...prev]);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Dialog */}
      <NewAutomationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateAutomation}
      />

      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-semibold">Automations</h1>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New automation
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="w-full justify-start bg-transparent gap-2 h-auto p-0">
            <TabsTrigger 
              value="triage" 
              className="data-[state=active]:bg-muted px-4 py-2 rounded-lg gap-2"
            >
              <Inbox className="w-4 h-4" />
              Triage
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-muted px-4 py-2 rounded-lg gap-2"
            >
              <Calendar className="w-4 h-4" />
              All automations
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Triage Tab */}
        <TabsContent value="triage" className="flex-1 overflow-y-auto scrollbar-thin p-4 mt-0">
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredRuns.length} {showOnlyUnread ? "unread" : "total"} runs
              </span>
              <button
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  showOnlyUnread 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Unread only
              </button>
            </div>

            {/* Runs List */}
            <div className="space-y-2">
              {filteredRuns.map((run) => (
                <div 
                  key={run.id}
                  className={`p-4 rounded-xl border transition-colors hover:bg-muted/30 cursor-pointer ${
                    !run.isRead ? "bg-muted/20 border-accent/30" : "border-border/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {run.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      ) : run.status === "failed" ? (
                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{run.automationName}</span>
                          {!run.isRead && (
                            <span className="w-2 h-2 bg-accent rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {run.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {run.timestamp}
                      </span>
                      <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                        <Archive className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRuns.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No automation runs to review</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* All Automations Tab */}
        <TabsContent value="all" className="flex-1 overflow-y-auto scrollbar-thin p-4 mt-0">
          <div className="space-y-3">
            {automations.map((automation) => (
              <div 
                key={automation.id}
                className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{automation.name}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        automation.status === "active" 
                          ? "bg-accent/20 text-accent" 
                          : automation.status === "running"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {automation.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {automation.prompt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {automation.schedule}
                      </span>
                      <span>•</span>
                      <span>{automation.project}</span>
                      {automation.lastRun && (
                        <>
                          <span>•</span>
                          <span>Last run: {automation.lastRun}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      {automation.status === "paused" ? (
                        <Play className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Pause className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationsPanel;
