"use client";

import { useState, useEffect, useRef } from "react";
import { Node } from "reactflow";
import LeftSidebar from "./LeftSidebar";
import ToolSidebar from "./ToolSidebar";
import InsertMenu from "./InsertMenu";
import RightSidebar from "./RightSidebar";
import PropertiesSidebar from "./PropertiesSidebar";
import TopToolbar from "./TopToolbar";
import CanvasArea, { CanvasApi } from "./CanvasArea";
import DocumentPanel from "./DocumentPanel";
import { CaretLeft } from "@phosphor-icons/react";
import { ViewModeProvider, useViewMode } from "./ViewModeContext";

function CanvasLayoutContent() {
  const [isInsertMenuOpen, setIsInsertMenuOpen] = useState(false);
  const [isComponentLibraryOpen, setIsComponentLibraryOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("select");
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [leftWidth] = useState(280);
  const [rightWidth] = useState(380);
  const { viewMode } = useViewMode();
  const canvasApiRef = useRef<CanvasApi | null>(null);

  // Handle diagram selection from Insert Menu
  const handleDiagramSelect = (type: string) => {
    setIsInsertMenuOpen(false);
    if (type === "system-architecture") {
      setIsComponentLibraryOpen(true);
    } else {
      setIsComponentLibraryOpen(false);
    }
  };

  // Persist state (Right Sidebar only for now)
  useEffect(() => {
    const savedRight = localStorage.getItem("canvas-right-sidebar");
    if (savedRight) setRightSidebarOpen(savedRight === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("canvas-right-sidebar", rightSidebarOpen.toString());
  }, [rightSidebarOpen]);

  // Determine which panels to show based on view mode
  const showDocument = viewMode === "document" || viewMode === "both";
  const showCanvas = viewMode === "canvas" || viewMode === "both";

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--color-background)] text-foreground">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Document View */}
        {showDocument && (
          <div className={`${viewMode === "both" ? "w-1/2 resize-x" : "w-full"} h-full relative z-30`}>
            <DocumentPanel />
          </div>
        )}

        {/* Canvas View */}
        {showCanvas && (
          <div className="flex-1 flex h-full relative overflow-hidden">
            {/* Tool Sidebar (Always visible in canvas mode) */}
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

            {isComponentLibraryOpen && (
              <LeftSidebar 
                isOpen={true} 
                toggle={() => setIsComponentLibraryOpen(false)} 
                width={leftWidth}
              />
            )}
            
            <CanvasArea
              onNodeSelect={setSelectedNode}
              onRegisterApi={(api) => {
                canvasApiRef.current = api;
              }}
            />
            
            <RightSidebar 
              isOpen={rightSidebarOpen && !selectedNode} 
              toggle={() => setRightSidebarOpen(!rightSidebarOpen)}
              width={rightWidth}
            />

            <PropertiesSidebar 
              isOpen={!!selectedNode} 
              node={selectedNode} 
              onClose={() => setSelectedNode(null)} 
              onUpdate={(nodeId, data) => {
                canvasApiRef.current?.updateNodeData(nodeId, data);
                setSelectedNode((prev) => (prev && prev.id === nodeId ? { ...prev, data } : prev));
              }}
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
        )}
      </div>
    </div>
  );
}

export default function CanvasLayout() {
  return (
    <ViewModeProvider>
      <CanvasLayoutContent />
    </ViewModeProvider>
  );
}
