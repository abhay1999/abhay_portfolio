"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────────

type RingIdx = 0 | 1 | 2 | 3
type QuadIdx = 0 | 1 | 2 | 3

interface Blip {
  name: string
  quad: QuadIdx   // 0=Languages(TR)  1=Frameworks(BR)  2=Databases(BL)  3=Infrastructure(TL)
  ring: RingIdx   // 0=ADOPT  1=TRIAL  2=ASSESS  3=HOLD
  desc: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const CX = 265
const CY = 265
const RING_OUTER = [62, 118, 172, 224]   // outer radius of each ring
const RING_MID   = [36, 90, 145, 198]    // midpoint radius for blip placement
const QUAD_START = [5, 95, 185, 275]     // start angle of each quadrant (deg, clockwise from top)
const QUAD_SPAN  = 80                    // angular span per quadrant

const RING_LABELS  = ['ADOPT', 'TRIAL', 'ASSESS', 'HOLD'] as const
const QUAD_LABELS  = ['Languages', 'Frameworks', 'Databases', 'Infrastructure'] as const

// ─── Colors ───────────────────────────────────────────────────────────────────

const RING_CLR = [
  { fill: 'rgba(52,211,153,0.07)',  stroke: 'rgba(52,211,153,0.25)',  dot: '#34d399', badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-500/30', label: 'text-emerald-400' },
  { fill: 'rgba(34,211,238,0.06)',  stroke: 'rgba(34,211,238,0.22)',  dot: '#22d3ee', badge: 'bg-cyan-400/15 text-cyan-300 border-cyan-500/30',          label: 'text-cyan-400'    },
  { fill: 'rgba(251,191,36,0.05)',  stroke: 'rgba(251,191,36,0.20)',  dot: '#fbbf24', badge: 'bg-amber-400/15 text-amber-300 border-amber-500/30',       label: 'text-amber-400'   },
  { fill: 'rgba(148,163,184,0.04)', stroke: 'rgba(148,163,184,0.15)', dot: '#94a3b8', badge: 'bg-slate-400/15 text-slate-300 border-slate-500/30',       label: 'text-slate-400'   },
]

const QUAD_CLR = [
  { dot: '#a78bfa', label: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10', glow: 'rgba(167,139,250,0.4)' },
  { dot: '#22d3ee', label: 'text-cyan-400',   border: 'border-cyan-500/30',   bg: 'bg-cyan-500/10',   glow: 'rgba(34,211,238,0.4)'  },
  { dot: '#f472b6', label: 'text-pink-400',   border: 'border-pink-500/30',   bg: 'bg-pink-500/10',   glow: 'rgba(244,114,182,0.4)' },
  { dot: '#34d399', label: 'text-emerald-400',border: 'border-emerald-500/30',bg: 'bg-emerald-500/10',glow: 'rgba(52,211,153,0.4)'  },
]

// ─── Blip Data ────────────────────────────────────────────────────────────────

const BLIPS: Blip[] = [
  // ── Languages & Runtimes (Q0 = top-right) ──────────────────────────────────
  { name: 'Go',          quad: 0, ring: 0, desc: 'Primary systems language. Fast compile, simple concurrency — writing K8s operators and CLIs daily.' },
  { name: 'Python',      quad: 0, ring: 0, desc: 'Go-to for scripting, automation pipelines, and quick data work. Indispensable in DevOps toolchains.' },
  { name: 'TypeScript',  quad: 0, ring: 0, desc: 'Non-negotiable for large frontend codebases. Type safety catches bugs at compile-time, not runtime.' },
  { name: 'JavaScript',  quad: 0, ring: 1, desc: 'Still the runtime everywhere. Prefer TypeScript but JS remains the foundation of the web.' },
  { name: 'Bash',        quad: 0, ring: 1, desc: 'Unavoidable in DevOps. Write a lot of init scripts, CI helpers, and cluster bootstrap automation.' },
  { name: 'Rust',        quad: 0, ring: 2, desc: 'Exploring for systems-level tooling. Steep learning curve but zero-cost abstractions are compelling.' },

  // ── Frameworks & Tools (Q1 = bottom-right) ─────────────────────────────────
  { name: 'React',          quad: 1, ring: 0, desc: 'Component model just clicks. Building complex, interactive UIs is a joy with the React ecosystem.' },
  { name: 'Next.js',        quad: 1, ring: 0, desc: 'Full-stack React. App Router, SSR, static export, API routes — this portfolio is built on it.' },
  { name: 'Tailwind CSS',   quad: 1, ring: 0, desc: 'Utility-first CSS changed how I think about styling. Never going back to BEM or SCSS modules.' },
  { name: 'Node.js',        quad: 1, ring: 1, desc: 'Rapid REST APIs and build tooling. Express/Fastify for lightweight services.' },
  { name: 'Gin (Go)',       quad: 1, ring: 1, desc: 'Lightweight HTTP framework for Go. Minimal and fast — pairs well with Kubernetes microservices.' },
  { name: 'Framer Motion',  quad: 1, ring: 1, desc: 'Declarative animations in React. The spring physics feel natural and performant.' },
  { name: 'LangChain',      quad: 1, ring: 2, desc: 'LLM orchestration framework. Useful for chaining prompts but abstractions sometimes leak.' },

  // ── Databases & Storage (Q2 = bottom-left) ─────────────────────────────────
  { name: 'PostgreSQL', quad: 2, ring: 0, desc: 'Relational workloads. JSONB, full-text search, partitioning — production-ready and battle-tested.' },
  { name: 'Redis',      quad: 2, ring: 0, desc: 'Caching, sessions, pub/sub, rate limiting. Simple API, blazing fast. Reach for it often.' },
  { name: 'MongoDB',    quad: 2, ring: 0, desc: 'Flexible schemas for rapidly evolving data models. Atlas for managed, self-hosted for control.' },
  { name: 'ClickHouse', quad: 2, ring: 1, desc: 'OLAP at scale. Columnar storage makes analytics queries absurdly fast. Worth the learning curve.' },
  { name: 'Qdrant',     quad: 2, ring: 2, desc: 'Vector DB for embedding similarity search. Growing use-case with LLM-powered features.' },
  { name: 'MySQL',      quad: 2, ring: 3, desc: 'Legacy projects only. Prefer PostgreSQL for new work — better types, window functions, and JSON.' },

  // ── Infrastructure & DevOps (Q3 = top-left) ────────────────────────────────
  { name: 'Kubernetes',    quad: 3, ring: 0, desc: 'Daily driver. Building self-healing operators, custom controllers, and GitOps pipelines.' },
  { name: 'Docker',        quad: 3, ring: 0, desc: 'Core of every project. Multi-stage builds, distroless images, layer caching strategies.' },
  { name: 'AWS',           quad: 3, ring: 0, desc: 'EKS, EC2, S3, IAM, CloudWatch, RDS — production-grade setups at scale.' },
  { name: 'CI/CD',         quad: 3, ring: 0, desc: 'GitHub Actions and Jenkins. Automated pipelines for build, test, security scan, and deploy.' },
  { name: 'Helm',          quad: 3, ring: 1, desc: 'CNCF contributor. Packaging K8s applications, managing releases and upgrade strategies.' },
  { name: 'Terraform',     quad: 3, ring: 1, desc: 'Infrastructure as Code for AWS. Modules, remote state, workspaces — declarative is better.' },
  { name: 'Prometheus',    quad: 3, ring: 1, desc: 'Metrics and alerting stack. Writing custom Go exporters for the self-healing K8s platform.' },
  { name: 'Grafana',       quad: 3, ring: 1, desc: 'Dashboards for everything from K8s health to business metrics. Pairs perfectly with Prometheus.' },
  { name: 'ArgoCD',        quad: 3, ring: 2, desc: 'GitOps delivery for Kubernetes. Declarative app definitions, automated sync — evaluating deeply.' },
  { name: 'Istio',         quad: 3, ring: 2, desc: 'Service mesh. Powerful observability and mTLS but adds non-trivial operational overhead.' },
]

// ─── Placement ────────────────────────────────────────────────────────────────

function nameHash(name: string): number {
  return name.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0)
}

function svgCoords(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) }
}

