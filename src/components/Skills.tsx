"use client"

import { useRef, useEffect } from 'react'
import { Cloud, Server, Globe, Activity } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Reveal from '@/components/Reveal'

// ─── Animated fill bar ────────────────────────────────────────────────────────

function FillBar({ level, hex }: { level: number; hex: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    gsap.set(el, { scaleX: 0 })
    const tween = gsap.to(el, {
      scaleX: 1,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
    })
    return () => {
      tween.kill()
      ScrollTrigger.getAll().filter(st => st.trigger === el).forEach(st => st.kill())
    }
  }, [])

  return (
    <div className="relative h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
      <div
        ref={barRef}
        className="absolute inset-0 rounded-full"
        style={{
          width: `${level}%`,
          background: `linear-gradient(to right, ${hex}99, ${hex})`,
          boxShadow: `0 0 10px ${hex}66`,
          transformOrigin: 'left center',
        }}
      />
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'devops', num: '01', title: 'DevOps & Platform', icon: Cloud,
    hex: '#34d399',
    accentText: 'text-emerald-400',
    dimText: 'text-emerald-400/60',
    iconBg: 'bg-emerald-500/10 border-emerald-500/25',
    panelBg: 'bg-emerald-500/[0.04]',
    hoverGlow: 'rgba(52,211,153,0.18)',
    skills: [
      { name: 'Kubernetes',                  level: 85 },
      { name: 'Helm',                        level: 85 },
      { name: 'Docker',                      level: 90 },
      { name: 'CI/CD — GH Actions / Jenkins',level: 85 },
      { name: 'ArgoCD / GitOps',             level: 75 },
    ],
  },
  {
    id: 'backend', num: '02', title: 'Backend & Go', icon: Server,
    hex: '#c084fc',
    accentText: 'text-purple-400',
    dimText: 'text-purple-400/60',
    iconBg: 'bg-purple-500/10 border-purple-500/25',
    panelBg: 'bg-purple-500/[0.04]',
    hoverGlow: 'rgba(192,132,252,0.18)',
    skills: [
      { name: 'Go (Golang)',            level: 85 },
      { name: 'Node.js',                level: 90 },
      { name: 'gRPC / REST',            level: 85 },
      { name: 'GraphQL / WebSockets',   level: 80 },
      { name: 'TypeScript',             level: 85 },
    ],
  },
  {
    id: 'cloud', num: '03', title: 'Cloud & Infra', icon: Globe,
    hex: '#22d3ee',
    accentText: 'text-cyan-400',
    dimText: 'text-cyan-400/60',
    iconBg: 'bg-cyan-500/10 border-cyan-500/25',
    panelBg: 'bg-cyan-500/[0.04]',
    hoverGlow: 'rgba(34,211,238,0.18)',
    skills: [
      { name: 'AWS — EKS · EC2 · S3 · Lambda', level: 85 },
      { name: 'Terraform',                      level: 80 },
      { name: 'Linux / Bash',                   level: 90 },
      { name: 'PostgreSQL / MongoDB / Redis',   level: 85 },
      { name: 'Next.js / React',                level: 90 },
    ],
  },
  {
    id: 'observability', num: '04', title: 'Observability', icon: Activity,
    hex: '#fb923c',
    accentText: 'text-orange-400',
    dimText: 'text-orange-400/60',
    iconBg: 'bg-orange-500/10 border-orange-500/25',
    panelBg: 'bg-orange-500/[0.04]',
    hoverGlow: 'rgba(251,146,60,0.18)',
    skills: [
      { name: 'Jaeger — distributed tracing', level: 85 },
      { name: 'Prometheus',                   level: 85 },
      { name: 'Grafana',                      level: 80 },
      { name: 'OpenTelemetry / SPM',          level: 75 },
      { name: 'Alertmanager',                 level: 80 },
    ],
  },
]

