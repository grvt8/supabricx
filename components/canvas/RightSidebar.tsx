"use client";

import { useState } from "react";
import { 
  CaretRight, 
  Trash, 
  Gear, 
  PaperPlaneRight,
  CheckCircle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  width?: number;
}

export default function RightSidebar({ isOpen, toggle, width = 380 }: SidebarProps) {
  const [message, setMessage] = useState("");
  
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? width : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col border-l border-border-dark bg-card-bg overflow-hidden z-40 relative"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-border-dark shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-orange-400 transition-colors"
          >
            <CaretRight size={16} className={!isOpen ? "rotate-180" : ""} />
          </button>
          <span className="font-display font-medium text-foreground">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-red-400 transition-colors" title="Clear History">
            <Trash size={16} />
          </button>
          <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-orange-400 transition-colors" title="Settings">
            <Gear size={16} />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        {/* Placeholder for chat messages */}
        <div className="flex flex-col gap-2">
          <div className="bg-background border border-border-dark rounded-lg rounded-tl-none p-3 max-w-[90%] self-start">
            <p className="text-sm text-foreground font-display">
              Hello! I&apos;m Supabricx AI. How can I help you design your architecture today?
            </p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border-dark bg-card-bg">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your architecture..."
            className="w-full bg-background border border-border-dark rounded-lg p-3 pr-12 text-sm font-mono text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none min-h-[80px]"
          />
          <button
            className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-md text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!message.trim()}
          >
            <PaperPlaneRight size={16} weight="bold" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-muted font-mono">{message.length} chars</span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <CheckCircle size={12} className="text-green-500" />
            <span>Ready</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
