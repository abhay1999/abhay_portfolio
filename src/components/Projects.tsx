"use client"

import { useState, useEffect, useRef } from 'react'
import { ExternalLink, ArrowUpRight, Star, GitFork, BookOpen, ChevronRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Reveal from '@/components/Reveal'
import TiltCard from '@/components/TiltCard'

// ─── Animated metric value ────────────────────────────────────────────────────

function AnimatedMetric({ value, className }: { value: string; className: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const obj = useRef({ val: 0 })
  const match = value.match(/^(\d[\d,]*)([+%]?)$/)

  useEffect(() => {
    if (!match) return
    const el = ref.current
    if (!el) return
    const [, numStr, suffix] = match
    const target = parseInt(numStr.replace(/,/g, ''), 10)
    const tween = gsap.fromTo(obj.current, { val: 0 }, {
      val: target, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        if (!el) return
        const v = Math.round(obj.current.val)
        el.textContent = (v >= 1000 ? v.toLocaleString() : String(v)) + suffix
      },
    })
    return () => { tween.kill(); ScrollTrigger.getAll().filter(s => s.trigger === el).forEach(s => s.kill()) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span ref={ref} className={className}>{value}</span>
}

// ─── Metric strip ─────────────────────────────────────────────────────────────

function MetricStrip({ metrics, metricClass }: {
  metrics: Array<{ value: string; label: string }>
  metricClass: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cells = el.querySelectorAll<HTMLElement>('.m-cell')
    gsap.set(cells, { opacity: 0, y: 10 })
    const tween = gsap.to(cells, {
      opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
    return () => { tween.kill(); ScrollTrigger.getAll().filter(s => s.trigger === el).forEach(s => s.kill()) }
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.07]">
      {metrics.map((m, i) => (
        <div key={i} className="m-cell flex flex-col items-center py-3.5 px-2 bg-white/[0.015]">
          <AnimatedMetric value={m.value} className={`font-black text-[22px] leading-none tabular-nums ${metricClass}`} />
          <span className="font-mono text-[8.5px] text-neutral-600 uppercase tracking-widest mt-1 text-center leading-tight">{m.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const GithubIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

// ─── Architecture Diagrams ────────────────────────────────────────────────────

function DiagramK8sHealing({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 280 118" fill="none" className="w-full h-full">
      <defs><marker id="arr-k8s" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill={c} fillOpacity={0.55} /></marker></defs>
      <line x1="88" y1="52" x2="113" y2="52" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-k8s)" />
      <line x1="169" y1="52" x2="194" y2="52" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-k8s)" />
      <line x1="141" y1="86" x2="141" y2="70" stroke={c} strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-k8s)" />
      <ellipse cx="141" cy="52" rx="32" ry="21" fill={c} fillOpacity={0.08} />
      <rect x="8" y="39" width="80" height="26" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.22} strokeWidth={1} />
      <text x="48" y="50" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight="600" fill="#fca5a5">CrashLoop</text>
      <text x="48" y="61" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">pod · restart↑</text>
      <rect x="113" y="36" width="56" height="32" rx="5" fill={c} fillOpacity={0.14} stroke={c} strokeOpacity={0.72} strokeWidth={1.5} />
      <text x="141" y="49" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>Operator</text>
      <text x="141" y="61" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#d1d5db">Go · ctrl-rt</text>
      <rect x="194" y="39" width="78" height="26" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.18} strokeWidth={1} />
      <text x="233" y="50" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight="600" fill="#86efac">Auto-Healed</text>
      <text x="233" y="61" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">pod · Running</text>
      <rect x="93" y="86" width="96" height="22" rx="4" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.13} strokeWidth={1} />
      <text x="141" y="96" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#9ca3af">Prometheus</text>
      <text x="141" y="105" textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#4b5563">alert webhook trigger</text>
    </svg>
  )
}

function DiagramDevEnv({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 280 118" fill="none" className="w-full h-full">
      <defs><marker id="arr-dev" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill={c} fillOpacity={0.55} /></marker></defs>
      <line x1="90" y1="59" x2="115" y2="59" stroke={c} strokeOpacity={0.5} strokeWidth={1} markerEnd="url(#arr-dev)" />
      <line x1="171" y1="48" x2="196" y2="33" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-dev)" />
      <line x1="171" y1="59" x2="196" y2="59" stroke={c} strokeOpacity={0.3} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-dev)" />
      <line x1="171" y1="70" x2="196" y2="84" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-dev)" />
      <ellipse cx="143" cy="59" rx="32" ry="21" fill={c} fillOpacity={0.08} />
      <rect x="8" y="46" width="82" height="26" rx="4" fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.28} strokeWidth={1} />
      <text x="49" y="57" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>devenv CLI</text>
      <text x="49" y="68" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">cobra · client-go</text>
      <rect x="115" y="43" width="56" height="32" rx="5" fill={c} fillOpacity={0.15} stroke={c} strokeOpacity={0.72} strokeWidth={1.5} />
      <text x="143" y="56" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>K8s NS</text>
      <text x="143" y="68" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#d1d5db">isolated</text>
      <rect x="196" y="20" width="76" height="22" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.2} strokeWidth={1} />
      <text x="234" y="31" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#d1d5db">App Pod</text>
      <text x="234" y="39" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">:8080 ready</text>
      <rect x="196" y="48" width="76" height="22" rx="4" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.13} strokeWidth={1} />
      <text x="234" y="58" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#9ca3af">port-forward</text>
      <text x="234" y="67" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#4b5563">:5432  :8080</text>
      <rect x="196" y="76" width="76" height="22" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.2} strokeWidth={1} />
      <text x="234" y="87" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#d1d5db">DB Pod</text>
      <text x="234" y="95" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">PG / Mongo</text>
    </svg>
  )
}

