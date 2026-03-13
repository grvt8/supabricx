"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  CaretLeft, 
  CaretRight, 
  MagnifyingGlass, 
  CaretDown,
  Cloud,
  Cpu,
  Lightning,
  Database,
  Globe,
  Shield,
  HardDrives,
  Cube,
  Scales,
  Browsers,
  Clock,
  Files,
  Warehouse,
  Queue,
  Broadcast,
  Waves,
  Envelope,
  TreeStructure,
  ArrowsLeftRight,
  IdentificationCard,
  Key,
  Wall,
  Certificate,
  Scroll,
  ChartLine,
  Binoculars,
  User,
  SidebarIcon,
  Plugs
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  width?: number;
}

export default function LeftSidebar({ isOpen, toggle, width = 280 }: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>("compute");

  const categories = [
    {
      id: "compute",
      label: "Compute & Logic",
      icon: <Cpu size={25} weight="fill" color="#FF2F9F" />,
      items: [
        { label: "Load Balancer", icon: <Scales size={20} color="#FF2F9F" /> },
        { label: "API Gateway", icon: <Shield size={20} color="#FF2F9F" /> },
        { label: "Microservice", icon: <Cube size={20} color="#FF2F9F"/> },
        { label: "Serverless Function", icon: <Lightning size={20} color="#FF2F9F" /> },
        { label: "Monolith App", icon: <Browsers size={20} color="#FF2F9F" /> },
        { label: "Scheduler/Worker", icon: <Clock size={20} color="#FF2F9F" /> },
      ]
    },
    {
      id: "data",
      label: "Data & Storage",
      icon: <Database size={25} weight="fill" color="#2FC1FF"/>,
      items: [
        { label: "Relational DB", icon: <Image src="/postgresql.png" alt="PostgreSQL" width={16} height={16} /> },
        { label: "NoSQL DB", icon: <Files size={20} color="#2FC1FF"/> },
        { label: "Cache", icon: <Image src="/redis.png" alt="Redis" width={16} height={16} /> },
        { label: "Object Storage", icon: <HardDrives size={20} color="#2FC1FF" /> },
        { label: "Data Warehouse", icon: <Warehouse size={20} color="#2FC1FF" /> },
        { label: "Search Engine", icon: <MagnifyingGlass size={20} color="#2FC1FF" /> },
      ]
    },
    {
      id: "messaging",
      label: "Messaging & Streaming",
      icon: <Broadcast size={25} weight="fill" color="#BF34D6"/>,
      items: [
        { label: "Message Queue", icon: <Queue size={20} color="#BF34D6"/> },
        { label: "Pub/Sub Topic", icon: <Broadcast size={20} color="#BF34D6"/> },
        { label: "Event Stream", icon: <Waves size={20} color="#BF34D6"/> },
        { label: "Email Service", icon: <Envelope size={20} color="#BF34D6"/> },
      ]
    },
    {
      id: "network",
      label: "Network & Edge",
      icon: <Globe size={25} weight="fill" color="#28F0CC"/>,
      items: [
        { label: "VPC / Network", icon: <Globe size={20} color="#28F0CC"/> },
        { label: "Subnet", icon: <TreeStructure size={20} color="#28F0CC"/> },
        { label: "CDN", icon: <Cloud size={20} color="#28F0CC"/> },
        { label: "DNS / Domain", icon: <Globe size={20} color="#28F0CC"/> },
        { label: "NAT Gateway", icon: <ArrowsLeftRight size={20} color="#28F0CC"/> },
      ]
    },
    {
      id: "security",
      label: "Security & Identity",
      icon: <Shield size={25} weight="fill" color="#46E84C"/>,
      items: [
        { label: "Identity Provider", icon: <IdentificationCard size={20} color="#46E84C"/> },
        { label: "Secrets Manager", icon: <Key size={20} color="#46E84C"/> },
        { label: "WAF", icon: <Wall size={20} color="#46E84C"/> },
        { label: "Certificate / SSL", icon: <Certificate size={20} color="#46E84C"/> },
      ]
    },
    {
      id: "observability",
      label: "Observability",
      icon: <ChartLine size={25} weight="fill" color="#FF802F"/>,
      items: [
        { label: "Logging Service", icon: <Scroll size={20} color="#FF802F"/> },
        { label: "Metrics / Monitoring", icon: <ChartLine size={20} color="#FF802F"/> },
        { label: "Tracing", icon: <Binoculars size={20} color="#FF802F"/> },
      ]
    },
    {
      id: "external",
      label: "External & Users",
      icon: <User size={25} weight="fill" color="#FF2F5B"/>,
      items: [
        { label: "End User / Client", icon: <User size={20} color="#FF2F5B"/> },
        { label: "3rd Party API", icon: <Plugs size={20} color="#FF2F5B"/> },
      ]
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? width : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex h-full flex-col bg-foreground transition-all overflow-hidden z-40 relative"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 shrink-0">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-medium text-black whitespace-nowrap"
            >
              Components
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          className="p-1.5 rounded text-black bg-canvas-bg hover:bg-mainColor transition-colors"
        >
          {isOpen ? <SidebarIcon size={20} /> : <SidebarIcon size={20} />}
        </button>
      </div>

      {/* Search */}
      <div className={`p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-canvas-bg rounded-md py-1.5 pl-9 pr-3 text-sm text-black placeholder:text-muted focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
        {categories.map((category) => (
          <div key={category.id} className="">
            <button
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              className={`flex w-full items-center justify-between px-4 py-3 hover:bg-canvas-bg transition-colors ${
                !isOpen && "justify-center px-2"
              }`}
              title={!isOpen ? category.label : undefined}
            >
              <div className="flex items-center gap-3 text-sm font-medium text-black">
                <span className={`${activeCategory === category.id ? "text-orange-400" : ""}`}>
                  {category.icon}
                </span>
                {isOpen && <span>{category.label}</span>}
              </div>
              {isOpen && (
                <CaretDown
                  size={14}
                  className={`text-muted transition-transform duration-200 ${
                    activeCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            
            <AnimatePresence>
              {isOpen && activeCategory === category.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-canvas-bg"
                >
                  <div className="px-4 pb-3 pt-1 space-y-1">
                    {category.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-border-dark cursor-grab active:cursor-grabbing group transition-colors"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/reactflow", item.label);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                      >
                        <span className="text-muted transition-colors">
                          {item.icon}
                        </span>
                        <span className="text-sm text-black/50 group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
