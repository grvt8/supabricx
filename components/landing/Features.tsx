"use client";

import { useState } from "react";
import { TerminalWindow, Code, Pulse } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Features() {
  const [activeTab, setActiveTab] = useState("Vite");

  const tabs = [
    { name: "Vite", icon: "⚡" },
    { name: "Next.js", icon: "▲" },
    { name: "Express", icon: "ex" },
  ];

  const codeSnippets = {
    Vite: `import supabricx from '@supabricx/vite';

export default defineConfig({
  plugins: [supabricx()]
});`,
    "Next.js": `import supabricx from '@supabricx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  plugins: [new supabricx()]
};`,
    "Express": `const supabricx = require('@supabricx/express');
const app = express();

app.use(supabricx.middleware());`,
  };

  const requests = [
    { status: 200, method: "GET", path: "/api/settings", time: "24ms" },
    { status: 404, method: "GET", path: "/api/unknown", time: "5ms" },
    { status: 200, method: "GET", path: "/api/users", time: "12ms" },
    { status: 201, method: "POST", path: "/api/webhooks", time: "45ms" },
    { status: 401, method: "GET", path: "/admin", time: "8ms" },
    { status: 200, method: "GET", path: "/favicon.ico", time: "2ms" },
    { status: 500, method: "POST", path: "/api/checkout", time: "120ms" },
    { status: 200, method: "GET", path: "/api/products", time: "15ms" },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        {/* Feature 1: Online in one line */}
        <div className="bg-[#050608] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <TerminalWindow size={24} weight="fill" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Online in one line</h3>
            </div>
            
            <p className="text-zinc-400 mb-8 font-mono text-sm leading-relaxed">
              One command, you&apos;re online. Seriously, try for yourself.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-zinc-300 flex items-center gap-2">
              <span className="text-purple-400">$</span>
              <span>supabricx 3000</span>
              <span className="animate-pulse w-2 h-4 bg-zinc-500 block ml-1" />
            </div>
          </div>
        </div>

        {/* Feature 2: Don't fw CLI? */}
        <div className="bg-[#050608] border border-white/10 rounded-3xl p-8 flex-1 relative overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Code size={24} weight="fill" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Don&apos;t fw CLI?</h3>
            </div>
            
            <p className="text-zinc-400 mb-6 font-mono text-sm leading-relaxed">
              Use our plugins to embed Supabricx directly into your build tool.
            </p>

            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.name
                      ? "bg-white/10 text-white shadow-lg shadow-white/5"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="opacity-70">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-300 overflow-x-auto flex-1 relative group/code">
              <div className="flex gap-1.5 absolute top-4 left-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <div className="mt-6">
                <pre className="whitespace-pre-wrap">
                  <code className="language-javascript">
                    {codeSnippets[activeTab as keyof typeof codeSnippets]}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Instant Observability */}
      <div className="bg-[#050608] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors duration-500 h-full min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Pulse size={24} weight="fill" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Instant Observability</h3>
          </div>
          
          <p className="text-zinc-400 mb-8 font-mono text-sm leading-relaxed">
            View live traffic happening on your APIs in real-time the second it goes online.
          </p>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {requests.map((req, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group/item"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-mono font-bold w-16 ${
                    req.status >= 500 ? "text-red-400" :
                    req.status >= 400 ? "text-zinc-500" :
                    req.status >= 300 ? "text-blue-400" :
                    "text-purple-400"
                  }`}>
                    {req.status} {req.status === 200 ? "OK" : req.status === 201 ? "Created" : req.status === 404 ? "Not Found" : req.status === 401 ? "Unauth" : "Error"}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 w-10">{req.method}</span>
                  <span className="text-sm text-zinc-300 font-mono truncate group-hover/item:text-white transition-colors">{req.path}</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">{req.time}</span>
              </motion.div>
            ))}
            
            {/* Fading overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050608] to-transparent pointer-events-none rounded-b-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
