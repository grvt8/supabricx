"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-56 shrink-0">
      <div className="text-xs font-mono text-black/40 mb-3">ACCOUNT</div>
      <nav className="flex flex-col gap-1">
        <Link
          href="/profile"
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive("/profile")
              ? "bg-canvas-bg text-black"
              : "text-black/60 hover:bg-canvas-bg hover:text-black"
          }`}
        >
          Profile
        </Link>
        <Link
          href="/settings"
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive("/settings")
              ? "bg-canvas-bg text-black"
              : "text-black/60 hover:bg-canvas-bg hover:text-black"
          }`}
        >
          Settings
        </Link>
      </nav>

      <div className="text-xs font-mono text-black/40 mt-8 mb-3">SUBSCRIPTION</div>
      <nav className="flex flex-col gap-1">
        <a
          href="#"
          className="rounded-lg px-3 py-2 text-sm font-medium text-black/60 hover:bg-canvas-bg hover:text-black transition-colors"
        >
          Plan &amp; Billings
        </a>
        <Link
          href="/usage"
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive("/usage")
              ? "bg-canvas-bg text-black"
              : "text-black/60 hover:bg-canvas-bg hover:text-black"
          }`}
        >
          Usage
        </Link>
      </nav>
    </aside>
  );
}
