"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#050608] font-display text-white">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-between p-8 md:w-1/2 lg:p-12 xl:p-16 relative z-10">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-zinc-400">
              Enter your email below to create your account
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/20">
                <Image src="/github.png" alt="GitHub" width={20} height={20} className="invert" />
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/20">
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Google
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050608] px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                placeholder="m@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <button className="inline-flex h-10 items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050608]">
              Create account
            </button>
          </div>

          <p className="px-8 text-center text-xs text-zinc-500">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Supabricx Inc.
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden w-1/2 bg-zinc-900 md:block relative">
        <Image
          src="/signup.jpeg"
          alt="Signup visualization"
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Overlay gradient for text readability if needed, or just aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-50" />
        
        {/* Quote or testimonial overlay matching the vibe */}
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              &ldquo;Supabricx has completely transformed how we build and deploy our microservices. It&apos;s like having a senior architect on call 24/7.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Sofia Davis, CTO at TechFlow</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