const STATS = [
  { value: '20+', label: 'Skills',      colorClass: 'text-cyan-400',    borderClass: 'border-cyan-500/20',    bgClass: 'bg-cyan-500/[0.06]'    },
  { value: '4',   label: 'Domains',     colorClass: 'text-purple-400',  borderClass: 'border-purple-500/20',  bgClass: 'bg-purple-500/[0.06]'  },
  { value: '9+',  label: 'CNCF PRs',   colorClass: 'text-emerald-400', borderClass: 'border-emerald-500/20', bgClass: 'bg-emerald-500/[0.06]' },
  { value: '5yr', label: 'Experience',  colorClass: 'text-orange-400',  borderClass: 'border-orange-500/20',  bgClass: 'bg-orange-500/[0.06]'  },
]

const EXPERTISE = [
  { text: 'CNCF Contributor',     cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-400/55' },
  { text: 'Kubernetes Operators', cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-400/55' },
  { text: 'Cloud Native',         cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 hover:border-cyan-400/55' },
  { text: 'Go',                   cls: 'text-purple-300 border-purple-500/30 bg-purple-500/8 hover:bg-purple-500/15 hover:border-purple-400/55' },
  { text: 'Helm',                 cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-400/55' },
  { text: 'GitOps',               cls: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-400/55' },
  { text: 'Open Source',          cls: 'text-amber-300 border-amber-500/30 bg-amber-500/8 hover:bg-amber-500/15 hover:border-amber-400/55' },
  { text: 'CI/CD',                cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 hover:border-cyan-400/55' },
  { text: 'DevSecOps',            cls: 'text-purple-300 border-purple-500/30 bg-purple-500/8 hover:bg-purple-500/15 hover:border-purple-400/55' },
  { text: 'Microservices',        cls: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 hover:border-cyan-400/55' },
  { text: 'IaC / Terraform',      cls: 'text-orange-300 border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/15 hover:border-orange-400/55' },
  { text: 'Performance Tuning',   cls: 'text-orange-300 border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/15 hover:border-orange-400/55' },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="relative py-24 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 20%, #001a10 0%, #000c07 45%, #000 100%)' }}>

    {/* Background */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
      <div className="absolute top-0 right-1/3 w-[700px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[160px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[130px]" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[120px]" />
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

      {/* ── Stat Strip ───────────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 20 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {STATS.map(s => (
          <div key={s.label} className={`rounded-2xl border ${s.borderClass} ${s.bgClass} px-5 py-5 flex flex-col gap-1.5`}>
            <span className={`font-black text-3xl sm:text-4xl tabular-nums leading-none ${s.colorClass}`}>{s.value}</span>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </Reveal>

      {/* ── Skill Panels ─────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {CATEGORIES.map((cat, idx) => (
          <Reveal key={cat.id} from={{ opacity: 0, y: 35 }} delay={idx * 0.08}>
            <div
              className={`relative rounded-2xl border border-white/[0.07] ${cat.panelBg} overflow-hidden transition-all duration-300 p-6 hover:border-white/[0.13]`}
              style={{
                borderLeft: `2px solid ${cat.hex}`,
                boxShadow: `0 0 0 0 transparent`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px -15px ${cat.hoverGlow}` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 transparent` }}
            >
              {/* Ghost number */}
              <span
                aria-hidden="true"
                className="absolute -top-4 right-1 font-black text-[6.5rem] leading-none select-none pointer-events-none"
                style={{ color: `${cat.hex}0d` }}
              >
                {cat.num}
              </span>

              {/* Category header */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cat.iconBg}`}>
                  <cat.icon size={15} className={cat.accentText} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm tracking-wide ${cat.accentText}`}>{cat.title}</h3>
                  <p className="font-mono text-[10px] text-neutral-600 mt-0.5">{cat.skills.length} modules loaded</p>
                </div>
              </div>

              {/* Skill rows */}
              <div className="space-y-4 relative z-10">
                {cat.skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] text-neutral-300 font-medium leading-tight">{skill.name}</span>
                      <span className={`font-mono text-[11px] tabular-nums flex-shrink-0 ml-3 ${cat.dimText}`}>{skill.level}%</span>
                    </div>
                    <FillBar level={skill.level} hex={cat.hex} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Expertise Tags ───────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 20 }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Additional Expertise</span>
          <div className="h-px flex-1 bg-white/[0.07]" />
          <span className="font-mono text-[9px] text-neutral-600">{EXPERTISE.length} tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map(e => (
            <Reveal key={e.text} from={{ opacity: 0, scale: 0.88 }}>
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
