import { X, Check } from "lucide-react";

interface DiffLine {
  type: "add" | "remove" | "context";
  content: string;
}

interface DiffFile {
  filename: string;
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

const DiffPanel = () => {
  const files: DiffFile[] = [
    {
      filename: "src/hero.tsx",
      additions: 8,
      deletions: 5,
      lines: [
        { type: "context", content: "export const hero = {" },
        { type: "remove", content: '  eyebrow: "New",' },
        { type: "remove", content: '  title: "Codex",' },
        { type: "remove", content: '  subtitle: "AI for developers",' },
        { type: "add", content: '  eyebrow: "Introducing",' },
        { type: "add", content: '  title: "Codex app",' },
        { type: "add", content: '  subtitle: "Your AI pair programmer",' },
        { type: "add", content: '  primaryCta: "Get started",' },
        { type: "add", content: '  secondaryCta: "Download the CLI",' },
        { type: "context", content: "};" },
        { type: "context", content: "" },
        { type: "context", content: "export const heroBullets = [" },
        { type: "remove", content: '  "Write code faster",' },
        { type: "remove", content: '  "Understand any repo",' },
        { type: "add", content: '  "Understands your repo in seconds",' },
        { type: "add", content: '  "Executes commands safely in a sandbox",' },
        { type: "add", content: '  "Turns issues into reviewed, production-ready PRs",' },
        { type: "context", content: "];" },
      ],
    },
    {
      filename: "tools/build.py",
      additions: 1,
      deletions: 1,
      lines: [
        { type: "context", content: "def build():" },
        { type: "remove", content: '    print("building")' },
        { type: "add", content: '    print("building launch hero...")' },
        { type: "context", content: "" },
        { type: "context", content: 'if __name__ == "__main__":' },
        { type: "context", content: "    build()" },
      ],
    },
  ];

  const totalAdditions = files.reduce((acc, f) => acc + f.additions, 0);
  const totalDeletions = files.reduce((acc, f) => acc + f.deletions, 0);

  return (
    <div className="w-96 flex flex-col h-full border-l border-border/50 bg-card/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">2 files changed</span>
          <span className="text-sm text-accent">+{totalAdditions}</span>
          <span className="text-sm text-destructive">-{totalDeletions}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <Check className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {files.map((file) => (
          <div key={file.filename} className="border-b border-border/50">
            {/* File Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium">
                  {file.filename}
                </span>
                <span className="text-xs text-accent">+{file.additions}</span>
                <span className="text-xs text-destructive">-{file.deletions}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <Check className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Diff Lines */}
            <div className="text-xs font-mono">
              {file.lines.map((line, index) => (
                <div
                  key={index}
                  className={`flex px-4 py-0.5 ${
                    line.type === "add"
                      ? "code-line-add"
                      : line.type === "remove"
                      ? "code-line-remove"
                      : ""
                  }`}
                >
                  <span className="w-4 text-muted-foreground select-none">
                    {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                  </span>
                  <span className="flex-1 whitespace-pre">{line.content}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiffPanel;
