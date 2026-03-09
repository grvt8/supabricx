"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { DotsThreeVertical } from "@phosphor-icons/react";

interface BaseNodeData {
  label: string;
  icon?: React.ReactNode;
  properties?: Record<string, string>;
  type?: string;
}

const BaseNode = ({ data, selected }: NodeProps<BaseNodeData>) => {
  return (
    <div className={`w-[200px] rounded-lg border bg-card-bg shadow-lg transition-all ${selected ? 'border-orange-400 ring-1 ring-orange-400' : 'border-border-dark'}`}>
      {/* Header */}
      <div className="flex h-8 items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-400 to-orange-500 px-2">
        <div className="flex items-center gap-2">
          {data.icon && <span className="text-white">{data.icon}</span>}
          <span className="font-display text-xs font-bold text-white truncate max-w-[120px]">
            {data.label}
          </span>
        </div>
        <button className="text-white/80 hover:text-white">
          <DotsThreeVertical size={16} weight="bold" />
        </button>
      </div>

      {/* Body */}
      <div className="bg-background p-3 rounded-b-lg">
        {data.properties && (
          <div className="space-y-1">
            {Object.entries(data.properties).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs font-mono">
                <span className="text-muted">{key}:</span>
                <span className="text-foreground truncate max-w-[100px]" title={value}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(BaseNode);
