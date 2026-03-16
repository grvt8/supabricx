"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import Button from "./Button";
import ChatInterface from "./ChatInterface";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const el = profileMenuRef.current;
      if (!el) return;
      if (event.target instanceof Node && el.contains(event.target)) return;
      setIsProfileMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    if (isProfileMenuOpen) {
      window.addEventListener("mousedown", onPointerDown);
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-30 h-20 p-4 text-black flex justify-between md:justify-around items-center cursor-pointer bg-[#ffead1]">
        <div className="flex justify-center items-center h-full w-fit gap-2">
          <Image src="/logo.png" alt="Logo" className="h-10 w-10 md:h-15 md:w-15" width={100} height={10} />
          <p className="text-xl md:text-2xl font-dynapuff">Supabricx</p>
        </div>
        <div className="hidden md:flex justify-evenly items-center h-full w-100 bg-[#E6D2BC] backdrop-blur-md border border-white/10">
          <p className="font-dynapuff">Docs</p>
          <p className="font-dynapuff">Changelog</p>
          <p className="font-dynapuff">Pricing</p>
          <p className="font-dynapuff">Blog</p>
        </div>
        <div className="flex justify-between gap-2 items-center h-full w-fit">
          
          <div className="hidden md:block">
            <Button
              title="Open Workspace"
              Icon={ArrowUpRight}
              width="220px"
              height="h-11"
              onClick={() => router.push('/signup')}
            />
          </div>

          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="block"
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
            >
              <div
                className="p-[3px]"
                style={{ background: "conic-gradient(#FFB563 0deg 90deg, #F85E00 90deg 270deg, #FBBC05 270deg 360deg)" }}
              >
                <div className="relative h-9.5 w-10 overflow-hidden bg-white shadow-sm">
                  <Image src="/user.jpeg" alt="avatar" fill className="object-cover" />
                </div>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-[275px] overflow-hidden border border-white/10 bg-[#0d0e12] shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-white/10 border border-white/10">
                    <Image src="/user.jpeg" alt="avatar" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg font-dynapuff text-white leading-none">404khai</div>
                    <div className="mt-2 w-fit rounded-md bg-mainColor/20 px-2.5 py-1 text-xs font-mono text-mainColor">
                      Pro
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  {[
                    { label: "Profile", href: "/profile" },
                    { label: "Settings", href: "/settings" },
                    { label: "Usage", href: "/usage" },
                  ].map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full px-5 py-3 text-left text-lg text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/10 py-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-5 py-3 text-left text-lg text-white/70 hover:text-white transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
