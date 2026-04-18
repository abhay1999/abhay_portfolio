"use client"

import { useRef, useEffect } from 'react'
import { Cloud, Server, Globe, Activity, Box, Layout } from 'lucide-react'
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

// ─── Capability Card ──────────────────────────────────────────────────────────

function CapabilityCard({ cap, delay }: { cap: any, delay: number }) {
  return (
    <Reveal from={{ opacity: 0, y: 20 }} delay={delay} className="group relative h-full flex">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${cap.hex}15, transparent)` }} />
      <div className="relative h-full w-full flex flex-col p-6 md:p-7 rounded-2xl border border-white/[0.08] bg-black/20 group-hover:bg-black/40 group-hover:border-white/[0.15] transition-all duration-500">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500" style={{ background: `${cap.hex}10`, borderColor: `${cap.hex}25` }}>
            <cap.icon size={20} style={{ color: cap.hex }} />
          </div>
          <h3 
            className="font-bold text-lg tracking-wide relative z-10 text-white transition-all duration-300"
          >
            {/* Base Text */}
            <span>{cap.title}</span>
            {/* Hover Gradient Text overlay */}
            <span 
              className="absolute inset-0 text-transparent bg-clip-text opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: `linear-gradient(to right, #fff, ${cap.hex})` }}
              aria-hidden="true"
            >
              {cap.title}
            </span>
          </h3>
        </div>

        {/* Content */}
        <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-1">
          {cap.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {cap.tools.map((tool: string) => (
            <span key={tool} className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.03] border border-white/[0.05] text-neutral-300">
              {tool}
            </span>
          ))}
        </div>

      </div>
    </Reveal>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    id: 'platform', title: 'Platform Engineering', icon: Box,
    description: 'Builds internal tooling, Kubernetes workflows, CI/CD systems, and developer platforms.',
    hex: '#34d399', tools: ['Kubernetes', 'ArgoCD', 'CI/CD Pipelines']
  },
  {
    id: 'cloud-devops', title: 'Cloud & DevOps', icon: Cloud,
    description: 'Designs and provisions scalable infrastructure with AWS, Docker, Helm, Terraform, and full-stack observability.',
    hex: '#22d3ee', tools: ['AWS', 'Docker', 'Helm', 'Terraform', 'Observability']
  },
  {
    id: 'backend', title: 'Go & Backend', icon: Server,
    description: 'Develops high-throughput microservices utilizing Go, robust APIs, gRPC, and sophisticated CLI tooling.',
    hex: '#c084fc', tools: ['Go', 'APIs', 'gRPC', 'CLI Tooling']
  },
  {
    id: 'frontend', title: 'Frontend Delivery', icon: Layout,
    description: 'Crafts responsive user interfaces and engaging product experiences utilizing React and Next.js.',
    hex: '#fb923c', tools: ['React', 'Next.js', 'Product Interfaces']
  },
]

const STATS = [
  { to: 20, suffix: '+',  label: 'Skills',      color: '#22d3ee' },
  { to: 4,  suffix: '',   label: 'Domains',      color: '#c084fc' },
  { to: 9,  suffix: '+',  label: 'CNCF PRs',    color: '#34d399' },
  { to: 2,  suffix: 'yr', label: 'Experience',   color: '#fb923c' },
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
  <section id="skills" className="relative py-32 md:py-48 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 20%, #001a10 0%, #000c07 45%, #000 100%)' }}>

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[160px]" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.02] blur-[130px]" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[120px]" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* ── Section Header ───────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 30 }} className="mb-12">
        <div className="flex items-end gap-5">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Technical</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Arsenal</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
        </div>
      </Reveal>

      {/* ── Main Panel: Stats + Capabilities ─────────────────────────────── */}
      <Reveal from={{ opacity: 0, y: 40 }} className="mb-12">
        <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-[200px_1fr]">

            {/* Left: bold stat column */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/[0.07] p-7 flex flex-row lg:flex-col justify-around lg:justify-center gap-6 lg:gap-8 bg-black/20">
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col gap-1 text-center lg:text-left">
                  <span className="font-black text-3xl sm:text-4xl tabular-nums leading-none" style={{ color: s.color }}>
                    <CountUp to={s.to} suffix={s.suffix} />
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mt-1">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Right: Capability Grid */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-5 w-full">
              {CAPABILITIES.map((cap, idx) => (
                <CapabilityCard key={cap.id} cap={cap} delay={idx * 0.1} />
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