function DiagramPortfolio({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 280 118" fill="none" className="w-full h-full">
      <defs><marker id="arr-pf" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill={c} fillOpacity={0.55} /></marker></defs>
      <line x1="92" y1="43" x2="116" y2="54" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-pf)" />
      <line x1="92" y1="79" x2="116" y2="68" stroke={c} strokeOpacity={0.32} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-pf)" />
      <line x1="178" y1="54" x2="200" y2="43" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-pf)" />
      <line x1="178" y1="66" x2="200" y2="79" stroke={c} strokeOpacity={0.35} strokeWidth={1} markerEnd="url(#arr-pf)" />
      <ellipse cx="147" cy="60" rx="35" ry="22" fill={c} fillOpacity={0.08} />
      <rect x="8" y="30" width="84" height="26" rx="4" fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.28} strokeWidth={1} />
      <text x="50" y="41" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>Next.js 14</text>
      <text x="50" y="52" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">TypeScript · GSAP</text>
      <rect x="8" y="66" width="84" height="26" rx="4" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.14} strokeWidth={1} />
      <text x="50" y="77" textAnchor="middle" fontFamily="monospace" fontSize={8} fill="#9ca3af">GitHub API</text>
      <text x="50" y="88" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#4b5563">live PR data</text>
      <rect x="116" y="46" width="62" height="28" rx="5" fill={c} fillOpacity={0.15} stroke={c} strokeOpacity={0.72} strokeWidth={1.5} />
      <text x="147" y="58" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>Docker</text>
      <text x="147" y="69" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#d1d5db">Nginx · static</text>
      <rect x="200" y="28" width="72" height="26" rx="4" fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.22} strokeWidth={1} />
      <text x="236" y="39" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight="600" fill="#d1d5db">Vercel CDN</text>
      <text x="236" y="50" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">edge deploy</text>
      <rect x="200" y="66" width="72" height="26" rx="4" fill={c} fillOpacity={0.06} stroke={c} strokeOpacity={0.14} strokeWidth={1} />
      <text x="236" y="77" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#86efac">Lighthouse A+</text>
      <text x="236" y="88" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#4b5563">perf · a11y</text>
    </svg>
  )
}

