"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { HardDrives, DotsThreeVertical, Code, CheckCircle, Warning } from "@phosphor-icons/react";

const ServiceNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[220px] rounded-lg border bg-card-bg shadow-lg transition-all ${selected ? 'border-orange-400 ring-1 ring-orange-400' : 'border-border-dark'}`}>
      {/* Header */}
      <div className="flex h-8 items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-400 to-orange-500 px-3 py-2">
        <div className="flex items-center gap-2">
          <HardDrives size={16} className="text-white" weight="bold" />
          <span className="font-display text-xs font-bold text-white truncate max-w-[140px]">
            {data.label || "Microservice"}
          </span>
        </div>
        <button className="text-white/80 hover:text-white">
          <DotsThreeVertical size={16} weight="bold" />
        </button>
      </div>

      {/* Body */}
      <div className="bg-background p-3 rounded-b-lg relative overflow-hidden">
        {/* Decorative Icon */}
        <Code size={48} className="absolute -bottom-2 -right-2 text-muted opacity-10 rotate-12" />

        <div className="space-y-2 relative z-10">
          {/* Language Badge */}
          <div className="flex justify-between items-center">
             <span className="text-xs font-mono text-muted">Lang:</span>
             <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10">
               {data.language || "Node.js"}
             </span>
          </div>

          {/* Port */}
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Port:</span>
            <span className="text-foreground">{data.port || ":8080"}</span>
          </div>

          {/* Health Status */}
          <div className="flex justify-between text-xs font-mono items-center">
            <span className="text-muted">Health:</span>
            <div className="flex items-center gap-1.5">
              {data.status === 'degraded' ? (
                 <Warning size={12} className="text-orange-400" weight="fill" />
              ) : (
                 <CheckCircle size={12} className="text-green-500" weight="fill" />
              )}
              <span className={data.status === 'degraded' ? "text-orange-400" : "text-green-500"}>
                {data.status === 'degraded' ? 'Degraded' : 'OK'}
              </span>
            </div>
          </div>

          {/* Instances */}
          <div className="flex justify-between text-xs font-mono">
             <span className="text-muted">Replicas:</span>
             <span className="bg-border-dark px-1.5 rounded text-foreground">
               x{data.instances || 1}
             </span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
};

export default memo(ServiceNode);
