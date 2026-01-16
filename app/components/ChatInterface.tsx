"use client";

import React, { useState, useEffect } from "react";

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

type ChatInterfaceProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      content: "Hey, I am your Supabricx AI assistant. Ask me anything about your backend.",
    },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        role: "user",
        content: trimmed,
      },
      {
        id: prev.length + 1,
        role: "ai",
        content: "AI responses are coming soon. For now, this is a mock reply.",
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mb-8 mr-8 flex w-full max-w-md flex-col rounded-3xl border border-white/10 bg-[#121212] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-t border-emerald-400/70" />
        <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-t border-emerald-400/70" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-emerald-400/70" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-emerald-400/70" />
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#a3a3a3]">Supabricx</span>
            <span className="text-lg font-semibold text-white">AI Chat</span>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="mb-4 flex h-64 flex-col gap-2 overflow-y-auto rounded-2xl border border-white/5 bg-black/40 p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-white/10 text-white"
                  : "mr-auto bg-[#1b1b1b] text-[#e5e5e5] border border-white/5"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#666666]"
          />
          <button
            type="button"
            className="chat-send-button"
            onClick={handleSend}
          >
            <span>Send</span>
            <span className="text-lg">➜</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

