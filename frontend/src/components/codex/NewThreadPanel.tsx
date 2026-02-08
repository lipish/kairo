import { useState } from "react";
import { Monitor, GitBranch, Cloud, ArrowUp, Plus, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ThreadMode = "local" | "worktree" | "cloud";

interface NewThreadPanelProps {
  onCreateThread?: (prompt: string, mode: ThreadMode) => void;
}

const NewThreadPanel = ({ onCreateThread }: NewThreadPanelProps) => {
  const [mode, setMode] = useState<ThreadMode>("local");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && onCreateThread) {
      onCreateThread(prompt.trim(), mode);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Start a new thread</h1>
            <p className="text-muted-foreground">
              Choose how you want Codex to work on your task
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex justify-center">
            <Tabs value={mode} onValueChange={(v) => setMode(v as ThreadMode)}>
              <TabsList className="grid grid-cols-3 w-[400px] h-12 bg-muted/50">
                <TabsTrigger 
                  value="local" 
                  className="flex items-center gap-2 data-[state=active]:bg-background"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Local</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="worktree" 
                  className="flex items-center gap-2 data-[state=active]:bg-background"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Worktree</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cloud" 
                  className="flex items-center gap-2 data-[state=active]:bg-background"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Cloud</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mode Description */}
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            {mode === "local" && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Local mode</span> — Work directly in your current project directory. Changes are applied immediately.
              </p>
            )}
            {mode === "worktree" && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Worktree mode</span> — Isolate changes in a Git worktree. Perfect for trying new ideas without touching your current work.
              </p>
            )}
            {mode === "cloud" && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Cloud mode</span> — Run remotely in a configured cloud environment. Great for resource-intensive tasks.
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick starts
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl text-left transition-colors group"
                onClick={() => setPrompt("Review the codebase and suggest improvements")}
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Code review</p>
                  <p className="text-xs text-muted-foreground">Analyze and improve code quality</p>
                </div>
              </button>
              <button 
                className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl text-left transition-colors group"
                onClick={() => setPrompt("Add comprehensive tests for the main features")}
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add tests</p>
                  <p className="text-xs text-muted-foreground">Write test coverage for features</p>
                </div>
              </button>
              <button 
                className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl text-left transition-colors group"
                onClick={() => setPrompt("Fix the current bug in the application")}
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Fix bug</p>
                  <p className="text-xs text-muted-foreground">Debug and resolve issues</p>
                </div>
              </button>
              <button 
                className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl text-left transition-colors group"
                onClick={() => setPrompt("Refactor the code for better maintainability")}
              >
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Refactor</p>
                  <p className="text-xs text-muted-foreground">Improve code structure</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/50">
        <div className="input-bar">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want Codex to do..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground resize-none min-h-[24px] max-h-[120px]"
            rows={1}
          />
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
              <span>GPT-5.2-Codex</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <Button 
              size="icon" 
              className="rounded-full"
              onClick={handleSubmit}
              disabled={!prompt.trim()}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewThreadPanel;
