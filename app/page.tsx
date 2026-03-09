"use client"
import { CodeBlockIcon } from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ffe9cf] text-white">
      <Navbar />
      <main className="flex-1 flex-col">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-10 md:pb-24 md:pt-16">
          <section className="relative w-full rounded-2xl md:rounded-[32px] border border-white/5 bg-gradient-to-b from-[#050608] via-[#050b08] to-black px-4 py-10 md:px-6 md:py-16 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <span className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l border-t border-orange-400/60" />
            <span className="pointer-events-none absolute right-0 top-0 h-7 w-7 border-r border-t border-orange-400/60" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-7 w-7 border-b border-l border-orange-400/40" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 border-b border-r border-orange-400/40" />

            <div className="flex flex-col items-center gap-8 md:gap-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="rounded-full border px-4 py-1 text-xs font-medium tracking-wide text-orange-300">
                  Build systems brick by brick at supa speed
                </span>
                <div className="space-y-3">
                  <h1 className="text-2xl font-semibold sm:text-3xl md:text-5xl">
                    Build something with{" "}
                    <span className="bg-gradient-to-r from-[#FFB563] to-[#F85E00] bg-clip-text text-transparent">
                      Supabricx
                    </span>
                  </h1>
                  <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                    Design, validate, and deploy resilient systems with AI-guided architecture. 
                  </p>
                </div>
              </div>

              
            </div>
          </section>
        </div>

        {/* Features Section */}
        <div className="bg-[#050608] w-full border-t border-white/5">
          <Features />
        </div>

        {/* Pricing Section */}
        <div className="bg-[#050608] w-full border-t border-white/5">
          <Pricing />
        </div>

        {/* Footer Section */}
        <div className="bg-[#EAE5D9] w-full border-t border-white/5">
          <Footer />
        </div>
      </main>
    </div>
  );
}
