"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, Github, Linkedin, Code, Trophy, Terminal, Cloud, GitBranch } from 'lucide-react'
import Image from 'next/image'

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
  'DevOps Engineer',
  'Cloud Native Specialist',
  'Full-Stack Developer',
  'Python Specialist',
  'React.js Expert',
]

const SOCIALS = [
  { Icon: Github,   href: 'https://github.com/abhay1999',                         label: 'GitHub'     },
  { Icon: Linkedin, href: 'https://linkedin.com/in/abhay-chaurasiya',             label: 'LinkedIn'   },
  { Icon: Code,     href: 'https://leetcode.com/u/imt_2018005/',                  label: 'LeetCode'   },
  { Icon: Trophy,   href: 'https://www.hackerrank.com/profile/abhaychaurasiya1',  label: 'HackerRank' },
]

// Fixed positions — avoids hydration mismatch from random values
const PARTICLES = [
  { x: '12%',  y: '18%', w: 8,  h: 8,  color: 'bg-cyan-400',    delay: 0    },
  { x: '88%',  y: '14%', w: 6,  h: 6,  color: 'bg-purple-400',  delay: 0.6  },
  { x: '68%',  y: '82%', w: 8,  h: 8,  color: 'bg-emerald-400', delay: 1.1  },
  { x: '22%',  y: '72%', w: 6,  h: 6,  color: 'bg-amber-400',   delay: 1.7  },
  { x: '50%',  y: '8%',  w: 5,  h: 5,  color: 'bg-cyan-300',    delay: 0.3  },
  { x: '92%',  y: '52%', w: 5,  h: 5,  color: 'bg-purple-300',  delay: 0.9  },
  { x: '8%',   y: '44%', w: 6,  h: 6,  color: 'bg-cyan-400',    delay: 2.2  },
  { x: '58%',  y: '92%', w: 5,  h: 5,  color: 'bg-emerald-300', delay: 1.4  },
  { x: '34%',  y: '6%',  w: 4,  h: 4,  color: 'bg-purple-400',  delay: 0.7  },
  { x: '78%',  y: '62%', w: 4,  h: 4,  color: 'bg-amber-300',   delay: 1.9  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Hero = () => {
  const [mounted, setMounted] = useState(false)
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentRole(prev => (prev + 1) % ROLES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >

      {/* ── Background layer ─────────────────────────────────────────────── */}

      {/* Micro circuit grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,1) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.032,
        }}
      />

      {/* 3D perspective tunnel grid — converges toward center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          style={{
            width: '130%',
            height: '130%',
            backgroundImage:
              'linear-gradient(to right,rgba(6,182,212,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(6,182,212,0.07) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
            transform: 'perspective(700px) rotateX(28deg)',
            transformOrigin: 'center 55%',
            maskImage:
              'radial-gradient(ellipse 75% 65% at 50% 50%,black 20%,transparent 80%)',
            opacity: 0.45,
          }}
        />
      </div>

      {/* Animated circuit traces */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* H-trace @ 22% */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" style={{ top: '22%' }} />
        <motion.div
          animate={{ x: ['-12%', '112%'] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
          className="absolute h-px w-52 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{ top: '22%', opacity: 0.9 }}
        />

        {/* H-trace @ 76% */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" style={{ top: '76%' }} />
        <motion.div
          animate={{ x: ['112%', '-12%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1.5, repeatDelay: 3 }}
          className="absolute h-px w-44 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          style={{ top: '76%', opacity: 0.75 }}
        />

        {/* V-trace @ 20% */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/[0.12] to-transparent" style={{ left: '20%' }} />
        <motion.div
          animate={{ y: ['-12%', '112%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1, repeatDelay: 3 }}
          className="absolute w-px h-36 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
          style={{ left: '20%', opacity: 0.65 }}
        />

        {/* V-trace @ 80% */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/[0.10] to-transparent" style={{ left: '80%' }} />
        <motion.div
          animate={{ y: ['112%', '-12%'] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'linear', delay: 3.5, repeatDelay: 2 }}
          className="absolute w-px h-24 bg-gradient-to-b from-transparent via-amber-400 to-transparent"
          style={{ left: '80%', opacity: 0.55 }}
        />

        {/* Diagonal accent trace */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/[0.07] to-transparent"
          style={{ top: '50%', transform: 'rotate(-5deg) scaleX(1.4)' }}
        />

        {/* Intersection glow nodes */}
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400    animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.9)]"     style={{ top: 'calc(22% - 4px)', left: 'calc(20% - 4px)' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400  animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.9)]"   style={{ top: 'calc(76% - 3px)', left: 'calc(80% - 3px)', animationDelay: '1s'   }} />
        <div className="absolute w-2 h-2 rounded-full bg-emerald-400  animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.9)]"   style={{ top: 'calc(22% - 4px)', left: 'calc(80% - 4px)', animationDelay: '0.5s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400    animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.9)]"   style={{ top: 'calc(76% - 3px)', left: 'calc(20% - 3px)', animationDelay: '1.5s' }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.3, 0.7] }}
            transition={{ duration: 2.5 + i * 0.35, repeat: Infinity, delay: p.delay }}
            className={`absolute rounded-full ${p.color}`}
            style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
          />
        ))}
      </div>

      {/* Ambient colour orbs */}
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-[700px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[200px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-purple-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-emerald-500/[0.03] rounded-full blur-[220px] pointer-events-none" />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* ── LEFT: Text Content ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7 text-center lg:text-left order-2 lg:order-1"
          >

            {/* System status badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono text-neutral-400 tracking-[0.15em] uppercase">
                SYS&nbsp;// Available for work
              </span>
            </motion.div>

            {/* Terminal prompt + name */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center gap-2 justify-center lg:justify-start"
              >
                <span className="text-[11px] font-mono text-neutral-600 tracking-widest">root@portfolio:~$</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-cyan-400/70 inline-block"
                />
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05]">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
                  Abhay
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                  Chaurasiya
                </span>
              </h1>
            </div>

            {/* Animated role */}
            <div className="flex items-center gap-2 justify-center lg:justify-start h-9 overflow-hidden">
              <span className="text-neutral-600 font-mono text-xs shrink-0 tracking-wider">role:&nbsp;</span>
              <div className="relative h-full flex items-center overflow-hidden">
                <motion.span
                  key={currentRole}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="text-lg md:text-xl font-bold text-white"
                >
                  {ROLES[currentRole]}
                </motion.span>
              </div>
              {/* Blinking cursor after role */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-0.5 h-5 bg-cyan-400/60 inline-block shrink-0"
              />
            </div>

            {/* Bio */}
            <p className="text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed text-[15px]">
              I build{' '}
              <span className="text-white font-medium">scalable web applications</span> and craft
              engaging digital experiences — from microservices on AWS to pixel-perfect frontends,
              end-to-end.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <motion.a
                href="/resume.html"
                download="Abhay_Chaurasiya_Resume.html"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-black font-semibold rounded-xl overflow-hidden hover:bg-cyan-50 transition-colors"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Download size={17} />
                <span className="relative">Download Resume</span>
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white/[0.04] border border-white/[0.09] hover:border-cyan-500/40 hover:bg-white/[0.08] text-white font-semibold rounded-xl transition-all"
              >
                <Mail size={17} />
                Get in Touch
              </motion.a>
            </div>

            {/* Social divider */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="h-px w-16 bg-white/[0.07]" />
              <span className="text-[10px] font-mono text-neutral-600 tracking-[0.25em] uppercase">Connect</span>
              <div className="h-px w-16 bg-white/[0.07]" />
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5 justify-center lg:justify-start">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/40 hover:bg-white/[0.07] text-neutral-400 hover:text-white transition-all duration-300"
                >
                  <Icon size={20} />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-mono bg-black/90 border border-white/10 rounded-lg text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Holographic Terminal ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-[300px] h-[400px] md:w-[360px] md:h-[470px]">

              {/* ── Floating tech panels ─────────────────────────────── */}

              {/* Frontend — top-left */}
              <motion.div
                animate={{ y: [-9, 9, -9] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-6 top-10 z-20"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-cyan-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <Code size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 font-mono tracking-wider">frontend</p>
                    <p className="text-xs text-white font-bold">React · Next.js</p>
                  </div>
                </div>
              </motion.div>

              {/* Cloud — top-right */}
              <motion.div
                animate={{ y: [9, -9, 9] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute -right-4 top-8 z-20"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-emerald-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Cloud size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 font-mono tracking-wider">cloud</p>
                    <p className="text-xs text-white font-bold">AWS · K8s</p>
                  </div>
                </div>
              </motion.div>

              {/* DevOps — bottom-left */}
              <motion.div
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
                className="absolute -left-8 bottom-14 z-20"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-purple-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                    <GitBranch size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 font-mono tracking-wider">devops</p>
                    <p className="text-xs text-white font-bold">Docker · Helm</p>
                  </div>
                </div>
              </motion.div>

              {/* Backend — bottom-right */}
              <motion.div
                animate={{ y: [7, -7, 7] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                className="absolute -right-2 bottom-18 z-20"
              >
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-neutral-900/95 border border-amber-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Terminal size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 font-mono tracking-wider">backend</p>
                    <p className="text-xs text-white font-bold">Node · Python</p>
                  </div>
                </div>
              </motion.div>

              {/* ── Monitor frame ─────────────────────────────────────── */}

              {/* Outer dashed orbit */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl border border-dashed border-cyan-500/12"
              />
              {/* Inner counter-orbit */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-2xl border border-purple-500/[0.09]"
              />

              {/* Terminal window */}
              <div className="absolute inset-6 rounded-2xl overflow-hidden border border-white/[0.09] bg-gradient-to-b from-neutral-900/97 to-black backdrop-blur-xl shadow-[0_0_100px_-25px_rgba(6,182,212,0.45)]">

                {/* Window title bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-black/70 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 ml-2 tracking-widest">profile.sys</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-400 tracking-widest">LIVE</span>
                  </div>
                </div>

                {/* Profile content */}
                <div className="relative flex flex-col items-center justify-center h-[calc(100%-40px)] p-5">

                  {/* Scan line animation */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ y: ['-10%', '115%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                    className="absolute inset-x-0 h-12 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-400/[0.055] to-transparent"
                  />

                  {/* Profile image + orbits */}
                  <div className="relative w-36 h-36 md:w-44 md:h-44 mb-5">
                    {/* Orbit 1 */}
                    <motion.div
                      aria-hidden="true"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-3 rounded-full border border-dashed border-cyan-500/25"
                    />
                    {/* Orbit 2 */}
                    <motion.div
                      aria-hidden="true"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-1.5 rounded-full border border-purple-500/18"
                    />

                    {/* Image */}
                    <div className="absolute inset-0 rounded-full overflow-hidden border border-white/10 bg-neutral-800 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                      <Image
                        src="/profile-picture.svg"
                        alt="Abhay Chaurasiya"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Online indicator */}
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10" />

                    {/* Orbiting dot */}
                    <motion.div
                      aria-hidden="true"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-3"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    </motion.div>
                  </div>

                  {/* Name + role */}
                  <h2 className="text-white font-bold text-xl tracking-tight mb-0.5">
                    Abhay Chaurasiya
                  </h2>
                  <p className="text-cyan-400 text-[10px] font-mono tracking-[0.22em] uppercase mb-5">
                    Full Stack Engineer
                  </p>

                  {/* Quick stat chips */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      { label: '2+ yrs',   cls: 'text-cyan-400    border-cyan-500/25    bg-cyan-500/[0.08]'    },
                      { label: '15+ proj', cls: 'text-purple-400  border-purple-500/25  bg-purple-500/[0.08]'  },
                      { label: '500+ LC',  cls: 'text-amber-400   border-amber-500/25   bg-amber-500/[0.08]'   },
                    ].map(c => (
                      <span
                        key={c.label}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${c.cls}`}
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner accent nodes on the frame */}
              <div aria-hidden="true" className="absolute top-5 left-5 w-1.5 h-1.5 rounded-full bg-cyan-400    shadow-[0_0_8px_rgba(6,182,212,1)]"    />
              <div aria-hidden="true" className="absolute top-5 right-5 w-1.5 h-1.5 rounded-full bg-purple-400  shadow-[0_0_8px_rgba(168,85,247,1)]"  />
              <div aria-hidden="true" className="absolute bottom-5 left-5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <div aria-hidden="true" className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-amber-400   shadow-[0_0_8px_rgba(245,158,11,1)]" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-mono">scroll</span>
        <div className="relative w-px h-12">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-700/40 to-transparent" />
          <motion.div
            animate={{ y: [0, 44, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full h-5 bg-gradient-to-b from-cyan-400/90 to-transparent"
          />
        </div>
      </motion.div>

    </section>
  )
}

export default Hero
