"use client"
import { CodeBlockIcon } from "@phosphor-icons/react";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 pb-12 pt-10 md:pb-24 md:pt-16">
        <section className="relative w-full rounded-2xl md:rounded-[32px] border border-white/5 bg-gradient-to-b from-[#050608] via-[#050b08] to-black px-4 py-10 md:px-6 md:py-16 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          <span className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l border-t border-orange-400/60" />
          <span className="pointer-events-none absolute right-0 top-0 h-7 w-7 border-r border-t border-orange-400/60" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-7 w-7 border-b border-l border-orange-400/40" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 border-b border-r border-orange-400/40" />

          <div className="flex flex-col items-center gap-8 md:gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-xs font-medium tracking-wide text-orange-300">
                Build brick by brick at supa speed
              </span>
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold sm:text-3xl md:text-5xl">
                  Build something with{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    Supabricx
                  </span>
                </h1>
                <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                  Create end-to-end backends and APIs by prompting. Describe what you want, and let
                  Supabricx build it for you.
                </p>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative overflow-visible border border-white/10 bg-transparent px-1 pb-2 pt-1">
                <span className="pointer-events-none absolute -left-px top-5 h-4 w-4 border-l border-t border-orange-400/60" />
                <span className="pointer-events-none absolute right-10 -top-px h-4 w-4 border-r border-t border-orange-400/40" />
                <span className="pointer-events-none absolute left-10 -bottom-px h-4 w-4 border-l border-b border-orange-400/40" />
                <span className="pointer-events-none absolute -right-px bottom-4 h-4 w-4 border-r border-b border-orange-400/60" />
                <span className="pointer-events-none absolute -left-px -top-px h-5 w-px bg-orange-400/80" />
                <span className="pointer-events-none absolute -left-px -top-px w-5 h-px bg-orange-400/80" />

                <div className="relative flex items-center gap-2 md:gap-3 border border-zinc-800 bg-[#05070a]/95 px-3 py-2 md:px-4 md:py-3 shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
                  <span className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl" />
                  <span className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-orange-500/30 blur-3xl" />

                  <span className="h-4 w-px bg-gradient-to-b from-orange-400/80 via-orange-300/40 to-transparent" />
                  <input
                    type="text"
                    placeholder="Build a RAG agent system with Rust..."
                    className="flex-1 min-w-0 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    className="agentic-toggle !px-2 !py-1 md:!px-[1.1rem] md:!py-[0.55rem]"
                  >
                    <span className="text-sm">✦</span>
                    <span className="text-sm hidden sm:inline">Agentic</span>
                    <span className="text-xs">▾</span>
                  </button>
                  <button
                    type="button"
                    className="cook-button !px-3 !py-1.5 md:!px-[1.4rem] md:!py-[0.65rem]"
                  >
                    <span className="hidden sm:inline">Build</span>
                    <CodeBlockIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600">
              <span className="uppercase tracking-[0.16em] text-zinc-500">
                Powered by your favorite tools
              </span>
              <span className="h-px w-10 bg-zinc-700" />
              <span>OpenAI</span>
              <span className="text-zinc-700">•</span>
              <span>Claude</span>
              <span className="text-zinc-700">•</span>
              <span>Grok</span>
              <span className="text-zinc-700">•</span>
              <span>Custom Supabricx runtimes</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
