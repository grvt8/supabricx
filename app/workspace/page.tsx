"use client";

import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import Navbar from "../components/Navbar";
import { Plus } from "@phosphor-icons/react";
import Link from "next/link";

interface Workspace {
  id: string;
  title: string;
  description: string;
  nodeCount: number;
  lastEdited: string;
  status: "draft" | "active" | "archived";
}

export default function WorkspacesPage() {
  const Workspaces: Workspace[] = [
    {
      id: "1",
      title: "Daily 9am API Report Email",
      description: "Every day at 9am, fetch data from an API endpoint and email the results.",
      nodeCount: 3,
      lastEdited: "3/9/2026",
      status: "draft"
    },
    // Add more mock Workspaces if needed
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-display text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workspaces</h1>
            <p className="text-muted mt-2 font-mono text-sm">Create and manage your automation Workspaces</p>
          </div>
          <Link href="/canvas" className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors shadow-lg shadow-orange-500/20">
            <Plus size={20} weight="bold" />
            New Workspace
          </Link>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Workspaces.map((Workspace) => (
            <WorkspaceCard
              key={Workspace.id}
              title={Workspace.title}
              description={Workspace.description}
              nodeCount={Workspace.nodeCount}
              lastEdited={Workspace.lastEdited}
              status={Workspace.status}
            />
          ))}
          
          {/* Empty State / Add New Card Placeholder */}
          <Link href="/canvas" className="group flex flex-col items-center justify-center w-[320px] h-[180px] border-2 border-dashed border-border-dark rounded-xl p-5 hover:border-orange-400/50 hover:bg-card-bg/50 transition-all duration-300">
             <div className="h-12 w-12 rounded-full bg-border-dark flex items-center justify-center text-muted group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors mb-4">
               <Plus size={24} weight="bold" />
             </div>
             <span className="text-muted font-medium group-hover:text-foreground">Create new Workspace</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
