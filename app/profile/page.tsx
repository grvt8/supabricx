"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  CalendarBlank,
  Camera,
  ChartLineUp,
  Code,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react";
import AccountSidebar from "../components/AccountSidebar";

const activity = Array.from({ length: 7 * 52 }, (_, i) => {
  const seed = (i * 73 + 19) % 100;
  if (seed < 70) return 0;
  if (seed < 82) return 1;
  if (seed < 92) return 2;
  return 3;
});

const activityColor = (level: number) => {
  if (level === 0) return "bg-black/10";
  if (level === 1) return "bg-mainColor/20";
  if (level === 2) return "bg-mainColor/40";
  return "bg-subColor";
};

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-canvas-bg rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-subColor">{icon}</span>
        <div className="font-display text-sm font-semibold text-black">{title}</div>
      </div>
      <div className="font-display text-3xl font-bold text-black mb-1">{value}</div>
      <div className="font-mono text-xs text-black/50">{description}</div>
    </div>
  );
}

export default function ProfilePage() {
  const user = {
    displayName: "404khai",
    dayCount: 97,
    badges: ["System Architect", "First Brick", "Early Bird", "AI Collaborator"],
    avatarSrc: "/user.jpeg",
    email: "404khai@supabricx.dev",
    github: "404khai",
    plan: "Pro",
    memberSince: "2025/12/10",
  };

  const recentActivity = [
    { label: "Created diagram", detail: "Payment System Architecture", time: "Today · 14:22" },
    { label: "Generated code", detail: "TypeScript services export", time: "Yesterday · 22:09" },
    { label: "Shared diagram", detail: "Team invite link created", time: "2026/03/10 · 09:41" },
    { label: "Connected integration", detail: "Vercel", time: "2026/03/02 · 17:08" },
  ];

  return (
    <div className="min-h-screen w-full bg-foreground text-black">
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
        <AccountSidebar />

        <main className="flex-1">
          <div className="flex items-start justify-between gap-8 mb-8">
            <div className="min-w-0">
              <h1 className="text-3xl font-display font-semibold">Hello! {user.displayName}</h1>
              <p className="mt-1 text-sm text-black/50 font-mono">
                This is your day{" "}
                <span className="text-subColor font-semibold">{user.dayCount}</span> of using Supabricx.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-mainColor/40 bg-mainColor/15 px-3 py-1 text-xs font-mono text-[#351300]"
                  >
                    # {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative shrink-0">
              <div
                className="p-[5px] rounded-2xl"
                style={{ background: "conic-gradient(#FFB563 0deg 90deg, #F85E00 90deg 270deg, #FBBC05 270deg 360deg)" }}
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-white shadow-sm">
                  {user.avatarSrc ? (
                    <Image src={user.avatarSrc} alt={`${user.displayName} avatar`} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-transparent">
                      <UserCircle size={48} className="text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 rounded-full bg-green-500 ring-4 ring-foreground" />
              
            </div>
          </div>

          <section>
            <div className="text-sm font-display font-medium text-black/70 mb-3">Overview</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Diagrams Created"
                value="28"
                description="Across 6 workspaces"
                icon={<ChartLineUp size={18} />}
              />
              <StatCard
                title="AI Generations"
                value="143"
                description="Prompts, refactors, and exports"
                icon={<Sparkle size={18} />}
              />
              <StatCard
                title="Code Exports"
                value="12"
                description="TypeScript, JSON, and Terraform"
                icon={<Code size={18} />}
              />
            </div>
          </section>

          <section className="mt-10">
            <div className="text-sm font-display font-medium text-black/70 mb-3">Activity</div>
            <div className="rounded-2xl bg-canvas-bg p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-display font-medium text-black/70">Active Days</div>
                <div className="text-xs font-mono text-black/40">Less ▪▪▪ More</div>
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="flex flex-col gap-3 pt-2 text-xs font-mono text-black/40">
                  <span>M</span>
                  <span>W</span>
                  <span>F</span>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-12 gap-2 text-xs font-mono text-black/40 mb-2">
                    {["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map(
                      (m) => (
                        <span key={m}>{m}</span>
                      ),
                    )}
                  </div>

                  <div className="grid grid-cols-52 gap-1">
                    {activity.map((lvl, idx) => (
                      <div key={idx} className={`h-3 w-3 rounded-[3px] ${activityColor(lvl)}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "AI Diagrams",
                  value: "393",
                  sub: "Across all sessions",
                  bar: "w-[78%]",
                  barColor: "bg-gradient-to-r from-orange-400 to-orange-500",
                },
                {
                  title: "Chat Count",
                  value: "84",
                  sub: "Messages sent",
                  bar: "w-[55%]",
                  barColor: "bg-mainColor/40",
                },
                {
                  title: "Conversations",
                  value: "46",
                  sub: "Created with @Bricx",
                  bar: "w-[62%]",
                  barColor: "bg-subColor/70",
                },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-black/50">{c.title}</div>
                  </div>
                  <div className="mt-2 text-2xl font-mono font-semibold text-black">{c.value}</div>
                  <div className="mt-1 text-xs font-mono text-black/40">{c.sub}</div>
                  <div className="mt-4 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                    <div className={`h-full ${c.bar} ${c.barColor} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>

            </div>
          </section>

          <section className="mt-10">
            <div className="text-sm font-display font-medium text-black/70 mb-3">Account Details</div>
            <div className="rounded-2xl bg-canvas-bg p-4">
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Display name</div>
                  <div className="text-xs text-black/50 font-mono">Used across Supabricx</div>
                </div>
                <input
                  defaultValue={user.displayName}
                  className="w-64 rounded-lg bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-subColor"
                />
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Email</div>
                  <div className="text-xs text-black/50 font-mono">Used for receipts and security alerts</div>
                </div>
                <div className="text-sm font-mono text-black/70">{user.email}</div>
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">GitHub</div>
                  <div className="text-xs text-black/50 font-mono">Your login method</div>
                </div>
                <div className="text-sm font-mono text-black/70">{user.github}</div>
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Plan</div>
                  <div className="text-xs text-black/50 font-mono">Current subscription</div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-mainColor/20 px-3 py-1 text-xs font-mono text-[#351300]">
                  {user.plan}
                </div>
              </div>

              <div className="h-px w-full bg-black/5" />

              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="text-sm font-medium text-black">Member since</div>
                  <div className="text-xs text-black/50 font-mono">Account creation date</div>
                </div>
                <div className="text-sm font-mono text-black/70">{user.memberSince}</div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="text-sm font-display font-medium text-black/70 mb-3">Recent Activity</div>
            <div className="rounded-2xl bg-canvas-bg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarBlank size={18} className="text-subColor" />
                <div className="font-display text-sm font-semibold text-black">Last actions</div>
              </div>

              <div className="flex flex-col">
                {recentActivity.map((item, idx) => (
                  <div key={`${item.label}-${idx}`}>
                    <div className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-black">{item.label}</div>
                        <div className="text-xs font-mono text-black/50 truncate">{item.detail}</div>
                      </div>
                      <div className="shrink-0 text-xs font-mono text-black/50">{item.time}</div>
                    </div>
                    {idx !== recentActivity.length - 1 && <div className="h-px w-full bg-black/5" />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
