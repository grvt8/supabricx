"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  CaretDown,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { NODE_CATEGories, ICON_MAP } from "./constants";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  width?: number;
}

export default function LeftSidebar({ isOpen, toggle: _toggle, width = 280 }: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>("compute");
  void _toggle;
  
  const iconBg = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");
    const full = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? width : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-foreground transition-all overflow-hidden z-40 relative"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 shrink-0">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-medium text-black whitespace-nowrap"
            >
              Components
            </motion.span>
          )}
        </AnimatePresence>
        {/*<button
          onClick={toggle}
          className="p-1.5 rounded text-black bg-canvas-bg hover:bg-mainColor transition-colors"
        >
          <SidebarIcon size={20} />
        </button>*/}
      </div>

      <div className={`px-4 pb-2 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-300`}>
        <div className="flex items-center gap-2 text-xs font-medium text-black/40">
          <span>All</span>
          <span>/</span>
          <span className="text-black">System Architecture</span>
        </div>
      </div>

      {/* Search */}
      <div className={`p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-canvas-bg rounded-md py-1.5 pl-9 pr-3 text-sm text-black placeholder:text-muted focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        {NODE_CATEGories.map((category) => {
          const CategoryIcon = ICON_MAP[category.iconName];
          
          return (
            <div key={category.id} className="">
              <button
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className={`flex w-full items-center justify-between px-4 py-3 hover:bg-canvas-bg transition-colors ${
                  !isOpen && "justify-center px-2"
                }`}
                title={!isOpen ? category.label : undefined}
              >
                <div className="flex items-center gap-3 text-sm font-medium text-black">
                  <span className={`${activeCategory === category.id ? "text-orange-400" : ""}`}>
                    <CategoryIcon size={25} weight="fill" color={category.color} />
                  </span>
                  {isOpen && <span>{category.label}</span>}
                </div>
                {isOpen && (
                  <CaretDown
                    size={14}
                    className={`text-muted transition-transform duration-200 ${
                      activeCategory === category.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              
              <AnimatePresence>
                {isOpen && activeCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-canvas-bg"
                  >
                    <div className="px-4 pb-3 pt-1 space-y-1">
                      {category.items.map((item) => {
                        const ItemIcon = ICON_MAP[item.iconName];
                        
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-border-dark cursor-grab active:cursor-grabbing group transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("application/reactflow", item.label);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                          >
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-lg"
                              style={{ backgroundColor: iconBg(item.color, 0.2) }}
                            >
                              {item.imageSrc ? (
                                <Image src={item.imageSrc} alt={item.label} width={16} height={16} />
                              ) : (
                                <ItemIcon size={20} color={item.color} />
                              )}
                            </div>
                            <span className="text-sm text-black/50 group-hover:text-foreground transition-colors">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
