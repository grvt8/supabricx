"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    navigate: [
      { label: "Work", href: "/workflows" },
      { label: "Practices", href: "/practices" },
      { label: "About", href: "/about" },
      { label: "Insights", href: "/insights" },
    ],
    proof: [
      { label: "Testimonials", href: "/testimonials" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Mentions", href: "/mentions" },
      { label: "Awards", href: "/awards" },
    ],
    connect: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter/X", href: "https://twitter.com" },
      { label: "Email", href: "mailto:hello@supabricx.com" },
    ],
  };

  return (
    <footer className="relative w-full bg-[#EAE5D9] text-[#4A4A4A] overflow-hidden pt-20 md:pt-32">
      {/* Top CTA Section */}
      <div className="container mx-auto px-4 md:px-6 mb-24 md:mb-32 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 md:gap-12">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight text-[#4A4A4A] max-w-5xl">
            BUILD SYSTEMS YOU NEED TO LEAD THE MARKET
          </h2>
          
          <Link 
            href="/workflows"
            className="group relative inline-flex items-center gap-2 bg-white px-8 py-4 rounded-lg text-[#4A4A4A] font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-[#D1CCC0]"
          >
            <span>Book a 15-Minute Call</span>
            <ArrowUpRight size={18} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Left Column: Brand & Copyright */}
          <div className="md:col-span-6 flex flex-col justify-between h-full gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Supabricx Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-lg"
                />
                <span className="font-display text-2xl font-bold text-[#4A4A4A]">Supabricx</span>
              </div>
              
              <div className="flex flex-col gap-1 text-sm text-[#7A7A7A] font-mono">
                <p>© {currentYear} Supabricx. All rights reserved.</p>
                <p>Enterprise AI & Architecture • est. 2024</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-[#4A4A4A] font-medium">
              <Link href="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-orange-600 transition-colors">Terms</Link>
            </div>
          </div>

          {/* Right Columns: Navigation Links */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
            {/* Navigate */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">Navigate</h3>
              <ul className="flex flex-col gap-4">
                {links.navigate.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-lg text-[#4A4A4A] hover:text-orange-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Proof */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">Proof</h3>
              <ul className="flex flex-col gap-4">
                {links.proof.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-lg text-[#4A4A4A] hover:text-orange-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-bold tracking-widest text-[#9A9A9A] uppercase">Connect</h3>
              <ul className="flex flex-col gap-4">
                {links.connect.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-[#4A4A4A] hover:text-orange-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Bottom Text */}
      <div className="w-full overflow-hidden border-t border-[#D1CCC0]/50 pt-4 md:pt-0">
        <div className="font-dynapuff font-bold text-[14vw] md:text-[18vw] leading-none text-center tracking-tighter text-[#8A8A8A] opacity-30 select-none mix-blend-multiply pb-4 md:pb-0">
          SUPABRICX
        </div>
      </div>
    </footer>
  );
}
