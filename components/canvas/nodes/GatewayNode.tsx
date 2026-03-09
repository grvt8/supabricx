"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Shield, DotsThreeVertical, ArrowRight, Pulse, Globe } from "@phosphor-icons/react";

const GatewayNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={`w-[220px] rounded-lg border bg-card-bg shadow-lg transition-all ${selected ? 'border-orange-400 ring-1 ring-orange-400' : 'border-border-dark'}`}>
      {/* Header */}
      <div className="flex h-8 items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-400 to-orange-500 px-3 py-2">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-white" weight="bold" />
          <span className="font-display text-xs font-bold text-white truncate max-w-[140px]">
            {data.label || "API Gateway"}
          </span>
        </div>
        <button className="text-white/80 hover:text-white">
          <DotsThreeVertical size={16} weight="bold" />
        </button>
      </div>

      {/* Body */}
      <div className="bg-background p-3 rounded-b-lg relative overflow-hidden">
        {/* Decorative Icon */}
        <Globe size={48} className="absolute -bottom-2 -right-2 text-muted opacity-5 rotate-12" />

        <div className="space-y-2 relative z-10">
          {/* Type Badge */}
          <div className="flex justify-between items-center">
             <span className="text-xs font-mono text-muted">Type:</span>
             <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-400 bg-orange-500/10">
               {data.type || "API Gateway"}
             </span>
          </div>

          {/* Rules */}
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Rules:</span>
            <div className="flex items-center gap-1">
              <ArrowRight size={12} className="text-muted" />
              <span className="text-foreground">{data.routes || "12 routes"}</span>
            </div>
          </div>

          {/* Rate Limit */}
          <div className="flex justify-between text-xs font-mono items-center">
            <span className="text-muted">Rate Limit:</span>
            <div className="flex items-center gap-1">
              <Pulse size={12} className="text-orange-400" />
              <span className="text-foreground">{data.rateLimit || "1000 req/min"}</span>
            </div>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
};

export default memo(GatewayNode);
