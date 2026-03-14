"use client"
import Navbar from "./components/Navbar";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/Footer";
import Button from "./components/Button";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import BentoGrid from "@/components/landing/BentoGrid";


export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#ffe9d0] text-black">
      <Navbar />
      <main className="flex-1 flex-col">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-10 md:pb-24 md:pt-16">
          <section className="relative w-full rounded-2xl md:rounded-[32px] py-10 md:px-6 md:py-16">
          
            <div className="flex flex-col items-center gap-8 md:gap-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="rounded-full border px-4 py-1 text-xs font-medium tracking-wide">
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
                  <Button
                    title="Design Now"
                    Icon={ArrowUpRight}
                    width="220px"
                    height="h-11"
                    onClick={() => router.push('/signup')}
                  />
                </div>
              </div>

              
            </div>
          </section>
        </div>

        <div className="bg-[#050608] w-full">
          <BentoGrid />
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
