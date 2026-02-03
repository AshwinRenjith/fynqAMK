'use client'

import Link from 'next/link'
import { Terminal, Cpu, Globe, Rocket, ChevronRight, Copy, Check, Sparkles, ChevronLeft, Command } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import clsx from 'clsx'

export default function GettingStarted() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            </div>

            {/* Navigation */}
            {/* Navigation */}
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
                        <span className="text-xs font-medium text-white transition-colors">Documentation</span>
                        <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </Link>
                </nav>
            </motion.div>


            <main className="relative z-10 max-w-4xl mx-auto px-6 py-32">

                {/* Header */}
                <header className="mb-32 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm shadow-xl"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Developer Guide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent"
                    >
                        The Agentic Age <br /> Starts Here.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Follow this guide to summon existing agents, compose your own intelligence, and share it with the world.
                    </motion.p>
                </header>

                {/* Connection Line */}
                <div className="absolute left-[28px] md:left-[50px] top-[400px] bottom-0 w-[1px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 z-0 pointer-events-none md:block hidden" />

                {/* Chapter 1: The Summoning */}
                <Chapter
                    number="01"
                    title="The Summoning"
                    subtitle="Equip yourself with the universal runtime."
                    icon={<Terminal className="w-5 h-5 text-indigo-400" />}
                    delay={0.2}
                >
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Your journey begins with the <strong>Fynq CLI</strong>. This single binary is your wand—secure, fast, and capable of running any agent from the registry.
                    </p>

                    <CodeBlock
                        command="curl -fsSL https://fynq.sh/install | sh"
                        label="Terminal"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mt-6 flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="text-sm">
                            <span className="text-indigo-200 block font-semibold mb-0.5">Verification</span>
                            <span className="text-indigo-200/60">Run <code className="bg-white/10 px-1.5 rounded text-white mx-1">fynq --version</code> to verify.</span>
                        </div>
                    </motion.div>
                </Chapter>

                {/* Chapter 2: First Contact */}
                <Chapter
                    number="02"
                    title="First Contact"
                    subtitle="Witness the power of autonomous execution."
                    icon={<Rocket className="w-5 h-5 text-emerald-400" />}
                    delay={0.3}
                >
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        Don't write code yet. Let's summon the <strong>Researcher</strong>. It can browse the live web, read technical documentation, and write a summary report for you.
                    </p>

                    <CodeBlock
                        command="fynq run @fynq/researcher --task 'Analyze the future of quantum computing'"
                        label="Run Agent"
                    />

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard title="The Request" icon={<Command className="w-4 h-4" />}>
                            You define a high-level goal. The agent figures out the steps.
                        </InfoCard>
                        <InfoCard title="The Sandbox" icon={<Globe className="w-4 h-4" />}>
                            The agent requests explicit permission for network access. You stay in control.
                        </InfoCard>
                    </div>
                </Chapter>

                {/* Chapter 3: Genesis */}
                <Chapter
                    number="03"
                    title="Genesis"
                    subtitle="Breathe life into your own creation."
                    icon={<Cpu className="w-5 h-5 text-purple-400" />}
                    delay={0.4}
                >
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Ready to become a creator? An agent is simple: Identity (Manifest) + Logic (Python).
                    </p>

                    <div className="space-y-12">
                        <Step
                            num="A"
                            title="Initialize"
                            desc="Create a new workspace."
                            code="fynq init my-first-agent"
                        />
                        <Step
                            num="B"
                            title="Define"
                            desc="Edit agent.yaml capabilities."
                            code={`# agent.yaml
package:
  name: "@me/greeter"
  version: "0.1.0"
agent:
  capabilities: []`}
                            isMultiLine
                        />
                        <Step
                            num="C"
                            title="Implement"
                            desc="Write logic in main.py."
                            code={`# main.py
import os
def main():
    user = os.getenv("FYNQ_TASK", "World")
    print(f"Hello, {user}!")
if __name__ == "__main__":
    main()`}
                            isMultiLine
                        />
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                        <p className="text-slate-400 mb-4 text-sm font-medium uppercase tracking-widest">Test Run</p>
                        <CodeBlock command="fynq run . --task 'Traveler'" />
                    </div>
                </Chapter>

                {/* Chapter 4: The Legacy */}
                <Chapter
                    number="04"
                    title="The Legacy"
                    subtitle="Share your intelligence with the world."
                    icon={<Globe className="w-5 h-5 text-blue-400" />}
                    delay={0.5}
                    isLast
                >
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        You've built something useful. Don't keep it locked away.
                        Publish it to the <strong>Fynq Registry</strong> so others can summon it with a single command.
                    </p>

                    <CodeBlock command="fynq publish" label="Publish" />
                </Chapter>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Ready to explore?</h2>
                    <Link
                        href="/registry"
                        className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#050505] px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900">
                            Browse the Registry <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </motion.div>

            </main>
        </div>
    )
}

// --- Components ---

function Chapter({ number, title, subtitle, icon, delay, isLast, children }: { number: string, title: string, subtitle: string, icon: React.ReactNode, delay: number, isLast?: boolean, children: React.ReactNode }) {
    return (
        <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay }}
            className="mb-32 relative pl-12 md:pl-24" // Align content
        >
            {/* Timeline Node */}
            <div className="absolute left-[3px] md:left-[26px] top-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-2xl relative z-10">
                    {icon}
                </div>
            </div>

            <div className="mb-8">
                <span className="font-mono text-indigo-500 text-sm font-bold tracking-widest mb-2 block">CHAPTER {number}</span>
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <p className="text-slate-500 text-lg">{subtitle}</p>
            </div>

            <div>
                {children}
            </div>
        </motion.section>
    )
}

function CodeBlock({ command, label, isMultiLine = false }: { command: string, label?: string, isMultiLine?: boolean }) {
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="group relative rounded-xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl transition-all hover:border-white/20">
            {label && (
                <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{label}</span>
                    <div className="flex gap-1.5 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    </div>
                </div>
            )}
            <div className={clsx("p-6 font-mono text-sm overflow-x-auto selection:bg-indigo-500/30", isMultiLine ? "whitespace-pre leading-relaxed" : "flex items-center")}>
                {!isMultiLine && <span className="text-indigo-500 mr-3 select-none">$</span>}
                <span className="text-slate-300">{command}</span>
            </div>
            <button
                onClick={copy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                title="Copy"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    )
}

function Step({ num, title, desc, code, isMultiLine }: { num: string, title: string, desc: string, code: string, isMultiLine?: boolean }) {
    return (
        <div className="relative">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-mono text-slate-500 bg-white/5">
                    {num}
                </div>
                <div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    <p className="text-sm text-slate-500">{desc}</p>
                </div>
            </div>
            <div className="pl-4 border-l border-white/5 ml-4 pb-8">
                <div className="pl-8">
                    <CodeBlock command={code} isMultiLine={isMultiLine} />
                </div>
            </div>
        </div>
    )
}

function InfoCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors">
            <h4 className="font-semibold text-slate-200 text-sm mb-2 flex items-center gap-2">
                <span className="text-indigo-400">{icon}</span> {title}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
                {children}
            </p>
        </div>
    )
}
