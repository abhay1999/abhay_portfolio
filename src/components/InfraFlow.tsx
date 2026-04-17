"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { AlertTriangle, CheckCircle2, RefreshCw, Zap, Shield, Activity, GitMerge } from 'lucide-react'
import Reveal from '@/components/Reveal'

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'HEAL'
type LogEntry = { id: number; level: LogLevel; msg: string; ts: string }

// ─── Phase config ─────────────────────────────────────────────────────────────
const DURATIONS: Record<Phase, number> = { 0: 3500, 1: 1800, 2: 1600, 3: 1600, 4: 1600, 5: 2200, 6: 2800 }

const PHASE_LOG: { level: LogLevel; msg: string }[] = [
  { level: 'INFO',  msg: 'cluster/prod — all 3 pods Running' },
  { level: 'ERROR', msg: 'pod/app-7d8f9-2 CrashLoopBackOff (exit 137)' },
  { level: 'WARN',  msg: 'prometheus FIRING: PodCrashLooping{pod="app-7d8f9-2"}' },
  { level: 'WARN',  msg: 'alertmanager → webhook: selfhealing-operator triggered' },
  { level: 'INFO',  msg: 'operator: remediation started — app-7d8f9-2' },
  { level: 'INFO',  msg: 'kubectl delete pod app-7d8f9-2 --grace-period=0 --force' },
  { level: 'HEAL',  msg: '✓ pod/app-7d8f9-3 Running — incident resolved in 11.4s' },
]

const PHASE_STATUS = [
  { label: 'NOMINAL',    accent: 'emerald' },
  { label: 'INCIDENT',   accent: 'red'     },
  { label: 'DETECTING',  accent: 'amber'   },
  { label: 'ROUTING',    accent: 'amber'   },
  { label: 'RESPONDING', accent: 'blue'    },
  { label: 'RESTARTING', accent: 'blue'    },
  { label: 'HEALED',     accent: 'emerald' },
] as const

// ─── Pod state helper ─────────────────────────────────────────────────────────
type PodState = 'healthy' | 'crash' | 'healing' | 'new'
function podState(idx: number, phase: Phase): PodState {
  if (idx !== 2) return 'healthy'
  if (phase === 1 || phase === 2 || phase === 3) return 'crash'
  if (phase === 4 || phase === 5) return 'healing'
  if (phase === 6) return 'new'
  return 'healthy'
}

// ─── SVG diagram constants ────────────────────────────────────────────────────
const VB = { w: 560, h: 280 }

const C = {
  cluster: { x: 200, y: 75 },
  pod:     [{ x: 110, y: 75 }, { x: 200, y: 75 }, { x: 290, y: 75 }],
  prom:    { x: 100, y: 210 },
  alert:   { x: 280, y: 210 },
  op:      { x: 460, y: 210 },
}

const PATHS = {
  clusterToProm:  `M ${C.pod[1].x} 108 L ${C.prom.x} 185`,
  promToAlert:    `M ${C.prom.x + 42} ${C.prom.y} L ${C.alert.x - 42} ${C.alert.y}`,
  alertToOp:      `M ${C.alert.x + 42} ${C.alert.y} L ${C.op.x - 42} ${C.op.y}`,
  opToPod:        `M ${C.op.x} 185 L ${C.pod[2].x} 108`,
}

const ACTIVE_PATHS: Partial<Record<Phase, keyof typeof PATHS>> = {
  2: 'clusterToProm',
  3: 'promToAlert',
  4: 'alertToOp',
  5: 'opToPod',
}

// ─── Log level styles ─────────────────────────────────────────────────────────
const LOG_STYLE: Record<LogLevel, { label: string; labelClass: string; msgClass: string }> = {
  INFO:  { label: 'INFO ', labelClass: 'text-neutral-600', msgClass: 'text-neutral-400' },
  WARN:  { label: 'WARN ', labelClass: 'text-amber-500',   msgClass: 'text-amber-200/80' },
  ERROR: { label: 'ERROR', labelClass: 'text-red-500',     msgClass: 'text-red-300'      },
  HEAL:  { label: 'HEAL ', labelClass: 'text-emerald-400', msgClass: 'text-emerald-300'  },
}

