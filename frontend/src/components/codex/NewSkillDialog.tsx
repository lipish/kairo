import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, FileText, TestTube, Bug, Layers, GitBranch } from "lucide-react";

export type SkillIcon = "code" | "file" | "test" | "bug" | "layers" | "git";

interface NewSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSkill: (skill: {
    name: string;
    description: string;
    icon: SkillIcon;
    prompt: string;
    isPersonal: boolean;
  }) => void;
}

const iconOptions: { value: SkillIcon; label: string; icon: React.ReactNode }[] = [
  { value: "code", label: "Code", icon: <Code className="w-4 h-4" /> },
  { value: "file", label: "File", icon: <FileText className="w-4 h-4" /> },
  { value: "test", label: "Test", icon: <TestTube className="w-4 h-4" /> },
  { value: "bug", label: "Bug", icon: <Bug className="w-4 h-4" /> },
  { value: "layers", label: "Layers", icon: <Layers className="w-4 h-4" /> },
  { value: "git", label: "Git", icon: <GitBranch className="w-4 h-4" /> },
];

const NewSkillDialog = ({ open, onOpenChange, onCreateSkill }: NewSkillDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<SkillIcon>("code");
  const [prompt, setPrompt] = useState("");
  const [scope, setScope] = useState<"personal" | "team">("personal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !prompt.trim()) return;

    onCreateSkill({
      name: name.trim(),
      description: description.trim(),
      icon,
      prompt: prompt.trim(),
      isPersonal: scope === "personal",
    });

    // Reset form
    setName("");
    setDescription("");
    setIcon("code");
    setPrompt("");
    setScope("personal");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create skill</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React Hook Generator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-description">Description</Label>
            <Input
              id="skill-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this skill does"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={(v) => setIcon(v as SkillIcon)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as "personal" | "team")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-prompt">System prompt</Label>
            <Textarea
              id="skill-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the system prompt for this skill..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !description.trim() || !prompt.trim()}>
              Create skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSkillDialog;
