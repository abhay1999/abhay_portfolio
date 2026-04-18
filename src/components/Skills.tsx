"use client"

import { useRef, useEffect } from 'react'
import { Cloud, Server, Globe, Activity, Box } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Reveal from '@/components/Reveal'

// ─── React atom logo ─────────────────────────────────────────────────────────

function ReactIcon({ size = 20, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="46" ry="16" stroke="currentColor" strokeWidth="4.5" />
      <ellipse cx="50" cy="50" rx="46" ry="16" stroke="currentColor" strokeWidth="4.5" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="46" ry="16" stroke="currentColor" strokeWidth="4.5" transform="rotate(120 50 50)" />
    </svg>
  )
}

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
    <Reveal from={{ opacity: 0, y: 20 }} delay={delay} className="group relative h-full flex rounded-2xl p-[1px] overflow-hidden">
      
      {/* Glowing rotating border background (revealed on hover) */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden rounded-2xl">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] animate-spin"
          style={{ 
            animationDuration: '4s', 
            backgroundImage: `conic-gradient(from 0deg, transparent 0%, transparent 60%, ${cap.hex} 100%)` 
          }} 
        />
      </div>

      {/* Default static border */}
      <div className="absolute inset-0 z-0 border border-white/10 rounded-2xl group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />

      {/* Inner Card */}
      <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-7 rounded-[15px] bg-[#050505] transition-colors duration-500">
        
        {/* Soft background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[15px] pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${cap.hex}15, transparent)` }} />

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-500 relative z-10" style={{ background: `${cap.hex}10`, borderColor: `${cap.hex}25` }}>
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
        <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-1 relative z-10">
          {cap.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mt-auto relative z-10">
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
    id: 'frontend', title: 'Frontend Delivery', icon: ReactIcon,
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
  { text: 'React', hex: '#61dafb' },      { text: 'Node.js', hex: '#c084fc' },
  { text: 'gRPC', hex: '#c084fc' },       { text: 'TypeScript', hex: '#c084fc' },
  { text: 'GraphQL', hex: '#c084fc' },
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

// ─── 3D Skill Ring ────────────────────────────────────────────────────────────

function SkillRing() {
  const ringRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!ringRef.current) return
    const tween = gsap.to(ringRef.current, {
      rotationY: -360,
      duration: 40,
      repeat: -1,
      ease: 'none'
    })
    return () => { tween.kill() }
  }, [])

  const items = [...MARQUEE_ROW_A, ...MARQUEE_ROW_B]
  const radius = 340 // Pixels to push items outwards

  return (
    <div className="relative w-full h-[160px] md:h-[200px] flex items-center justify-center overflow-hidden mb-12 rounded-[2rem] border border-white/[0.05] bg-black/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" style={{ perspective: '1200px' }}>
      
      {/* 3D ambient glows inside the box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-emerald-500/[0.06] rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[80px] bg-cyan-500/[0.06] rounded-full blur-[50px] pointer-events-none" />

      {/* Fade masks for depth masking the edges */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#000b06] via-[#000b06]/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#000b06] via-[#000b06]/60 to-transparent z-10 pointer-events-none" />

      <div 
        className="w-full h-full flex items-center justify-center" 
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-8deg)' }} 
      >
        <div ref={ringRef} className="relative w-0 h-0 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, i) => {
            const angle = (i / items.length) * 360
            return (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2 flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/[0.12] bg-neutral-900/80 backdrop-blur-md shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] transition-colors hover:bg-black hover:border-white/[0.2] group cursor-default"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${item.hex}, transparent)` }} />
                <span className="w-2 h-2 rounded-full relative z-10" style={{ background: item.hex, boxShadow: `0 0 12px ${item.hex}` }} />
                <span className="font-mono text-[13px] text-neutral-300 font-bold whitespace-nowrap relative z-10 group-hover:text-white transition-colors">{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="relative py-32 md:py-48 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 20%, #001a10 0%, #000c07 45%, #000 100%)' }}>



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

      {/* ── 3D Skill Ring ────────────────────────────────────────────────── */}
      <Reveal from={{ opacity: 0, scale: 0.95, y: 30 }} className="mb-4 relative z-10">
        <SkillRing />
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
