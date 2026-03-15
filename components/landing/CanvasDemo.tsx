"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { PaperPlaneTilt, Sparkle, Chats, ClockCounterClockwise} from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };

function CursorPointer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4 3.5V20.5L9.3 15.2L12.4 22.5L15.2 21.2L12.1 13.9L19 13.9L4 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

type MiniNode = {
  id: string;
  label: string;
  subtitle?: string;
  imageSrc?: string;
  color: string;
  x: number;
  y: number;
  w: number;
};

const prompt = "Generate an architecture diagram for a basic ecommerce application";

export default function CanvasDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const sendRef = useRef<HTMLButtonElement | null>(null);

  const cursorControls = useAnimationControls();
  const [anchors, setAnchors] = useState<{ start: Point; input: Point; send: Point } | null>(null);
  const [typed, setTyped] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const nodes = useMemo<MiniNode[]>(
    () => [
      { id: "client", label: "Web Client", subtitle: "Storefront", imageSrc: "/globe.svg", color: "#FFB563", x: 110, y: 110, w: 180 },
      { id: "gateway", label: "API Gateway", subtitle: "Routing + Auth", imageSrc: "/logo.png", color: "#F85E00", x: 410, y: 110, w: 200 },

      { id: "auth", label: "Auth Service", subtitle: "JWT + OAuth", imageSrc: "/google.png", color: "#FF2F9F", x: 220, y: 290, w: 200 },
      { id: "catalog", label: "Catalog", subtitle: "Products", imageSrc: "/logo.png", color: "#7C3AED", x: 470, y: 290, w: 200 },
      { id: "cart", label: "Cart", subtitle: "Session state", imageSrc: "/logo.png", color: "#22C55E", x: 720, y: 290, w: 200 },

      { id: "orders", label: "Orders", subtitle: "Checkout", imageSrc: "/logo.png", color: "#06B6D4", x: 360, y: 455, w: 200 },
      { id: "payments", label: "Payments", subtitle: "Stripe", imageSrc: "/stripe.png", color: "#A3A3A3", x: 610, y: 455, w: 200 },

      { id: "db", label: "PostgreSQL", subtitle: "users + orders", imageSrc: "/postgresql.png", color: "#2FC1FF", x: 250, y: 610, w: 220 },
      { id: "cache", label: "Redis", subtitle: "cache", imageSrc: "/redis.png", color: "#F97316", x: 560, y: 610, w: 200 },
    ],
    [],
  );

  const edges = useMemo(
    () => [
      { from: "client", to: "gateway" },
      { from: "gateway", to: "auth" },
      { from: "gateway", to: "catalog" },
      { from: "gateway", to: "cart" },
      { from: "catalog", to: "cache" },
      { from: "cart", to: "cache" },
      { from: "catalog", to: "db" },
      { from: "auth", to: "db" },
      { from: "gateway", to: "orders" },
      { from: "orders", to: "db" },
      { from: "orders", to: "payments" },
    ],
    [],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    const send = sendRef.current;
    if (!container || !input || !send) return;

    const compute = () => {
      const c = container.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      const sendRect = send.getBoundingClientRect();

      const start: Point = { x: c.width * 0.55, y: c.height * 0.32 };
      const inputPoint: Point = {
        x: inputRect.left - c.left + inputRect.width * 0.85,
        y: inputRect.top - c.top + inputRect.height * 0.65,
      };
      const sendPoint: Point = {
        x: sendRect.left - c.left + sendRect.width * 0.5,
        y: sendRect.top - c.top + sendRect.height * 0.5,
      };
      setAnchors({ start, input: inputPoint, send: sendPoint });
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (!anchors || hasRun) return;
    setHasRun(true);

    const run = async () => {
      await cursorControls.start({
        x: anchors.start.x,
        y: anchors.start.y,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
      });

      await cursorControls.start({
        x: anchors.start.x - 120,
        y: anchors.start.y + 90,
        transition: { duration: 0.9, ease: "easeInOut" },
      });

      await cursorControls.start({
        x: anchors.start.x + 80,
        y: anchors.start.y + 40,
        transition: { duration: 0.9, ease: "easeInOut" },
      });

      await cursorControls.start({
        x: anchors.input.x,
        y: anchors.input.y,
        transition: { duration: 0.7, ease: "easeInOut" },
      });

      setIsFocused(true);
      await cursorControls.start({ scale: 0.92, transition: { duration: 0.08 } });
      await cursorControls.start({ scale: 1, transition: { duration: 0.12 } });

      setTyped("");
      for (let i = 1; i <= prompt.length; i += 1) {
        setTyped(prompt.slice(0, i));
        await new Promise((r) => setTimeout(r, 14));
      }

      await cursorControls.start({
        x: anchors.send.x,
        y: anchors.send.y,
        transition: { duration: 0.45, ease: "easeInOut" },
      });
      await cursorControls.start({ scale: 0.92, transition: { duration: 0.08 } });
      await cursorControls.start({ scale: 1, transition: { duration: 0.12 } });

      setSubmitted(true);
      setIsFocused(false);
      setIsGenerating(true);
      await new Promise((r) => setTimeout(r, 1800));
      setShowDiagram(true);
      await new Promise((r) => setTimeout(r, 750));
      setIsGenerating(false);
    };

    void run();
  }, [anchors, cursorControls, hasRun]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e12] backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image src="/logo.png" alt="Supabricx" fill className="object-contain" />
          </div>
          <span className="font-dynapuff text-white">E-Commerce App</span>
          <span className="ml-2 text-xs text-white/50 font-mono hidden sm:inline">Canvas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs text-white/50 font-mono">
            <span className="px-2 py-1 rounded-full bg-white/5">Document</span>
            <span className="px-2 py-1 rounded-full bg-white/5">Canvas</span>
            <span className="px-2 py-1 rounded-full bg-white/5">AI</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white border border-white/10 overflow-hidden relative">
            <Image src="/user.jpeg" alt="User" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="relative flex h-[520px]">
        <div className="w-14 shrink-0 bg-[#0d0e12] backdrop-blur-sm border-r border-white/10 flex flex-col items-center gap-3 py-4">
          {["select", "insert", "connect", "comment", "video"].map((k) => (
            <div
              key={k}
              className="h-9 w-9 rounded-xl bg-white/10 border border-white/10"
            />
          ))}
        </div>

        <div className="relative flex-1 bg-[#1a1a1a]  overflow-hidden">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <svg
            viewBox="0 0 1000 760"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {showDiagram &&
              edges.map((e) => {
                const from = nodes.find((n) => n.id === e.from);
                const to = nodes.find((n) => n.id === e.to);
                if (!from || !to) return null;
                const x1 = from.x + from.w / 2;
                const y1 = from.y + 38;
                const x2 = to.x + to.w / 2;
                const y2 = to.y + 38;
                return (
                  <motion.line
                    key={`${e.from}-${e.to}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                );
              })}
          </svg>

          {showDiagram &&
            nodes.map((n, idx) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
                className="absolute"
                style={{
                  left: `${(n.x / 1000) * 100}%`,
                  top: `${(n.y / 760) * 100}%`,
                  width: `${(n.w / 1000) * 100}%`,
                }}
              >
                <div className="rounded-2xl bg-white border border-white/10 shadow-sm px-3 py-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 relative overflow-hidden">
                    {n.imageSrc ? (
                      <Image src={n.imageSrc} alt={n.label} fill className="object-contain p-2" />
                    ) : (
                      <div className="h-6 w-6 rounded bg-white/10" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-dynapuff text-white truncate">{n.label}</div>
                      <span className="h-2 w-2 rounded-full" style={{ background: n.color }} />
                    </div>
                    {n.subtitle && <div className="text-xs text-white/50 font-mono truncate">{n.subtitle}</div>}
                  </div>
                </div>
              </motion.div>
            ))}

          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/10 px-5 py-4 flex items-center gap-3 shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-9 w-9"
                >
                  <Image src="/logo.png" alt="Generating" fill className="object-contain" />
                </motion.div>
                <div className="flex flex-col">
                  <div className="text-sm font-dynapuff text-white flex items-center gap-2">
                    Generating
                    <motion.span
                      className="inline-flex"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkle size={16} className="text-subColor" weight="fill" />
                    </motion.span>
                  </div>
                  <div className="text-xs text-white/50 font-mono">ecommerce-architecture.json</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[360px] shrink-0 bg-[#0d0e12] border-l border-white/10 flex flex-col">
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image src="/logo.png" alt="Bricx" fill className="object-contain" />
              </div>
              <span className="font-dynapuff text-white">Bricx</span>
            </div>
            <ClockCounterClockwise size={16} color="#ffffff" />
            <Chats size={16} color="#ffffff" />
        
          </div>

          <div className="flex-1 overflow-hidden p-4">
            {!submitted ? (
              <div className="h-full rounded-2xl border border-white/10 bg-[var(--color-background)] p-4 flex items-center justify-center text-sm text-white/60 font-mono text-center">
                Ask Supabricx to generate an architecture diagram.
              </div>
            ) : (
              <div className="flex flex-col gap-3 h-full">
                <div className="flex justify-end">
                  <div className="max-w-[260px] rounded-2xl bg-subColor text-white px-3 py-2 text-sm font-mono">
                    {prompt}
                  </div>
                </div>
                <div className="flex justify-start">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-[280px] rounded-2xl bg-white border border-white/10 px-3 py-2 text-sm font-mono text-white"
                  >
                    Generating diagram…
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 pt-0">
            <div
              className={[
                "rounded-2xl border bg-[var(--color-background)] p-3",
                isFocused ? "border-subColor/40 shadow-[0_0_0_4px_rgba(248,94,0,0.12)]" : "border-white/10",
              ].join(" ")}
            >
              <textarea
                ref={inputRef}
                value={typed}
                readOnly
                rows={3}
                className="w-full resize-none bg-transparent text-sm font-mono text-white placeholder:text-white/40 focus:outline-none"
                placeholder="Describe your architecture..."
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-white/40 font-mono">{typed.length} chars</div>
                <button
                  ref={sendRef}
                  type="button"
                  className="h-9 w-9 rounded-xl bg-subColor text-white flex items-center justify-center shadow-sm"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={cursorControls}
          className="pointer-events-none absolute left-0 top-0 z-50 text-white"
          style={{ x: 0, y: 0 }}
        >
          <div className="relative">
            <CursorPointer className="h-7 w-7 drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]" />
            <motion.div
              className="absolute -right-7 -top-7 h-5 w-5 rounded-full bg-subColor/30"
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
