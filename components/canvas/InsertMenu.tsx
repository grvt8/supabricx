import { MagnifyingGlass, Sparkle, TreeStructure, Cloud, ChartBar, Database, FileCode } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface InsertMenuProps {
  isOpen: boolean;
  onSelectDiagram: (type: string) => void;
  width?: number;
}

export default function InsertMenu({ isOpen, onSelectDiagram, width = 320 }: InsertMenuProps) {
  const menuItems = [
    {
      id: "ai",
      label: "AI diagram",
      description: "Generate diagram with natural language",
      icon: Sparkle,
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
      id: "cloud",
      label: "Cloud Architecture",
      description: "Visualize your infrastructure",
      icon: Cloud,
      color: "text-black"
    },
    {
      id: "bpmn",
      label: "BPMN",
      description: "Visualize business processes with swimlanes",
      icon: ChartBar,
      color: "text-black"
    },
    {
      id: "erd",
      label: "Entity Relationship",
      description: "Visualize data models",
      icon: Database,
      color: "text-black"
    },
    {
      id: "sequence",
      label: "Sequence",
      description: "Visualize system flow and interactions",
      icon: TreeStructure,
      color: "text-black"
    },
    {
      id: "image",
      label: "Image-to-diagram",
      description: "Import image file",
      icon: FileCode,
      color: "text-black"
    }
  ];

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
            <span>All Categories</span>
            <span>/</span>
            <span className="text-black">Diagram as Code</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectDiagram(item.id)}
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
        </div>
      </div>
    </motion.div>
  );
}
