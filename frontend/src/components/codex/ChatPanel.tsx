import { useState } from "react";
import { Check, Plus, ChevronDown, ArrowUp, Mic } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { Button } from "@/components/ui/button";

const ChatPanel = () => {
  const [showThought, setShowThought] = useState(false);
  const [showExplored, setShowExplored] = useState(false);
  const [showFile1, setShowFile1] = useState(false);
  const [showReadFile, setShowReadFile] = useState(false);
  const [showFile2, setShowFile2] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [prompt, setPrompt] = useState("");

  const introText = "I'll update the hero copy to clearly communicate what the app does, add outcome-focused bullets, and ensure the CTAs align with launch goals.";
  const summaryText = "Updated the launch hero to emphasize real developer outcomes (repo understanding, safe execution, PR delivery), and aligned the CTAs with launch intent.";

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    console.log("Sending:", prompt);
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
      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="message-bubble bg-primary text-primary-foreground">
            Create a compelling launch hero for the new app
          </div>
        </div>

        {/* AI Response */}
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-foreground leading-relaxed">
            <TypewriterText
              text={introText}
              speed={20}
              delay={300}
              onComplete={() => setShowThought(true)}
            />
          </p>

          {/* Thought indicator */}
          {showThought && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
              <TypewriterText
                text="Thought 7s"
                speed={40}
                onComplete={() => setShowExplored(true)}
              />
            </div>
          )}

          {/* Explored files */}
          {showExplored && (
            <div className="text-sm text-muted-foreground animate-fade-in">
              <TypewriterText
                text="Explored 2 files"
                speed={40}
                onComplete={() => setShowFile1(true)}
              />
            </div>
          )}

          {/* File Cards */}
          {showFile1 && (
            <div className="space-y-2 animate-fade-in">
              <div className="file-card animate-scale-in">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Edited</span>
                  <span className="font-medium font-mono text-sm">hero.tsx</span>
                </div>
                <Check className="w-4 h-4 text-accent" />
              </div>

              {!showReadFile && (
                <div className="h-6" onAnimationEnd={() => setShowReadFile(true)}>
                  <TypewriterText
                    text="Read build.py"
                    speed={40}
                    delay={400}
                    className="text-sm text-muted-foreground"
                    onComplete={() => setShowReadFile(true)}
                  />
                </div>
              )}

              {showReadFile && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Read build.py
                  </div>
                  {!showFile2 && (
                    <div onAnimationEnd={() => setShowFile2(true)}>
                      {setTimeout(() => setShowFile2(true), 500) && null}
                    </div>
                  )}
                </>
              )}

              {showFile2 && (
                <div className="file-card animate-scale-in">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Edited</span>
                    <span className="font-medium font-mono text-sm">build.py</span>
                  </div>
                  <Check className="w-4 h-4 text-accent" />
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {showFile2 && !showSummary && (
            <div onAnimationEnd={() => setShowSummary(true)}>
              {setTimeout(() => setShowSummary(true), 600) && null}
            </div>
          )}

          {showSummary && (
            <p className="text-sm text-foreground leading-relaxed animate-fade-in">
              <TypewriterText text={summaryText} speed={18} delay={200} />
            </p>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/50">
        <div className="input-bar">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, @ to mention, / for workflows"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground resize-none min-h-[24px] max-h-[120px]"
            rows={1}
          />
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
              <span>Planning</span>
              <ChevronDown className="w-4 h-4" />
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

export default ChatPanel;
