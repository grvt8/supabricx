import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050608] text-white">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 pb-24 pt-16">
        <section className="relative w-full rounded-[32px] border border-white/5 bg-gradient-to-b from-[#050608] via-[#050b08] to-black px-6 py-16 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          <span className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l border-t border-emerald-400/60" />
          <span className="pointer-events-none absolute right-0 top-0 h-7 w-7 border-r border-t border-emerald-400/60" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-7 w-7 border-b border-l border-emerald-400/40" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 border-b border-r border-emerald-400/40" />

          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-medium tracking-wide text-emerald-300">
                Supabricx AI Builder
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold md:text-5xl">
                  Build something with{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                    Supabricx
                  </span>
                </h1>
                <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                  Create backends and APIs by chatting with AI. Describe what you want, and let
                  Supabricx scaffold the stack for you.
                </p>
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-black/70 px-5 pb-4 pt-5 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex-1 rounded-2xl bg-[#111111] px-4 py-3 text-sm text-zinc-300">
                    Ask Supabricx to create a backend prototype
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-sky-400 text-black shadow-[0_14px_40px_rgba(34,197,94,0.55)]"
                  >
                    <span className="text-lg">➜</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full border border-zinc-700 bg-black/60 px-3 py-1"
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Attach</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full border border-zinc-700 bg-black/60 px-3 py-1"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Public</span>
                    </button>
                  </div>
                  <span className="uppercase tracking-[0.16em] text-zinc-600">
                    Supabricx chat workspace
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-sky-400" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600">
              <span className="uppercase tracking-[0.16em] text-zinc-500">
                Powered by your favorite tools
              </span>
              <span className="h-px w-10 bg-zinc-700" />
              <span>OpenAI</span>
              <span className="text-zinc-700">•</span>
              <span>Claude</span>
              <span className="text-zinc-700">•</span>
              <span>Grok</span>
              <span className="text-zinc-700">•</span>
              <span>Custom Supabricx runtimes</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
