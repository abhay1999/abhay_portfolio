"use client"

import { useRef, useEffect } from 'react'
import { Cloud, Server, Globe, Activity } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Reveal from '@/components/Reveal'

// ─── Count-up number ─────────────────────────────────────────────────────────

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(obj.current, { val: 0 }, {
      val: to,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { if (el) el.textContent = Math.round(obj.current.val) + suffix },
    })
    return () => { tween.kill(); ScrollTrigger.getAll().filter(s => s.trigger === el).forEach(s => s.kill()) }
  }, [to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── Circular skill ring ──────────────────────────────────────────────────────

function SkillRing({ level, hex, name }: { level: number; hex: string; name: string }) {
  const ringRef = useRef<SVGCircleElement>(null)
  const SIZE = 60, SW = 4, R = (SIZE - SW) / 2
  const C = 2 * Math.PI * R

  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    gsap.set(el, { strokeDasharray: C, strokeDashoffset: C })
    const tween = gsap.to(el, {
      strokeDashoffset: C - C * (level / 100),
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 93%', once: true },
    })
    return () => {
      tween.kill()
      ScrollTrigger.getAll().filter(s => s.trigger === el).forEach(s => s.kill())
    }
  }, [level, C])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="rotate-[-90deg]">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={SW} />
          <circle
            ref={ringRef}
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none" stroke={hex} strokeWidth={SW} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${hex}99)` }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-black text-[12px] tabular-nums"
          style={{ color: hex }}
        >
          {level}
        </span>
      </div>
      <span className="text-[9px] font-mono text-neutral-500 text-center leading-tight w-[60px] truncate">{name}</span>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'devops', num: '01', title: 'DevOps', icon: Cloud,
    hex: '#34d399', accentText: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/25',
    skills: [
      { name: 'Kubernetes', level: 85 },
      { name: 'Helm',       level: 85 },
      { name: 'Docker',     level: 90 },
      { name: 'CI/CD',      level: 85 },
      { name: 'ArgoCD',     level: 75 },
    ],
  },
  {
    id: 'backend', num: '02', title: 'Backend & Go', icon: Server,
    hex: '#c084fc', accentText: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/25',
    skills: [
      { name: 'Go',         level: 85 },
      { name: 'Node.js',    level: 90 },
      { name: 'gRPC',       level: 85 },
      { name: 'GraphQL',    level: 80 },
      { name: 'TypeScript', level: 85 },
    ],
  },
  {
    id: 'cloud', num: '03', title: 'Cloud & Infra', icon: Globe,
    hex: '#22d3ee', accentText: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/25',
    skills: [
      { name: 'AWS',         level: 85 },
      { name: 'Terraform',   level: 80 },
      { name: 'Linux',       level: 90 },
      { name: 'Databases',   level: 85 },
      { name: 'Next.js',     level: 90 },
    ],
  },
  {
    id: 'observability', num: '04', title: 'Observability', icon: Activity,
    hex: '#fb923c', accentText: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/25',
    skills: [
      { name: 'Jaeger',      level: 85 },
      { name: 'Prometheus',  level: 85 },
      { name: 'Grafana',     level: 80 },
      { name: 'OTel',        level: 75 },
      { name: 'Alertmgr',   level: 80 },
    ],
  },
]

const STATS = [
  { to: 20, suffix: '+',  label: 'Skills',      color: '#22d3ee' },
  { to: 4,  suffix: '',   label: 'Domains',      color: '#c084fc' },
  { to: 9,  suffix: '+',  label: 'CNCF PRs',    color: '#34d399' },
  { to: 5,  suffix: 'yr', label: 'Experience',   color: '#fb923c' },
]

// All skills flat, with category hex, for the marquee
const MARQUEE_ROW_A = [
  { text: 'Kubernetes', hex: '#34d399' }, { text: 'Helm', hex: '#34d399' },
  { text: 'Docker', hex: '#34d399' },     { text: 'ArgoCD', hex: '#34d399' },
  { text: 'GitOps', hex: '#34d399' },     { text: 'Go (Golang)', hex: '#c084fc' },
  { text: 'Node.js', hex: '#c084fc' },    { text: 'gRPC', hex: '#c084fc' },
  { text: 'TypeScript', hex: '#c084fc' }, { text: 'GraphQL', hex: '#c084fc' },
]

const MARQUEE_ROW_B = [
  { text: 'AWS EKS', hex: '#22d3ee' },       { text: 'Terraform', hex: '#22d3ee' },
  { text: 'Linux / Bash', hex: '#22d3ee' },  { text: 'PostgreSQL', hex: '#22d3ee' },
  { text: 'Next.js', hex: '#22d3ee' },       { text: 'Prometheus', hex: '#fb923c' },
  { text: 'Grafana', hex: '#fb923c' },       { text: 'Jaeger', hex: '#fb923c' },
  { text: 'OpenTelemetry', hex: '#fb923c' }, { text: 'CI/CD Pipelines', hex: '#34d399' },
]

