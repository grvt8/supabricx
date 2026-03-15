"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ClockCounterClockwise,
  CaretDown,
  Link,
  CloudCheckIcon
} from "@phosphor-icons/react";
import { useViewMode } from "./ViewModeContext";


export default function TopToolbar() {
  const [title, setTitle] = useState("Untitled Diagram");
  const [saveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const { viewMode, setViewMode } = useViewMode();
  const router = useRouter();

  return (
    <div className="flex h-14 w-full items-center border-b border-canvas-border justify-between bg-foreground backdrop-blur-md px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="Logo" className="h-10 w-10 md:h-14 md:w-14" width={100} height={10} />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-canvas-bg font-mono text-md text-black focus:outline-none w-40"
            placeholder="Untitled Diagram"
          />
          <div className={`h-2 w-2 rounded-full ${
            saveStatus === "saved" ? "bg-green-500" : 
            saveStatus === "saving" ? "bg-orange-500" : "bg-gray-500"
          }`} />
        </div>
      </div>

      {/* Center Section: View Mode Toggle */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-mainColor/10 rounded-lg p-1 border border-subColor/10">
        {[
          { id: "document", label: "Document" },
          { id: "both", label: "Both" },
          { id: "canvas", label: "Canvas" }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as "document" | "both" | "canvas")}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium transition-all
              ${viewMode === mode.id 
                ? "bg-mainColor text-white shadow-sm" 
                : "text-muted hover:text-black hover:bg-black/5"
              }
            `}
          >
            {mode.label}
          </button>
        ))}
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 rounded-full text-gray-700 transition-colors">
          <ClockCounterClockwise size={24} />
        </button>
        
        <button className="p-2 hover:bg-black/5 rounded-full text-gray-700 transition-colors">
          <CloudCheckIcon size={24} />
        </button>

        {/* Share Button */}
        <div className="flex items-center h-10 bg-mainColor hover:bg-mainColor/50 text-[#351300] rounded-full pl-4 pr-2 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 pr-3">
            <Link size={20} />
            <span className="font-semibold text-sm">Share</span>
          </div>
          <div className="h-full w-px bg-subColor" />
          <button className="pl-2 h-full flex items-center justify-center">
            <CaretDown size={16} weight="bold" />
          </button>
        </div>

        {/* User Profile */}
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="relative p-[2px] rounded-full bg-white cursor-pointer"
        >
          <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#FFB563 0deg 90deg, #F85E00 90deg 270deg, #FBBC05 270deg 360deg)" }} />
          <div className="relative h-10 w-10 rounded-full border-2 border-white bg-white overflow-hidden">
            <Image 
              src="/user.jpeg" 
              alt="User" 
              fill 
              className="object-cover"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
