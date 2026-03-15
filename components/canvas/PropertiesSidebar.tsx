import { Database, X, Trash, CaretDown, CaretRight, Sparkle } from "@phosphor-icons/react";
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
  const [openDropdown, setOpenDropdown] = useState<"auth" | "db" | "broker" | null>(null);

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

  const StarBadge = () => (
    <span className="inline-flex items-center justify-center rounded-full bg-mainColor/20 p-1">
      <Sparkle size={14} weight="fill" className="text-subColor" />
    </span>
  );

  // Render specific fields based on node type
  const renderFields = () => {
    if (node.data.label === "Auth Service" || node.data.label === "Identity Provider") {
      const providers = [
        { id: "google", label: "Google Auth", imageSrc: "/google.png" },
        { id: "microsoft", label: "Microsoft Auth", imageSrc: "/microsoft.png" },
        { id: "github", label: "Github Auth", imageSrc: "/github.png" },
      ] as const;

      const selectedProviderId = (formData.authProvider as string) || "google";
      const selectedProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">Auth Type</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "auth" ? null : "auth")}
                className="w-full flex items-center justify-between bg-canvas-bg border border-black/5 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-orange-400"
              >
                <span className="flex items-center gap-2">
                  <Image src={selectedProvider.imageSrc} alt={selectedProvider.label} width={18} height={18} className="object-contain" />
                  <span>{selectedProvider.label}</span>
                </span>
                <CaretDown className="text-black/40" size={14} />
              </button>

              {openDropdown === "auth" && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg border border-black/5">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handleChange("authProvider", p.id);
                        handleChange("authProviderName", p.label);
                        handleChange("imageSrc", p.imageSrc);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-canvas-bg transition-colors"
                    >
                      <Image src={p.imageSrc} alt={p.label} width={18} height={18} className="object-contain" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-black/70">
              Role in diagram
              <StarBadge />
            </label>
            <textarea
              value={(formData.role as string) || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g. Handles user login and token issuance for all services"
              className="w-full bg-canvas-bg text-black border border-black/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none min-h-[96px]"
            />
          </div>
        </div>
      );
    }

    const isDbNode =
      node.data.label === "Relational DB" ||
      node.data.label === "NoSQL DB" ||
      node.data.label === "Cache" ||
      node.data.label === "Object Storage" ||
      node.data.type === "PostgreSQL" ||
      node.data.type === "Redis";

    if (isDbNode) {
      const dbCategory =
        node.data.label === "Cache" || node.data.type === "Redis"
          ? "cache"
          : node.data.label === "Object Storage"
            ? "object-storage"
            : node.data.label === "NoSQL DB"
              ? "nosql"
              : "relational";

      const dbOptions =
        dbCategory === "cache"
          ? ([
              { id: "redis", label: "Redis", imageSrc: "/redis.png", type: "Redis" },
            ] as const)
          : dbCategory === "relational"
            ? ([
                { id: "postgresql", label: "PostgreSQL", imageSrc: "/postgresql.png", type: "PostgreSQL" },
                { id: "mysql", label: "MySQL", imageSrc: "/mysql.png", type: "MySQL" },
                { id: "sqlserver", label: "SQL Server", imageSrc: "/sqlserver.png", type: "SQL Server" },
              ] as const)
            : dbCategory === "nosql"
              ? ([  
                  { id: "mongodb", label: "MongoDB", imageSrc: "/mongodb.png", type: "MongoDB" },
                  { id: "dynamodb", label: "DynamoDB", imageSrc: "/dynamodb.png", type: "DynamoDB" },
                  { id: "cassandra", label: "Cassandra", imageSrc: "/cassandradb.png", type: "Cassandra" },
                ] as const)
              : ([
                  { id: "s3", label: "Amazon S3", imageSrc: "/logo.png", type: "S3" },
                  { id: "gcs", label: "Google Cloud Storage", imageSrc: "/logo.png", type: "GCS" },
                  { id: "azure-blob", label: "Azure Blob Storage", imageSrc: "/logo.png", type: "Azure Blob" },
                ] as const);

      const selectedDbId =
        (formData.dbProvider as string) ||
        (node.data.type === "Redis"
          ? "redis"
          : node.data.type === "PostgreSQL"
            ? "postgresql"
            : dbCategory === "cache"
              ? "redis"
              : "postgresql");

      const selectedDb = dbOptions.find((d) => d.id === selectedDbId) || dbOptions[0];

      const defaultRole =
        dbCategory === "cache"
          ? "Caches hot data and reduces database load for faster reads."
          : dbCategory === "object-storage"
            ? "Stores files and large blobs used by services (uploads, exports, media)."
            : dbCategory === "nosql"
              ? "Persists flexible, high-throughput data with horizontal scaling."
              : "Stores normalized, transactional data and ensures strong consistency.";

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black/70">Database Type</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "db" ? null : "db")}
                className="w-full flex items-center justify-between bg-canvas-bg border border-black/5 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-orange-400"
              >
                <span className="flex items-center gap-2">
                  <Image src={selectedDb.imageSrc} alt={selectedDb.label} width={18} height={18} className="object-contain" />
                  <span>{selectedDb.label}</span>
                </span>
                <CaretDown className="text-black/40" size={14} />
              </button>

              {openDropdown === "db" && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg border border-black/5">
                  {dbOptions.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        handleChange("dbProvider", d.id);
                        handleChange("dbProviderName", d.label);
                        handleChange("type", d.type);
                        handleChange("imageSrc", d.imageSrc);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-canvas-bg transition-colors"
                    >
                      <Image src={d.imageSrc} alt={d.label} width={18} height={18} className="object-contain" />
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-black/70">
              Role in diagram
              <StarBadge />
            </label>
            <textarea
              value={((formData.role as string) || "").trim().length > 0 ? (formData.role as string) : defaultRole}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full bg-canvas-bg text-black border border-black/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none min-h-[96px]"
            />
          </div>
        </div>
      );
    }

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
                className="w-full appearance-none bg-canvas-bg border text-black border-black/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
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
              className="w-full bg-canvas-bg text-black border border-black/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
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
                    className="text-subColor focus:ring-subColor"
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-black/70">
              Role in diagram
              <StarBadge />
            </label>
            <textarea
              value={(formData.role as string) || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g. Buffers jobs and decouples services for reliable async processing"
              className="w-full bg-canvas-bg text-black border border-black/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none min-h-[96px]"
            />
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
              className="w-full appearance-none bg-canvas-bg border border-black/5 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-orange-400"
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
              className="w-full bg-canvas-bg border border-black/5 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:border-orange-400"
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
      className="absolute top-0 right-0 h-full w-[380px] bg-white border-l border-border-black/10 shadow-xl z-50 flex flex-col"
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
