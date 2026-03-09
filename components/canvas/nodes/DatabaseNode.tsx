"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Database, DotsThreeVertical, Cylinder } from "@phosphor-icons/react";

const DatabaseNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[220px] rounded-lg border bg-card-bg shadow-lg transition-all ${selected ? 'border-orange-400 ring-1 ring-orange-400' : 'border-border-dark'}`}>
      {/* Header */}
      <div className="flex h-8 items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-400 to-orange-500 px-3 py-2">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-white" weight="bold" />
          <span className="font-display text-xs font-bold text-white truncate max-w-[140px]">
            {data.label || "Database"}
          </span>
        </div>
        <button className="text-white/80 hover:text-white">
          <DotsThreeVertical size={16} weight="bold" />
        </button>
      </div>

      {/* Body */}
      <div className="bg-background p-3 rounded-b-lg relative overflow-hidden">
        {/* Decorative Icon */}
        <Cylinder size={48} className="absolute -bottom-2 -right-2 text-muted opacity-5 rotate-12" />

        <div className="space-y-2 relative z-10">
          {/* Type Badge */}
          <div className="flex justify-between items-center">
             <span className="text-xs font-mono text-muted">Type:</span>
             <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10">
               {data.type || "PostgreSQL"}
             </span>
          </div>

          {/* Connection */}
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Conn:</span>
            <span className="text-foreground font-mono bg-border-dark/50 px-1 rounded truncate max-w-[100px]" title={data.connection}>
              {data.connection || "postgres://***"}
            </span>
          </div>

          {/* Storage */}
          <div className="flex justify-between text-xs font-mono items-center">
            <span className="text-muted">Storage:</span>
            <span className="text-foreground">{data.storage || "50GB"}</span>
          </div>

          {/* Replicas */}
          <div className="flex justify-between text-xs font-mono">
             <span className="text-muted">Repl:</span>
             <span className="bg-border-dark px-1.5 rounded text-foreground">
               {data.replicas || "1 primary + 2 read"}
             </span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
};

export default memo(DatabaseNode);
