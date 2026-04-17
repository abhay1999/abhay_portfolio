"use client"

import { Database, Cloud, Terminal, Cpu, Zap, Activity, Wifi, GitMerge } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import TiltCard from '@/components/TiltCard'
import Reveal from '@/components/Reveal'
import { fetchJsonWithTimeout, readCachedValue, writeCachedValue, type DataSourceState } from '@/lib/client-data'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILL_BARS = [
  { name: 'Kubernetes / K8s', pct: 85, bar: 'bg-cyan-400',    track: 'bg-cyan-400/15'    },
  { name: 'Go (Golang)',      pct: 75, bar: 'bg-emerald-400', track: 'bg-emerald-400/15' },
  { name: 'AWS / Cloud',      pct: 85, bar: 'bg-purple-400',  track: 'bg-purple-400/15'  },
  { name: 'CI/CD Pipelines',  pct: 80, bar: 'bg-amber-400',   track: 'bg-amber-400/15'   },
]

const BASE_STATS = [
  { key: 'exp',      value: '2+',   label: 'Years Exp',  Icon: Activity, iconCls: 'text-cyan-400',    numCls: 'text-cyan-400',    bg: 'bg-cyan-500/[0.05]',    border: 'border-cyan-500/20'    },
  { key: 'projects', value: '15+',  label: 'Projects',   Icon: Zap,      iconCls: 'text-purple-400',  numCls: 'text-purple-400',  bg: 'bg-purple-500/[0.05]',  border: 'border-purple-500/20'  },
  { key: 'leetcode', value: '600+', label: 'LeetCode',   Icon: Terminal, iconCls: 'text-emerald-400', numCls: 'text-emerald-400', bg: 'bg-emerald-500/[0.05]', border: 'border-emerald-500/20' },
  { key: 'prs',      value: '8+',   label: 'Merged PRs', Icon: GitMerge, iconCls: 'text-amber-400',   numCls: 'text-amber-400',   bg: 'bg-amber-500/[0.05]',   border: 'border-amber-500/20'   },
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
  { Icon: Cloud,    title: 'Cloud & DevOps',  desc: 'AWS · Kubernetes · Docker · Terraform',   iconBg: 'bg-emerald-500/15', iconCls: 'text-emerald-400', border: 'border-emerald-500/20 hover:border-emerald-400/50', hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]' },
  { Icon: Cpu,      title: 'Go & Backend',    desc: 'Golang · Node.js · REST APIs · gRPC',     iconBg: 'bg-cyan-500/15',    iconCls: 'text-cyan-400',    border: 'border-cyan-500/20 hover:border-cyan-400/50',         hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)]'  },
  { Icon: Database, title: 'Open Source',     desc: 'golang/tools · CNCF · Helm · Jaeger',     iconBg: 'bg-purple-500/15',  iconCls: 'text-purple-400',  border: 'border-purple-500/20 hover:border-purple-400/50',     hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)]' },
]

const ABOUT_CACHE_KEY = 'about:merged-prs-v2'
const ABOUT_CACHE_TTL_MS = 1000 * 60 * 30

function getSourceBadge(state: DataSourceState) {
  if (state === 'live')   return { label: 'LIVE',            dotClass: 'bg-cyan-500',    textClass: 'text-cyan-400',    borderClass: 'border-cyan-500/25',   bgClass: 'bg-cyan-500/10'   }
  if (state === 'cached') return { label: 'CACHED',          dotClass: 'bg-amber-500',   textClass: 'text-amber-300',   borderClass: 'border-amber-500/25',  bgClass: 'bg-amber-500/10'  }
  return                         { label: 'STATIC SNAPSHOT', dotClass: 'bg-neutral-500', textClass: 'text-neutral-400', borderClass: 'border-white/10',      bgClass: 'bg-white/[0.04]'  }
}

// ─── Skill bar — GSAP scroll-triggered fill ────────────────────────────────

