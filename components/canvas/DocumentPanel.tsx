import { 
  TextB, 
  TextItalic, 
  ListBullets, 
  ListNumbers, 
  Code, 
  Link,
  Image as ImageIcon,
  Plus
} from "@phosphor-icons/react";

export default function DocumentPanel() {
  return (
    <div className="flex flex-col h-full w-full bg-foreground text-black border-r border-black/10 overflow-hidden">
      {/* Document Header / Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-black/10 overflow-x-auto scrollbar-none">
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <Plus size={16} />
        </button>
        <div className="h-4 w-px bg-black/10 mx-1" />
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <TextB size={16} />
        </button>
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <TextItalic size={16} />
        </button>
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <ListBullets size={16} />
        </button>
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <ListNumbers size={16} />
        </button>
        <div className="h-4 w-px bg-black/10 mx-1" />
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <Code size={16} />
        </button>
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <Link size={16} />
        </button>
        <button className="p-1.5 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors">
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-8 font-sans">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-black leading-tight font-display">
            WEB SCRAPPING, CELERY, REDIS QUEUE, AI ENGINE
          </h1>
          
          <p className="text-black/80 leading-relaxed text-lg">
            This detailed implementation flow for the Smart Scraping, AI Engine, and Change Detection pipeline is the <strong className="text-black font-semibold">core architectural blueprint</strong> for your product. I&apos;ve updated the flow to incorporate <strong className="text-black font-semibold">distributed locking</strong> and refined the <strong className="text-black font-semibold">politeness policy</strong> for enterprise-grade execution.
          </p>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-black font-display">
              <span className="text-mainColor">▶</span> Enterprise Smart Scraper Architecture Flow
            </h2>
            <p className="text-black/80 leading-relaxed">
              This architecture divides the massive task into self-contained, resilient, and scalable components.
            </p>
          </div>
          
          {/* Placeholder content for length */}
          <div className="h-96"></div>
        </div>
      </div>
    </div>
  );
}
