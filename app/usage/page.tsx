"use client";

import {
  Lightning,
  Info,
  Sparkle,
  GitBranch,
  Code,
  FileText,
  CheckCircle,
  ChatText,
  Cube,
  Calendar,
  Check,
} from "@phosphor-icons/react";
import AccountSidebar from "../components/AccountSidebar";

export default function UsagePage() {
  return (
    <div className="min-h-screen w-full bg-foreground text-black">
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-10">
        <AccountSidebar />

        <main className="flex-1">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-black mb-2">Usage &amp; Credits</h1>
            <p className="font-mono text-sm text-black/50">
              You are on <span className="text-subColor font-semibold">Pro plan</span>. Usage resets in{" "}
              <span className="text-black font-semibold">13 days</span> on 2026/03/29 14:55
            </p>
          </div>

          <div className="bg-canvas-bg rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightning size={20} className="text-subColor" />
                <h2 className="font-display text-lg font-semibold text-black">Credit Usage</h2>
                <span title="Credits are used for AI operations like diagram generation, code analysis, and exports">
                  <Info size={16} className="text-black/40" />
                </span>
              </div>
              <button className="px-4 py-2 bg-subColor text-white rounded-lg font-display text-sm font-medium hover:opacity-90 transition-opacity">
                Upgrade Plan
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-black/60">Pro Plan</span>
                <span className="font-mono text-sm text-green-600">Bonus: +150 credits</span>
              </div>

              <div className="relative h-3 bg-white rounded-full overflow-hidden mb-2">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                  style={{ width: "42%" }}
                />
                <div
                  className="absolute left-[42%] top-0 h-full bg-green-500/20 rounded-full"
                  style={{
                    width: "12%",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(74,222,128,0.25) 5px, rgba(74,222,128,0.25) 10px)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between font-mono text-sm">
                <div>
                  <span className="text-black font-semibold">275</span>
                  <span className="text-black/50"> / 500 credits used</span>
                </div>
                <div className="text-black/50">Resets at 2026/03/29 14:55</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle size={16} className="text-subColor" weight="fill" />
                  <span className="font-mono text-xs text-black/50">AI Generation</span>
                </div>
                <div className="font-mono text-lg font-semibold text-black">240 credits</div>
                <div className="font-mono text-xs text-black/40 mt-1">24 diagrams generated</div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch size={16} className="text-blue-600" />
                  <span className="font-mono text-xs text-black/50">Repo Analysis</span>
                </div>
                <div className="font-mono text-lg font-semibold text-black">100 credits</div>
                <div className="font-mono text-xs text-black/40 mt-1">4 repos analyzed</div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={16} className="text-purple-600" />
                  <span className="font-mono text-xs text-black/50">Code Export</span>
                </div>
                <div className="font-mono text-lg font-semibold text-black">80 credits</div>
                <div className="font-mono text-xs text-black/40 mt-1">8 exports generated</div>
              </div>
            </div>
          </div>

          <div className="bg-canvas-bg rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Cube size={20} className="text-blue-600" />
              <h2 className="font-display text-lg font-semibold text-black">Other Quotas</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <div className="font-mono text-sm text-black mb-1">Total Diagrams</div>
                  <div className="font-mono text-xs text-black/50">Reset at 2026/03/29 14:55</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-black">
                    12 <span className="text-black/40">/ 50</span>
                  </div>
                  <div className="font-mono text-xs text-green-600">Unlimited on Pro</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <div className="font-mono text-sm text-black mb-1">Team Members</div>
                  <div className="font-mono text-xs text-black/50">Collaborators on diagrams</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-black">
                    2 <span className="text-black/40">/ 5</span>
                  </div>
                  <button className="font-mono text-xs text-subColor hover:underline mt-1">Manage team</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div>
                  <div className="font-mono text-sm text-black mb-1">Storage</div>
                  <div className="font-mono text-xs text-black/50">Diagram exports &amp; uploads</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-black">
                    2.4 GB <span className="text-black/40">/ 10 GB</span>
                  </div>
                  <div className="w-32 h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-[24%] bg-blue-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-canvas-bg rounded-2xl p-6 mb-6">
            <h3 className="font-display text-lg font-semibold text-black mb-4">Credit Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { action: "AI Diagram Generation", cost: 10, icon: Sparkle, iconClass: "text-subColor" },
                { action: "GitHub Repo Analysis", cost: 25, icon: GitBranch, iconClass: "text-blue-600" },
                { action: "PDF/SRS Parsing", cost: 15, icon: FileText, iconClass: "text-black/60" },
                { action: "Code Export", cost: 10, icon: Code, iconClass: "text-purple-600" },
                { action: "Architecture Validation", cost: 20, icon: CheckCircle, iconClass: "text-green-600" },
                { action: "AI Chat (per message)", cost: 2, icon: ChatText, iconClass: "text-black/60" },
              ].map((item) => (
                <div key={item.action} className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={item.iconClass} weight="fill" />
                    <span className="font-mono text-sm text-black">{item.action}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-subColor">{item.cost} credits</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-canvas-bg rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-black">Usage History</h3>

              <div className="flex items-center gap-2">
                <div className="flex bg-white rounded-lg p-1">
                  <button className="px-3 py-1.5 font-mono text-xs rounded-md text-black/50 hover:text-black transition-colors">
                    Today
                  </button>
                  <button className="px-3 py-1.5 font-mono text-xs rounded-md bg-black/5 text-black">
                    7 days
                  </button>
                  <button className="px-3 py-1.5 font-mono text-xs rounded-md text-black/50 hover:text-black transition-colors">
                    30 days
                  </button>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg">
                  <span className="font-mono text-xs text-black/60">2026/03/09 - 2026/03/15</span>
                  <Calendar size={14} className="text-black/40" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-3 px-4 font-mono text-xs text-black/50 font-medium">Time</th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-black/50 font-medium">Action</th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-black/50 font-medium">Diagram/Repo</th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-black/50 font-medium">Credits</th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-black/50 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  {[
                    {
                      time: "2026/03/15 09:23",
                      action: "AI Diagram Generation",
                      target: "E-commerce Microservices",
                      credits: "-10",
                      status: "Success",
                      icon: Sparkle,
                      iconClass: "text-subColor",
                    },
                    {
                      time: "2026/03/15 08:45",
                      action: "GitHub Repo Analysis",
                      target: "acme/payment-service",
                      credits: "-25",
                      status: "Success",
                      icon: GitBranch,
                      iconClass: "text-blue-600",
                    },
                    {
                      time: "2026/03/14 16:12",
                      action: "Code Export",
                      target: "terraform.tf",
                      credits: "-10",
                      status: "Success",
                      icon: Code,
                      iconClass: "text-purple-600",
                    },
                  ].map((row) => (
                    <tr key={row.time + row.action} className="border-b border-black/5 hover:bg-white/40">
                      <td className="py-3 px-4 text-black/50">{row.time}</td>
                      <td className="py-3 px-4 text-black">
                        <div className="flex items-center gap-2">
                          <row.icon size={14} className={row.iconClass} weight="fill" />
                          {row.action}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-black">{row.target}</td>
                      <td className="py-3 px-4 text-subColor font-semibold">{row.credits}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/15 text-green-700 rounded text-xs">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
              <span className="font-mono text-xs text-black/50">Showing 1-10 of 47 events</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg font-mono text-xs text-black/50 hover:text-black disabled:opacity-50 bg-white"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg font-mono text-xs text-black/50 hover:text-black bg-white">
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="bg-mainColor/10 rounded-2xl p-6 mt-6">
            <h3 className="font-display text-xl font-bold text-black mb-4">Need more credits?</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4">
                <div className="font-mono text-sm text-black/50 mb-2">Free</div>
                <div className="font-display text-2xl font-bold text-black mb-1">$0</div>
                <div className="font-mono text-xs text-black/50 mb-4">50 credits/month</div>
                <ul className="space-y-2 font-mono text-xs text-black/60">
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    Basic AI features
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    5 diagrams
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full font-mono text-xs text-white font-semibold">
                  Current
                </div>
                <div className="font-mono text-sm text-black/50 mb-2">Pro</div>
                <div className="font-display text-2xl font-bold text-black mb-1">$19/mo</div>
                <div className="font-mono text-xs text-black/50 mb-4">500 credits/month</div>
                <ul className="space-y-2 font-mono text-xs text-black/60">
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    All AI features
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    Unlimited diagrams
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    Priority support
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="font-mono text-sm text-black/50 mb-2">Team</div>
                <div className="font-display text-2xl font-bold text-black mb-1">$49/user</div>
                <div className="font-mono text-xs text-black/50 mb-4">1,500 credits/user</div>
                <ul className="space-y-2 font-mono text-xs text-black/60">
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={12} className="text-green-600" weight="bold" />
                    SSO &amp; audit logs
                  </li>
                </ul>
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-display font-semibold hover:opacity-90 transition-opacity">
              Compare All Plans
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
