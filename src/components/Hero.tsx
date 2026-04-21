"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import {
  Activity,
  ArrowRight,
  Code,
  Download,
  GitMerge,
  Linkedin,
  Mail,
  ShieldCheck,
  Trophy,
} from 'lucide-react'
import Image from 'next/image'

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const SOCIALS = [
  { Icon: GithubIcon, href: 'https://github.com/abhay1999', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://linkedin.com/in/abhay-chaurasiya', label: 'LinkedIn' },
  { Icon: Code, href: 'https://leetcode.com/u/imt_2018005/', label: 'LeetCode' },
  { Icon: Trophy, href: 'https://www.hackerrank.com/profile/abhaychaurasiya1', label: 'HackerRank' },
]

type TLine = { type: 'cmd' | 'output' | 'blank'; text: string; cls?: string }

const TERMINAL_LINES: TLine[] = [
  { type: 'cmd', text: 'boot mission-control' },
  { type: 'output', text: 'Mission Control online', cls: 'text-emerald-400' },
  { type: 'blank', text: '' },
  { type: 'cmd', text: 'identify operator' },
  { type: 'output', text: 'Abhay Chaurasiya — DevOps · Platform · Go', cls: 'text-cyan-300' },
  { type: 'blank', text: '' },
  { type: 'cmd', text: 'cat mission.txt' },
  { type: 'output', text: 'Build cloud systems that ship fast', cls: 'text-neutral-100' },
  { type: 'output', text: 'and heal themselves.', cls: 'text-neutral-100' },
  { type: 'blank', text: '' },
  { type: 'cmd', text: 'tail -n 3 live-proof.log' },
  { type: 'output', text: '[MERGED] golang/tools · 3 CLs', cls: 'text-emerald-400' },
  { type: 'output', text: '[MERGED] CNCF ecosystem · 9+ PRs', cls: 'text-cyan-300' },
  { type: 'output', text: '[STATUS] Available · open to hire', cls: 'text-amber-300' },
]

const LIVE_FEED = [
  'sync: gopls analyzers deployed',
  'signal: Jaeger dashboard generator merged',
  'health: platform services nominal',
  'status: accepting DevOps / Platform / Go interviews',
]

function TerminalTypewriter() {
  const [shown, setShown] = useState<TLine[]>([])
  const [typing, setTyping] = useState<string | null>(null)
  const [typingCls, setTypingCls] = useState('')
  const [typingType, setTypingType] = useState<'cmd' | 'output'>('cmd')
  const [finished, setFinished] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const runLine = (idx: number) => {
      if (cancelled || idx >= TERMINAL_LINES.length) {
        if (!cancelled) setFinished(true)
        return
      }

      const line = TERMINAL_LINES[idx]

      if (line.type === 'blank') {
        const timer = setTimeout(() => {
          if (cancelled) return
          setShown((prev) => [...prev, line])
          runLine(idx + 1)
        }, 150)
        timers.push(timer)
        return
      }

      let charCount = 0
      const speed = line.type === 'cmd' ? 32 : 11

      setTypingType(line.type)
      setTypingCls(line.cls ?? '')
      setTyping('')

      const typeChar = () => {
        if (cancelled) return
        charCount += 1
        setTyping(line.text.slice(0, charCount))

        if (charCount < line.text.length) {
          const timer = setTimeout(typeChar, speed)
          timers.push(timer)
          return
        }

        const timer = setTimeout(() => {
          if (cancelled) return
          setShown((prev) => [...prev, line])
          setTyping(null)
          runLine(idx + 1)
        }, line.type === 'cmd' ? 260 : 70)
        timers.push(timer)
      }

      typeChar()
    }

    const init = setTimeout(() => runLine(0), 450)
    timers.push(init)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [shown, typing])

  const renderLine = (line: TLine, i: number) => {
    if (line.type === 'blank') return <div key={i} className="h-2" />

    if (line.type === 'cmd') {
      return (
        <div key={i} className="flex items-center gap-2">
          <span className="text-emerald-500">$</span>
          <span className="text-neutral-100">{line.text}</span>
        </div>
      )
    }

    return (
      <div key={i} className={`pl-4 ${line.cls ?? 'text-neutral-400'}`}>
        {line.text}
      </div>
    )
  }

  return (
    <div ref={bodyRef} className="h-[238px] overflow-hidden font-mono text-[12px] leading-6 md:text-[13px]">
      {shown.map(renderLine)}

      {typing !== null && (
        <div>
          {typingType === 'cmd' ? (
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">$</span>
              <span className="text-neutral-100">{typing}</span>
              <span className="cursor-blink inline-block h-[14px] w-[7px] bg-emerald-400/80" />
            </div>
          ) : (
            <div className={`pl-4 ${typingCls || 'text-neutral-400'}`}>
              {typing}
              <span className="cursor-blink ml-0.5 inline-block h-[12px] w-[6px] bg-current/60 align-middle" />
            </div>
          )}
        </div>
      )}

      {finished && typing === null && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-emerald-500">$</span>
          <span className="cursor-blink inline-block h-[14px] w-[7px] bg-emerald-400/80" />
        </div>
      )}
    </div>
  )
}

