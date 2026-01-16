"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  Icon?: React.ElementType;
  width?: string;
  height?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  Icon,
  width = "auto",
  height = "auto",
  ...props
}) => {
  return (
    <button
      style={{ width, height }}
      className={`
        relative 
        bg-white/5 
        backdrop-blur-md 
        border border-white/10 
        h-full!
        text-white 
        text-lg 
        inline-flex items-center justify-center gap-2 
        cursor-pointer 
        transition-all duration-300 ease-in-out 
        overflow-hidden 
        shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        group
      `}
      {...props}
    >
      <span>{title}</span>
      {Icon && <Icon className="text-xl transform transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
};

export default Button;
