import { Database, X, Trash, CaretDown, CaretRight } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Node } from "reactflow";
import { motion } from "framer-motion";
import { ICON_MAP } from "./constants";
import Image from "next/image";

interface PropertiesSidebarProps {
  isOpen: boolean;
  node: Node | null;
  onClose: () => void;
  onDelete?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, data: Record<string, unknown>) => void;
}

export default function PropertiesSidebar({ isOpen, node, onClose, onDelete, onUpdate }: PropertiesSidebarProps) {
  // Local state for form fields
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Reset form data when node changes
  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
    }
  }, [node]);

  if (!node) return null;

  const IconComponent = node.data.iconName ? ICON_MAP[node.data.iconName as keyof typeof ICON_MAP] : null;
  const color = (node.data.color as string) || "#000000";

  // Helper to update field
  const handleChange = (field: string, value: string | number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onUpdate && node) {
      onUpdate(node.id, newData);
    }
  };

  // Render specific fields based on node type
  const renderFields = () => {
    // Message Broker / Queue specific logic
    if (node.data.label === "Message Queue" || node.data.label === "Pub/Sub Topic") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">Broker Type</label>
            <div className="relative">
              <select
                value={(formData.brokerType as string) || "RabbitMQ"}
                onChange={(e) => handleChange("brokerType", e.target.value)}
                className="w-full appearance-none bg-canvas-bg border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              >
                <option value="RabbitMQ">RabbitMQ</option>
                <option value="Kafka">Apache Kafka</option>
                <option value="ActiveMQ">ActiveMQ</option>
                <option value="SQS">AWS SQS</option>
                <option value="Redis">Redis Pub/Sub</option>
              </select>
              <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40" size={14} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">Queue Name</label>
            <input
              type="text"
              value={(formData.queueName as string) || ""}
              onChange={(e) => handleChange("queueName", e.target.value)}
              placeholder="e.g. orders-queue"
              className="w-full bg-canvas-bg border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">Durability</label>
             <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-black/70">
                  <input 
                    type="radio" 
                    name="durability"
                    checked={formData.durability === "durable"} 
                    onChange={() => handleChange("durability", "durable")}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  Durable
                </label>
                <label className="flex items-center gap-2 text-sm text-black/70">
                  <input 
                    type="radio" 
                    name="durability"
                    checked={formData.durability === "transient"} 
                    onChange={() => handleChange("durability", "transient")}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  Transient
                </label>
             </div>
          </div>
        </div>
      );
    }

    // Default / HTTP Request style (matching image)
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-black/70">Method</label>
          <div className="relative">
            <select
              value={(formData.method as string) || "GET"}
              onChange={(e) => handleChange("method", e.target.value)}
              className="w-full appearance-none bg-canvas-bg border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40" size={14} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black/70">URL</label>
          <div className="relative">
            <input
              type="text"
              value={(formData.url as string) || ""}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full bg-canvas-bg border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/5 rounded cursor-pointer hover:bg-black/10">
               <Database size={12} className="text-black/50" />
            </div>
          </div>
          <div className="text-xs text-black/40">Use {"{{ trigger.field }}"} for dynamic values</div>
        </div>

        {/* Collapsible Sections */}
        {["Headers", "Authentication", "Body", "Query Parameters"].map((section) => (
          <div key={section} className="border border-black/10 rounded-lg overflow-hidden">
            <button className="flex items-center justify-between w-full px-3 py-2 bg-canvas-bg/50 hover:bg-canvas-bg transition-colors text-left">
              <span className="text-sm font-medium text-black/70">{section}</span>
              <CaretRight size={14} className="text-black/40" />
            </button>
          </div>
        ))}

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-black/70">Timeout (seconds)</label>
          <input
            type="number"
            value={(formData.timeout as number) || 30}
            onChange={(e) => handleChange("timeout", Number(e.target.value))}
            className="w-full bg-canvas-bg border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute top-0 right-0 h-full w-[380px] bg-white border-l border-border-dark shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-opacity-20"
            style={{ backgroundColor: `${color}33` }} // 20% opacity
          >
             {node.data.imageSrc ? (
               <Image src={node.data.imageSrc} alt={node.data.label} width={20} height={20} className="object-contain" />
             ) : IconComponent ? (
               <IconComponent size={24} weight="fill" color={color} />
             ) : null}
          </div>
          <div>
            <h3 className="font-display font-medium text-black">{node.data.label}</h3>
            <p className="text-xs text-black/50 font-mono">{node.data.type || "Component"}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-black/5 rounded-lg text-black/40 hover:text-black transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        {renderFields()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-black/5">
        <button 
          onClick={() => onDelete && onDelete(node.id)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium text-sm"
        >
          <Trash size={16} />
          Delete Node
        </button>
      </div>
    </motion.div>
  );
}
