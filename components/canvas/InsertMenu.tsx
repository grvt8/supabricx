import { useState } from "react";
import { MagnifyingGlass, Sparkle, Shapes, TreeStructure, Cloud, ChartBar, Database, FileCode, SquaresFour, Clock } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface InsertMenuProps {
  isOpen: boolean;
  onSelectDiagram: (type: string) => void;
  width?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description?: string;
  hasSubmenu?: boolean;
  action?: string;
}

export default function InsertMenu({ isOpen, onSelectDiagram, width = 320 }: InsertMenuProps) {
  const [currentView, setCurrentView] = useState<"main" | "diagram-types">("main");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["All"]);

  const mainMenu: MenuItem[] = [
    { id: "ai", label: "AI Diagrams", icon: Sparkle, color: "text-black" },
    { id: "diagram-types", label: "Diagram Types", icon: TreeStructure, color: "text-black", hasSubmenu: true },
    { id: "templates", label: "Templates", icon: SquaresFour, color: "text-black" },
    { id: "recent", label: "Recent & Favorites", icon: Clock, color: "text-black" },
    { id: "shapes", label: "Shapes", icon: Shapes, color: "text-black" },
  ];

  const diagramTypesMenu: MenuItem[] = [
    {
      id: "system-architecture",
      label: "System Architecture",
      description: "High-level system overview",
      icon: Database,
      color: "text-black",
      action: "open-sidebar"
    },
    {
      id: "cloud",
      label: "Cloud Architecture",
      description: "Visualize your infrastructure",
      icon: Cloud,
      color: "text-black"
    },
    {
      id: "flowchart",
      label: "Flow Chart",
      description: "Visualize process and logic flows",
      icon: TreeStructure,
      color: "text-black"
    },
    {
      id: "sequence",
      label: "Sequence Diagram",
      description: "Show service interactions",
      icon: TreeStructure,
      color: "text-black"
    },
    {
      id: "bpmn",
      label: "BPMN",
      description: "Business processes with lanes",
      icon: ChartBar,
      color: "text-black"
    },
    {
      id: "api",
      label: "API Design",
      description: "Endpoint & schema visualization",
      icon: FileCode,
      color: "text-black"
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      setCurrentView(item.id as "main" | "diagram-types");
      setBreadcrumbs(["All", item.label]);
    } else if (item.action === "open-sidebar") {
      onSelectDiagram(item.id);
    } else {
      // Default action or placeholder
      console.log(`Selected: ${item.label}`);
    }
  };

  const navigateToCrumb = (crumb: string, index: number) => {
    if (index === 0) {
      setCurrentView("main");
      setBreadcrumbs(["All"]);
      return;
    }

    if (crumb === "Diagram Types") {
      setCurrentView("diagram-types");
      setBreadcrumbs(["All", "Diagram Types"]);
      return;
    }
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: isOpen ? width : 0, 
        opacity: isOpen ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-foreground overflow-hidden z-40 border-r border-black/10"
    >
      <div className="flex flex-col h-full w-[320px] shrink-0">
        {/* Header / Search */}
        <div className="p-4 pt-6">
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
            <input
              type="text"
              placeholder="Insert item"
              className="w-full bg-black/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
            />
          </div>
          
          <div className="mt-6 mb-2 flex items-center gap-2 text-xs font-medium text-black/40 px-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <button
                  type="button"
                  onClick={() => navigateToCrumb(crumb, index)}
                  className={`transition-colors ${
                    index === breadcrumbs.length - 1 ? "text-black" : "hover:text-black"
                  }`}
                >
                  {crumb}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
          <AnimatePresence mode="wait">
            {currentView === "main" ? (
              <motion.div
                key="main"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-2"
              >
                {mainMenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-4 w-full p-4 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 hover:border-black/10 transition-all group text-left"
                  >
                    <div className="mt-0.5">
                      <item.icon size={24} weight="fill" className={item.color} />
                    </div>
                    <span className="text-sm font-semibold text-black group-hover:text-black transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="submenu"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-2"
              >
                {diagramTypesMenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-start gap-4 w-full p-4 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 hover:border-black/10 transition-all group text-left"
                  >
                    <div className="mt-0.5">
                      <item.icon size={24} weight="fill" className={item.color} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-black group-hover:text-black transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs text-black/50 font-medium">
                        {item.description}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
