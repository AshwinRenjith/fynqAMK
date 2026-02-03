'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ChevronLeft, Box, Download, Copy, Check, Terminal, Shield, Cpu, Calendar, Code, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import clsx from 'clsx'

type Package = {
    name: string
    version: string
    description: string
    user_id: string
    created_at: string
}

export default function PackageDetailPage() {
    const params = useParams()
    // params.user and params.name are likely arrays or strings.
    const userParam = typeof params.user === 'string' ? params.user : params.user?.[0]
    const nameParam = typeof params.name === 'string' ? params.name : params.name?.[0]

    const fullName = userParam === 'library' ? nameParam : `@${userParam}/${nameParam}`

    const [pkg, setPkg] = useState<Package | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        async function fetchPackage() {
            if (!fullName) return

            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('name', fullName)
                .single()

            if (data) setPkg(data)
            setLoading(false)
        }

        fetchPackage()
    }, [fullName])

    const copyInstall = () => {
        navigator.clipboard.writeText(`fynq run ${fullName}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-indigo-500">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!pkg) return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Package not found</h1>
            <Link href="/registry" className="text-indigo-400 hover:underline">Back to Registry</Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            </div>

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

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start gap-8 mb-16"
                >
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-28 h-28 bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-900/10 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Box className="w-12 h-12 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </motion.div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-5xl font-bold tracking-tight">{pkg.name}</h1>
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">v{pkg.version}</span>
                        </div>
                        <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-3xl">{pkg.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Terminal className="w-4 h-4 text-indigo-400" />
                                <span>Generic Agent</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400/80">Verified Publisher</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span>Released {new Date(pkg.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Layout */}
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Main Content (Readme) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="p-1 rounded-2xl bg-white/5 inline-flex mb-2">
                            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-lg text-sm font-medium">Overview</button>
                            <button className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors text-sm font-medium">Versions</button>
                            <button className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors text-sm font-medium">Source</button>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Cpu className="w-64 h-64" />
                            </div>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Cpu className="w-6 h-6 text-indigo-400" />
                                About this Agent
                            </h2>
                            <div className="prose prose-invert prose-slate max-w-none prose-lg">
                                <p>
                                    This autonomous agent is managed by the <strong>Fynq Runtime</strong>.
                                    It operates within a secure sandbox environment and adheres to declared capabilities.
                                </p>

                                <div className="my-8">
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                        <h3 className="text-white text-lg font-semibold mb-4 mt-0">Capabilities Used</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-indigo-500">
                                            <li><strong className="text-white">Network Access</strong>: To browse the web or call APIs.</li>
                                            <li><strong className="text-white">File System</strong>: Can read/write files within the workspace.</li>
                                            <li><strong className="text-white">Standard Library</strong>: Uses <code>fynq.sdk</code> utilities.</li>
                                        </ul>
                                    </div>
                                </div>

                                <h3>From the Publisher</h3>
                                <p>
                                    This agent demonstrates the power of the Fynq ecosystem. It is designed to be composable and easy to integrate into larger workflows.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-32 space-y-6">

                            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                                <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-slate-500">Fast Install</h3>

                                <div className="relative bg-black rounded-xl border border-white/10 py-4 px-4 flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={copyInstall}>
                                    <code className="text-sm font-mono text-indigo-400 truncate mr-2">
                                        fynq run {pkg.name}
                                    </code>
                                    <div className="text-slate-500 group-hover:text-white transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                    <Terminal className="w-3 h-3" />
                                    <span>Requires CLI v1.0+</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                                <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-slate-500">Resources</h3>
                                <div className="space-y-3">
                                    <Link href="#" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Code className="w-4 h-4" /></span>
                                        View Source Code
                                    </Link>
                                    <Link href="#" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Box className="w-4 h-4" /></span>
                                        Version History
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
