import { 
  Cursor, 
  HandGrabbing, 
  Square, 
  Circle, 
  ArrowUpRight, 
  Pencil, 
  TextT, 
  Plus, 
  X,
  GearSix
} from "@phosphor-icons/react";

interface ToolSidebarProps {
  isOpen: boolean;
  toggle: () => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export default function ToolSidebar({ isOpen, toggle, activeTool, setActiveTool }: ToolSidebarProps) {
  const tools = [
    { id: "select", icon: Cursor, label: "Select" },
    { id: "hand", icon: HandGrabbing, label: "Pan" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "line", icon: ArrowUpRight, label: "Line" },
    { id: "draw", icon: Pencil, label: "Draw" },
    { id: "text", icon: TextT, label: "Text" },
    { id: "settings", icon: GearSix, label: "Settings" },
  ];

  return (
    <div className="flex h-full w-[60px] flex-col items-center bg-foreground py-4 z-50 border-r border-border-black/10 shadow-sm">
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className={`
          flex h-10 w-10 items-center justify-center rounded-xl 
          transition-all duration-300 mb-6
          ${isOpen 
            ? "bg-black text-white hover:bg-black/80" 
            : "bg-canvas-bg text-black hover:bg-mainColor hover:text-white"
          }
        `}
      >
        {isOpen ? <X size={20} weight="bold" /> : <Plus size={20} weight="bold" />}
      </button>

      {/* Tools */}
      <div className="flex flex-col gap-3 w-full px-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`
              group relative flex h-10 w-full items-center justify-center rounded-lg 
              transition-colors duration-200
              ${activeTool === tool.id 
                ? "bg-orange-50 text-orange-500" 
                : "text-muted hover:bg-canvas-bg hover:text-black"
              }
            `}
            title={tool.label}
          >
            <tool.icon 
              size={20} 
              weight={activeTool === tool.id ? "fill" : "regular"} 
            />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 hidden rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
              {tool.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
