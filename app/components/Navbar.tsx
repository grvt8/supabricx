"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import Button from "./Button";
import ChatInterface from "./ChatInterface";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const handleGithubClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <nav className="w-full h-20 p-4 text-black flex justify-between md:justify-around items-center cursor-pointer">
        <div className="flex justify-center items-center h-full w-fit gap-2">
          <Image src="/logo.png" alt="Logo" className="h-10 w-10 md:h-15 md:w-15" width={100} height={10} />
          <p className="text-xl md:text-2xl font-dynapuff">Supabricx</p>
        </div>
        <div className="hidden md:flex justify-evenly items-center h-full w-100 bg-black/10 backdrop-blur-md border border-white/10">
          <p className="font-dynapuff">Product</p>
          <p className="font-dynapuff">Docs</p>
          <p className="font-dynapuff">APIs</p>
        </div>
        <div className="flex justify-between gap-2 items-center h-full w-fit">
          <GithubLogo
            size={32}
            className="cursor-pointer text-black/50 transition hover:text-black"
            onClick={handleGithubClick}
          />
          <div className="hidden md:block">
            <Button
              title="Get Started"
              Icon={ArrowUpRight}
              width="220px"
              height="h-11"
              onClick={() => router.push('/signup')}
            />
          </div>
        </div>
      </nav>
      <ChatInterface isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
};

export default Navbar;
