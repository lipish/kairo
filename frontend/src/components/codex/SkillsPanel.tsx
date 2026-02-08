import { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  Search,
  Code,
  FileText,
  TestTube,
  Bug,
  Layers,
  GitBranch,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewSkillDialog, { SkillIcon } from "./NewSkillDialog";

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: SkillIcon;
  usageCount: number;
  isPersonal: boolean;
}

const iconMap = {
  code: Code,
  file: FileText,
  test: TestTube,
  bug: Bug,
  layers: Layers,
  git: GitBranch
};

const SkillsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "1",
      name: "React Component Generator",
      description: "Generate React components with TypeScript, props interface, and tests",
      icon: "code",
      usageCount: 47,
      isPersonal: false
    },
    {
      id: "2",
      name: "API Documentation",
      description: "Generate comprehensive API documentation from code",
      icon: "file",
      usageCount: 23,
      isPersonal: false
    },
    {
      id: "3",
      name: "Unit Test Writer",
      description: "Write unit tests for existing functions with edge cases",
      icon: "test",
      usageCount: 56,
      isPersonal: true
    },
    {
      id: "4",
      name: "Bug Hunter",
      description: "Analyze code for common bugs and security vulnerabilities",
      icon: "bug",
      usageCount: 34,
      isPersonal: false
    },
    {
      id: "5",
      name: "Code Refactorer",
      description: "Refactor code for better readability and maintainability",
      icon: "layers",
      usageCount: 28,
      isPersonal: true
    },
    {
      id: "6",
      name: "Git Commit Helper",
      description: "Generate meaningful commit messages from staged changes",
      icon: "git",
      usageCount: 89,
      isPersonal: false
    }
  ]);

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const personalSkills = filteredSkills.filter(s => s.isPersonal);
  const teamSkills = filteredSkills.filter(s => !s.isPersonal);

  const handleCreateSkill = (skillData: {
    name: string;
    description: string;
    icon: SkillIcon;
    prompt: string;
    isPersonal: boolean;
  }) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillData.name,
      description: skillData.description,
      icon: skillData.icon,
      usageCount: 0,
      isPersonal: skillData.isPersonal,
    };
    setSkills((prev) => [newSkill, ...prev]);
  };

  return (
    <>
      <NewSkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateSkill={handleCreateSkill}
      />
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-semibold">Skills</h1>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Create skill
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {/* Personal Skills */}
        {personalSkills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Personal skills
            </h2>
            <div className="space-y-2">
              {personalSkills.map((skill) => {
                const IconComponent = iconMap[skill.icon];
                return (
                  <div 
                    key={skill.id}
                    className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <IconComponent className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {skill.description}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 inline-block">
                          Used {skill.usageCount} times
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Skills */}
        {teamSkills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Team skills
            </h2>
            <div className="space-y-2">
              {teamSkills.map((skill) => {
                const IconComponent = iconMap[skill.icon];
                return (
                  <div 
                    key={skill.id}
                    className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <IconComponent className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <button className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {skill.description}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 inline-block">
                          Used {skill.usageCount} times
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No skills found</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default SkillsPanel;
