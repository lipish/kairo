import { Settings, Code2 } from "lucide-react";
import TrafficLights from "./TrafficLights";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      {/* Left: Traffic Lights */}
      <div className="w-64 flex items-center gap-4">
        <TrafficLights />
      </div>

      {/* Center: Title */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-sm font-medium">Agent Manager</h1>
      </div>

      {/* Right: Actions */}
      <div className="w-64 flex items-center justify-end gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors">
          <Code2 className="w-4 h-4" />
          <span>Open Editor</span>
        </button>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Header;