function DiagramNetflixEKS({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 280 118" fill="none" className="w-full h-full">
      <defs><marker id="arr-eks" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill={c} fillOpacity={0.55} /></marker></defs>
      <line x1="84" y1="40" x2="110" y2="52" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-eks)" />
      <line x1="84" y1="79" x2="110" y2="68" stroke={c} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-eks)" />
      <line x1="168" y1="50" x2="192" y2="38" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-eks)" />
      <line x1="168" y1="68" x2="192" y2="80" stroke={c} strokeOpacity={0.4} strokeWidth={1} markerEnd="url(#arr-eks)" />
      <ellipse cx="139" cy="59" rx="33" ry="22" fill={c} fillOpacity={0.08} />
      <rect x="6" y="27" width="78" height="26" rx="4" fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.26} strokeWidth={1} />
      <text x="45" y="38" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fontWeight="600" fill="#d1d5db">Terraform</text>
      <text x="45" y="49" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">EKS node groups</text>
      <rect x="6" y="66" width="78" height="26" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.2} strokeWidth={1} />
      <text x="45" y="77" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#d1d5db">Jenkins CI/CD</text>
      <text x="45" y="88" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">multi-stage</text>
      <rect x="110" y="43" width="58" height="32" rx="5" fill={c} fillOpacity={0.15} stroke={c} strokeOpacity={0.72} strokeWidth={1.5} />
      <text x="139" y="56" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>Amazon</text>
      <text x="139" y="68" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>EKS</text>
      <rect x="192" y="25" width="80" height="26" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.18} strokeWidth={1} />
      <text x="232" y="36" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#f87171">Trivy Scan</text>
      <text x="232" y="47" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">0 critical CVEs</text>
      <rect x="192" y="68" width="80" height="26" rx="4" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.13} strokeWidth={1} />
      <text x="232" y="79" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#9ca3af">Grafana</text>
      <text x="232" y="90" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#4b5563">Prometheus alerts</text>
    </svg>
  )
}

function DiagramAvlokan({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 280 118" fill="none" className="w-full h-full">
      <defs><marker id="arr-av" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill={c} fillOpacity={0.55} /></marker></defs>
      <line x1="88" y1="59" x2="114" y2="59" stroke={c} strokeOpacity={0.5} strokeWidth={1} markerEnd="url(#arr-av)" />
      <line x1="172" y1="49" x2="196" y2="35" stroke={c} strokeOpacity={0.45} strokeWidth={1} markerEnd="url(#arr-av)" />
      <line x1="172" y1="59" x2="196" y2="59" stroke={c} strokeOpacity={0.28} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-av)" />
      <line x1="172" y1="69" x2="196" y2="83" stroke={c} strokeOpacity={0.4} strokeWidth={1} markerEnd="url(#arr-av)" />
      <ellipse cx="143" cy="59" rx="33" ry="22" fill={c} fillOpacity={0.08} />
      <rect x="6" y="46" width="82" height="26" rx="4" fill={c} fillOpacity={0.08} stroke={c} strokeOpacity={0.27} strokeWidth={1} />
      <text x="47" y="57" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>React SPA</text>
      <text x="47" y="68" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">HLS video · auth</text>
      <rect x="114" y="43" width="58" height="32" rx="5" fill={c} fillOpacity={0.15} stroke={c} strokeOpacity={0.72} strokeWidth={1.5} />
      <text x="143" y="56" textAnchor="middle" fontFamily="monospace" fontSize={8} fontWeight="700" fill={c}>Node.js</text>
      <text x="143" y="68" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#d1d5db">REST API</text>
      <rect x="196" y="22" width="76" height="24" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.2} strokeWidth={1} />
      <text x="234" y="33" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#d1d5db">MySQL</text>
      <text x="234" y="43" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">AWS RDS</text>
      <rect x="196" y="48" width="76" height="22" rx="4" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.13} strokeWidth={1} />
      <text x="234" y="58" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#9ca3af">Razorpay</text>
      <text x="234" y="67" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#4b5563">payments</text>
      <rect x="196" y="72" width="76" height="24" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.18} strokeWidth={1} />
      <text x="234" y="83" textAnchor="middle" fontFamily="monospace" fontSize={7.5} fill="#d1d5db">S3 + CloudFront</text>
      <text x="234" y="93" textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#6b7280">HLS CDN stream</text>
    </svg>
  )
}

