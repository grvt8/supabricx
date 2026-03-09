"use client";

import { useState } from "react";
import { 
  GitBranch, 
  Key, 
  Plugs, 
  UserCircle 
} from "@phosphor-icons/react";
import Link from "next/link";

export default function WorkflowsNavbar() {
  const [activeTab, setActiveTab] = useState("workflows");

  const tabs = [
    { id: "workflows", label: "Workflows", icon: <GitBranch size={20} weight={activeTab === "workflows" ? "fill" : "regular"} />, href: "/workflows" },
    { id: "credentials", label: "Credentials", icon: <Key size={20} weight={activeTab === "credentials" ? "fill" : "regular"} />, href: "/credentials" },
    { id: "integrations", label: "Integrations", icon: <Plugs size={20} weight={activeTab === "integrations" ? "fill" : "regular"} />, href: "/integrations" },
  ];

  return (
    <nav className="flex h-16 w-full items-center justify-between border-b border-border-dark bg-background px-6 z-50">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center">
             <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-display text-xl font-bold gradient-orange-text">Supabricx</span>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center h-9 w-9 rounded-full bg-card-bg border border-border-dark hover:border-orange-400 transition-colors">
          <UserCircle size={24} className="text-muted hover:text-foreground" />
        </button>
      </div>
    </nav>
  );
}
