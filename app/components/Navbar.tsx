"use client"
import Image from 'next/image'
import React from 'react'
import { ArrowUpRight, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="w-full h-20 p-4 text-white flex justify-around items-center cursor-pointer">
        <div className='flex justify-center items-center h-full w-fit '>
          <Image src="/logo.png" alt="Logo" className='h-15 w-15' width={100} height={10} />
          <p className='text-2xl'>Supabricx</p>
        </div>
        

        <div className="flex justify-evenly items-center h-full w-100 bg-white/5 backdrop-blur-md border border-white/10 rounded-[30px] shadow-lg">
          <p>Product</p>
          <p>Docs</p>
          <p>APIs</p>
        </div>

        
        <div className='flex justify-between gap-2 items-center h-full w-fit'>
            {/* <LinkedinLogo size={32} /> */}
            <GithubLogo size={32} />
            <Button
              title="Join the Beta"
              Icon={ArrowUpRight}
              width="220px"
              height="60px"
            />
        </div>
    </nav>
  )
}

export default Navbar