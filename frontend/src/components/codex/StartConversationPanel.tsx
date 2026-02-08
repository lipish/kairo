import { useState } from "react";
import { ArrowUp, Plus, ChevronDown, Mic, Mail, Code2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartConversationPanelProps {
  selectedWorkspace: string;
  onStartConversation?: (prompt: string) => void;
}

const StartConversationPanel = ({ 
  selectedWorkspace = "nebula",
  onStartConversation 
}: StartConversationPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("Planning");
  const [model, setModel] = useState("Gemini 3 Flash");

  const handleSubmit = () => {
    if (prompt.trim() && onStartConversation) {
      onStartConversation(prompt.trim());
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
        <div className="w-full max-w-2xl space-y-6">
          {/* Header with workspace selector and inbox link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg text-foreground">Start new conversation in</span>
              <button className="flex items-center gap-1 text-lg font-medium text-foreground hover:text-muted-foreground transition-colors">
                {selectedWorkspace}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
              <span>View Inbox</span>
            </button>
          </div>

          {/* Input Area */}
          <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, @ to mention, / for workflows"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground resize-none min-h-[60px]"
              rows={2}
            />
            
            {/* Bottom toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                  <ChevronDown className="w-3 h-3" />
                  <span>{mode}</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                  <ChevronDown className="w-3 h-3" />
                  <span>{model}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </button>
                <Button 
                  size="icon" 
                  className="rounded-full w-8 h-8"
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Code2 className="w-4 h-4" />
              <span>Open editor</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Play className="w-4 h-4" />
              <span>Use Playground</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConversationPanel;
