"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import Button from "./Button";
import ChatInterface from "./ChatInterface";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <>
      <nav className="sticky top-0 z-30 w-full h-20 p-4 text-black flex justify-between md:justify-around items-center cursor-pointer">
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

          <div className="relative shrink-0">
            <div
              className="p-[3px]"
              style={{ background: "conic-gradient(#FFB563 0deg 90deg, #F85E00 90deg 270deg, #FBBC05 270deg 360deg)" }}
            >
              <div className="relative h-9.5 w-10 overflow-hidden bg-white shadow-sm">
                <Image src="/user.jpeg" alt="avatar" fill className="object-cover" />
              </div>
            </div>
          
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