// ─── Project Data ─────────────────────────────────────────────────────────────

const FEATURED = [
  {
    id: '01', repo: 'abhay1999/self-healing-k8s-platform',
    title: 'Self-Healing K8s Platform',
    solution: 'Built 3 Go operators using controller-runtime that detect CrashLoopBackOff, trigger automated pod remediation, and restore cluster health without human intervention.',
    metrics: [{ value: '47+', label: 'Incidents Healed' }, { value: '~11s', label: 'Avg Heal Time' }, { value: '100%', label: 'Success Rate' }],
    techStack: ['Kubernetes', 'Go', 'Prometheus', 'Helm', 'GitOps'],
    github: 'https://github.com/abhay1999/self-healing-k8s-platform', liveDemo: '', caseStudy: '',
    category: 'DevOps · Go', highlight: '3 custom K8s operators', accentHex: '#10b981',
    Diagram: DiagramK8sHealing,
    pillClass: 'bg-emerald-900/40 text-emerald-200 border-emerald-500/25',
    borderClass: 'border-emerald-500/20', accentText: 'text-emerald-400',
    titleHoverClass: 'group-hover:text-emerald-300',
    highlightClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    metricClass: 'text-emerald-400',
    ctaClass: 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/50',
    diagBgClass: 'bg-emerald-950/40', diagBorderClass: 'border-emerald-500/12',
    boxShadow: '0 0 0 1px rgba(16,185,129,0.12), 0 4px 40px -12px rgba(16,185,129,0.18)',
    hoverShadow: '0 0 0 1px rgba(16,185,129,0.45), 0 8px 60px -10px rgba(16,185,129,0.35)',
  },
  {
    id: '02', repo: 'abhay1999/dev-env-platform',
    title: 'Dev Environment Platform',
    solution: 'Go CLI that provisions isolated K8s namespaces with a full stack (MERN / Go+PG) in one command — port-forwarding, teardown, and lifecycle managed automatically.',
    metrics: [{ value: '<15s', label: 'Stack Spin-Up' }, { value: '3', label: 'Stack Templates' }, { value: '1 cmd', label: 'Full Setup' }],
    techStack: ['Go', 'Kubernetes', 'CLI', 'MERN', 'PostgreSQL'],
    github: 'https://github.com/abhay1999/dev-env-platform', liveDemo: '', caseStudy: '',
    category: 'DevOps · Go', highlight: 'Single CLI · K8s isolated stacks', accentHex: '#f97316',
    Diagram: DiagramDevEnv,
    pillClass: 'bg-orange-900/40 text-orange-200 border-orange-500/25',
    borderClass: 'border-orange-500/20', accentText: 'text-orange-400',
    titleHoverClass: 'group-hover:text-orange-300',
    highlightClass: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    metricClass: 'text-orange-400',
    ctaClass: 'border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400/50',
    diagBgClass: 'bg-orange-950/40', diagBorderClass: 'border-orange-500/12',
    boxShadow: '0 0 0 1px rgba(249,115,22,0.12), 0 4px 40px -12px rgba(249,115,22,0.18)',
    hoverShadow: '0 0 0 1px rgba(249,115,22,0.45), 0 8px 60px -10px rgba(249,115,22,0.35)',
  },
  {
    id: '03', repo: 'abhay1999/abhay_portfolio',
    title: 'Developer Portfolio',
    solution: 'Built with Next.js 14 + Docker, featuring a live K8s self-healing visualizer, DevOps terminal, CI/CD monitor, and CNCF PR feed — all pulling live GitHub data.',
    metrics: [{ value: '9', label: 'Live Sections' }, { value: 'Live', label: 'GitHub API' }, { value: 'A+', label: 'Lighthouse' }],
    techStack: ['Next.js', 'TypeScript', 'GSAP', 'Tailwind', 'Docker'],
    github: 'https://github.com/abhay1999/abhay_portfolio', liveDemo: '', caseStudy: '',
    category: 'Full-Stack', highlight: 'Live GitHub API · 3D UI', accentHex: '#06b6d4',
    Diagram: DiagramPortfolio,
    pillClass: 'bg-cyan-900/40 text-cyan-200 border-cyan-500/25',
    borderClass: 'border-cyan-500/20', accentText: 'text-cyan-400',
    titleHoverClass: 'group-hover:text-cyan-300',
    highlightClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    metricClass: 'text-cyan-400',
    ctaClass: 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50',
    diagBgClass: 'bg-cyan-950/40', diagBorderClass: 'border-cyan-500/12',
    boxShadow: '0 0 0 1px rgba(6,182,212,0.12), 0 4px 40px -12px rgba(6,182,212,0.18)',
    hoverShadow: '0 0 0 1px rgba(6,182,212,0.45), 0 8px 60px -10px rgba(6,182,212,0.35)',
  },
  {
    id: '04', repo: 'abhay1999/Netflix-Clone-Deployment-on-Amazon-EKS',
    title: 'Netflix Clone on EKS',
    solution: 'Complete DevSecOps pipeline: Terraform provisions EKS, Jenkins runs CI/CD, SonarQube enforces quality gates, Trivy scans images, Prometheus + Grafana provides observability.',
    metrics: [{ value: '0', label: 'Critical CVEs' }, { value: '100%', label: 'IaC Coverage' }, { value: 'Auto', label: 'Deploy on Merge' }],
    techStack: ['AWS EKS', 'Terraform', 'Jenkins', 'Docker', 'Trivy'],
    github: 'https://github.com/abhay1999/Netflix-Clone-Deployment-on-Amazon-EKS', liveDemo: '', caseStudy: '',
    category: 'DevSecOps', highlight: '0 critical vulns · full CI/CD', accentHex: '#ef4444',
    Diagram: DiagramNetflixEKS,
    pillClass: 'bg-red-900/40 text-red-200 border-red-500/25',
    borderClass: 'border-red-500/20', accentText: 'text-red-400',
    titleHoverClass: 'group-hover:text-red-300',
    highlightClass: 'bg-red-500/10 border-red-500/20 text-red-300',
    metricClass: 'text-red-400',
    ctaClass: 'border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-400/50',
    diagBgClass: 'bg-red-950/40', diagBorderClass: 'border-red-500/12',
    boxShadow: '0 0 0 1px rgba(239,68,68,0.12), 0 4px 40px -12px rgba(239,68,68,0.18)',
    hoverShadow: '0 0 0 1px rgba(239,68,68,0.45), 0 8px 60px -10px rgba(239,68,68,0.35)',
  },
  {
    id: '05', repo: '',
    title: 'AvlokanIAS — E-Learning Platform',
    solution: 'Built from scratch: HLS video streaming via CloudFront CDN, JWT auth, Razorpay payments, admin dashboard, Node.js backend — deployed on AWS EC2 + S3 with 5000+ concurrent users on launch day.',
    metrics: [{ value: '5k+', label: 'Concurrent Users' }, { value: '0', label: 'Downtime on Launch' }, { value: 'HLS', label: 'Adaptive Stream' }],
    techStack: ['React', 'Node.js', 'MySQL', 'AWS', 'CloudFront'],
    github: '', liveDemo: 'https://avlokanias.com', caseStudy: '',
    category: 'Full-Stack', highlight: '5000+ concurrent users', accentHex: '#a855f7',
    Diagram: DiagramAvlokan,
    pillClass: 'bg-purple-900/40 text-purple-200 border-purple-500/25',
    borderClass: 'border-purple-500/20', accentText: 'text-purple-400',
    titleHoverClass: 'group-hover:text-purple-300',
    highlightClass: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    metricClass: 'text-purple-400',
    ctaClass: 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/50',
    diagBgClass: 'bg-purple-950/40', diagBorderClass: 'border-purple-500/12',
    boxShadow: '0 0 0 1px rgba(168,85,247,0.12), 0 4px 40px -12px rgba(168,85,247,0.18)',
    hoverShadow: '0 0 0 1px rgba(168,85,247,0.45), 0 8px 60px -10px rgba(168,85,247,0.35)',
  },
]

