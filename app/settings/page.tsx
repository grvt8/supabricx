"use client";

import Image from "next/image";
import AccountSidebar from "../components/AccountSidebar";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full bg-foreground text-black">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
        <AccountSidebar />

        <main className="flex-1">
          <div>
            <h1 className="text-3xl font-display font-semibold">Settings</h1>
            <p className="mt-1 text-sm text-black/50 font-mono">View your account information.</p>
          </div>

          <section className="mt-8">
            <div className="text-sm font-display font-medium text-black/70 mb-3">User Info</div>
            <div className="rounded-2xl bg-canvas-bg p-4">
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Avatar</div>
                  <div className="text-xs text-black/50 font-mono">JPG, PNG, or GIF (max 2 MB)</div>
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white">
                  <Image src="/user.jpeg" alt="Avatar" fill className="object-cover" />
                </div>
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Name</div>
                  <div className="text-xs text-black/50 font-mono">Your profile name</div>
                </div>
                <input
                  defaultValue="kaizel"
                  className="w-64 rounded-lg bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-subColor"
                />
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">GitHub</div>
                  <div className="text-xs text-black/50 font-mono">Your login method</div>
                </div>
                <div className="text-sm font-mono text-black/70">404khai</div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="text-sm font-display font-medium text-black/70 mb-3">Integrations</div>
            <div className="rounded-2xl bg-canvas-bg p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-black">Vercel</div>
                  <div className="text-xs text-black/50 font-mono">
                    A frontend cloud platform that automatically builds and rapidly deploys web apps.
                  </div>
                </div>
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/5 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
