import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supabricx Canvas",
  description: "AI-powered architecture design tool",
};

export default function CanvasRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background font-display text-foreground">
      {children}
    </div>
  );
}
