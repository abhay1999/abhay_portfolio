"use client"

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { Mail, Linkedin, Code, Trophy, GitMerge, Star, Users, ArrowRight, Cloud, Server, GitBranch } from 'lucide-react'
import Image from 'next/image'

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIALS = [
  { Icon: GithubIcon, href: 'https://github.com/abhay1999',                        label: 'GitHub'     },
  { Icon: Linkedin,   href: 'https://linkedin.com/in/abhay-chaurasiya',            label: 'LinkedIn'   },
  { Icon: Code,       href: 'https://leetcode.com/u/imt_2018005/',                 label: 'LeetCode'   },
  { Icon: Trophy,     href: 'https://www.hackerrank.com/profile/abhaychaurasiya1', label: 'HackerRank' },
]

const ROLE_CHIPS = [
  'DevOps Engineer',
  'Platform Engineer',
  'Go / Backend',
  'SRE',
]

const PROOF = [
  { Icon: GitMerge, value: '3 CLs',  detail: 'golang/tools · ships in gopls',  accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { Icon: Star,     value: '9+ PRs', detail: 'merged · CNCF ecosystem',         accent: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'   },
  { Icon: Users,    value: '5k+',    detail: 'concurrent users served',          accent: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
]

const PARTICLES = [
  { x: '12%', y: '18%', w: 8, h: 8, color: 'bg-cyan-400',    delay: '0s'   },
  { x: '88%', y: '14%', w: 6, h: 6, color: 'bg-purple-400',  delay: '0.6s' },
  { x: '68%', y: '82%', w: 8, h: 8, color: 'bg-emerald-400', delay: '1.1s' },
  { x: '22%', y: '72%', w: 6, h: 6, color: 'bg-amber-400',   delay: '1.7s' },
  { x: '50%', y: '8%',  w: 5, h: 5, color: 'bg-cyan-300',    delay: '0.3s' },
  { x: '92%', y: '52%', w: 5, h: 5, color: 'bg-purple-300',  delay: '0.9s' },
  { x: '8%',  y: '44%', w: 6, h: 6, color: 'bg-cyan-400',    delay: '2.2s' },
  { x: '58%', y: '92%', w: 5, h: 5, color: 'bg-emerald-300', delay: '1.4s' },
  { x: '34%', y: '6%',  w: 4, h: 4, color: 'bg-purple-400',  delay: '0.7s' },
  { x: '78%', y: '62%', w: 4, h: 4, color: 'bg-amber-300',   delay: '1.9s' },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Hero = () => {
  const leftRef   = useRef<HTMLDivElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)
  const proofRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,   { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' })
      gsap.fromTo(rightRef.current,  { opacity: 0, x:  50 }, { opacity: 1, x: 0, duration: 0.95, delay: 0.1, ease: 'power3.out' })
      gsap.fromTo(proofRef.current,  { opacity: 0, y:  20 }, { opacity: 1, y: 0, duration: 0.8,  delay: 0.55, ease: 'power2.out' })
      gsap.fromTo(scrollRef.current, { opacity: 0 },          { opacity: 1, duration: 1, delay: 1.6 })
    })
    return () => ctx.revert()
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - 80, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 65% 35%, #0e0830 0%, #050218 45%, #000008 100%)' }}
    >
      {/* ── Background ───────────────────────────────────────────────────── */}

      {/* Micro circuit grid */}
      <div aria-hidden="true" className="hidden sm:block absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,1) 1px,transparent 1px)',
        backgroundSize: '50px 50px', opacity: 0.032,
      }} />

      {/* 3-D perspective tunnel grid */}
      <div aria-hidden="true" className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
        <div style={{
          width: '130%', height: '130%',
          backgroundImage: 'linear-gradient(to right,rgba(6,182,212,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(6,182,212,0.07) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          transform: 'perspective(700px) rotateX(28deg)', transformOrigin: 'center 55%',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%,black 20%,transparent 80%)',
          opacity: 0.45,
        }} />
      </div>

      {/* Animated circuit traces */}
      <div aria-hidden="true" className="hidden sm:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" style={{ top: '22%' }} />
        <div className="trace-x-fwd absolute h-px w-52 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
             style={{ top: '22%', opacity: 0.9, animationDuration: '5.5s' }} />

        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" style={{ top: '76%' }} />
        <div className="trace-x-bwd absolute h-px w-44 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
             style={{ top: '76%', opacity: 0.75, animationDuration: '7s', animationDelay: '1.5s' }} />

        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/[0.12] to-transparent" style={{ left: '20%' }} />
        <div className="trace-y-fwd absolute w-px h-36 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
             style={{ left: '20%', opacity: 0.65, animationDuration: '8s', animationDelay: '1s' }} />

        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/[0.10] to-transparent" style={{ left: '80%' }} />
        <div className="trace-y-bwd absolute w-px h-24 bg-gradient-to-b from-transparent via-amber-400 to-transparent"
             style={{ left: '80%', opacity: 0.55, animationDuration: '9.5s', animationDelay: '3.5s' }} />

        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/[0.07] to-transparent"
             style={{ top: '50%', transform: 'rotate(-5deg) scaleX(1.4)' }} />

        {/* Intersection glow nodes */}
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400    animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.9)]"    style={{ top: 'calc(22% - 4px)', left: 'calc(20% - 4px)' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400  animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.9)]"  style={{ top: 'calc(76% - 3px)', left: 'calc(80% - 3px)', animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-emerald-400  animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]"   style={{ top: 'calc(22% - 4px)', left: 'calc(80% - 4px)', animationDelay: '0.5s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400    animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.9)]"  style={{ top: 'calc(76% - 3px)', left: 'calc(20% - 3px)', animationDelay: '1.5s' }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-pulse ${p.color}`}
            style={{ left: p.x, top: p.y, width: p.w, height: p.h, animationDelay: p.delay, animationDuration: `${2.5 + i * 0.35}s` }}
          />
        ))}
      </div>

      {/* Ambient colour orbs */}
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-[700px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[200px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-purple-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-emerald-500/[0.03] rounded-full blur-[220px] pointer-events-none" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-8">

        {/* Zone 1 + 2: headline / profile */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center mb-10 lg:mb-14">

          {/* ── LEFT: Headline + proof + CTA ─────────────────────────────── */}
          <div
            ref={leftRef}
            className="space-y-7 text-center lg:text-left order-2 lg:order-1"
            style={{ opacity: 0 }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] backdrop-blur-md">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-neutral-400 tracking-wide">
                Available · Platform / DevOps / Go roles
              </span>
            </div>

            {/* Terminal prompt + name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="text-[11px] font-mono text-neutral-600 tracking-widest">root@portfolio:~$</span>
                <span className="cursor-blink w-2 h-4 bg-cyan-400/70 inline-block" />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05]">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">Abhay</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Chaurasiya</span>
              </h1>
            </div>

            {/* Headline — the one bold statement */}
            <p className="text-xl md:text-2xl font-semibold text-white/90 leading-snug max-w-[24ch] mx-auto lg:mx-0">
              I build cloud systems that ship fast and heal themselves.
            </p>

            {/* Subtext — one sentence */}
            <p className="text-neutral-400 max-w-[52ch] mx-auto lg:mx-0 leading-relaxed text-[15px]">
              3 CLs merged into golang/tools (reviewed by Alan Donovan · ships in gopls) · 9+ PRs across Jaeger, Helm &amp; CNCF.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#projects"
                onClick={e => { e.preventDefault(); scrollTo('#projects') }}
                className="group relative flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-black font-semibold rounded-xl overflow-hidden hover:bg-cyan-50 transition-colors"
              >
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">View Projects</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); scrollTo('#contact') }}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/[0.04] border border-white/[0.09] hover:border-cyan-500/40 hover:bg-white/[0.08] text-white font-semibold rounded-xl transition-all"
              >
                <Mail size={16} />
                Get in Touch
              </a>
            </div>

            {/* Role chips — compact, no label */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {ROLE_CHIPS.map(role => (
                <span
                  key={role}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-medium text-neutral-300 backdrop-blur-sm"
                >
                  {role}
                </span>
              ))}
            </div>

            {/* Social row — no divider */}
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/40 hover:bg-white/[0.07] text-neutral-400 hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-mono bg-black/90 border border-white/10 rounded-lg text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Live Status Panel ──────────────────────────────────── */}
          <div
            ref={rightRef}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            style={{ opacity: 0 }}
          >
            <div className="relative w-[300px] h-[400px] md:w-[360px] md:h-[470px]">

              {/* Floating tech chips */}
              <div className="float-a absolute -left-6 top-10 z-20" style={{ animationDuration: '4.2s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-cyan-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <GitMerge size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 tracking-wider">golang/tools</p>
                    <p className="text-xs text-white font-bold">3 CLs merged</p>
                  </div>
                </div>
              </div>

              <div className="float-b absolute -right-4 top-8 z-20" style={{ animationDuration: '4.8s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-emerald-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Cloud size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 tracking-wider">cloud</p>
                    <p className="text-xs text-white font-bold">AWS · Kubernetes</p>
                  </div>
                </div>
              </div>

              <div className="float-c absolute -left-8 bottom-14 z-20" style={{ animationDuration: '5s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-purple-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <GitBranch size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 tracking-wider">open source</p>
                    <p className="text-xs text-white font-bold">CNCF · 9+ PRs</p>
                  </div>
                </div>
              </div>

              <div className="float-d absolute -right-2 bottom-16 z-20" style={{ animationDuration: '5.5s' }}>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-amber-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Server size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 tracking-wider">language</p>
                    <p className="text-xs text-white font-bold">Go · gopls</p>
                  </div>
                </div>
              </div>

              {/* Orbits */}
              <div aria-hidden="true" className="spin-cw absolute inset-0 rounded-3xl border border-dashed border-cyan-500/12" style={{ animationDuration: '22s' }} />
              <div aria-hidden="true" className="spin-ccw absolute inset-3 rounded-2xl border border-purple-500/[0.09]" style={{ animationDuration: '15s' }} />

              {/* Terminal window */}
              <div className="absolute inset-6 rounded-2xl overflow-hidden border border-white/[0.09] bg-gradient-to-b from-neutral-900/97 to-black backdrop-blur-xl shadow-[0_0_100px_-25px_rgba(6,182,212,0.45)]">

                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-black/70 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 ml-2 tracking-widest">status.live</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-400 tracking-widest">ONLINE</span>
                  </div>
                </div>

                {/* Profile */}
                <div className="relative flex flex-col items-center justify-center h-[calc(100%-40px)] p-5">
                  {/* Scan line */}
                  <div aria-hidden="true" className="scan-line absolute inset-x-0 h-12 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-400/[0.055] to-transparent"
                       style={{ animationDuration: '4s' }} />

                  {/* Avatar + orbiting rings */}
                  <div className="relative w-36 h-36 md:w-44 md:h-44 mb-4">
                    <div aria-hidden="true" className="spin-cw absolute -inset-3 rounded-full border border-dashed border-cyan-500/25" style={{ animationDuration: '13s' }} />
                    <div aria-hidden="true" className="spin-ccw absolute -inset-1.5 rounded-full border border-purple-500/18" style={{ animationDuration: '9s' }} />
                    <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10 bg-neutral-800 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                      <Image src="/profile-picture.svg" alt="Abhay Chaurasiya" fill className="object-cover" priority />
                    </div>
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10" />
                    <div aria-hidden="true" className="spin-cw absolute -inset-3" style={{ animationDuration: '13s' }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    </div>
                  </div>

                  <p className="text-white font-bold text-base tracking-tight mb-0.5">Abhay Chaurasiya</p>
                  <p className="text-cyan-400 text-[10px] font-mono tracking-[0.18em] uppercase mb-4">DevOps · Go · golang/tools</p>

                  {/* Live status fields */}
                  <div className="w-full space-y-1.5">
                    {[
                      { prefix: '●', label: 'STATUS', val: 'Available · open to work',     valCls: 'text-emerald-400' },
                      { prefix: '↑', label: 'LATEST',  val: 'golang/tools PR #629 merged', valCls: 'text-cyan-300'    },
                      { prefix: '◎', label: 'FOCUS',   val: 'CNCF · K8s platforms in Go', valCls: 'text-neutral-300' },
                    ].map(({ prefix, label, val, valCls }) => (
                      <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <span className="text-neutral-600 font-mono text-[10px] w-3 shrink-0">{prefix}</span>
                        <span className="text-neutral-600 font-mono text-[9px] uppercase tracking-wider w-10 shrink-0">{label}</span>
                        <span className={`font-mono text-[9px] ${valCls} truncate`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner accent nodes */}
              <div aria-hidden="true" className="absolute top-5 left-5   w-1.5 h-1.5 rounded-full bg-cyan-400    shadow-[0_0_8px_rgba(6,182,212,1)]"    />
              <div aria-hidden="true" className="absolute top-5 right-5  w-1.5 h-1.5 rounded-full bg-purple-400  shadow-[0_0_8px_rgba(168,85,247,1)]"  />
              <div aria-hidden="true" className="absolute bottom-5 left-5  w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <div aria-hidden="true" className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-amber-400   shadow-[0_0_8px_rgba(245,158,11,1)]" />
            </div>
          </div>
        </div>

        {/* ── Zone 3: Proof strip ───────────────────────────────────────── */}
        <div
          ref={proofRef}
          className="grid grid-cols-3 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
          style={{ opacity: 0 }}
        >
          {PROOF.map(({ Icon, value, detail, accent, bg, border }) => (
            <div key={value} className="flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
              <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center shrink-0`}>
                <Icon size={15} className={accent} />
              </div>
              <div className="min-w-0">
                <p className={`text-base font-bold ${accent} leading-none`}>{value}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight truncate">{detail}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-mono">scroll</span>
        <div className="relative w-px h-12">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-700/40 to-transparent" />
          <div className="scroll-drip absolute top-0 left-0 w-full h-5 bg-gradient-to-b from-cyan-400/90 to-transparent" />
        </div>
      </div>

    </section>
  )
}

export default Hero
