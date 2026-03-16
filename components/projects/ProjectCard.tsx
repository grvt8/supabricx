"use client";

import { Clock, ArrowRight, Network, Folder, FolderOpen } from "@phosphor-icons/react";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  diagramCount: number;
  lastEdited: string;
  status?: "draft" | "active" | "archived";
}

export default function ProjectCard({
  title,
  description,
  diagramCount,
  lastEdited,
  status = "draft",
}: ProjectCardProps) {
  return (
    <Link 
      href="/canvas"
      className="group flex flex-col justify-between w-[320px] h-[200px] bg-card-bg border border-border-dark rounded-xl p-5 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 relative overflow-hidden hover:translate-y-[-10px]"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-border-dark/50 border border-border-dark text-[10px] uppercase font-bold tracking-wider text-muted">
        {status}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="h-10 w-10 rounded-lg bg-mainColor/10 flex items-center justify-center text-mainColor border border-mainColor/20 group-hover:scale-105 transition-transform">
          <FolderOpen size={20} weight="fill" />
        </div>
        
        <div>
          <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-mainColor transition-colors">
            {title}
          </h3>
          <p className="font-mono text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-dark/50">
        <div className="flex items-center gap-3 text-xs text-muted font-mono">
          <span className="flex items-center gap-1">
            <Network size={20} color="#FFB563" weight="fill"/>
            {diagramCount} diagrams
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {lastEdited}
          </span>
        </div>
        
        <div className="text-muted group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