function buildPositions(blips: Blip[]) {
  const groups: Map<string, Blip[]> = new Map()
  for (const b of blips) {
    const k = `${b.quad}-${b.ring}`
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k)!.push(b)
  }
  const positions: Record<string, { x: number; y: number }> = {}
  groups.forEach((group, k) => {
    const [q, r] = k.split('-').map(Number)
    const n = group.length
    const step = QUAD_SPAN / (n + 1)
    group.forEach((blip, i) => {
      const h = nameHash(blip.name)
      const angleJitter = ((h % 13) - 6) * 0.45
      const rJitter = ((h * 7) % 22) - 11
      const angle = QUAD_START[q] + step * (i + 1) + angleJitter
      const radius = RING_MID[r] + rJitter * 0.55
      positions[blip.name] = svgCoords(angle, Math.max(18, radius))
    })
  })
  return positions
}

// ─── Component ────────────────────────────────────────────────────────────────

const TechRadar = () => {
  const [hovered,    setHovered]    = useState<string | null>(null)
  const [activeRing, setActiveRing] = useState<number | null>(null)
  const [activeQuad, setActiveQuad] = useState<number | null>(null)

  const positions = useMemo(() => buildPositions(BLIPS), [])
  const hoveredBlip = hovered ? BLIPS.find(b => b.name === hovered) ?? null : null

  const isDimmed = (b: Blip) => {
    if (activeRing !== null && b.ring !== activeRing) return true
    if (activeQuad !== null && b.quad !== activeQuad) return true
    return false
  }

  // Quadrant label positions — midpoint angle, just outside outermost ring
  const quadLabelPos = QUAD_START.map(start => svgCoords(start + QUAD_SPAN / 2, 248))

  return (
    <section id="tech-radar" className="relative py-24 overflow-hidden bg-black">

      {/* ── Background ───────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(167,139,250,0.9) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,0.9) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[160px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/4 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/4 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-violet-400">$</span>
            <span className="text-neutral-400">radar</span>
            <span className="text-neutral-600">~/tech</span>
            <span className="text-white">›</span>
            <span className="text-violet-400">blips</span>
            <span className="text-neutral-300">.plot()</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
              className="w-1.5 h-3.5 bg-violet-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">08.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Tech</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Radar</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
          <p className="text-sm text-neutral-600 mt-3 font-mono">
            Inspired by <span className="text-violet-400">ThoughtWorks</span> · hover blips to read my take · {BLIPS.length} tools mapped
          </p>
        </motion.div>

        {/* ── Main layout ─────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── Radar SVG ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="bg-neutral-950/70 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/30 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[10px] text-neutral-500">tech_radar.svg — abhay@k8s-master</span>
              </div>
              <span className="font-mono text-[10px] text-violet-400">{BLIPS.length} blips</span>
            </div>

            <div className="p-4">
              <svg viewBox="0 0 530 530" className="w-full" style={{ maxHeight: '520px' }}>

                {/* ── Ring fills (back to front) ──────────────────────────── */}
                {[3, 2, 1, 0].map(ri => (
                  <circle key={ri} cx={CX} cy={CY} r={RING_OUTER[ri]}
                    fill={RING_CLR[ri].fill} stroke={RING_CLR[ri].stroke} strokeWidth="1" />
                ))}

                {/* ── Quadrant dividers ───────────────────────────────────── */}
                <line x1={CX} y1={CY - RING_OUTER[3] - 8} x2={CX} y2={CY + RING_OUTER[3] + 8} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1={CX - RING_OUTER[3] - 8} y1={CY} x2={CX + RING_OUTER[3] + 8} y2={CY} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* ── Ring labels (right side) ─────────────────────────────── */}
                {RING_OUTER.map((r, ri) => {
                  const prev = ri === 0 ? 0 : RING_OUTER[ri - 1]
                  const midR = (r + prev) / 2
                  return (
                    <text key={ri} x={CX + midR} y={CY + 4}
                      textAnchor="middle" fontSize="8" fontFamily="monospace"
                      fill={RING_CLR[ri].stroke} opacity="0.7" letterSpacing="1">
                      {RING_LABELS[ri]}
                    </text>
                  )
                })}

                {/* ── Quadrant labels ──────────────────────────────────────── */}
                {quadLabelPos.map((pos, qi) => (
                  <text key={qi} x={pos.x} y={pos.y}
                    textAnchor="middle" fontSize="9.5" fontFamily="monospace" fontWeight="600"
                    fill={QUAD_CLR[qi].dot} opacity="0.75" letterSpacing="0.5">
                    {QUAD_LABELS[qi].toUpperCase()}
                  </text>
                ))}

                {/* ── Center dot ──────────────────────────────────────────── */}
                <circle cx={CX} cy={CY} r="3" fill="rgba(255,255,255,0.2)" />

                {/* ── Blips ───────────────────────────────────────────────── */}
                {BLIPS.map((blip, i) => {
                  const pos = positions[blip.name]
                  if (!pos) return null
                  const isHov  = hovered === blip.name
                  const dimmed = isDimmed(blip)
                  const col    = QUAD_CLR[blip.quad].dot

                  return (
                    <g key={blip.name}
                      onMouseEnter={() => setHovered(blip.name)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Glow halo on hover */}
                      {isHov && (
                        <motion.circle cx={pos.x} cy={pos.y} r={14}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 0.25, scale: 1 }}
                          fill={col} />
                      )}
                      {/* Pulse ring */}
                      {isHov && (
                        <motion.circle cx={pos.x} cy={pos.y} r={10}
                          fill="none" stroke={col} strokeWidth="1"
                          initial={{ opacity: 0.8, scale: 0.8 }}
                          animate={{ opacity: 0, scale: 2 }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                      {/* Main dot */}
                      <motion.circle
                        cx={pos.x} cy={pos.y}
                        r={isHov ? 7 : 5}
                        fill={col}
                        opacity={dimmed ? 0.12 : isHov ? 1 : 0.85}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: dimmed ? 0.12 : isHov ? 1 : 0.85 }}
                        transition={{ duration: 0.4, delay: i * 0.025, type: 'spring', stiffness: 200 }}
                        filter={isHov ? `drop-shadow(0 0 6px ${QUAD_CLR[blip.quad].glow})` : undefined}
                      />
                      {/* Label on hover */}
                      {isHov && (
                        <motion.text x={pos.x} y={pos.y - 11}
                          textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700"
                          fill={col} initial={{ opacity: 0, y: pos.y - 8 }} animate={{ opacity: 1, y: pos.y - 11 }}
                        >
                          {blip.name}
                        </motion.text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </motion.div>

          {/* ── Right panel ───────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="px-4 py-2.5 bg-black/30 border-b border-white/[0.06] font-mono text-[10px] text-neutral-500 flex items-center justify-between">
                <span>blip_info.log</span>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.9)]" />
              </div>

              <div className="p-4 min-h-[160px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {hoveredBlip ? (
                    <motion.div key={hoveredBlip.name}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`text-base font-bold ${QUAD_CLR[hoveredBlip.quad].label}`}>
                          {hoveredBlip.name}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${RING_CLR[hoveredBlip.ring].badge}`}>
                          {RING_LABELS[hoveredBlip.ring]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: QUAD_CLR[hoveredBlip.quad].dot }} />
                        <span className={`font-mono text-[10px] ${QUAD_CLR[hoveredBlip.quad].label}`}>
                          {QUAD_LABELS[hoveredBlip.quad]}
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-400 leading-relaxed">{hoveredBlip.desc}</p>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
                        <div className="w-2 h-2 rounded-full bg-violet-400" />
                      </div>
                      <p className="font-mono text-[11px] text-neutral-600">Hover a blip to see details</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Ring filter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="px-4 py-2.5 bg-black/30 border-b border-white/[0.06] font-mono text-[10px] text-neutral-500">
                filter by ring
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {RING_LABELS.map((label, ri) => (
                  <button key={label}
                    onClick={() => setActiveRing(activeRing === ri ? null : ri)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150 text-left
                      ${activeRing === ri
                        ? `${RING_CLR[ri].badge} border-opacity-60`
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                      }`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: RING_CLR[ri].dot }} />
                    <span className={`font-mono text-[10px] font-bold ${activeRing === ri ? '' : 'text-neutral-400'}`}>{label}</span>
                    <span className="font-mono text-[9px] text-neutral-700 ml-auto">
                      {BLIPS.filter(b => b.ring === ri).length}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quadrant filter */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="px-4 py-2.5 bg-black/30 border-b border-white/[0.06] font-mono text-[10px] text-neutral-500">
                filter by quadrant
              </div>
              <div className="p-3 space-y-2">
                {QUAD_LABELS.map((label, qi) => (
                  <button key={label}
                    onClick={() => setActiveQuad(activeQuad === qi ? null : qi)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150
                      ${activeQuad === qi
                        ? `${QUAD_CLR[qi].bg} ${QUAD_CLR[qi].border} border-opacity-60`
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                      }`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: QUAD_CLR[qi].dot }} />
                    <span className={`font-mono text-[10px] font-bold ${activeQuad === qi ? QUAD_CLR[qi].label : 'text-neutral-400'}`}>
                      {label.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] text-neutral-700 ml-auto">
                      {BLIPS.filter(b => b.quad === qi).length} tools
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Blip list ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 bg-neutral-950/70 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="px-5 py-3 bg-black/30 border-b border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500">all_blips.index</span>
            <span className="font-mono text-[10px] text-neutral-600">{BLIPS.length} entries</span>
          </div>
          <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUAD_LABELS.map((qlabel, qi) => (
              <div key={qlabel}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: QUAD_CLR[qi].dot }} />
                  <span className={`font-mono text-[10px] font-bold ${QUAD_CLR[qi].label}`}>{qlabel.toUpperCase()}</span>
                </div>
                <div className="space-y-1.5">
                  {BLIPS.filter(b => b.quad === qi).map(b => (
                    <button
                      key={b.name}
                      onMouseEnter={() => setHovered(b.name)}
                      onMouseLeave={() => setHovered(null)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg
                        bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors text-left
                        ${hovered === b.name ? 'border-white/15 bg-white/[0.04]' : ''}`}
                    >
                      <span className="font-mono text-[11px] text-neutral-300 truncate">{b.name}</span>
                      <span className={`font-mono text-[9px] flex-shrink-0 ${RING_CLR[b.ring].label}`}>
                        {RING_LABELS[b.ring].slice(0, 3)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default TechRadar