// ─── Status dot accent helpers ────────────────────────────────────────────────
function statusDotClass(accent: string) {
  if (accent === 'emerald') return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
  if (accent === 'red')     return 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]'
  if (accent === 'amber')   return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
  return 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]'
}
function statusTextClass(accent: string) {
  if (accent === 'emerald') return 'text-emerald-400'
  if (accent === 'red')     return 'text-red-400'
  if (accent === 'amber')   return 'text-amber-400'
  return 'text-blue-400'
}

// ─── Component ────────────────────────────────────────────────────────────────
const InfraFlow = () => {
  const [phase, setPhase]         = useState<Phase>(0)
  const [log, setLog]             = useState<LogEntry[]>([])
  const [healCount, setHealCount] = useState(47)
  const [logId, setLogId]         = useState(0)
  const [elapsed, setElapsed]     = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logRef   = useRef<HTMLDivElement>(null)

  const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const addLog = useCallback((p: Phase) => {
    const entry = PHASE_LOG[p]
    setLog(prev => {
      const next: LogEntry[] = [...prev, { id: Date.now(), level: entry.level, msg: entry.msg, ts: now() }]
      return next.slice(-18)
    })
    setLogId(id => id + 1)
  }, [])

  const advance = useCallback((current: Phase) => {
    addLog(current)
    const next = ((current + 1) % 7) as Phase
    if (next === 0) setHealCount(c => c + 1)

    timerRef.current = setTimeout(() => {
      setPhase(next)
      setElapsed(0)
    }, DURATIONS[current])
  }, [addLog])

  useEffect(() => {
    advance(phase)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  useEffect(() => {
    const iv = setInterval(() => setElapsed(e => e + 100), 100)
    return () => clearInterval(iv)
  }, [phase])

  const status = PHASE_STATUS[phase]
  const activePath = ACTIVE_PATHS[phase]

  const nodeActive = (node: 'prom' | 'alert' | 'op') => {
    if (node === 'prom')  return phase >= 2 && phase <= 3
    if (node === 'alert') return phase >= 3 && phase <= 4
    if (node === 'op')    return phase >= 4 && phase <= 5
    return false
  }

  return (
    <section id="infraflow" className="relative py-20 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 40% 55%, #001520 0%, #000b12 45%, #000 100%)' }}>

      {/* Background grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.8) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Reveal className="mb-10">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">kubectl</span>
            <span className="text-neutral-600">~/prod-cluster</span>
            <span className="text-white">›</span>
            <span className="text-emerald-400">watch</span>
            <span className="text-neutral-300">--self-healing</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">Live Demo</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mt-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Self-Healing</span>{' '}
                <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Infrastructure</span>
              </h2>
              <p className="text-sm text-neutral-500 mt-2 font-mono">
                3 Go operators · Prometheus + Alertmanager · Automated remediation loop
              </p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-4" />
          </div>
        </Reveal>

        {/* ── Main Demo Panel ──────────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 40 }}>
          <div className="relative rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-neutral-950/90 via-black/95 to-emerald-950/10 overflow-hidden"
            style={{ boxShadow: '0 0 80px -30px rgba(16,185,129,0.15)' }}>

            {/* Scanline overlay */}
            <div aria-hidden="true"
              className="scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none z-20" />

            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="font-mono text-[11px] text-neutral-500">self-healing-k8s-platform · live</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Phase status */}
                <div className="flex items-center gap-1.5">
                  <div className={`opacity-pulse w-1.5 h-1.5 rounded-full ${statusDotClass(status.accent)}`} />
                  <span className={`font-mono text-[10px] font-bold ${statusTextClass(status.accent)}`}>{status.label}</span>
                </div>
                <div className="w-px h-3.5 bg-white/10" />
                <span className="font-mono text-[10px] text-neutral-600">{(elapsed / 1000).toFixed(1)}s</span>
              </div>
            </div>

            {/* Content: diagram + log */}
            <div className="grid lg:grid-cols-[1fr_320px] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

              {/* ── SVG Cluster Diagram ──────────────────────────────────── */}
              <div className="p-4 sm:p-6 flex items-center justify-center min-h-[320px]">
                <svg
                  viewBox={`0 0 ${VB.w} ${VB.h}`}
                  className="w-full max-w-[560px]"
                  style={{ overflow: 'visible' }}
                >
                  {/* Defs */}
                  <defs>
                    <marker id="arrowEmerald" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="rgba(52,211,153,0.6)" />
                    </marker>
                    <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="rgba(251,191,36,0.6)" />
                    </marker>
                    <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="rgba(96,165,250,0.6)" />
                    </marker>
                  </defs>

                  {/* ── K8s Cluster boundary ─────────────────────────── */}
                  <rect x="40" y="22" width="320" height="90" rx="12"
                    fill="rgba(16,185,129,0.04)" stroke="rgba(52,211,153,0.25)" strokeWidth="1" strokeDasharray="6 4" />
                  <text x="56" y="40" fontFamily="monospace" fontSize="9" fill="rgba(52,211,153,0.5)" fontWeight="700" letterSpacing="1">
                    K8S CLUSTER · namespace: prod
                  </text>

                  {/* Deployment label */}
                  <text x="116" y="58" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.25)">
                    deploy/app-server
                  </text>

                  {/* ── Pods ──────────────────────────────────────────── */}
                  {[0, 1, 2].map((i) => {
                    const st = podState(i, phase)
                    const cx = C.pod[i].x
                    const cy = C.pod[i].y
                    const isIncident = st === 'crash'
                    const isHealing  = st === 'healing'
                    const isNew      = st === 'new'

                    const fill   = isIncident ? 'rgba(239,68,68,0.15)'    : isHealing ? 'rgba(96,165,250,0.15)'    : 'rgba(16,185,129,0.12)'
                    const stroke = isIncident ? 'rgba(239,68,68,0.55)'    : isHealing ? 'rgba(96,165,250,0.55)'    : 'rgba(52,211,153,0.45)'
                    const dot    = isIncident ? 'rgb(239,68,68)'           : isHealing ? 'rgb(96,165,250)'          : 'rgb(52,211,153)'
                    const label  = isIncident ? 'CrashLoop' : isHealing   ? 'Pending'  : isNew ? 'Running*' : 'Running'

                    return (
                      <g key={i}>
                        <rect
                          x={cx - 36} y={cy - 22} width={72} height={44} rx={8}
                          fill={fill} stroke={stroke} strokeWidth={isIncident ? 1.5 : 1}
                        >
                          {isIncident && <animate attributeName="opacity" values="1;0.6;1" dur="0.7s" repeatCount="indefinite" />}
                          {isNew && <animate attributeName="opacity" values="0.4;1" dur="0.6s" repeatCount="1" />}
                        </rect>
                        {/* Dot */}
                        <circle
                          cx={cx - 20} cy={cy - 8} r={3}
                          fill={dot}
                          style={{ filter: `drop-shadow(0 0 4px ${dot})` }}
                        >
                          {isIncident
                            ? <animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite" />
                            : <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                          }
                        </circle>
                        <text x={cx - 10} y={cy - 4} fontFamily="monospace" fontSize="7.5" fill="rgba(255,255,255,0.7)" fontWeight="600">
                          pod-{i}
                        </text>
                        <text x={cx - 24} y={cy + 12} fontFamily="monospace" fontSize="7" fill={isIncident ? 'rgba(239,68,68,0.9)' : isHealing ? 'rgba(96,165,250,0.9)' : 'rgba(52,211,153,0.75)'}>
                          {label}
                        </text>
                        {/* Crash icon */}
                        {isIncident && (
                          <text x={cx + 12} y={cy - 6} fontSize="11">
                            <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
                            ⚠
                          </text>
                        )}
                        {/* Heal check */}
                        {isNew && (
                          <text x={cx + 14} y={cy - 6} fontSize="11">✓</text>
                        )}
                        {/* Spinning refresh on healing */}
                        {isHealing && (
                          <text x={cx + 12} y={cy - 6} fontSize="10">
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from={`0 ${cx + 17} ${cy - 11}`}
                              to={`360 ${cx + 17} ${cy - 11}`}
                              dur="1s"
                              repeatCount="indefinite"
                            />
                            ↻
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* ── Observability stack nodes ─────────────────────── */}
                  {[
                    { key: 'prom',  cx: C.prom.x,  label: 'Prometheus',   sub: 'metrics', active: nodeActive('prom'),  fill: 'rgba(251,191,36,', stroke: 'rgba(251,191,36,' },
                    { key: 'alert', cx: C.alert.x, label: 'Alertmanager', sub: 'routing', active: nodeActive('alert'), fill: 'rgba(251,191,36,', stroke: 'rgba(251,191,36,' },
                    { key: 'op',    cx: C.op.x,    label: 'Operator',     sub: 'go ctrl', active: nodeActive('op'),    fill: 'rgba(96,165,250,',  stroke: 'rgba(96,165,250,' },
                  ].map(({ key, cx, label, sub, active, fill, stroke }) => (
                    <g key={key}>
                      <rect
                        x={cx - 42} y={C.prom.y - 24} width={84} height={48} rx={10}
                        fill={`${fill}${active ? '0.12' : '0.05'})`}
                        stroke={`${stroke}${active ? '0.6' : '0.2'})`}
                        strokeWidth={active ? 1.5 : 1}
                      >
                        {active && <animate attributeName="opacity" values="0.8;1;0.8" dur="0.8s" repeatCount="indefinite" />}
                      </rect>
                      {/* Active glow */}
                      {active && (
                        <rect x={cx - 42} y={C.prom.y - 24} width={84} height={48} rx={10}
                          fill="none" stroke={`${stroke}0.4)`} strokeWidth={8}
                          style={{ filter: 'blur(4px)' }}>
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="0.9s" repeatCount="indefinite" />
                        </rect>
                      )}
                      {/* Icon area */}
                      <circle cx={cx - 22} cy={C.prom.y - 6} r={9}
                        fill={`${fill}${active ? '0.2' : '0.08'})`}
                        stroke={`${stroke}${active ? '0.5' : '0.15'})`} strokeWidth={1} />
                      <text x={cx - 22} y={C.prom.y - 2} textAnchor="middle" fontSize="9">{key === 'prom' ? '📈' : key === 'alert' ? '🔔' : '⚙️'}</text>
                      <text x={cx + 2} y={C.prom.y - 8} fontFamily="monospace" fontSize="8"
                        fill={active ? (key === 'op' ? 'rgba(96,165,250,0.95)' : 'rgba(251,191,36,0.95)') : 'rgba(255,255,255,0.5)'}
                        fontWeight={active ? '700' : '400'}>
                        {label}
                      </text>
                      <text x={cx + 2} y={C.prom.y + 6} fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.25)">{sub}</text>
                    </g>
                  ))}

                  {/* ── Connection lines ──────────────────────────────── */}
                  {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((key) => {
                    const d = PATHS[key]
                    const isActive = activePath === key
                    const color = key === 'opToPod' ? 'rgba(96,165,250,0.6)' : key === 'clusterToProm' ? 'rgba(52,211,153,0.6)' : 'rgba(251,191,36,0.6)'
                    const dimColor = key === 'opToPod' ? 'rgba(96,165,250,0.1)' : key === 'clusterToProm' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)'
                    const markerEnd = key === 'opToPod' ? 'url(#arrowBlue)' : key === 'clusterToProm' ? 'url(#arrowEmerald)' : 'url(#arrowAmber)'

                    return (
                      <g key={key}>
                        {/* Base line */}
                        <path d={d} fill="none" stroke={isActive ? color : dimColor} strokeWidth={isActive ? 1.5 : 1}
                          strokeDasharray={isActive ? 'none' : '4 4'} markerEnd={isActive ? markerEnd : undefined} />
                        {/* Animated particle */}
                        {isActive && (
                          <circle r={3} fill={color}
                            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                          >
                            {/* @ts-ignore */}
                            <animateMotion dur="1.2s" repeatCount="indefinite" path={d} />
                          </circle>
                        )}
                      </g>
                    )
                  })}

                  {/* ── GitHub repo link ─────────────────────────────── */}
                  <a href="https://github.com/abhay1999/self-healing-k8s-platform" target="_blank" rel="noreferrer">
                    <rect x={C.op.x + 16} y="22" width="80" height="22" rx="6"
                      fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
                    <text x={C.op.x + 56} y="36" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="rgba(96,165,250,0.7)">
                      ↗ github
                    </text>
                  </a>
                </svg>
              </div>

              {/* ── Event Log Terminal ──────────────────────────────────── */}
              <div className="flex flex-col h-full min-h-[300px] lg:min-h-0">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/20">
                  <div className="flex items-center gap-2">
                    <Activity size={11} className="text-emerald-400" />
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Event Log</span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-700">kubectl logs --follow</span>
                </div>
                <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[10px]"
                  style={{ maxHeight: '280px', scrollbarWidth: 'none' }}>
                  {log.map((entry) => {
                    const s = LOG_STYLE[entry.level]
                    return (
                      <div key={entry.id} className="flex gap-2 leading-relaxed">
                        <span className="text-neutral-700 shrink-0">{entry.ts}</span>
                        <span className={`shrink-0 ${s.labelClass}`}>{s.label}</span>
                        <span className={s.msgClass}>{entry.msg}</span>
                      </div>
                    )
                  })}
                  {/* Blinking cursor */}
                  <div className="flex gap-2">
                    <span className="text-neutral-700">{now()}</span>
                    <span className="cursor-blink text-emerald-500">█</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Stats bar ────────────────────────────────────────────── */}
            <div className="border-t border-white/[0.06] bg-black/30 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'INCIDENTS HEALED',  value: healCount,  suffix: '',    accent: 'text-emerald-400', glow: 'rgba(52,211,153,0.8)',   barColor: '#34d399' },
                { label: 'AVG HEAL TIME',      value: '11.4',     suffix: 's',   accent: 'text-blue-400',   glow: 'rgba(96,165,250,0.8)',   barColor: '#60a5fa' },
                { label: 'SUCCESS RATE',       value: '100',      suffix: '%',   accent: 'text-cyan-400',   glow: 'rgba(34,211,238,0.8)',   barColor: '#22d3ee' },
                { label: 'OPERATORS',          value: '3',        suffix: ' Go', accent: 'text-purple-400', glow: 'rgba(192,132,252,0.8)',  barColor: '#c084fc' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="opacity-pulse w-1 h-6 rounded-full shrink-0" style={{ background: stat.barColor }} />
                  <div>
                    <div className={`font-mono text-lg font-black leading-none ${stat.accent}`}
                      style={{ textShadow: `0 0 12px ${stat.glow}` }}>
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="font-mono text-[8px] text-neutral-600 uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Reveal>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        <Reveal
          from={{ opacity: 0, y: 20 }}
          delay={0.3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <a href="https://github.com/abhay1999/self-healing-k8s-platform" target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-500/25 text-white rounded-2xl hover:border-emerald-400/50 transition-all duration-300 font-medium text-sm"
            style={{ boxShadow: '0 0 30px -10px rgba(16,185,129,0.2)' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View Source
            <GitMerge size={14} className="text-emerald-400/70" />
          </a>
          <p className="text-xs font-mono text-neutral-600">
            3 custom Go operators · K8s controller-runtime · Helm chart deployed
          </p>
        </Reveal>

      </div>
    </section>
  )
}

export default InfraFlow
