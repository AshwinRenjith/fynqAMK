'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Loader2, Download, Box, ChevronLeft, Sparkles, Command, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Type definition for a package
type Package = {
    name: string
    version: string
    description: string
    user_id: string
    created_at: string
}

export default function RegistryPage() {
    const [packages, setPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchPackages() {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setPackages(data)
            setLoading(false)
        }

        fetchPackages()
    }, [])

    const filtered = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px]" />
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

                    <Link href="/registry" className="px-4 py-1.5 text-xs font-medium text-white bg-white/5 rounded-full transition-all">Registry</Link>
                    <Link href="https://github.com/AshwinRenjith/fynqADK" className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">GitHub</Link>

                    <Link href="/getting-started" className="ml-1 pl-4 pr-1 py-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-200 hover:text-white transition-colors">Documentation</span>
                        <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </Link>
                </nav>
            </motion.div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm shadow-xl"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Discover Intelligence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent"
                    >
                        The Agent Registry
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg text-slate-400 max-w-2xl text-center"
                    >
                        Browse the global collection of verified autonomous agents. <br />Sandboxed, versioned, and ready to run.
                    </motion.p>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-xl mx-auto mb-20 relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                    <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl focus-within:border-indigo-500/50 transition-colors">
                        <Search className="w-5 h-5 text-slate-500 ml-3 mr-3" />
                        <input
                            type="text"
                            placeholder="Search agents (e.g., 'researcher', 'coder')..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none h-10 text-base"
                        />
                        <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-xs text-slate-500 font-mono mr-1">
                            <Command className="w-3 h-3" /> K
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filtered.map((pkg, index) => {
                                const cleanName = pkg.name.startsWith('@') ? pkg.name.substring(1) : pkg.name
                                const [user, name] = cleanName.includes('/') ? cleanName.split('/') : ['library', cleanName]
                                const detailUrl = `/package/${user}/${name}`

                                return (
                                    <motion.div
                                        key={pkg.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link href={detailUrl} className="group relative block h-full p-6 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">

                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300 border border-white/5">
                                                    <Box className="w-6 h-6" />
                                                </div>
                                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400 font-mono group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                                                    v{pkg.version}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{pkg.name}</h3>
                                            <p className="text-sm text-slate-400 mb-8 line-clamp-2 h-10 leading-relaxed">{pkg.description || 'No description provided.'}</p>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded-md border border-white/5">
                                                    <Download className="w-3 h-3" />
                                                    <span>fynq run {pkg.name}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <Search className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-500">No agents found matching "<span className="text-white">{search}</span>"</p>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