const SkillBar = ({ name, pct, bar, track }: typeof SKILL_BARS[0]) => {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    gsap.set(el, { width: 0 })
    const tween = gsap.to(el, {
      width: `${pct}%`,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    return () => { tween.kill(); ScrollTrigger.getAll().filter(st => st.trigger === el).forEach(st => st.kill()) }
  }, [pct])

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] font-mono text-neutral-400">{name}</span>
        <span className="text-[11px] font-mono text-neutral-600">{pct}%</span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${track}`}>
        <div ref={fillRef} className={`h-full rounded-full ${bar} shadow-[0_0_6px_currentColor]`} />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {
  const [mergedCount, setMergedCount] = useState('9+')
  const [sourceState, setSourceState] = useState<DataSourceState>('static')

  useEffect(() => {
    const cached = readCachedValue<{ totalCount: number }>(ABOUT_CACHE_KEY, ABOUT_CACHE_TTL_MS)
    if (cached) { setMergedCount(String(cached.value.totalCount)); setSourceState('cached') }

    fetchJsonWithTimeout<{ total_count?: number }>(
      'https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:merged&per_page=1',
      { headers: { Accept: 'application/vnd.github.v3+json' } }, 4500,
    ).then(data => {
      if (typeof data.total_count !== 'number') return
      const actualTotal = Math.max(9, data.total_count + 3)
      setMergedCount(String(actualTotal)); setSourceState('live')
      writeCachedValue(ABOUT_CACHE_KEY, { totalCount: actualTotal })
    }).catch(() => {})
  }, [])

  const STATS = BASE_STATS.map(s => s.key === 'prs' ? { ...s, value: mergedCount } : s)
  const sourceBadge = getSourceBadge(sourceState)

  const ID_FIELDS = [
    { prefix: '$', key: 'status',     val: '● available',               valCls: 'text-emerald-400' },
    { prefix: '~', key: 'location',   val: 'India',                      valCls: 'text-neutral-300' },
    { prefix: '>', key: 'focus',      val: 'DevOps · Go · golang/tools', valCls: 'text-cyan-300'    },
    { prefix: '#', key: 'github',     val: 'abhay1999',                  valCls: 'text-cyan-300'    },
    { prefix: '@', key: 'merged_prs', val: `${mergedCount} merged`,      valCls: 'text-purple-300'  },
  ]

  return (
    <section id="about" className="relative py-20 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 30% 60%, #031a0f 0%, #011008 45%, #000 100%)' }}>

      {/* Ambient orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-0 w-[520px] h-[520px] bg-cyan-500/[0.10] rounded-full blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-0 w-[420px] h-[420px] bg-emerald-500/[0.09] rounded-full blur-[140px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-emerald-500/[0.07] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <Reveal className="flex items-center gap-4 mb-14">
          <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">01.</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">About</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Me</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Holographic Identity Card */}
          <Reveal from={{ opacity: 0, x: -40, rotateY: 12 }} className="lg:col-span-4">
            <TiltCard className="group relative will-change-transform">
              <div className="rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-neutral-900/90 to-black overflow-hidden shadow-[0_0_80px_-20px_rgba(6,182,212,0.35)]" style={{ transformStyle: 'preserve-3d' }}>

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

                <div className="relative overflow-hidden">
                  {/* Scan line — CSS */}
                  <div aria-hidden="true" className="scan-line absolute inset-x-0 h-10 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-400/[0.07] to-transparent"
                       style={{ animationDuration: '3.5s' }} />

                  <div className="flex flex-col items-center px-6 pt-7 pb-5" style={{ transform: 'translateZ(20px)' }}>
                    <div className="relative w-32 h-32 mb-4">
                      <div aria-hidden="true" className="spin-cw absolute inset-0 rounded-full border border-dashed border-cyan-500/30"   style={{ animationDuration: '14s' }} />
                      <div aria-hidden="true" className="spin-ccw absolute inset-2 rounded-full border border-purple-500/20" style={{ animationDuration: '9s' }} />
                      <div className="absolute inset-5 rounded-full overflow-hidden border border-white/10 bg-neutral-800">
                        <Image src="/profile-picture.svg" alt="Abhay Chaurasiya" fill className="object-cover" priority />
                      </div>
                      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10" />
                      <div aria-hidden="true" className="spin-cw absolute inset-0" style={{ animationDuration: '14s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-lg tracking-tight">Abhay Chaurasiya</h3>
                    <p className="text-cyan-400 text-[11px] font-mono mt-1 tracking-[0.15em] uppercase">DevOps · Go · Open Source</p>

                    <div className="w-full mt-5 space-y-1.5">
                      {ID_FIELDS.map(({ prefix, key, val, valCls }) => (
                        <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors">
                          <span className="text-neutral-600 font-mono text-[11px] w-3 shrink-0">{prefix}</span>
                          <span className="text-neutral-500 font-mono text-[11px]">{key}</span>
                          <span className={`ml-auto font-mono text-[11px] ${valCls}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-6">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="h-px flex-1 bg-white/[0.05]" />
                    <span className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase">core_focus</span>
                    <span className="h-px flex-1 bg-white/[0.05]" />
                  </div>
                  <div className="space-y-3" style={{ transform: 'translateZ(10px)' }}>
                    {SKILL_BARS.map((skill, idx) => (
                      <SkillBar key={skill.name} {...skill} />
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* RIGHT: Content panels */}
          <Reveal from={{ opacity: 0, x: 40 }} delay={0.15} className="lg:col-span-8 space-y-5">

            {/* Bio terminal */}
            <div className="rounded-3xl border border-white/[0.12] bg-neutral-900/70 overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <Terminal size={12} className="text-cyan-400" />
                <span className="text-[11px] text-neutral-500 font-mono tracking-wider"><span className="hidden sm:inline">~/about/</span>bio.md</span>
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
                    I&apos;m <span className="text-white font-semibold">Abhay Chaurasiya</span> — a DevOps-focused engineer who builds infrastructure that heals itself, pipelines that ship without friction, and CLI tools that make developers faster.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-mono text-sm mt-0.5 shrink-0">›</span>
                  <p className="text-[15px] text-neutral-300 leading-relaxed">
                    <strong className="text-white">3 CLs merged into the official Go toolchain</strong> (<span className="text-cyan-400 font-medium">golang/tools</span>): <code className="text-xs bg-white/[0.06] px-1 py-0.5 rounded">slicesbackward</code> analyzer, <code className="text-xs bg-white/[0.06] px-1 py-0.5 rounded">stringscut</code> analyzer, and a gopls completion fix — reviewed by Alan Donovan and shipping in <span className="text-cyan-400 font-medium">gopls</span>. Also 6 merged PRs across <span className="text-cyan-400 font-medium">Jaeger</span>, <span className="text-cyan-400 font-medium">Helm</span> &amp; <span className="text-cyan-400 font-medium">GoReleaser</span> — <strong className="text-white">9 total</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-mono text-sm mt-0.5 shrink-0">›</span>
                  <p className="text-[15px] text-neutral-300 leading-relaxed">
                    Goal: go deeper into the <span className="text-white font-semibold">CNCF ecosystem</span> — targeting <span className="text-emerald-400 font-medium">GSoC / LFX Mentorship</span> with Jaeger or Argo CD.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ value, label, Icon, iconCls, numCls, bg, border }) => (
                <TiltCard key={label} className="group will-change-transform">
                  <div className={`relative rounded-2xl border ${border} ${bg} p-5 text-center overflow-hidden`}>
                    <div aria-hidden="true" className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bg} rounded-2xl`} />
                    <Icon size={18} className={`${iconCls} mx-auto mb-2 relative z-10`} />
                    <div className={`text-3xl md:text-4xl font-bold ${numCls} mb-1 relative z-10`}>{value}</div>
                    <div className="text-[11px] text-neutral-500 font-mono uppercase tracking-widest relative z-10">{label}</div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Current focus */}
            <div className="rounded-3xl border border-white/[0.12] bg-neutral-900/70 overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-[11px] text-neutral-400 font-mono ml-1 tracking-wider">current_focus.log</span>
                <span className={`ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${sourceBadge.borderClass} ${sourceBadge.bgClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sourceBadge.dotClass}`} />
                  <span className={`text-[10px] font-mono tracking-widest ${sourceBadge.textClass}`}>{sourceBadge.label}</span>
                </span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { Icon: Cpu,      color: 'text-cyan-400',    border: 'border-cyan-500/10 hover:border-cyan-500/25',     label: 'CONTRIBUTING', labelCls: 'text-cyan-300',    text: `golang/tools (Go toolchain · gopls), Jaeger, Helm, GoReleaser, Argo CD — ${mergedCount} PRs merged.` },
                  { Icon: Zap,      color: 'text-emerald-400', border: 'border-emerald-500/10 hover:border-emerald-500/25', label: 'BUILDING',     labelCls: 'text-emerald-300', text: 'Self-healing Kubernetes operators in Go, dev environment platform CLI, and exploring eBPF.' },
                  { Icon: Activity, color: 'text-purple-400',  border: 'border-purple-500/10 hover:border-purple-500/25',  label: 'GOAL',         labelCls: 'text-purple-300',  text: 'Become a CNCF project maintainer. If it runs on Kubernetes and is written in Go — I want to be inside it.' },
                ].map(({ Icon, color, border, label, labelCls, text }) => (
                  <div key={label} className={`flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border ${border} transition-colors`}>
                    <Icon size={15} className={`${color} shrink-0 mt-0.5`} />
                    <p className="text-[13px] font-mono text-neutral-400 leading-relaxed">
                      <span className={`${labelCls} font-semibold`}>{label}</span>{' '}{text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Capability cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {CAPS.map(({ Icon, title, desc, iconBg, iconCls, border, hoverGlow }) => (
                <TiltCard key={title} className="group will-change-transform">
                  <div className={`rounded-2xl border ${border} ${hoverGlow} bg-neutral-900/35 p-5 transition-all duration-300 h-full`}>
                    <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconCls} flex items-center justify-center mb-4`} style={{ transform: 'translateZ(20px)' }}>
                      <Icon size={20} />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5" style={{ transform: 'translateZ(15px)' }}>{title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Competitive Coding Panel */}
            <div className="rounded-3xl border border-white/[0.12] bg-neutral-900/70 overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/30">
                <Zap size={11} className="text-amber-400" />
                <span className="text-[11px] text-neutral-500 font-mono tracking-wider">competitive_coding.log</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="opacity-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] text-emerald-400 font-mono tracking-widest">VERIFIED</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05] p-5 gap-5 sm:gap-0">
                <div className="sm:pr-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">LeetCode</p>
                      <p className="text-2xl font-black text-amber-400">{CODING.leetcode.total}</p>
                      <p className="font-mono text-[10px] text-neutral-500">problems solved</p>
                    </div>
                    <a href={CODING.leetcode.href} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-colors">
                      <span className="font-mono text-[10px] text-amber-400">View →</span>
                    </a>
                  </div>
                  <div className="space-y-2.5">
                    {CODING.leetcode.breakdown.map((d, i) => (
                      <SkillBar key={d.label} name={d.label} pct={d.pct} bar={d.barClass} track={d.trackClass} />
                    ))}
                  </div>
                </div>

                <div className="sm:pl-5 pt-5 sm:pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">HackerRank</p>
                      <p className="text-2xl font-black text-emerald-400">5★</p>
                      <p className="font-mono text-[10px] text-neutral-500">top domains</p>
                    </div>
                    <a href={CODING.hackerrank.href} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-colors">
                      <span className="font-mono text-[10px] text-emerald-400">View →</span>
                    </a>
                  </div>
                  <div className="space-y-2.5">
                    {CODING.hackerrank.domains.map(d => (
                      <div key={d.label} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <span className="font-mono text-[11px] text-neutral-400">{d.label}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-[12px] ${i < d.stars ? 'text-emerald-400' : 'text-neutral-700'}`}>★</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default About
