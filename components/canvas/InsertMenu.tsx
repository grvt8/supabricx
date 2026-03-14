import { MagnifyingGlass, Sparkle, TreeStructure, Cloud, ChartBar, Database, FileCode } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

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
      color: "text-white"
    },
    {
      id: "flowchart",
      label: "Flow Chart",
      description: "Visualize process and logic flows",
      icon: TreeStructure,
      color: "text-white"
    },
    {
      id: "cloud",
      label: "Cloud Architecture",
      description: "Visualize your infrastructure",
      icon: Cloud,
      color: "text-white"
    },
    {
      id: "bpmn",
      label: "BPMN",
      description: "Visualize business processes with swimlanes",
      icon: ChartBar,
      color: "text-white"
    },
    {
      id: "erd",
      label: "Entity Relationship",
      description: "Visualize data models",
      icon: Database,
      color: "text-white"
    },
    {
      id: "sequence",
      label: "Sequence",
      description: "Visualize system flow and interactions",
      icon: TreeStructure,
      color: "text-white"
    },
    {
      id: "image",
      label: "Image-to-diagram",
      description: "Import image file",
      icon: FileCode,
      color: "text-white"
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
      className="flex h-full flex-col bg-[#1A1A1A] overflow-hidden z-40 border-r border-white/10"
    >
      <div className="flex flex-col h-full w-[320px] shrink-0">
        {/* Header / Search */}
        <div className="p-4 pt-6">
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Insert item"
              className="w-full bg-white/5 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
          
          <div className="mt-6 mb-2 flex items-center gap-2 text-xs font-medium text-white/40 px-1">
            <span>All Categories</span>
            <span>/</span>
            <span className="text-white">Diagram as Code</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectDiagram(item.id)}
              className="flex items-start gap-4 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group text-left"
            >
              <div className="mt-0.5">
                <item.icon size={24} weight="fill" className={item.color} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-white/50 font-medium">
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
