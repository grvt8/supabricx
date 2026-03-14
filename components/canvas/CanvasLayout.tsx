"use client";

import { useState, useEffect } from "react";
import { Node } from "reactflow";
import LeftSidebar from "./LeftSidebar";
import ToolSidebar from "./ToolSidebar";
import InsertMenu from "./InsertMenu";
import RightSidebar from "./RightSidebar";
import PropertiesSidebar from "./PropertiesSidebar";
import TopToolbar from "./TopToolbar";
import CanvasArea from "./CanvasArea";
import { CaretLeft } from "@phosphor-icons/react";

export default function CanvasLayout() {
  const [isInsertMenuOpen, setIsInsertMenuOpen] = useState(false);
  const [isComponentLibraryOpen, setIsComponentLibraryOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("select");
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [leftWidth] = useState(280);
  const [rightWidth] = useState(380);

  // Toggle Insert Menu
  const toggleInsertMenu = () => {
    if (isInsertMenuOpen) {
      setIsInsertMenuOpen(false);
    } else {
      setIsInsertMenuOpen(true);
      setIsComponentLibraryOpen(false); // Close component library when opening insert menu
    }
  };

  // Handle diagram selection from Insert Menu
  const handleDiagramSelect = (type: string) => {
    // For now, any selection opens the component library
    setIsInsertMenuOpen(false);
    setIsComponentLibraryOpen(true);
  };

  // Persist state (Right Sidebar only for now)
  useEffect(() => {
    const savedRight = localStorage.getItem("canvas-right-sidebar");
    if (savedRight) setRightSidebarOpen(savedRight === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("canvas-right-sidebar", rightSidebarOpen.toString());
  }, [rightSidebarOpen]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-background)] text-foreground">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Tool Sidebar (Always visible) */}
        <ToolSidebar 
          isOpen={isInsertMenuOpen || isComponentLibraryOpen} 
          toggle={() => {
            if (isInsertMenuOpen || isComponentLibraryOpen) {
              setIsInsertMenuOpen(false);
              setIsComponentLibraryOpen(false);
            } else {
              setIsInsertMenuOpen(true);
            }
          }}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />

        {/* Insert Menu (Overlay or Push) */}
        <InsertMenu 
          isOpen={isInsertMenuOpen} 
          onSelectDiagram={handleDiagramSelect}
          width={320}
        />

        {/* Component Library (Left Sidebar) */}
        {/* <LeftSidebar 
          isOpen={isComponentLibraryOpen} 
          toggle={() => setIsComponentLibraryOpen(!isComponentLibraryOpen)} 
          width={leftWidth}
        /> */}
        
        <CanvasArea onNodeSelect={setSelectedNode} />
        
        <RightSidebar 
          isOpen={rightSidebarOpen && !selectedNode} 
          toggle={() => setRightSidebarOpen(!rightSidebarOpen)}
          width={rightWidth}
        />

        <PropertiesSidebar 
          isOpen={!!selectedNode} 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)} 
        />

        {!rightSidebarOpen && !selectedNode && (
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