const Hero = () => {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const proofRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      gsap.fromTo(rightRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.12, ease: 'power3.out' })
      gsap.fromTo(proofRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: 'power2.out' })
      gsap.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.25 })
    })

    return () => ctx.revert()
  }, [])

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (!el) return

    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top - 80, behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 18% 20%, rgba(24,107,105,0.26) 0%, transparent 34%), radial-gradient(circle at 82% 24%, rgba(45,95,160,0.22) 0%, transparent 30%), radial-gradient(ellipse at 50% 42%, #0d1f26 0%, #081319 48%, #030608 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(103,232,249,0.85) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,0.85) 1px,transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 top-[22%] h-px bg-gradient-to-r from-transparent via-cyan-400/18 to-transparent" />
        <div className="trace-x-fwd absolute top-[22%] h-px w-64 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" style={{ animationDuration: '7.5s' }} />

        <div className="absolute inset-x-0 top-[68%] h-px bg-gradient-to-r from-transparent via-sky-400/18 to-transparent" />
        <div className="trace-x-bwd absolute top-[68%] h-px w-56 bg-gradient-to-r from-transparent via-sky-300 to-transparent" style={{ animationDuration: '8.2s' }} />

        <div className="absolute bottom-0 left-1/2 h-[42%] w-full -translate-x-1/2 opacity-[0.08]" style={{
          backgroundImage:
            'linear-gradient(to right, rgba(103,232,249,0.72) 1px, transparent 1px), linear-gradient(to bottom, rgba(103,232,249,0.72) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: 'perspective(760px) rotateX(65deg) translateY(28%)',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 16%, transparent 76%)',
        }} />

        <div className="radar-sweep absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute left-[22%] top-[20%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
        <div className="absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.9)]" />
        <div className="absolute bottom-[22%] left-[28%] h-1.5 w-1.5 rounded-full bg-teal-200 shadow-[0_0_10px_rgba(153,246,228,0.9)]" />
        <div className="absolute bottom-[18%] right-[24%] h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.9)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-14 pt-20 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-16">
          <div ref={leftRef} className="space-y-7" style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono tracking-[0.18em] text-emerald-200 uppercase">
                Mission Control Online
              </span>
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                DevOps · Platform · Go
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-[6.25rem]">
                Abhay Chaurasiya
              </h1>
              <p className="max-w-3xl text-2xl font-medium leading-tight tracking-[-0.03em] text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-100 bg-clip-text sm:text-3xl lg:text-[2.35rem]">
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-100 bg-clip-text text-transparent">
                  DevOps Engineer · Platform Builder · Go
                </span>
              </p>
              <p className="max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                I build cloud systems that ship fast, stay observable, and heal themselves under pressure.
              </p>
            </div>

            <div className="max-w-2xl rounded-[28px] border border-white/10 bg-black/45 shadow-[0_0_80px_-28px_rgba(52,211,153,0.35)] backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                  mission.log
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-400">
                    live
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <TerminalTypewriter />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="/resume.pdf"
                download="Abhay_Chaurasiya_Resume.pdf"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-6 py-3.5 font-semibold text-cyan-50 transition-all hover:border-cyan-300/45 hover:bg-cyan-400/16 hover:shadow-[0_0_28px_-10px_rgba(34,211,238,0.65)]"
              >
                <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
                Download Resume
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('#projects')
                }}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-black transition-all hover:bg-emerald-300 hover:shadow-[0_0_30px_-10px_rgba(52,211,153,0.7)]"
              >
                Open Mission Log
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo('#contact')
                }}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-semibold text-white transition-all hover:border-cyan-400/35 hover:bg-white/[0.08]"
              >
                <Mail size={16} />
                Request Interview
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group relative rounded-xl border border-white/8 bg-white/[0.03] p-3 text-neutral-400 transition-all duration-300 hover:border-emerald-500/35 hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon size={18} />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-2 py-1 text-[10px] font-mono text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="relative mx-auto w-full max-w-[720px]" style={{ opacity: 0 }}>
            <div className="relative h-[520px] sm:h-[600px] lg:h-[640px]">
              <div className="absolute inset-0 rounded-[44px] bg-[radial-gradient(circle_at_50%_45%,rgba(52,211,153,0.16),rgba(34,211,238,0.07)_26%,transparent_60%)]" />
              <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-[130px]" />
              <div className="absolute left-[54%] top-[44%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[110px]" />

              <div className="absolute left-1/2 top-[50%] h-[78%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-emerald-300/70 to-transparent" />
              <div className="scan-line absolute left-1/2 top-[11%] h-20 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent" style={{ animationDuration: '4.8s' }} />

              <div className="absolute left-1/2 top-[44%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/14" />
              <div className="spin-cw absolute left-1/2 top-[44%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/16" style={{ animationDuration: '18s' }} />
              <div className="spin-ccw absolute left-1/2 top-[44%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/12" style={{ animationDuration: '12s' }} />
              <div className="absolute left-1/2 top-[44%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_55%,transparent_80%)] backdrop-blur-[2px]" />

              <div className="absolute left-1/2 top-[44%] h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 sm:h-[190px] sm:w-[190px]">
                <div className="signal-pulse absolute -inset-10 rounded-full border border-emerald-400/15" />
                <div className="signal-pulse absolute -inset-16 rounded-full border border-cyan-400/10" style={{ animationDelay: '1.1s' }} />
                <div className="absolute inset-0 overflow-hidden rounded-full border border-white/10 bg-black shadow-[0_0_70px_rgba(52,211,153,0.28)]">
                  <Image src="/profile-picture.svg" alt="Abhay Chaurasiya" fill className="object-cover" priority />
                </div>
              </div>

              <div className="absolute left-1/2 top-[44%] z-10 h-3 w-3 -translate-x-1/2 -translate-y-[165px] rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]" />
              <div className="absolute left-1/2 top-[44%] z-10 h-3 w-3 translate-x-[150px] -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
              <div className="absolute left-1/2 top-[44%] z-10 h-2.5 w-2.5 -translate-x-[155px] translate-y-[95px] rounded-full bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,1)]" />

              <div className="float-a absolute left-[2%] top-[10%] w-[220px] rounded-[24px] border border-emerald-500/18 bg-black/35 px-4 py-4 backdrop-blur-md" style={{ animationDuration: '6s' }}>
                <div className="mb-2 flex items-center gap-2">
                  <GitMerge size={14} className="text-emerald-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-300">Contribution Signal</span>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-white">10+ merged PRs</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">CNCF ecosystem and golang/tools, with production-facing fixes and platform work.</p>
                <div className="absolute right-[-34px] top-[56%] h-px w-10 bg-gradient-to-r from-emerald-400/70 to-transparent" />
              </div>

              <div className="float-b absolute right-[0%] top-[14%] w-[210px] rounded-[24px] border border-cyan-500/18 bg-black/35 px-4 py-4 backdrop-blur-md" style={{ animationDuration: '6.8s' }}>
                <div className="mb-2 flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-cyan-300">Live Focus</span>
                </div>
                <p className="text-xl font-semibold tracking-tight text-white">Platform reliability</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">AWS, Kubernetes, observability, delivery velocity, and systems that recover under load.</p>
                <div className="absolute left-[-34px] top-[48%] h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/70" />
              </div>

              <div className="float-c absolute bottom-[15%] left-[8%] w-[220px] rounded-[24px] border border-amber-500/18 bg-black/35 px-4 py-4 backdrop-blur-md" style={{ animationDuration: '7.2s' }}>
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-300">Operator Status</span>
                </div>
                <p className="text-xl font-semibold tracking-tight text-white">Open to hire</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">Best fit for DevOps, Platform, Cloud, and Go backend roles.</p>
                <div className="absolute right-[-34px] top-[34%] h-px w-10 bg-gradient-to-r from-amber-400/70 to-transparent" />
              </div>

              <div className="float-d absolute bottom-[8%] right-[2%] w-[245px] rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-md" style={{ animationDuration: '7.8s' }}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-neutral-600">Mission Stream</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-300">Live</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {LIVE_FEED.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-neutral-300">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                      <span className="font-mono">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute left-[-34px] top-[38%] h-px w-10 bg-gradient-to-r from-transparent to-white/60" />
              </div>

            </div>

            <div className="mx-auto mt-6 max-w-[360px] text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-600">Operator Identity</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Abhay Chaurasiya</h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-200/85">
                Platform reliability, cloud delivery, open-source velocity, and Go systems design.
              </p>
            </div>
          </div>
        </div>

        <div
          ref={proofRef}
          className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_0_100px_-50px_rgba(52,211,153,0.45)] backdrop-blur-xl md:px-8 md:py-6"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-neutral-600">
                Verified operator proof
              </p>
              <p className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-[2.5rem]">
                10+ merged PRs across CNCF and golang/tools, plus systems shipped for 5k+ concurrent users.
              </p>
            </div>
            <div className="shrink-0">
              <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
                Built to be scanned by recruiters, trusted by engineers, and remembered after one pass.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600">scroll</span>
        <div className="relative h-12 w-px">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-700/40 to-transparent" />
          <div className="scroll-drip absolute left-0 top-0 h-5 w-full bg-gradient-to-b from-emerald-400/90 to-transparent" />
        </div>
      </div>
    </section>
  )
}

export default Hero
