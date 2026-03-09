"use client";

import { useState } from "react";
import { ArrowUUpLeft, ArrowUUpRight, Plus, Minus, DotsThreeVertical } from "@phosphor-icons/react";

export default function TopToolbar() {
  const [title, setTitle] = useState("Untitled Diagram");
  const [saveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  return (
    <div className="flex h-14 w-full items-center justify-between border-b border-border-dark bg-card-bg/80 backdrop-blur-md px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="font-display text-xl font-bold gradient-orange-text">
          Supabricx
        </div>
        <div className="h-6 w-px bg-border-dark" />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent font-mono text-sm text-foreground focus:outline-none w-40"
            placeholder="Untitled Diagram"
          />
          <div className={`h-2 w-2 rounded-full ${
            saveStatus === "saved" ? "bg-green-500" : 
            saveStatus === "saving" ? "bg-orange-500" : "bg-gray-500"
          }`} />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2 rounded-lg bg-background p-1 border border-border-dark">
        <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors">
          <ArrowUUpLeft size={16} />
        </button>
        <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors">
          <ArrowUUpRight size={16} />
        </button>
        <div className="h-4 w-px bg-border-dark mx-1" />
        <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors">
          <Minus size={16} />
        </button>
        <span className="text-xs font-mono text-muted w-12 text-center">100%</span>
        <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Placeholder for user/menu */}
        <button className="p-2 hover:bg-border-dark rounded-full text-muted hover:text-foreground transition-colors">
          <DotsThreeVertical size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}