const EXPERTISE = [
  { text: 'CNCF Contributor',     cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/18 hover:border-emerald-400/60' },
  { text: 'Kubernetes Operators', cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/18 hover:border-emerald-400/60' },
  { text: 'Cloud Native',         cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/18 hover:border-cyan-400/60' },
  { text: 'Open Source',          cls: 'text-amber-300 border-amber-500/30 bg-amber-500/8 hover:bg-amber-500/18 hover:border-amber-400/60' },
  { text: 'GitOps',               cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/18 hover:border-emerald-400/60' },
  { text: 'DevSecOps',            cls: 'text-purple-300 border-purple-500/30 bg-purple-500/8 hover:bg-purple-500/18 hover:border-purple-400/60' },
  { text: 'Microservices',        cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/18 hover:border-cyan-400/60' },
  { text: 'IaC / Terraform',      cls: 'text-orange-300 border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/18 hover:border-orange-400/60' },
  { text: 'Performance Tuning',   cls: 'text-orange-300 border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/18 hover:border-orange-400/60' },
  { text: 'Distributed Systems',  cls: 'text-purple-300 border-purple-500/30 bg-purple-500/8 hover:bg-purple-500/18 hover:border-purple-400/60' },
  { text: 'Self-Healing Infra',   cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/18 hover:border-emerald-400/60' },
  { text: 'WebSockets / Realtime',cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/18 hover:border-cyan-400/60' },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="relative py-24 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 20%, #001a10 0%, #000c07 45%, #000 100%)' }}>

    {/* Inject marquee keyframes */}
    <style>{`
      @keyframes mq-fwd { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      @keyframes mq-bwd { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      .mq-fwd { animation: mq-fwd 28s linear infinite; }
      .mq-bwd { animation: mq-bwd 22s linear infinite; }
      .mq-fwd:hover, .mq-bwd:hover { animation-play-state: paused; }
    `}</style>

    {/* Background */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald-500/[0.07] blur-[160px]" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[130px]" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/[0.06] blur-[120px]" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* ── Section Header ───────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 30 }} className="mb-12">
        <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
          <span className="text-emerald-400">$</span>
          <span className="text-neutral-400">sys</span>
          <span className="hidden sm:inline text-neutral-600">~/core</span>
          <span className="text-white">›</span>
          <span className="text-cyan-400">skill_matrix</span>
          <span className="text-neutral-300">.init()</span>
          <span className="cursor-blink w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5" />
        </div>
        <div className="flex items-end gap-5">
          <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">02.</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Technical</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Arsenal</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
        </div>
      </Reveal>

      {/* ── Main Panel: Stats + Rings ─────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 40 }} className="mb-8">
        <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
          <div className="grid lg:grid-cols-[200px_1fr]">

            {/* Left: bold stat column */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/[0.07] p-7 flex flex-row lg:flex-col justify-around lg:justify-center gap-6 lg:gap-8">
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="font-black text-3xl sm:text-4xl tabular-nums leading-none" style={{ color: s.color }}>
                    <CountUp to={s.to} suffix={s.suffix} />
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Right: category ring rows */}
            <div className="p-6 lg:p-8 space-y-7">
              {CATEGORIES.map((cat, idx) => (
                <Reveal key={cat.id} from={{ opacity: 0, x: 20 }} delay={idx * 0.07}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Category label */}
                    <div className="flex items-center gap-2.5 sm:w-36 flex-shrink-0">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: cat.hex, boxShadow: `0 0 8px ${cat.hex}` }}
                      />
                      <div className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 hidden sm:flex"
                        style={{ background: `${cat.hex}18`, borderColor: `${cat.hex}44` }}>
                        <cat.icon size={14} style={{ color: cat.hex }} />
                      </div>
                      <span className="font-mono text-[11px] tracking-wide whitespace-nowrap" style={{ color: cat.hex }}>
                        {cat.title}
                      </span>
                    </div>

                    {/* Thin separator */}
                    <div className="hidden sm:block flex-shrink-0 w-px h-8 bg-white/[0.07]" />

                    {/* Rings */}
                    <div className="flex items-center gap-5 flex-wrap">
                      {cat.skills.map(skill => (
                        <SkillRing key={skill.name} level={skill.level} hex={cat.hex} name={skill.name} />
                      ))}
                    </div>

                  </div>
                  {idx < CATEGORIES.length - 1 && (
                    <div className="mt-7 h-px bg-white/[0.05]" />
                  )}
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </Reveal>

      {/* ── Marquee ticker ───────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 20 }} className="mb-8 overflow-hidden">
        {/* Row A — forward */}
        <div className="relative overflow-hidden py-1 mb-1">
          <div className="mq-fwd flex gap-6 w-max">
            {[...MARQUEE_ROW_A, ...MARQUEE_ROW_A].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.hex, boxShadow: `0 0 6px ${item.hex}` }} />
                <span className="font-mono text-xs text-neutral-400 whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Row B — backward */}
        <div className="relative overflow-hidden py-1">
          <div className="mq-bwd flex gap-6 w-max">
            {[...MARQUEE_ROW_B, ...MARQUEE_ROW_B].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.hex, boxShadow: `0 0 6px ${item.hex}` }} />
                <span className="font-mono text-xs text-neutral-400 whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Expertise Tags ───────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 20 }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Also proficient in</span>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map((e, i) => (
            <Reveal key={e.text} from={{ opacity: 0, scale: 0.85 }} delay={i * 0.025}>
              <span className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border cursor-default transition-all duration-200 ${e.cls}`}>
                {e.text}
              </span>
            </Reveal>
          ))}
        </div>
      </Reveal>

    </div>
  </section>
)

export default Skills
