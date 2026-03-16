"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import {
  ArrowUpRight,
  HandGrabbing, 
  Square, 
  Circle, 
  TextT,
  CaretDown,
  Chat,
  Chats,
  CheckCircle,
  ClockCounterClockwise,
  CloudCheckIcon,
  Cursor,
  FileText,
  GithubLogo,
  Link,
  PaperPlaneTilt,
  Plus,
  Sparkle,
  GearSix,
  LineVertical,
} from "@phosphor-icons/react";
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
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [viewMode, setViewMode] = useState<"document" | "both" | "canvas">("canvas");

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

      await cursorControls.start({ scale: 0.92, transition: { duration: 0.08 } });
      await cursorControls.start({ scale: 1, transition: { duration: 0.12 } });

      setMessage("");
      for (let i = 1; i <= prompt.length; i += 1) {
        setMessage(prompt.slice(0, i));
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
      <div className="relative flex items-center justify-between px-4 py-3 bg-[#0d0e12] backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image src="/logo.png" alt="Supabricx" fill className="object-contain" />
          </div>
          <span className="font-dynapuff text-white">E-Commerce App</span>
          <span className="ml-2 text-xs text-white/50 font-mono hidden sm:inline">Canvas</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-mainColor/10 rounded-lg p-1 border border-subColor/10">
          {[
            { id: "document", label: "Document" },
            { id: "both", label: "Both" },
            { id: "canvas", label: "Canvas" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as "document" | "both" | "canvas")}
              className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-all
                ${viewMode === mode.id
                  ? "bg-mainColor text-white shadow-sm"
                  : "text-muted hover:text-black hover:bg-black/5"
                }
              `}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-black/5 rounded-full text-gray-200 transition-colors">
            <ClockCounterClockwise size={24} />
          </button>

          <button className="p-2 hover:bg-black/5 rounded-full text-gray-200 transition-colors">
            <CloudCheckIcon size={24} />
          </button>

          <div className="flex items-center h-10 bg-mainColor hover:bg-mainColor/50 text-[#351300] rounded-full pl-4 pr-2 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 pr-3">
              <Link size={20} />
              <span className="font-semibold text-sm">Share</span>
            </div>
            <div className="h-full w-px bg-subColor" />
            <button className="pl-2 h-full flex items-center justify-center">
              <CaretDown size={16} weight="bold" />
            </button>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-white/10 overflow-hidden relative">
            <Image src="/user.jpeg" alt="User" fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="relative flex h-[520px]">
        <div className="w-14 shrink-0 bg-[#0d0e12] backdrop-blur-sm border-r border-white/10 flex flex-col items-center gap-3 py-4">
          {[
            { id: "select", icon: Cursor },
            { id: "move", icon: HandGrabbing },
            { id: "insert", icon: Plus },
            { id: "connect", icon: LineVertical },
            { id: "rectangle", icon: Square },
            { id: "circle", icon: Circle },
            { id: "text", icon: TextT },
            { id: "comment", icon: Chats },
            { id: "settngs", icon: GearSix },
          ].map((t, idx) => (
            <button
              key={t.id}
              type="button"
              className={[
                "h-9 w-9 rounded-xl border flex items-center justify-center transition-colors",
                idx === 0
                  ? "bg-mainColor/20 border-mainColor/30 text-mainColor"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10",
              ].join(" ")}
              aria-label={t.id}
            >
              <t.icon size={18} weight={idx === 0 ? "fill" : "regular"} />
            </button>
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
              <span className="text-white">Bricx</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors" title="History">
                <ClockCounterClockwise size={18} />
              </button>
              <button className="p-1.5 hover:bg-border-dark rounded text-muted hover:text-foreground transition-colors" title="New Chat">
                <Chats size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
            {message.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Image src="/logo.png" alt="Supabricx AI" fill className="object-contain" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-display font-medium text-white">
                      Work with <span className="text-subColor">Supabricx</span>
                    </div>
                    <p className="mt-2 text-sm text-white/60 font-mono max-w-[320px]">
                      Generate architecture diagrams, refine system designs, and turn requirements into deployable blueprints.
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-[340px]">
                  <div className="text-sm font-dm-mono font-medium text-white/70 mb-3">Past Conversations</div>

                  <div className="flex flex-col gap-2">
                    {[{ title: "Generate a SaaS microservices architecture", meta: "Today" }].map((item) => (
                      <button
                        key={item.title}
                        className="w-full flex items-center justify-between gap-3 rounded-xl bg-canvas-bg/70 hover:bg-canvas-bg transition-colors px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <Chat size={20} className="text-subColor" weight="fill" />
                          </div>
                          <span className="text-sm text-white/70 truncate font-display">{item.title}</span>
                        </div>
                        <span className="text-xs text-white/40 shrink-0 font-mono">{item.meta}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {submitted && (
                  <>
                    <div className="flex justify-end">
                      <div className="max-w-[280px] rounded-2xl bg-subColor text-white px-3 py-2 text-sm font-mono">
                        {prompt}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-[280px] rounded-2xl bg-white border border-black/10 px-3 py-2 text-sm font-mono text-black"
                      >
                        Generating diagram…
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="p-4 pt-0">
            <div className="relative bg-[#1a1a1a] rounded-2xl p-2">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your architecture..."
                className="w-full bg-transparent pl-3 pr-12 text-sm font-mono text-white placeholder:text-muted focus:outline-none resize-none min-h-[40px]"
              />

              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-black/5 rounded-lg text-muted hover:text-foreground transition-colors">
                    <FileText size={18} />
                  </button>
                  <button className="p-1.5 hover:bg-black/5 rounded-lg text-muted hover:text-foreground transition-colors">
                    <GithubLogo size={18} />
                  </button>
                </div>

                <button
                  ref={sendRef}
                  className="p-2 bg-subColor rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!message.trim()}
                  type="button"
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
          className="pointer-events-none absolute left-0 top-0 z-50"
          style={{ x: 0, y: 0 }}
        >
          <div className="relative">
            <div className="rounded-lg bg-foreground border border-black/10 p-1 shadow-[0_14px_30px_rgba(0,0,0,0.35)] text-black">
              <CursorPointer className="h-7 w-7 drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]" />
            </div>
            <motion.div
              className="absolute -right-7 -top-7 h-5 w-5 rounded-full bg-mainColor/20 border border-mainColor/30"
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
