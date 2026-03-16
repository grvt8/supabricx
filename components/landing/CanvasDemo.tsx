"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import {
  User,
  HandGrabbing, 
  Square, 
  Circle, 
  TextT,
  CaretDown,
  Chat,
  Chats,
  MapPin,
  Package,
  Receipt,
  ClipboardText, 
  CreditCard,
  Truck,
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

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getEntityCardHeight(fieldCount: number) {
  const header = 44;
  const row = 22;
  const padding = 10;
  return header + fieldCount * row + padding;
}

function getEntityIcon(id: string, color: string) {
  if (id === "users") return <User size={20} color={color} />;
  if (id === "addresses") return <MapPin size={20} color={color} />;
  if (id === "products") return <Package size={20} color={color} />;
  if (id === "orders") return <Receipt size={20} color={color} />;
  if (id === "order_items") return <ClipboardText size={20} color={color} />;
  if (id === "payments") return <CreditCard size={20} color={color} />;
  if (id === "shipping") return <Truck size={20} color={color} />;
  return <Circle size={20} color={color} />;
}

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
  color: string;
  x: number;
  y: number;
  w: number;
  title: string;
  fields: {
    name: string;
    type: string;
    key?: "PK" | "FK";
  }[];
};

const prompt = "Generate an ERD for a basic ecommerce application";
const WORLD_W = 1400;
const WORLD_H = 1100;
const SIDEBAR_W = 360;

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
      {
        id: "users",
        title: "users",
        color: "#2FC1FF",
        x: 120,
        y: 120,
        w: 250,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "email", type: "string" },
          { name: "password_hash", type: "string" },
          { name: "first_name", type: "string" },
          { name: "last_name", type: "string" },
          { name: "phone", type: "string" },
          { name: "created_at", type: "timestamp" },
          { name: "updated_at", type: "timestamp" },
        ],
      },
      {
        id: "addresses",
        title: "addresses",
        color: "#60A5FA",
        x: 500,
        y: 160,
        w: 260,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "user_id", type: "uuid", key: "FK" },
          { name: "type", type: "enum" },
          { name: "street", type: "string" },
          { name: "city", type: "string" },
          { name: "state", type: "string" },
          { name: "postal_code", type: "string" },
          { name: "country", type: "string" },
          { name: "is_default", type: "boolean" },
        ],
      },
      {
        id: "orders",
        title: "orders",
        color: "#F85E00",
        x: 260,
        y: 460,
        w: 300,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "user_id", type: "uuid", key: "FK" },
          { name: "order_number", type: "string" },
          { name: "status", type: "enum" },
          { name: "subtotal", type: "decimal" },
          { name: "tax", type: "decimal" },
          { name: "shipping_cost", type: "decimal" },
          { name: "discount", type: "decimal" },
          { name: "total", type: "decimal" },
          { name: "currency", type: "string" },
          { name: "shipping_address", type: "string" },
          { name: "billing_address", type: "string" },
          { name: "notes", type: "string" },
          { name: "created_at", type: "timestamp" },
          { name: "updated_at", type: "timestamp" },
        ],
      },
      {
        id: "order_items",
        title: "order_items",
        color: "#F59E0B",
        x: 900,
        y: 460,
        w: 300,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "order_id", type: "uuid", key: "FK" },
          { name: "product_id", type: "uuid", key: "FK" },
          { name: "quantity", type: "int" },
          { name: "unit_price", type: "decimal" },
          { name: "total_price", type: "decimal" },
        ],
      },
      {
        id: "products",
        title: "products",
        color: "#22C55E",
        x: 1040,
        y: 140,
        w: 280,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "slug", type: "string" },
          { name: "price", type: "decimal" },
          { name: "compare_price", type: "decimal" },
          { name: "cost", type: "decimal" },
          { name: "sku", type: "string" },
          { name: "barcode", type: "string" },
          { name: "inventory_qty", type: "int" },
          { name: "status", type: "enum" },
          { name: "created_at", type: "timestamp" },
          { name: "updated_at", type: "timestamp" },
        ],
      },
      {
        id: "payments",
        title: "payments",
        color: "#FF2F9F",
        x: 220,
        y: 860,
        w: 310,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "order_id", type: "uuid", key: "FK" },
          { name: "user_id", type: "uuid", key: "FK" },
          { name: "amount", type: "decimal" },
          { name: "currency", type: "string" },
          { name: "method", type: "enum" },
          { name: "status", type: "enum" },
          { name: "transaction_id", type: "string" },
          { name: "paid_at", type: "timestamp" },
          { name: "created_at", type: "timestamp" },
        ],
      },
      {
        id: "shipping",
        title: "shipping",
        color: "#06B6D4",
        x: 740,
        y: 860,
        w: 320,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "order_id", type: "uuid", key: "FK" },
          { name: "carrier", type: "string" },
          { name: "tracking_number", type: "string" },
          { name: "method", type: "string" },
          { name: "status", type: "enum" },
          { name: "shipped_at", type: "timestamp" },
          { name: "delivered_at", type: "timestamp" },
          { name: "estimated_delivery", type: "timestamp" },
        ],
      },
    ],
    [],
  );

  const edges = useMemo(
    () => [
      { from: "users", to: "addresses" },
      { from: "users", to: "orders" },
      { from: "users", to: "payments" },
      { from: "orders", to: "order_items" },
      { from: "products", to: "order_items" },
      { from: "orders", to: "payments" },
      { from: "orders", to: "shipping" },
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

        <div className="relative flex-1 bg-[#1a1a1a] overflow-hidden">
          <div className="absolute inset-0 overflow-auto">
            <div className="relative" style={{ width: WORLD_W, height: WORLD_H }}>
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <svg
                viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
                className="absolute left-0 top-0"
                width={WORLD_W}
                height={WORLD_H}
                preserveAspectRatio="none"
              >
                {showDiagram &&
                  edges.map((e) => {
                    const from = nodes.find((n) => n.id === e.from);
                    const to = nodes.find((n) => n.id === e.to);
                    if (!from || !to) return null;

                    const fromH = getEntityCardHeight(from.fields.length);
                    const toH = getEntityCardHeight(to.fields.length);

                    const fromLeft = from.x;
                    const fromRight = from.x + from.w;
                    const toLeft = to.x;
                    const toRight = to.x + to.w;

                    const y1 = from.y + fromH / 2;
                    const y2 = to.y + toH / 2;

                    let x1 = fromRight;
                    let x2 = toLeft;
                    if (toRight <= fromLeft) {
                      x1 = fromLeft;
                      x2 = toRight;
                    } else if (fromRight > toLeft && toRight > fromLeft) {
                      x1 = from.x + from.w / 2;
                      x2 = to.x + to.w / 2;
                    }

                    const dx = x2 - x1;
                    let midX = x1 + dx / 2;
                    if (Math.abs(dx) < 120) midX = x1 + (dx >= 0 ? 160 : -160);

                    const d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

                    return (
                      <motion.path
                        key={`${e.from}-${e.to}`}
                        d={d}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        fill="none"
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
                    style={{ left: n.x, top: n.y, width: n.w }}
                  >
                    <div
                      className="rounded-lg bg-white shadow-sm overflow-hidden"
                      style={{ border: `2px solid ${n.color}` }}
                    >
                      <div
                        className="flex items-center justify-between px-3 py-2"
                        style={{ backgroundColor: hexToRgba(n.color, 0.12) }}
                      >
                        <div className="text-[13px] font-mono font-semibold text-black">{n.title}</div>
                        <div
                          className="h-9 w-9 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: hexToRgba(n.color, 0.2) }}
                        >
                          {getEntityIcon(n.id, n.color)}
                        </div>
                      </div>

                      <div className="border-t border-black/5">
                        {n.fields.map((f) => (
                          <div
                            key={`${n.id}:${f.name}`}
                            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-1.5 text-[12px] font-mono"
                            style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <div className="text-black/70 truncate">{f.name}</div>
                            <div className="text-black/40">{f.type}</div>
                            <div className="justify-self-end">
                              {f.key ? (
                                <span
                                  className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold"
                                  style={{
                                    backgroundColor: hexToRgba(n.color, 0.18),
                                    color: "rgba(0,0,0,0.70)",
                                  }}
                                >
                                  {f.key.toLowerCase()}
                                </span>
                              ) : (
                                <span className="w-7" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl bg-[#252525]/70 backdrop-blur-sm border border-white/10 px-5 py-4 flex items-center gap-3 shadow-lg">
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
                      <div className="text-xs text-white/50 font-mono">ecommerce-ERD.sbx</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="absolute right-0 top-0 bottom-0 bg-[#0d0e12] border-l border-white/10 flex flex-col z-30"
            style={{ width: SIDEBAR_W }}
          >
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
                    <div className="relative w-20 h-20 rounded-full bg-mainColor/20 flex items-center justify-center">
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
                          className="w-full flex items-center justify-between gap-3 rounded-xl bg-[#252525]/70 hover:bg-[#252525] transition-colors px-4 py-3"
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
                        <div className="flex flex-col items-end gap-1 max-w-[320px]">
                          <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 bg-white/10">
                              <Image src="/user.jpeg" alt="User" fill className="object-cover" />
                            </div>
                            <span className="text-sm font-mono text-mainColor">404khai</span>
                          </div>
                          <div className="max-w-[320px] rounded-tl-lg rounded-bl-lg rounded-br-lg bg-mainColor border border-white/10 px-4 py-3 text-sm font-mono text-black">
                            {prompt}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="flex flex-col items-start gap-1 max-w-[340px]">
                            <div className="flex items-center gap-2">
                              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10">
                                <Image src="/logo.png" alt="Bricx" fill className="object-contain p-1.5" />
                              </div>
                              <span className="text-sm font-mono text-white/80">Bricx</span>
                            </div>
                            <div className="max-w-[340px] rounded-tr-lg rounded-bl-lg rounded-br-lg bg-[#252525] border border-black/10 px-4 py-3 text-sm font-mono text-white/90">
                              Generating diagram…
                            </div>
                          </div>
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
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={cursorControls}
          className="pointer-events-none absolute left-0 top-0 z-50"
          style={{ x: 0, y: 0 }}
        >
          <div className="relative">
            <div className="rounded-lg bg-transparent p-1 text-white">
              <CursorPointer className="h-7 w-7 border border-subColor" />
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}