type RepoStats = Record<string, { stars: number; forks: number }>

// ─── Component ────────────────────────────────────────────────────────────────

const Projects = () => {
  const [stats, setStats] = useState<RepoStats>({})
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const repos = FEATURED.filter(p => p.repo).map(p => p.repo)
    Promise.all(
      repos.map(repo =>
        fetch(`https://api.github.com/repos/${repo}`, { headers: { Accept: 'application/vnd.github.v3+json' } })
          .then(r => r.ok ? r.json() : null).catch(() => null)
      )
    ).then(results => {
      const map: RepoStats = {}
      results.forEach((data, i) => { if (data) map[repos[i]] = { stars: data.stargazers_count, forks: data.forks_count } })
      setStats(map)
    })
  }, [])

  // ── GSAP horizontal scroll (desktop only) ──────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      ScrollTrigger.refresh()

      const getScrollDist = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          scrub: 1.2,
          pin: true,
          pinType: 'transform',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const idx = Math.round(self.progress * (FEATURED.length - 1))
            setActiveIdx(idx)
          },
        },
      })

      return () => { tween.kill() }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 35% 65%, #001818 0%, #001010 45%, #000 100%)' }}
    >
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[140px]" />
      </div>

      {/* ── Desktop: horizontal carousel ────────────────────────────────── */}
      <div className="hidden md:flex flex-col h-screen relative z-10">

        {/* Header */}
        <div className="shrink-0 pt-24 pb-6 px-[max(2rem,calc((100vw-80rem)/2))]">
          <Reveal className="mb-1">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-neutral-500">
              <span className="text-cyan-400">$</span>
              <span className="text-neutral-400">build</span>
              <span className="text-neutral-600">~/projects</span>
              <span className="text-white">›</span>
              <span className="text-purple-400">project_manifest</span>
              <span className="text-neutral-300">.load()</span>
              <span className="cursor-blink w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5" />
            </div>
            <div className="flex items-end gap-5">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Featured</span>{' '}
                <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Projects</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
            </div>
          </Reveal>

          {/* Progress dots */}
          <div className="flex items-center gap-3 mt-4">
            {FEATURED.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIdx ? 28 : 8,
                    background: i === activeIdx ? p.accentHex : 'rgba(255,255,255,0.15)',
                  }}
                />
              </div>
            ))}
            <span className="ml-2 text-[10px] font-mono text-neutral-600">
              {activeIdx + 1} / {FEATURED.length} · scroll →
            </span>
            <ChevronRight size={12} className="text-neutral-700 animate-pulse" />
          </div>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 flex items-center overflow-visible">
          <div
            ref={trackRef}
            className="flex gap-5 pl-[max(2rem,calc((100vw-80rem)/2))] pr-24 will-change-transform"
            style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
          >
            {FEATURED.map((project, idx) => {
              const repoStats = project.repo ? stats[project.repo] : undefined
              const { Diagram } = project
              return (
                <div
                  key={project.id}
                  className="group w-[420px] xl:w-[460px] flex-shrink-0 [perspective:900px]"
                  style={{ height: 'calc(100vh - 220px)', maxHeight: 560 }}
                >
                  <TiltCard
                    className={`relative flex flex-col h-full rounded-3xl overflow-hidden border transition-all duration-500 bg-white/[0.04] backdrop-blur-xl ${project.borderClass}`}
                    style={{ boxShadow: project.boxShadow }}
                  >
                    {/* Progress line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-30 pointer-events-none">
                      <div className="h-full w-0 group-hover:w-full transition-[width] duration-700 ease-out"
                        style={{ background: `linear-gradient(to right, transparent, ${project.accentHex}dd, transparent)` }} />
                    </div>

                    {/* Hover glow border */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
                      style={{ boxShadow: `inset 0 0 0 1px ${project.accentHex}55` }} />

                    {/* Diagram strip */}
                    <div className={`relative overflow-hidden border-b ${project.diagBorderClass} ${project.diagBgClass} h-[110px]`}>
                      <div aria-hidden="true" className="scan-line absolute left-0 right-0 h-px pointer-events-none z-10 opacity-50"
                        style={{ background: `linear-gradient(to right, transparent, ${project.accentHex}99, transparent)` }} />
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        <Diagram c={project.accentHex} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                        <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${project.pillClass}`}>{project.category}</span>
                        {repoStats && (
                          <div className="flex items-center gap-3">
                            {repoStats.stars > 0 && <div className="flex items-center gap-1"><Star size={9} className="text-yellow-400 fill-yellow-400" /><span className="text-[10px] font-mono text-neutral-500">{repoStats.stars}</span></div>}
                            {repoStats.forks > 0 && <div className="flex items-center gap-1"><GitFork size={9} className="text-neutral-600" /><span className="text-[10px] font-mono text-neutral-500">{repoStats.forks}</span></div>}
                          </div>
                        )}
                        {!project.repo && <span className="text-[9px] font-mono text-neutral-700">Private repo</span>}
                      </div>
                    </div>

                    <MetricStrip metrics={project.metrics} metricClass={project.metricClass} />

                    <div className="flex flex-col flex-1 p-5 overflow-hidden" style={{ transform: 'translateZ(8px)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <h3 className={`text-[17px] font-bold text-white ${project.titleHoverClass} transition-colors duration-300 leading-snug`}>{project.title}</h3>
                        <ArrowUpRight size={15} className={`${project.accentText} opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                      </div>
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-semibold tracking-wide ${project.highlightClass}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{project.highlight}
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-400 leading-relaxed line-clamp-3 mb-4">{project.solution}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.map(tech => (
                          <span key={tech} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${project.pillClass}`}>{tech}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-3.5 border-t border-white/[0.07] mt-auto">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-medium transition-all duration-200 ${project.ctaClass}`}>
                            <GithubIcon size={11} />Repo
                          </a>
                        )}
                        {project.liveDemo && (
                          <a href={project.liveDemo} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono font-medium transition-all duration-200 ${project.ctaClass}`}>
                            <ExternalLink size={10} />Live ↗
                          </a>
                        )}
                        {project.github && !project.liveDemo && !project.caseStudy && (
                          <a href={`${project.github}#readme`} target="_blank" rel="noreferrer"
                            className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-neutral-700 hover:text-neutral-400 transition-colors">
                            README →
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </div>
              )
            })}

            {/* End CTA card */}
            <div className="w-[260px] flex-shrink-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto backdrop-blur-xl">
                  <GithubIcon size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-300">More on GitHub</p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">15+ projects</p>
                </div>
                <a href="https://github.com/abhay1999" target="_blank" rel="noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white rounded-xl hover:bg-white hover:text-black transition-all duration-300 font-medium text-sm">
                  View All
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: vertical stack ───────────────────────────────────────── */}
      <div className="md:hidden py-24 px-4 sm:px-6 relative z-10">
        <Reveal className="mb-10">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-neutral-500">
            <span className="text-cyan-400">$</span>
            <span className="text-neutral-400">build</span>
            <span className="text-white">›</span>
            <span className="text-purple-400">project_manifest</span>
          </div>
          <h2 className="text-5xl font-bold tracking-tight leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Featured</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Projects</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-5 mb-10">
          {FEATURED.map((project, idx) => {
            const repoStats = project.repo ? stats[project.repo] : undefined
            const { Diagram } = project
            return (
              <Reveal key={project.id} from={{ opacity: 0, y: 40 }} delay={idx * 0.09} className="group [perspective:900px]">
                <TiltCard
                  className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 bg-white/[0.04] backdrop-blur-xl ${project.borderClass}`}
                  style={{ boxShadow: project.boxShadow }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-30 pointer-events-none">
                    <div className="h-full w-0 group-hover:w-full transition-[width] duration-700 ease-out"
                      style={{ background: `linear-gradient(to right, transparent, ${project.accentHex}dd, transparent)` }} />
                  </div>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
                    style={{ boxShadow: `inset 0 0 0 1px ${project.accentHex}55` }} />
                  <div className={`relative overflow-hidden border-b ${project.diagBorderClass} ${project.diagBgClass} h-[110px] sm:h-[140px]`}>
                    <div aria-hidden="true" className="scan-line absolute left-0 right-0 h-px pointer-events-none z-10 opacity-50"
                      style={{ background: `linear-gradient(to right, transparent, ${project.accentHex}99, transparent)` }} />
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <Diagram c={project.accentHex} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                      <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${project.pillClass}`}>{project.category}</span>
                      {repoStats && (
                        <div className="flex items-center gap-3">
                          {repoStats.stars > 0 && <div className="flex items-center gap-1"><Star size={9} className="text-yellow-400 fill-yellow-400" /><span className="text-[10px] font-mono text-neutral-500">{repoStats.stars}</span></div>}
                          {repoStats.forks > 0 && <div className="flex items-center gap-1"><GitFork size={9} className="text-neutral-600" /><span className="text-[10px] font-mono text-neutral-500">{repoStats.forks}</span></div>}
                        </div>
                      )}
                      {!project.repo && <span className="text-[9px] font-mono text-neutral-700">Private repo</span>}
                    </div>
                  </div>
                  <MetricStrip metrics={project.metrics} metricClass={project.metricClass} />
                  <div className="flex flex-col flex-1 p-5" style={{ transform: 'translateZ(8px)' }}>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <h3 className={`text-[17px] font-bold text-white ${project.titleHoverClass} transition-colors duration-300 leading-snug`}>{project.title}</h3>
                      <ArrowUpRight size={15} className={`${project.accentText} opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-all`} />
                    </div>
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-semibold tracking-wide ${project.highlightClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{project.highlight}
                      </span>
                    </div>
                    <p className="text-[12px] text-neutral-400 leading-relaxed line-clamp-3 mb-4">{project.solution}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map(tech => (
                        <span key={tech} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${project.pillClass}`}>{tech}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-3.5 border-t border-white/[0.07] mt-auto">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-lg border text-[11px] font-mono font-medium transition-all duration-200 ${project.ctaClass}`}>
                          <GithubIcon size={11} />Repo
                        </a>
                      )}
                      {project.liveDemo && (
                        <a href={project.liveDemo} target="_blank" rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-lg border text-[11px] font-mono font-medium transition-all duration-200 ${project.ctaClass}`}>
                          <ExternalLink size={10} />Live ↗
                        </a>
                      )}
                      {project.github && !project.liveDemo && !project.caseStudy && (
                        <a href={`${project.github}#readme`} target="_blank" rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-neutral-700 hover:text-neutral-400 transition-colors">
                          README →
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>

        <Reveal from={{ opacity: 0, y: 20 }} delay={0.3} className="flex items-center justify-center">
          <a href="https://github.com/abhay1999" target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/15 text-white rounded-2xl hover:bg-white hover:text-black transition-all duration-300 font-medium hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <GithubIcon size={17} />
            <span>View All Projects on GitHub</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default Projects
