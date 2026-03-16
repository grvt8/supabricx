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
  className,
  ...props
}) => {
  const isHeightClass = height?.startsWith("h-");
  const styleHeight = isHeightClass ? undefined : height;
  const heightClass = isHeightClass ? height : "";

  return (
    <button
      style={{ width, height: styleHeight }}
      className={`
        relative 
        bg-black/10 
        backdrop-blur-md
        before:hidden after:hidden
        text-black 
        font-dynapuff
        text-lg 
        inline-flex items-center justify-center gap-2 
        cursor-pointer 
        transition-all duration-300 ease-in-out 
        overflow-hidden 
        group
        ${heightClass}
        ${className || ""}
      `}
      {...props}
    >
      <span>{title}</span>
      {Icon && <Icon className="text-xl transform transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
};

export default Button;
