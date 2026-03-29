"use client"

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Database, Cloud, Terminal, Cpu, Zap, Activity, Wifi, GitMerge } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'

// ─── Tilt Card ────────────────────────────────────────────────────────────────

const TiltCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mx = useSpring(x, { stiffness: 150, damping: 20 })
  const my = useSpring(y, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(my, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(mx, [-0.5, 0.5], ['-8deg', '8deg'])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/[0.04] to-transparent z-50"
      />
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILL_BARS = [
  { name: 'Kubernetes / K8s', pct: 85, bar: 'bg-cyan-400',    track: 'bg-cyan-400/15'    },
  { name: 'Go (Golang)',      pct: 75, bar: 'bg-emerald-400', track: 'bg-emerald-400/15' },
  { name: 'AWS / Cloud',      pct: 85, bar: 'bg-purple-400',  track: 'bg-purple-400/15'  },
  { name: 'CI/CD Pipelines',  pct: 80, bar: 'bg-amber-400',   track: 'bg-amber-400/15'   },
]

const BASE_STATS = [
  { key: 'exp',      value: '2+',   label: 'Years Exp',    Icon: Activity, iconCls: 'text-cyan-400',    numCls: 'text-cyan-400',    bg: 'bg-cyan-500/[0.05]',    border: 'border-cyan-500/20'    },
  { key: 'projects', value: '15+',  label: 'Projects',     Icon: Zap,      iconCls: 'text-purple-400',  numCls: 'text-purple-400',  bg: 'bg-purple-500/[0.05]',  border: 'border-purple-500/20'  },
  { key: 'leetcode', value: '600+', label: 'LeetCode',     Icon: Terminal, iconCls: 'text-emerald-400', numCls: 'text-emerald-400', bg: 'bg-emerald-500/[0.05]', border: 'border-emerald-500/20' },
  { key: 'prs',      value: '5+',   label: 'Merged PRs',   Icon: GitMerge, iconCls: 'text-amber-400',   numCls: 'text-amber-400',   bg: 'bg-amber-500/[0.05]',   border: 'border-amber-500/20'   },
]

const CODING = {
  leetcode: {
    total: '600+',
    href: 'https://leetcode.com/u/imt_2018005/',
    breakdown: [
      { label: 'Easy',   count: '220+', pct: 68, barClass: 'bg-emerald-400', trackClass: 'bg-emerald-400/12', labelClass: 'text-emerald-400' },
      { label: 'Medium', count: '310+', pct: 85, barClass: 'bg-amber-400',   trackClass: 'bg-amber-400/12',   labelClass: 'text-amber-400'   },
      { label: 'Hard',   count: '70+',  pct: 35, barClass: 'bg-red-400',     trackClass: 'bg-red-400/12',     labelClass: 'text-red-400'     },
    ],
  },
  hackerrank: {
    href: 'https://www.hackerrank.com/profile/abhaychaurasiya1',
    domains: [
      { label: 'Problem Solving', stars: 5 },
      { label: 'Python',          stars: 4 },
      { label: 'SQL',             stars: 3 },
    ],
  },
}

const CAPS = [
  {
    Icon: Cloud,     title: 'Cloud & DevOps',      desc: 'AWS · Kubernetes · Docker · Terraform',
    iconBg: 'bg-emerald-500/15', iconCls: 'text-emerald-400',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
    hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]',
  },
  {
    Icon: Cpu,       title: 'Go & Backend',         desc: 'Golang · Node.js · REST APIs · gRPC',
    iconBg: 'bg-cyan-500/15',    iconCls: 'text-cyan-400',
    border: 'border-cyan-500/20 hover:border-cyan-400/50',
    hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)]',
  },
  {
    Icon: Database,  title: 'Open Source',          desc: 'CNCF · Helm · GitHub · Community',
    iconBg: 'bg-purple-500/15',  iconCls: 'text-purple-400',
    border: 'border-purple-500/20 hover:border-purple-400/50',
    hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)]',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {
  const [mergedCount, setMergedCount] = useState('5+')

  useEffect(() => {
    fetch('https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:merged&per_page=1')
      .then(r => r.json())
      .then(d => { if (d.total_count) setMergedCount(`${d.total_count}`) })
      .catch(() => {})
  }, [])

  const STATS = BASE_STATS.map(s => s.key === 'prs' ? { ...s, value: mergedCount } : s)

  const ID_FIELDS = [
    { prefix: '$', key: 'status',     val: '● available',            valCls: 'text-emerald-400' },
    { prefix: '~', key: 'location',   val: 'India',                   valCls: 'text-neutral-300' },
    { prefix: '>', key: 'focus',      val: 'DevOps · Go · Cloud',    valCls: 'text-cyan-300'    },
    { prefix: '#', key: 'github',     val: 'abhay1999',               valCls: 'text-cyan-300'    },
    { prefix: '@', key: 'merged_prs', val: `${mergedCount} merged`,   valCls: 'text-purple-300'  },
  ]

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-black">

      {/* ── Technical Background ─────────────────────────────────────────── */}

      {/* Micro-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated circuit traces */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* H-trace 1 @ 28% */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" style={{ top: '28%' }} />
        <motion.div
          animate={{ x: ['-15%', '115%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          className="absolute h-px w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{ top: '28%', opacity: 0.8 }}
        />

        {/* H-trace 2 @ 66% */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" style={{ top: '66%' }} />
        <motion.div
          animate={{ x: ['115%', '-15%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 2, repeatDelay: 2 }}
          className="absolute h-px w-36 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          style={{ top: '66%', opacity: 0.7 }}
        />

        {/* V-trace @ 30% */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent" style={{ left: '30%' }} />
        <motion.div
          animate={{ y: ['-15%', '115%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1, repeatDelay: 4 }}
          className="absolute w-px h-28 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
          style={{ left: '30%', opacity: 0.65 }}
        />

        {/* V-trace @ 72% */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/[0.08] to-transparent" style={{ left: '72%' }} />
        <motion.div
          animate={{ y: ['115%', '-15%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 3, repeatDelay: 2 }}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-amber-400 to-transparent"
          style={{ left: '72%', opacity: 0.5 }}
        />

        {/* Diagonal traces */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/[0.08] to-transparent" style={{ top: '45%', transform: 'rotate(-8deg) scaleX(1.2)' }} />
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/[0.06] to-transparent" style={{ top: '78%', transform: 'rotate(5deg) scaleX(1.3)' }} />

        {/* Glowing intersection nodes */}
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400    animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.9)]"    style={{ top: 'calc(28% - 4px)', left: 'calc(30% - 4px)' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400  animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.9)]"  style={{ top: 'calc(66% - 3px)', left: 'calc(72% - 3px)', animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-emerald-400  animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]"  style={{ top: 'calc(28% - 4px)', left: 'calc(72% - 4px)', animationDelay: '0.5s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400    animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.9)]"  style={{ top: 'calc(66% - 3px)', left: 'calc(30% - 3px)', animationDelay: '1.5s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-cyan-300      animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.7)]"    style={{ top: '14%', left: '55%', animationDelay: '2s' }} />
        <div className="absolute w-1 h-1 rounded-full bg-purple-300    animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.7)]"   style={{ top: '86%', left: '45%', animationDelay: '0.8s' }} />
      </div>

      {/* Perspective floor grid */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[320px] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.15) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          transform: 'rotateX(65deg) translateY(60px)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 10%, transparent 75%)',
          opacity: 0.12,
        }}
      />

      {/* Ambient colour orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-0 w-[520px] h-[520px] bg-cyan-500/[0.06] rounded-full blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-0 w-[420px] h-[420px] bg-purple-500/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-emerald-500/[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">01.</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">About</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Me</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
        </motion.div>

        {/* ── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT: Holographic Identity Card ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: 12 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <TiltCard className="group relative will-change-transform">
              <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-neutral-900/90 to-black overflow-hidden shadow-[0_0_80px_-20px_rgba(6,182,212,0.35)]" style={{ transformStyle: 'preserve-3d' }}>

                {/* Window title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono ml-2 tracking-wider">identity.sys</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Wifi size={9} className="text-cyan-400" />
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest">SECURE</span>
                  </div>
                </div>

                {/* Profile with scan animation */}
                <div className="relative overflow-hidden">
                  {/* Animated scan line */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ y: ['-10%', '110%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    className="absolute inset-x-0 h-10 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-400/[0.07] to-transparent"
                  />

                  <div className="flex flex-col items-center px-6 pt-7 pb-5" style={{ transform: 'translateZ(20px)' }}>
                    {/* Profile image + orbits */}
                    <div className="relative w-32 h-32 mb-4">
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
                      />
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 rounded-full border border-purple-500/20"
                      />
                      <div className="absolute inset-5 rounded-full overflow-hidden border border-white/10 bg-neutral-800">
                        <Image
                          src="/profile-picture.svg"
                          alt="Abhay Chaurasiya"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      {/* Online dot */}
                      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10" />
                      {/* Orbiting dot */}
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      </motion.div>
                    </div>

                    <h3 className="text-white font-bold text-lg tracking-tight">Abhay Chaurasiya</h3>
                    <p className="text-cyan-400 text-[11px] font-mono mt-1 tracking-[0.15em] uppercase">DevOps · Go · Open Source</p>

                    {/* Terminal data rows */}
                    <div className="w-full mt-5 space-y-1.5">
                      {ID_FIELDS.map(({ prefix, key, val, valCls }) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors"
                        >
                          <span className="text-neutral-600 font-mono text-[11px] w-3 shrink-0">{prefix}</span>
                          <span className="text-neutral-500 font-mono text-[11px]">{key}</span>
                          <span className={`ml-auto font-mono text-[11px] ${valCls}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skill metrics */}
                <div className="px-5 pb-6">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="h-px flex-1 bg-white/[0.05]" />
                    <span className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase">core_focus</span>
                    <span className="h-px flex-1 bg-white/[0.05]" />
                  </div>
                  <div className="space-y-3" style={{ transform: 'translateZ(10px)' }}>
                    {SKILL_BARS.map((skill, idx) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-mono text-neutral-400">{skill.name}</span>
                          <span className="text-[11px] font-mono text-neutral-600">{skill.pct}%</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${skill.track}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${skill.bar} shadow-[0_0_6px_currentColor]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </TiltCard>
          </motion.div>

          {/* ── RIGHT: Content panels ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-5"
          >

            {/* Bio terminal */}
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-neutral-900/60 to-black overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <Terminal size={12} className="text-cyan-400" />
                <span className="text-[11px] text-neutral-500 font-mono tracking-wider">~/about/bio.md</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] text-neutral-600 font-mono">utf-8</span>
                  <span className="h-3 w-px bg-white/10" />
                  <span className="text-[10px] text-cyan-500 font-mono">READ</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-mono text-sm mt-0.5 shrink-0">›</span>
                  <p className="text-[15px] text-neutral-300 leading-relaxed">
                    I&apos;m <span className="text-white font-semibold">Abhay Chaurasiya</span> — a DevOps-focused engineer who builds infrastructure that heals itself, pipelines that ship without friction, and CLI tools that make developers faster. I gravitate toward hard distributed systems problems and cloud-native architecture.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-mono text-sm mt-0.5 shrink-0">›</span>
                  <p className="text-[15px] text-neutral-300 leading-relaxed">
                    I contribute to production-grade <span className="text-white font-semibold">CNCF projects</span> — 4 merged PRs in <span className="text-cyan-400 font-medium">Jaeger</span> (Go SDK dashboard generator, CI sync-check, MCP response limits, SPM restore), 1 in <span className="text-cyan-400 font-medium">Helm</span>, 1 in <span className="text-cyan-400 font-medium">GoReleaser</span>, and 11+ open PRs across Argo CD, Grafana, Tekton &amp; more.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-mono text-sm mt-0.5 shrink-0">›</span>
                  <p className="text-[15px] text-neutral-300 leading-relaxed">
                    Goal: go deeper into the <span className="text-white font-semibold">CNCF ecosystem</span> — targeting <span className="text-emerald-400 font-medium">GSoC / LFX Mentorship</span> with Jaeger or Argo CD, and eventually becoming a project maintainer. If it runs on Kubernetes and is written in Go, I want to be inside it.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ value, label, Icon, iconCls, numCls, bg, border }) => (
                <TiltCard key={label} className="group will-change-transform">
                  <div className={`relative rounded-2xl border ${border} ${bg} bg-gradient-to-br from-neutral-900/70 to-black p-5 text-center overflow-hidden`}>
                    <div aria-hidden="true" className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bg} rounded-2xl`} />
                    <Icon size={18} className={`${iconCls} mx-auto mb-2 relative z-10`} />
                    <div className={`text-3xl md:text-4xl font-bold ${numCls} mb-1 relative z-10`}>{value}</div>
                    <div className="text-[11px] text-neutral-500 font-mono uppercase tracking-widest relative z-10">{label}</div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Current focus */}
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-neutral-900/60 to-black overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-[11px] text-neutral-400 font-mono ml-1 tracking-wider">current_focus.log</span>
                <span className="ml-auto text-[10px] text-cyan-400 font-mono tracking-widest">LIVE</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-cyan-500/10 hover:border-cyan-500/25 transition-colors">
                  <Cpu size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-mono text-neutral-400 leading-relaxed">
                    <span className="text-cyan-300 font-semibold">CONTRIBUTING</span>{' '}
                    Active in Jaeger, Helm, Argo CD &amp; Tekton — {mergedCount} PRs merged, 11+ open. Targeting GSoC / LFX Mentorship in the CNCF ecosystem.
                  </p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/10 hover:border-emerald-500/25 transition-colors">
                  <Zap size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-mono text-neutral-400 leading-relaxed">
                    <span className="text-emerald-300 font-semibold">BUILDING</span>{' '}
                    Self-healing Kubernetes operators in Go, dev environment platform CLI, and exploring eBPF &amp; service mesh internals.
                  </p>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-purple-500/10 hover:border-purple-500/25 transition-colors">
                  <Activity size={15} className="text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-mono text-neutral-400 leading-relaxed">
                    <span className="text-purple-300 font-semibold">GOAL</span>{' '}
                    Become a CNCF project maintainer. If it runs on Kubernetes and is written in Go — I want to be inside it.
                  </p>
                </div>
              </div>
            </div>

            {/* Capability cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {CAPS.map(({ Icon, title, desc, iconBg, iconCls, border, hoverGlow }) => (
                <TiltCard key={title} className="group will-change-transform">
                  <div className={`rounded-2xl border ${border} ${hoverGlow} bg-gradient-to-br from-neutral-900/70 to-black p-5 transition-all duration-300 h-full`}>
                    <div
                      className={`w-10 h-10 rounded-xl ${iconBg} ${iconCls} flex items-center justify-center mb-4`}
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <Icon size={20} />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5" style={{ transform: 'translateZ(15px)' }}>
                      {title}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* ── Competitive Coding Panel ─────────────────────────────────── */}
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-neutral-900/60 to-black overflow-hidden backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <Zap size={11} className="text-amber-400" />
                <span className="text-[11px] text-neutral-500 font-mono tracking-wider">competitive_coding.log</span>
                <div className="ml-auto flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                  />
                  <span className="text-[10px] text-emerald-400 font-mono tracking-widest">VERIFIED</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05] p-5 gap-5 sm:gap-0">

                {/* LeetCode column */}
                <div className="sm:pr-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">LeetCode</p>
                      <p className="text-2xl font-black text-amber-400">{CODING.leetcode.total}</p>
                      <p className="font-mono text-[10px] text-neutral-500">problems solved</p>
                    </div>
                    <a
                      href={CODING.leetcode.href}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-colors"
                    >
                      <span className="font-mono text-[10px] text-amber-400">View →</span>
                    </a>
                  </div>
                  <div className="space-y-2.5">
                    {CODING.leetcode.breakdown.map((d, i) => (
                      <div key={d.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-mono text-[10px] ${d.labelClass}`}>{d.label}</span>
                          <span className="font-mono text-[10px] text-neutral-600">{d.count}</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${d.trackClass}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${d.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${d.barClass}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HackerRank column */}
                <div className="sm:pl-5 pt-5 sm:pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">HackerRank</p>
                      <p className="text-2xl font-black text-emerald-400">5★</p>
                      <p className="font-mono text-[10px] text-neutral-500">top domains</p>
                    </div>
                    <a
                      href={CODING.hackerrank.href}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors"
                    >
                      <span className="font-mono text-[10px] text-emerald-400">View →</span>
                    </a>
                  </div>
                  <div className="space-y-2.5">
                    {CODING.hackerrank.domains.map(d => (
                      <div key={d.label} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="font-mono text-[11px] text-neutral-400">{d.label}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-[12px] ${i < d.stars ? 'text-emerald-400' : 'text-neutral-700'}`}
                            >★</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
