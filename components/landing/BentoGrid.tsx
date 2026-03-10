"use client";

import { motion } from "framer-motion";
import { StarFourIcon, Code, GitBranch, User, ArrowRight, GithubLogo } from "@phosphor-icons/react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    }
  })
};

export default function BentoGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: AI Architecture Generation */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="relative bg-card-bg border border-border-dark rounded-2xl p-6 overflow-hidden group hover:border-orange-400/50 transition-colors duration-300 min-h-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <StarFourIcon weight="bold" size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              AI Architecture Generation
            </h3>
          </div>

          {/* Description */}
          <p className="font-mono text-sm text-muted mb-6">
            Describe your system in plain English. Watch AI build the architecture.
          </p>

          {/* Visual Demo: Chat Interface */}
          <div className="bg-background rounded-lg border border-border-dark p-4 space-y-3">
            {/* User Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-orange-400" />
              </div>
              <div className="bg-border-dark/50 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <p className="font-mono text-xs text-foreground">
                  "Create a microservices architecture for an e-commerce app with auth, products, and payments"
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <StarFourIcon size={16} className="text-white" />
              </div>
              <div className="bg-background border border-border-dark rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <p className="font-mono text-xs text-foreground mb-2">
                  ✓ Generated architecture:
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-purple-400/20 border border-purple-400/30 rounded text-xs font-mono text-purple-300">
                    API Gateway
                  </span>
                  <span className="px-2 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-xs font-mono text-blue-300">
                    Auth Service
                  </span>
                  <span className="px-2 py-1 bg-green-400/20 border border-green-400/30 rounded text-xs font-mono text-green-300">
                    PostgreSQL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>

        {/* CARD 2: Code That Writes Itself */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="relative bg-card-bg border border-border-dark rounded-2xl p-6 overflow-hidden group hover:border-orange-400/50 transition-colors duration-300 min-h-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
              <Code weight="bold" size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Code That Writes Itself
            </h3>
          </div>

          {/* Description */}
          <p className="font-mono text-sm text-muted mb-6">
            Export your diagram to production-ready boilerplate code instantly.
          </p>

          {/* Visual Demo: Code Split View */}
          <div className="bg-background rounded-lg border border-border-dark p-4 font-mono text-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 border-b border-border-dark pb-2">
              <span className="text-muted">docker-compose.yml</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                <div className="w-2 h-2 rounded-full bg-green-400/50" />
              </div>
            </div>
            <div className="space-y-1 text-muted">
              <div className="flex">
                <span className="w-4 text-zinc-600">1</span>
                <span className="text-purple-300">version:</span> <span className="text-green-300">'3.8'</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">2</span>
                <span className="text-purple-300">services:</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">3</span>
                <span className="pl-2 text-blue-300">api-gateway:</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">4</span>
                <span className="pl-4 text-orange-300">image:</span> <span className="text-green-300">nginx:latest</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">5</span>
                <span className="pl-4 text-orange-300">ports:</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">6</span>
                <span className="pl-6 text-green-300">- "80:80"</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">7</span>
                <span className="pl-2 text-blue-300">postgres:</span>
              </div>
              <div className="flex">
                <span className="w-4 text-zinc-600">8</span>
                <span className="pl-4 text-orange-300">image:</span> <span className="text-green-300">postgres:15</span>
              </div>
            </div>
            
            {/* Typing Cursor Animation */}
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute bottom-4 left-24 w-2 h-4 bg-orange-400"
            />
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>

        {/* CARD 3: GitHub to Diagram */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="relative bg-card-bg border border-border-dark rounded-2xl p-6 overflow-hidden group hover:border-orange-400/50 transition-colors duration-300 min-h-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <GitBranch weight="bold" size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              GitHub to Diagram
            </h3>
          </div>

          {/* Description */}
          <p className="font-mono text-sm text-muted mb-6">
            Import any repository and instantly visualize its architecture and dependencies.
          </p>

          {/* Visual Demo: Import Flow */}
          <div className="bg-background rounded-lg border border-border-dark p-4 flex flex-col items-center justify-center gap-4 h-[200px]">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
              <GithubLogo size={16} />
              <span>username/repo</span>
            </div>
            
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowRight size={24} className="text-muted rotate-90" />
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <div className="relative bg-card-bg border border-blue-500/30 rounded-lg p-3 flex gap-2 shadow-xl">
                <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-sm" />
                </div>
                <div className="w-8 h-8 rounded bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-400 rounded-full" />
                </div>
                <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-sm rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
