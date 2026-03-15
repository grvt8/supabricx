"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  CaretRight, 
  PaperPlaneTilt,
  CheckCircle,
  ClockCounterClockwise,
  Plus,
  FileText,
  GithubLogo,
  Chat
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
      className="flex h-full flex-col bg-foreground overflow-hidden z-40 relative"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-orange-400 transition-colors"
          >
            <CaretRight size={16} className={!isOpen ? "rotate-180" : ""} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-black">Bricx</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors" title="History">
            <ClockCounterClockwise size={16} />
          </button>
          <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors" title="New Chat">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Chat History / Empty State */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        {message.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Image src="/logo.png" alt="Supabricx AI" fill className="object-contain" />
              </div>
              <div className="text-center">
                <div className="text-xl font-display font-medium text-black">
                  Work with <span className="text-subColor">Supabricx</span>
                </div>
                <p className="mt-2 text-sm text-black/60 font-mono max-w-[320px]">
                  Generate architecture diagrams, refine system designs, and turn requirements into deployable blueprints.
                </p>
              </div>
            </div>
            
            <div className="w-full max-w-[340px]">
              <div className="text-sm font-dm-mono font-medium text-black/70 mb-3">
                Past Conversations
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { title: "Generate a SaaS microservices architecture", meta: "Today" },
                  
                ].map((item) => (
                  <button
                    key={item.title}
                    className="w-full flex items-center justify-between gap-3 rounded-xl bg-canvas-bg/70 hover:bg-canvas-bg transition-colors px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <Chat size={20} className="text-subColor" weight="fill" />
                      </div>
                      <span className="text-sm text-black/70 truncate font-display">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs text-black/40 shrink-0 font-mono">
                      {item.meta}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
             {/* Chat messages would go here */}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4">
        <div className="relative bg-canvas-bg rounded-2xl p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your architecture..."
            className="w-full bg-transparent pl-3 pr-12 text-sm font-mono text-black placeholder:text-muted focus:outline-none resize-none min-h-[40px]"
          />
          
          <div className="flex items-center justify-between px-2 pb-1">
             <div className="flex items-center gap-2">
               <button className="p-1.5 hover:bg-black/5 rounded-lg text-muted hover:text-foreground transition-colors">
                 <FileText size={18} />
               </button>
               <button className="p-1.5 hover:bg-black/5 rounded-lg text-muted hover:text-foreground transition-colors">
                 <GithubLogo size={18} />
               </button>
             </div>

             <button
               className="p-2 bg-subColor rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50"
               disabled={!message.trim()}
             >
               <PaperPlaneTilt size={16} weight="bold" />
             </button>
          </div>
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
