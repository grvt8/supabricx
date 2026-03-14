import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { ICON_MAP } from '../constants';

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex) return `rgba(0, 0, 0, ${alpha})`;
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const UniversalNode = ({ data, selected }: NodeProps) => {
  const IconComponent = data.iconName ? ICON_MAP[data.iconName as keyof typeof ICON_MAP] : null;
  const color = data.color || '#000000';
  const bgColor = hexToRgba(color, 0.1); // 10% opacity for background
  const borderColor = hexToRgba(color, 0.5); // 50% opacity for border

  return (
    <div className="relative group">
      {/* Node Container */}
      <div
        className={`
          flex flex-col items-center justify-center
          w-20 h-20 rounded-2xl
          border-2 transition-all duration-200
          ${selected ? 'ring-2 ring-offset-2 ring-offset-white' : ''}
        `}
        style={{
          backgroundColor: bgColor,
          borderColor: selected ? color : borderColor,
          // Box shadow for depth
          boxShadow: selected ? `0 4px 12px ${hexToRgba(color, 0.2)}` : 'none',
        }}
      >
        {/* Icon or Image */}
        <div className="flex items-center justify-center text-foreground">
          {data.imageSrc ? (
            <div className="relative w-8 h-8">
              <Image 
                src={data.imageSrc} 
                alt={data.label} 
                fill 
                className="object-contain"
              />
            </div>
          ) : IconComponent ? (
            <IconComponent 
              size={32} 
              weight="fill" 
              color={color}
            />
          ) : null}
        </div>

        {/* Status Indicator (Optional - mimicking the red warning in reference image) */}
        {data.status === 'error' && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
             <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">!</div>
          </div>
        )}
      </div>

      {/* Label (Outside the box) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium text-black/70 font-display">
          {data.label}
        </span>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-white !border-2 !border-black/20"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-white !border-2 !border-black/20"
      />
    </div>
  );
};

export default memo(UniversalNode);
