"use client"

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Cloud, Server, Globe, Activity, Cpu } from 'lucide-react'

// ─── TiltCard ─────────────────────────────────────────────────────────────────

const TiltCard = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 120, damping: 18 })
  const sy = useSpring(y, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg'])

  return (
    <motion.div
      ref={ref}
      onMouseMove={e => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      className={className}
    >
      <div style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: 'translateZ(35px)' }}
      />
    </motion.div>
  )
}

// ─── Dot Matrix Skill Indicator ───────────────────────────────────────────────

const DotMatrix = ({ level, dotClass }: { level: number; dotClass: string }) => {
  const filled = Math.round(level / 10)
  return (
    <div className="flex gap-[3px] items-center" aria-label={`${level}%`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 * i, duration: 0.25 }}
          className={`w-[5px] h-[5px] rounded-[2px] ${i < filled ? dotClass : 'bg-white/10 border border-white/5'}`}
        />
      ))}
    </div>
  )
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'devops',
    num: '01',
    title: 'DevOps',
    icon: Cloud,
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/25',
    bgClass: 'bg-emerald-500/5',
    iconBgClass: 'bg-emerald-500/10 border-emerald-500/20',
    numClass: 'text-emerald-500/8',
    dotClass: 'bg-emerald-400 shadow-[0_0_4px_1px_rgba(52,211,153,0.55)]',
    arrowClass: 'text-emerald-400/60',
    pctClass: 'text-emerald-400',
    boxShadow: '0 0 45px -18px rgba(16,185,129,0.28)',
    skills: [
      { name: 'Kubernetes',   level: 85 },
      { name: 'Helm',         level: 85 },
      { name: 'Docker',       level: 90 },
      { name: 'CI/CD (GitHub Actions / Jenkins)', level: 85 },
      { name: 'ArgoCD / GitOps', level: 75 },
    ],
  },
  {
    id: 'backend',
    num: '02',
    title: 'Backend & Go',
    icon: Server,
    accentClass: 'text-purple-400',
    borderClass: 'border-purple-500/25',
    bgClass: 'bg-purple-500/5',
    iconBgClass: 'bg-purple-500/10 border-purple-500/20',
    numClass: 'text-purple-500/8',
    dotClass: 'bg-purple-400 shadow-[0_0_4px_1px_rgba(192,132,252,0.55)]',
    arrowClass: 'text-purple-400/60',
    pctClass: 'text-purple-400',
    boxShadow: '0 0 45px -18px rgba(168,85,247,0.28)',
    skills: [
      { name: 'Go (Golang)',  level: 85 },
      { name: 'Node.js',      level: 90 },
      { name: 'gRPC / REST',  level: 85 },
      { name: 'GraphQL / WebSockets', level: 80 },
      { name: 'TypeScript',   level: 85 },
    ],
  },
  {
    id: 'cloud',
    num: '03',
    title: 'Cloud & Infra',
    icon: Globe,
    accentClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/25',
    bgClass: 'bg-cyan-500/5',
    iconBgClass: 'bg-cyan-500/10 border-cyan-500/20',
    numClass: 'text-cyan-500/8',
    dotClass: 'bg-cyan-400 shadow-[0_0_4px_1px_rgba(34,211,238,0.55)]',
    arrowClass: 'text-cyan-400/60',
    pctClass: 'text-cyan-400',
    boxShadow: '0 0 45px -18px rgba(34,211,238,0.28)',
    skills: [
      { name: 'AWS (EKS · EC2 · S3 · Lambda)', level: 85 },
      { name: 'Terraform',    level: 80 },
      { name: 'Linux / Bash', level: 90 },
      { name: 'PostgreSQL / MongoDB / Redis', level: 85 },
      { name: 'Next.js / React', level: 90 },
    ],
  },
  {
    id: 'observability',
    num: '04',
    title: 'Observability',
    icon: Activity,
    accentClass: 'text-orange-400',
    borderClass: 'border-orange-500/25',
    bgClass: 'bg-orange-500/5',
    iconBgClass: 'bg-orange-500/10 border-orange-500/20',
    numClass: 'text-orange-500/8',
    dotClass: 'bg-orange-400 shadow-[0_0_4px_1px_rgba(251,146,60,0.55)]',
    arrowClass: 'text-orange-400/60',
    pctClass: 'text-orange-400',
    boxShadow: '0 0 45px -18px rgba(251,146,60,0.28)',
    skills: [
      { name: 'Jaeger (distributed tracing)', level: 85 },
      { name: 'Prometheus',   level: 85 },
      { name: 'Grafana',      level: 80 },
      { name: 'OpenTelemetry / SPM', level: 75 },
      { name: 'Alertmanager', level: 80 },
    ],
  },
]

