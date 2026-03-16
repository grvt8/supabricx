"use client";

import ProjectCard from "@/components/projects/ProjectCard";
import Navbar from "../components/Navbar";
import { Plus, Folder } from "@phosphor-icons/react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  diagramCount: number;
  lastEdited: string;
  status: "draft" | "active" | "archived";
}

export default function ProjectsPage() {
  const Projects: Project[] = [
    {
      id: "1",
      title: "Keihatsu System Diagrams",
      description: "Entity-Relationship Diagram (ERD) & Sequence Diagram for the Keihatsu app.",
      diagramCount: 3,
      lastEdited: "9/3/2026",
      status: "draft"
    },
    {
      id: "2",
      title: "FarmIntel Diagrams",
      description: "ERD, Class Diagram, & Sequence Diagram for the FarmIntel system.",
      diagramCount: 5,
      lastEdited: "17/3/2026",
      status: "active"
    },
    {
      id: "3",
      title: "Starlight Engine",
      description: "ERD, Class Diagram, & Sequence Diagram for the Starlight Engine system.",
      diagramCount: 3,
      lastEdited: "17/3/2026",
      status: "archived"
    },
    // Add more mock Projects if needed
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
            <div className="flex items-center gap-2">
              <Folder size={40} className="text-mainColor" weight="fill" />
              <h1 className="text-3xl font-bold text-black">Projects</h1>
            </div>
            <p className="text-muted mt-2 font-mono text-sm">Create and manage your Projects</p>
          </div>
          <Link href="/canvas" className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-mainColor hover:bg-mainColor/60 text-black font-medium transition-colors shadow-lg shadow-orange-500/20">
            <Plus size={20} weight="bold" />
            New Project
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Projects.map((Project) => (
            <ProjectCard
              key={Project.id}
              title={Project.title}
              description={Project.description}
              diagramCount={Project.diagramCount}
              lastEdited={Project.lastEdited}
              status={Project.status}
            />
          ))}
          
          {/* Empty State / Add New Card Placeholder 
          <Link href="/canvas" className="group flex flex-col items-center justify-center w-[320px] h-[180px] border-2 border-dashed border-border-dark rounded-xl p-5 hover:border-mainColor hover:bg-gray-100 transition-all duration-300">
             <div className="h-12 w-12 rounded-full bg-border-dark flex items-center justify-center text-muted group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors mb-4">
               <Plus size={24} weight="bold" />
             </div>
             <span className="text-muted font-medium group-hover:text-black">Create new Project</span>
          </Link> */}
        </div>
      </main>
    </div>
  );
}
