import { useState } from "react";
import { Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface NewAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (automation: {
    name: string;
    prompt: string;
    schedule: string;
    project: string;
  }) => void;
}

const scheduleOptions = [
  { value: "hourly", label: "Every hour" },
  { value: "6hours", label: "Every 6 hours" },
  { value: "daily", label: "Every day at 9:00 AM" },
  { value: "weekly", label: "Every Monday at 10:00 AM" },
  { value: "monthly", label: "First day of each month" },
];

const projectOptions = [
  { value: "Codex", label: "Codex" },
  { value: "ChatGPT", label: "ChatGPT" },
  { value: "Sora", label: "Sora" },
  { value: "Atlas", label: "Atlas" },
];

const NewAutomationDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: NewAutomationDialogProps) => {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [schedule, setSchedule] = useState("");
  const [project, setProject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt || !schedule || !project) return;

    const scheduleLabel = scheduleOptions.find(s => s.value === schedule)?.label || schedule;
    
    onSubmit({
      name,
      prompt,
      schedule: scheduleLabel,
      project,
    });

    // Reset form
    setName("");
    setPrompt("");
    setSchedule("");
    setProject("");
    onOpenChange(false);
  };

  const isValid = name && prompt && schedule && project;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            New Automation
          </DialogTitle>
          <DialogDescription>
            Create a scheduled task that runs automatically on your codebase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Daily code review"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what this automation should do..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger id="schedule">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Create automation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAutomationDialog;