const CORE_MODULES = [
  { label: 'DevOps',         dotClass: 'bg-emerald-400', glowClass: 'shadow-[0_0_7px_rgba(52,211,153,0.8)]',  count: '5 skills' },
  { label: 'Backend & Go',   dotClass: 'bg-purple-400',  glowClass: 'shadow-[0_0_7px_rgba(192,132,252,0.8)]', count: '5 skills' },
  { label: 'Cloud & Infra',  dotClass: 'bg-cyan-400',    glowClass: 'shadow-[0_0_7px_rgba(34,211,238,0.8)]',  count: '5 skills' },
  { label: 'Observability',  dotClass: 'bg-orange-400',  glowClass: 'shadow-[0_0_7px_rgba(251,146,60,0.8)]',  count: '5 skills' },
]

const BADGES = [
  { text: 'CNCF Contributor',     rx: 5,  ry: -8 },
  { text: 'Kubernetes Operators', rx: -7, ry: 4  },
  { text: 'Cloud Native',         rx: 3,  ry: 9  },
  { text: 'Go',                   rx: -5, ry: -6 },
  { text: 'Helm',                 rx: 8,  ry: 3  },
  { text: 'GitOps',               rx: -4, ry: 7  },
  { text: 'Open Source',          rx: 6,  ry: -5 },
  { text: 'CI/CD',                rx: -8, ry: 2  },
  { text: 'DevSecOps',            rx: 4,  ry: 8  },
  { text: 'Microservices',        rx: -6, ry: -3 },
  { text: 'IaC / Terraform',      rx: 7,  ry: -9 },
  { text: 'Performance Tuning',   rx: -3, ry: 6  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Skills = () => {
  return (
    <section id="skills" className="relative py-20 overflow-hidden bg-black">

      {/* ── Background System ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(34,211,238,0.8) 1px, transparent 1px),linear-gradient(90deg, rgba(34,211,238,0.8) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[55%] opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.9) 1px, transparent 1px),linear-gradient(to bottom, rgba(139,92,246,0.9) 1px, transparent 1px)`,
            backgroundSize: '56px 56px',
            transform: 'perspective(700px) rotateX(58deg) translateY(18%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
          }}
        />
        <div className="absolute top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent">
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
            className="absolute top-0 left-0 w-36 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
        <div className="absolute top-[72%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent">
          <motion.div animate={{ x: ['200%', '-100%'] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            className="absolute top-0 left-0 w-36 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>
        <div className="absolute top-0 left-[20%] h-full w-px bg-gradient-to-b from-transparent via-emerald-500/12 to-transparent">
          <motion.div animate={{ y: ['-100%', '200%'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent" />
        </div>
        <div className="absolute top-0 right-[20%] h-full w-px bg-gradient-to-b from-transparent via-orange-500/12 to-transparent">
          <motion.div animate={{ y: ['200%', '-100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            className="absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent" />
        </div>
        <div className="absolute top-[25%] left-[20%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.55)]" />
        <div className="absolute top-[25%] right-[20%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_12px_3px_rgba(251,146,60,0.55)]" />
        <div className="absolute top-[72%] left-[20%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.55)]" />
        <div className="absolute top-[72%] right-[20%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_3px_rgba(192,132,252,0.55)]" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/6 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/6 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">sys</span>
            <span className="text-neutral-600">~/core</span>
            <span className="text-white">›</span>
            <span className="text-cyan-400">skill_matrix</span>
            <span className="text-neutral-300">.init()</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5"
            />
          </div>
          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">02.</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Technical</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Arsenal</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </motion.div>

        {/* ── Skill Matrix Core Panel ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative bg-neutral-950/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <motion.div
              animate={{ y: ['-100%', '400%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none z-20"
            />
            {/* macOS title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-black/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[10px] text-neutral-400 tracking-wide">
                  skill_matrix.core — NEURAL INTERFACE v2.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                />
                <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
              </div>
            </div>

            {/* Core content */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] divide-y lg:divide-y-0 lg:divide-x divide-white/8">

              {/* Left — system stats */}
              <div className="p-5 grid grid-cols-2 gap-2.5">
                {[
                  { label: 'TOTAL SKILLS', value: '20', unit: 'modules',          colorClass: 'text-cyan-400'    },
                  { label: 'DOMAINS',      value: '04', unit: 'categories',       colorClass: 'text-purple-400'  },
                  { label: 'CNCF PRs',     value: '6+', unit: 'merged',           colorClass: 'text-emerald-400' },
                  { label: 'FOCUS',        value: 'K8s', unit: 'cloud native',    colorClass: 'text-orange-400'  },
                ].map(stat => (
                  <div key={stat.label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`font-black text-xl ${stat.colorClass}`}>{stat.value}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">{stat.unit}</p>
                  </div>
                ))}
              </div>

              {/* Center — radar orb */}
              <div className="flex items-center justify-center py-6 px-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-cyan-500/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_7px_2px_rgba(34,211,238,0.6)]" />
                  </motion.div>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-4 rounded-full border border-purple-500/30">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]" />
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-9 rounded-full border border-orange-500/40">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_2px_rgba(251,146,60,0.8)]" />
                  </motion.div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true" className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-px h-1/2"
                      style={{ background: 'linear-gradient(to top, rgba(34,211,238,0.45), transparent)', transformOrigin: 'bottom center' }} />
                  </motion.div>
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], boxShadow: ['0 0 20px rgba(34,211,238,0.15)', '0 0 40px rgba(34,211,238,0.35)', '0 0 20px rgba(34,211,238,0.15)'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/25 to-purple-500/25 border border-white/20 flex items-center justify-center"
                    >
                      <Cpu size={18} className="text-white/90" />
                    </motion.div>
                    <span className="font-mono text-[9px] text-neutral-500 mt-1.5 tracking-widest">CORE</span>
                  </div>
                </div>
              </div>

              {/* Right — active modules */}
              <div className="p-5">
                <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-3">Active Modules</p>
                <div className="space-y-2">
                  {CORE_MODULES.map(mod => (
                    <div key={mod.label} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${mod.dotClass} ${mod.glowClass}`} />
                        <span className="font-mono text-xs text-neutral-300">{mod.label}</span>
                      </div>
                      <span className="font-mono text-[9px] text-neutral-600">{mod.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="font-mono text-[9px] text-neutral-600 mb-1">SYS_STATUS</p>
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                    <span className="font-mono text-[10px] text-emerald-400">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Skill Category TiltCards ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 mb-8 [perspective:1200px]">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
              className="group [perspective:900px]"
            >
              <TiltCard
                className={`relative rounded-2xl bg-neutral-950/65 backdrop-blur-xl border ${cat.borderClass} p-5 h-full flex flex-col overflow-hidden`}
                style={{ boxShadow: cat.boxShadow }}
              >
                {/* Ghost number */}
                <span
                  aria-hidden="true"
                  className={`absolute top-2 right-3 font-black text-[5rem] leading-none select-none ${cat.numClass} pointer-events-none`}
                  style={{ transform: 'translateZ(-8px)' }}
                >
                  {cat.num}
                </span>

                {/* Card header */}
                <div className="flex items-center gap-3 mb-4" style={{ transform: 'translateZ(18px)' }}>
                  <div className={`w-10 h-10 rounded-xl ${cat.iconBgClass} border flex items-center justify-center flex-shrink-0`}>
                    <cat.icon size={18} className={cat.accentClass} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${cat.accentClass} leading-tight`}>{cat.title}</h3>
                    <p className="font-mono text-[10px] text-neutral-600 mt-0.5">{cat.skills.length} modules loaded</p>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-white/10 mb-4" style={{ transform: 'translateZ(5px)' }} />

                {/* Skills with dot matrix */}
                <div className="space-y-3 flex-1" style={{ transform: 'translateZ(12px)' }}>
                  {cat.skills.map(skill => (
                    <div key={skill.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-mono text-[11px] ${cat.arrowClass} flex-shrink-0`}>›</span>
                        <span className="text-sm text-neutral-300 font-medium truncate">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <DotMatrix level={skill.level} dotClass={cat.dotClass} />
                        <span className={`font-mono text-[10px] ${cat.pctClass} w-8 text-right tabular-nums`}>
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* ── Tech Badge Cloud ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Additional Expertise</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="font-mono text-[9px] text-neutral-600">{BADGES.length} tags</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 [perspective:1000px]">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                whileHover={{ scale: 1.1, rotateX: badge.rx, rotateY: badge.ry, z: 45 }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 border border-white/10 bg-gradient-to-b from-neutral-800/25 to-neutral-900/60 backdrop-blur-xl shadow-lg hover:text-white hover:border-white/25 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] cursor-pointer [transform-style:preserve-3d] transition-colors duration-200"
              >
                <span style={{ transform: 'translateZ(9px)', display: 'block' }}>{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Skills
