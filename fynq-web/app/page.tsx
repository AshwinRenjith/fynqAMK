'use client'

import Link from 'next/link'
import { Package, Shield, Globe, ChevronRight, Sparkles, Command, ArrowRight, Cpu, Terminal } from 'lucide-react'
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useRef, MouseEvent } from 'react'
import clsx from 'clsx'

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })

  // Subtle parallax
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.4], [0, 50])

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">

      {/* 1. Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Atmospheric Glows */}
        <div className="absolute top-[-30%] left-[-10%] w-[120vw] h-[100vh] bg-indigo-900/10 rounded-full blur-[180px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[120vw] h-[100vh] bg-blue-900/10 rounded-full blur-[180px] animate-pulse-slow delay-2000 mix-blend-screen" />

        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] contrast-150 brightness-100 mix-blend-overlay" />

        {/* Minimal Grid - Fading out */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 2. Floating Island Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
      >
        <nav className="pointer-events-auto flex items-center gap-1 p-1.5 pl-2 rounded-full border border-white/5 bg-[#080808]/60 backdrop-blur-2xl shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors group">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-[10px] font-bold text-white font-mono">F</span>
            </div>
            <span className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors">fynq</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/5 mx-1" />

          <Link href="/registry" className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">Registry</Link>
          <Link href="https://github.com/AshwinRenjith/fynqADK" className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">GitHub</Link>

          <Link href="/getting-started" className="ml-1 pl-4 pr-1 py-1 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-200 hover:text-white transition-colors">Documentation</span>
            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </nav>
      </motion.div>

      <main className="relative z-10">

        {/* 3. Hero Section - Typography Focused */}
        <section ref={targetRef} className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 relative">
          <motion.div
            style={{ opacity, scale, y }}
            className="flex flex-col items-center text-center max-w-7xl mx-auto z-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono tracking-wide uppercase backdrop-blur-md shadow-2xl">
                <Sparkles className="w-3 h-3" />
                <span>Intelligent Runtimes v1.0</span>
              </div>
            </motion.div>

            {/* Main Title - Split & Staggered */}
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-8 relative">
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 pb-2"
              >
                Orchestrate
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-blue-200 animate-text-shimmer bg-[size:200%_auto] pb-4"
              >
                Intelligence.
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
            >
              The universal package manager for autonomous agents. <br className="hidden md:block" />
              <span className="text-slate-300 font-normal">Discover. Install. Execute.</span>
            </motion.p>

            {/* Install Command - Ultra Minimal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="w-full max-w-md mx-auto relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex items-center justify-between gap-4 bg-[#0A0A0A] border border-white/10 rounded-xl px-5 py-4 shadow-2xl">
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-indigo-400 select-none">$</span>
                  <span className="text-slate-300">curl -fsSL https://fynq.sh/install | sh</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText("curl -fsSL https://fynq.sh/install | sh")}
                  className="text-slate-500 hover:text-white transition-colors p-1"
                  aria-label="Copy command"
                >
                  <Command className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-0.5 h-2 bg-white/50 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* 4. Feature Grid - Glass Cards with Spotlight */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            <SpotlightCard
              title="Secure Sandbox"
              desc="Capabilities are locked by default. You grant explicit permissions for network and filesystem access."
              icon={<Shield className="w-5 h-5" />}
              delay={0}
            />
            <SpotlightCard
              title="Global Registry"
              desc="Immutable, versioned, and cryptographically signed. Publish your intelligence to the world."
              icon={<Globe className="w-5 h-5" />}
              delay={0.1}
            />
            <SpotlightCard
              title="Python Native"
              desc="Built for modern AI engineering. Includes a powerful SDK for browser automation and search."
              icon={<Package className="w-5 h-5" />}
              delay={0.2}
            />
          </div>
        </section>

        {/* 5. Terminal Demo - The "Real" Experience */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Built for Builders</h2>
              <p className="text-slate-400 text-lg">Your new favorite CLI tool.</p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-[#050505] shadow-2xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-[#FB5454]" />
                  <div className="w-3 h-3 rounded-full bg-[#FDBE2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="text-xs font-mono text-slate-500">~/projects/fynq</div>
              </div>
              <div className="p-8 font-mono text-sm md:text-base leading-relaxed text-slate-300 min-h-[400px]">
                <div className="flex gap-2 mb-4">
                  <span className="text-indigo-400 font-bold">➜</span>
                  <span>fynq run @fynq/youtube --task <span className="text-green-300">"Summarize this release"</span></span>
                </div>

                <TypewriterSequence delay={1} />
              </div>

              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 6. Footer - Clean */}
        <footer className="py-20 border-t border-white/5 bg-[#020202]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/5">
              <span className="font-mono font-bold text-white">F</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500 mb-8">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">Discord</Link>
              <Link href="#" className="hover:text-white transition-colors">Legal</Link>
            </div>
            <p className="text-xs text-slate-700 font-mono">
              DESIGNED FOR THE FUTURE &middot; 2026 FYNQ AI
            </p>
          </div>
        </footer>

      </main>
    </div>
  )
}

// --- Sub-components --

function SpotlightCard({ title, desc, icon, delay }: { title: string, desc: string, icon: React.ReactNode, delay: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative border border-white/10 bg-white/[0.02] rounded-2xl p-8 overflow-hidden hover:bg-white/[0.04] transition-colors"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
                        radial-gradient(
                            500px circle at ${mouseX}px ${mouseY}px,
                            rgba(99, 102, 241, 0.1),
                            transparent 80%
                        )
                    `
        }}
      />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function TypewriterSequence({ delay }: { delay: number }) {
  // A simplified sequence tailored for effect
  const lines = [
    { text: "[10:42:01] 📺 Analyst Agent initialized...", color: "text-slate-400", time: 0 },
    { text: "[10:42:02] 🔒 Verifying sandbox permissions...", color: "text-slate-400", time: 800 },
    { text: "[10:42:03] 🕸️  Visiting YouTube page...", color: "text-blue-300", time: 1600 },
    { text: "         Target: https://youtube.com/watch?v=dQw4w9WgXcQ", color: "text-slate-600", time: 2400 },
    { text: "[10:42:06] 🧠 Extracting metadata (Mistral)...", color: "text-purple-300", time: 4000 },
    { text: "[10:42:15] 💾 Report generated: video_summary.md", color: "text-emerald-400", time: 6000 },
    { text: "✔ Task completed successfully.", color: "text-white", time: 7000 },
  ]

  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <DelayRender key={i} delay={delay + (line.time / 1000)}>
          <div className={line.color}>{line.text}</div>
        </DelayRender>
      ))}
      <DelayRender delay={delay + 8}>
        <div className="flex items-center gap-2 mt-4 text-slate-500">
          <span className="text-indigo-400 font-bold">➜</span>
          <span className="w-2.5 h-4 bg-slate-500/50 animate-pulse" />
        </div>
      </DelayRender>
    </div>
  )
}

function DelayRender({ delay, children }: { delay: number, children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
