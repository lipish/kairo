import { useState } from "react";
import { ArrowUp, Plus, ChevronDown, Mic, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlaygroundPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("GPT-4o");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "This is a simulated response from the AI model. In a real implementation, this would be connected to an actual AI backend." }
    ]);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Playground</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <span>{model}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg mb-2">Playground Mode</p>
            <p className="text-sm">Test prompts and experiment with different models</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/50">
        <div className="input-bar">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground resize-none min-h-[24px] max-h-[120px]"
            rows={1}
          />
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Mic className="w-4 h-4 text-muted-foreground" />
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

export default PlaygroundPanel;
