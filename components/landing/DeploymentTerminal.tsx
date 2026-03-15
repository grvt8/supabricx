"use client";

import { motion } from "framer-motion";
import { CheckCircle, HandPointing } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const logs = [
  { time: "14:32:01.120", text: "Starting deployment of my-awesome-app" },
  { time: "14:32:01.340", command: "git clone", text: " – Cloning repository..." },
  { time: "14:32:02.810", text: "Detected framework: Next.js 14" },
  { time: "14:32:03.005", command: "npm install", text: " – Installing dependencies..." },
  { time: "14:32:18.442", text: "npm install completed (1,247 packages)" },
  { time: "14:32:18.500", highlight: true, text: "npm warn deprecated inflight@1.0.6" },
  { time: "14:32:19.100", command: "next build", text: " – Running build: next build" },
  { time: "14:32:22.330", text: "Creating optimized production build..." },
  { time: "14:32:38.710", text: "Compiled successfully" },
  { time: "14:32:40.200", text: "Generating static pages (24/24)" },
  { time: "14:32:41.550", text: "Uploading build artifacts..." },
  { time: "14:32:43.880", text: "Provisioning edge network..." },
  { time: "14:32:44.200", text: "Assigning domain: my-app.pxxl.pro" },
  { time: "14:32:45.610", text: "SSL certificate issued" },
];

export default function DeploymentTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < logs.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, Math.random() * 400 + 100); // Random delay between 100ms and 500ms
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl font-mono text-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-xs text-gray-500 font-sans">https://supabricx.com</div>
        <div className="w-12"></div> {/* Spacer for balance */}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white font-sans text-base">my-supabricx-app</span>
          <span className="text-xs text-gray-500 font-sans">main branch - Next.js 14</span>
        </div>

        <motion.button 
          className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#2d1b36] border border-[#e879f9]/30 text-[#e879f9] text-xs font-medium font-sans shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: visibleLines === logs.length ? 1 : 0.9, opacity: visibleLines === logs.length ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle weight="bold" className="w-4 h-4" />
          Preview
          
          {/* Animated Cursor */}
          {visibleLines === logs.length && (
            <motion.div 
              className="absolute -bottom-6 -right-4 text-white z-10"
              initial={{ x: 50, y: 50, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <HandPointing weight="fill" className="w-6 h-6" />
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Terminal Body */}
      <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar relative">
        <div className="flex flex-col gap-2">
          {logs.slice(0, visibleLines).map((log, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-4 font-mono text-[13px] ${
                log.highlight ? "bg-yellow-500/10 py-1 px-2 -mx-2 rounded" : ""
              }`}
            >
              <span className="text-gray-600 shrink-0 select-none">{log.time}</span>
              <span className={`break-all ${log.highlight ? "text-yellow-500" : "text-gray-300"}`}>
                {log.command && <span className="text-blue-400">{log.command}</span>}
                {log.text}
              </span>
            </motion.div>
          ))}
          {visibleLines < logs.length && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-gray-400 mt-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
