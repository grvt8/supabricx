"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import TopToolbar from "./TopToolbar";
import CanvasArea from "./CanvasArea";
import { CaretLeft } from "@phosphor-icons/react";

export default function CanvasLayout() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [leftWidth] = useState(280);
  const [rightWidth] = useState(380);

  // Persist state
  useEffect(() => {
    const savedLeft = localStorage.getItem("canvas-left-sidebar");
    const savedRight = localStorage.getItem("canvas-right-sidebar");
    if (savedLeft) setLeftSidebarOpen(savedLeft === "true");
    if (savedRight) setRightSidebarOpen(savedRight === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("canvas-left-sidebar", leftSidebarOpen.toString());
  }, [leftSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("canvas-right-sidebar", rightSidebarOpen.toString());
  }, [rightSidebarOpen]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-background)] text-foreground">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar 
          isOpen={leftSidebarOpen} 
          toggle={() => setLeftSidebarOpen(!leftSidebarOpen)} 
          width={leftWidth}
        />
        
        <CanvasArea />
        
        <RightSidebar 
          isOpen={rightSidebarOpen} 
          toggle={() => setRightSidebarOpen(!rightSidebarOpen)}
          width={rightWidth}
        />

        {!rightSidebarOpen && (
          <button 
            onClick={() => setRightSidebarOpen(true)}
            className="absolute right-4 top-4 z-50 p-2 bg-card-bg rounded-full text-foreground shadow-lg hover:text-orange-400 transition-colors"
          >
            <CaretLeft size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
