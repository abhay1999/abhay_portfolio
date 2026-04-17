"use client"

import { useEffect, useState } from 'react'
import { Server, GitBranch, Activity } from 'lucide-react'
import { fetchJsonWithTimeout, readCachedValue, writeCachedValue, type DataSourceState } from '@/lib/client-data'
import Reveal from '@/components/Reveal'

// ─── Types ────────────────────────────────────────────────────────────────────

type Conclusion = 'success' | 'failure' | 'cancelled' | 'skipped' | null

interface WorkflowRun {
  status: 'completed' | 'in_progress' | 'queued'
  conclusion: Conclusion
  head_branch: string
  updated_at: string
}

interface ContribDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface HeatmapResponse {
  contributions: ContribDay[]
  total: Record<string, number>
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    label: 'Self-Healing K8s',
    repo: 'abhay1999/self-healing-k8s-platform',
    short: 'self-healing-k8s',
    accentCls: 'text-emerald-400',
    dotCls: 'bg-emerald-400',
    glowCls: 'shadow-[0_0_8px_rgba(52,211,153,0.9)]',
  },
  {
    label: 'Portfolio',
    repo: 'abhay1999/abhay_portfolio',
    short: 'abhay_portfolio',
    accentCls: 'text-cyan-400',
    dotCls: 'bg-cyan-400',
    glowCls: 'shadow-[0_0_8px_rgba(34,211,238,0.9)]',
  },
  {
    label: 'Netflix EKS',
    repo: 'abhay1999/Netflix-Clone-Deployment-on-Amazon-EKS',
    short: 'netflix-clone-eks',
    accentCls: 'text-red-400',
    dotCls: 'bg-red-400',
    glowCls: 'shadow-[0_0_8px_rgba(248,113,113,0.9)]',
  },
]

// Static Tailwind classes for each contribution level
const CELL_CLS = [
  'bg-neutral-800/80 border border-neutral-700/30',
  'bg-emerald-950 border border-emerald-900/60',
  'bg-emerald-800 border border-emerald-700/50',
  'bg-emerald-600 border border-emerald-500/60',
  'bg-emerald-400 border border-emerald-300/50 shadow-[0_0_4px_rgba(52,211,153,0.5)]',
] as const

const VITALS = [
  { label: 'PORTFOLIO', value: 'LIVE',  color: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'shadow-[0_0_6px_rgba(52,211,153,0.8)]',  pulse: true  },
  { label: 'UPTIME',    value: '99.9%', color: 'text-cyan-400',    dot: 'bg-cyan-400',    glow: 'shadow-[0_0_6px_rgba(34,211,238,0.8)]',  pulse: false },
  { label: 'BUILD',     value: 'PASS',  color: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'shadow-[0_0_6px_rgba(52,211,153,0.8)]',  pulse: false },
  { label: 'RUNTIME',   value: 'NGINX', color: 'text-purple-400',  dot: 'bg-purple-400',  glow: 'shadow-[0_0_6px_rgba(192,132,252,0.8)]', pulse: false },
]

const RUNS_CACHE_KEY = 'devops-live:workflow-runs'
const RUNS_CACHE_TTL_MS = 1000 * 60 * 10
const HEATMAP_CACHE_KEY = 'devops-live:heatmap'
const HEATMAP_CACHE_TTL_MS = 1000 * 60 * 60 * 6

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveStatus(run: WorkflowRun | null | undefined): {
  label: string; labelCls: string; dotCls: string; glowCls: string; pulse: boolean
} {
  if (run === undefined) return { label: 'LOADING', labelCls: 'text-neutral-500', dotCls: 'bg-neutral-600', glowCls: '', pulse: false }
  if (run === null)      return { label: 'ACTIVE',  labelCls: 'text-cyan-400',    dotCls: 'bg-cyan-400',    glowCls: 'shadow-[0_0_8px_rgba(34,211,238,0.7)]', pulse: false }
  if (run.status === 'in_progress') return { label: 'RUNNING', labelCls: 'text-amber-400',   dotCls: 'bg-amber-400',   glowCls: 'shadow-[0_0_8px_rgba(251,191,36,0.9)]',  pulse: true  }
  if (run.status === 'queued') return { label: 'QUEUED', labelCls: 'text-amber-300', dotCls: 'bg-amber-300', glowCls: 'shadow-[0_0_8px_rgba(252,211,77,0.8)]', pulse: true }
  if (run.conclusion === 'success') return { label: 'PASSING', labelCls: 'text-emerald-400', dotCls: 'bg-emerald-400', glowCls: 'shadow-[0_0_8px_rgba(52,211,153,0.9)]',  pulse: false }
  if (run.conclusion === 'failure') return { label: 'FAILING', labelCls: 'text-red-400',     dotCls: 'bg-red-400',     glowCls: 'shadow-[0_0_8px_rgba(248,113,113,0.9)]',  pulse: false }
  if (run.conclusion === 'cancelled') return { label: 'CANCELLED', labelCls: 'text-neutral-400', dotCls: 'bg-neutral-500', glowCls: '', pulse: false }
  if (run.conclusion === 'skipped') return { label: 'SKIPPED', labelCls: 'text-neutral-400', dotCls: 'bg-neutral-500', glowCls: '', pulse: false }
  return { label: 'ACTIVE', labelCls: 'text-cyan-400', dotCls: 'bg-cyan-400', glowCls: 'shadow-[0_0_8px_rgba(34,211,238,0.7)]', pulse: false }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function getMonthLabels(weeks: ContribDay[][]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    if (!week[0]) return
    const m = new Date(week[0].date).getMonth()
    if (m !== lastMonth) {
      labels.push({ label: new Date(week[0].date).toLocaleString('default', { month: 'short' }), col: wi })
      lastMonth = m
    }
  })
  return labels
}

function getStateMeta(state: DataSourceState) {
  if (state === 'live')   return { label: 'LIVE',        dotClass: 'bg-emerald-400', textClass: 'text-emerald-400' }
  if (state === 'cached') return { label: 'CACHED',      dotClass: 'bg-amber-400',   textClass: 'text-amber-400'   }
  return                         { label: 'STATIC DATA', dotClass: 'bg-neutral-600', textClass: 'text-neutral-500' }
}

// ─── Component ────────────────────────────────────────────────────────────────

const DevOpsLive = () => {
  const [runs, setRuns] = useState<Record<string, WorkflowRun | null>>({})
  const [contribs, setContribs] = useState<ContribDay[]>([])
  const [totalContribs, setTotalContribs] = useState<number | null>(null)
  const [heatmapLoading, setHeatmapLoading] = useState(true)
  const [heatmapError, setHeatmapError] = useState(false)
  const [runsSource, setRunsSource] = useState<DataSourceState>('static')
  const [heatmapSource, setHeatmapSource] = useState<DataSourceState>('static')

  useEffect(() => {
    const cachedRuns = readCachedValue<Record<string, WorkflowRun | null>>(RUNS_CACHE_KEY, RUNS_CACHE_TTL_MS)
    if (cachedRuns) {
      setRuns(cachedRuns.value)
      setRunsSource('cached')
    } else {
      setRuns(Object.fromEntries(SERVICES.map((svc) => [svc.repo, null])) as Record<string, WorkflowRun | null>)
    }

    Promise.all(
      SERVICES.map(async (svc) => {
        const data = await fetchJsonWithTimeout<{ workflow_runs?: WorkflowRun[] }>(
          `https://api.github.com/repos/${svc.repo}/actions/runs?per_page=1`,
          { headers: { Accept: 'application/vnd.github.v3+json' } },
          5000
        )
        return [svc.repo, data.workflow_runs?.[0] ?? null] as const
      })
    )
      .then((entries) => {
        const nextRuns = Object.fromEntries(entries) as Record<string, WorkflowRun | null>
        setRuns(nextRuns)
        setRunsSource('live')
        writeCachedValue(RUNS_CACHE_KEY, nextRuns)
      })
      .catch(() => {})

    const cachedHeatmap = readCachedValue<HeatmapResponse>(HEATMAP_CACHE_KEY, HEATMAP_CACHE_TTL_MS)
    if (cachedHeatmap) {
      setContribs(cachedHeatmap.value.contributions ?? [])
      setTotalContribs(Object.values(cachedHeatmap.value.total ?? {}).reduce((a, b) => a + b, 0))
      setHeatmapSource('cached')
      setHeatmapLoading(false)
    }

    fetchJsonWithTimeout<HeatmapResponse>('https://github-contributions-api.jogruber.de/v4/abhay1999?y=last', {}, 5000)
      .then((data) => {
        setContribs(data.contributions ?? [])
        setTotalContribs(Object.values(data.total ?? {}).reduce((a, b) => a + b, 0))
        setHeatmapSource('live')
        setHeatmapLoading(false)
        setHeatmapError(false)
        writeCachedValue(HEATMAP_CACHE_KEY, data)
      })
      .catch(() => {
        setHeatmapError(!cachedHeatmap)
        setHeatmapLoading(false)
      })
  }, [])

  const weeks: ContribDay[][] = []
  if (contribs.length > 0) {
    let week: ContribDay[] = []
    for (const day of contribs) {
      week.push(day)
      if (week.length === 7) { weeks.push(week); week = [] }
    }
    if (week.length > 0) weeks.push(week)
  }
  const monthLabels = getMonthLabels(weeks)
  const runsMeta = getStateMeta(runsSource)
  const heatmapMeta = getStateMeta(heatmapSource)

  return (
    <section id="devops-live" className="relative py-24 overflow-hidden bg-black">

      {/* ── Background ───────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: 'linear-gradient(rgba(52,211,153,0.9) 1px, transparent 1px),linear-gradient(90deg, rgba(52,211,153,0.9) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40%] opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(to right, rgba(52,211,153,0.9) 1px, transparent 1px),linear-gradient(to bottom, rgba(52,211,153,0.9) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
        }} />
        {/* Circuit traces — CSS */}
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/12 to-transparent">
          <div className="trace-x-fwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ animationDuration: '5s' }} />
        </div>
        <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent">
          <div className="trace-x-bwd absolute top-0 left-0 w-36 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute top-0 left-[22%] h-full w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent">
          <div className="trace-y-fwd absolute top-0 left-0 h-28 w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent" style={{ animationDuration: '8s' }} />
        </div>
        {/* Ambient orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[130px]" />
        {/* Intersection nodes */}
        <div className="absolute top-[30%] left-[22%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
        <div className="absolute top-[70%] right-[22%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <Reveal className="mb-12">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">ops</span>
            <span className="text-neutral-600">~/live</span>
            <span className="text-white">›</span>
            <span className="text-emerald-400">monitor</span>
            <span className="text-neutral-300">.watch()</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">06.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">DevOps</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Live</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
          <p className="text-sm text-neutral-600 mt-3 font-mono">
            Real-time CI/CD status · GitHub activity · system health — <span className="text-emerald-500">all live</span>
          </p>
        </Reveal>

        {/* ── Main Grid ───────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-5 items-start">

          {/* ── LEFT: Ops Center ─────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* CI/CD Monitor */}
            <Reveal from={{ opacity: 0, x: -30 }}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wide">ci_cd_monitor.sh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${runsMeta.dotClass} shadow-[0_0_6px_rgba(52,211,153,0.9)] ${runsSource === 'live' ? 'opacity-pulse' : ''}`} />
                  <span className={`font-mono text-[10px] ${runsMeta.textClass}`}>{runsMeta.label}</span>
                </div>
              </div>

              {/* Prompt line */}
              <div className="px-4 pt-3 pb-1 font-mono text-[10px] text-neutral-600">
                <span className="text-emerald-400">→</span> watching 3 repositories · {runsSource === 'live' ? 'fresh api results' : runsSource === 'cached' ? 'using cached snapshot' : 'using static defaults'}
              </div>

              {/* Service rows */}
              <div className="px-4 pb-4 space-y-2.5 mt-1">
                {SERVICES.map(svc => {
                  const run = runs[svc.repo]
                  const st = resolveStatus(Object.prototype.hasOwnProperty.call(runs, svc.repo) ? run : undefined)
                  return (
                    <div key={svc.repo} className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all duration-200">
                      {/* Status dot */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dotCls} ${st.glowCls} ${st.pulse ? 'opacity-pulse' : ''}`} />
                      {/* Label + repo */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-mono text-[11px] font-bold ${svc.accentCls}`}>{svc.label}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <GitBranch size={8} className="text-neutral-600 flex-shrink-0" />
                          <p className="font-mono text-[9px] text-neutral-600 truncate">
                            {run?.head_branch ?? svc.short}
                          </p>
                        </div>
                      </div>
                      {/* Status + time */}
                      <div className="text-right flex-shrink-0">
                        <p className={`font-mono text-[10px] font-black tracking-wider ${st.labelCls}`}>{st.label}</p>
                        {run?.updated_at && (
                          <p className="font-mono text-[9px] text-neutral-700 mt-0.5">{timeAgo(run.updated_at)}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/[0.04] bg-black/20 font-mono text-[9px] text-neutral-700">
                <span className="text-emerald-500/70">✓</span> polling github actions api · auto-refresh on load
              </div>
            </Reveal>

            {/* System Vitals */}
            <Reveal from={{ opacity: 0, x: -30 }} delay={0.15}
              className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40">
                <div className="flex items-center gap-2">
                  <Server size={10} className="text-cyan-400" />
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wide">system_vitals.log</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity size={9} className="text-cyan-400" />
                  <span className="font-mono text-[10px] text-cyan-400">ONLINE</span>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2.5">
                {VITALS.map(v => (
                  <div key={v.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/8 transition-colors">
                    <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1.5">{v.label}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${v.dot} ${v.glow} ${v.pulse ? 'opacity-pulse' : ''}`} />
                      <p className={`font-mono text-sm font-black ${v.color}`}>{v.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: Contribution Heatmap ──────────────────────────────── */}
          <Reveal from={{ opacity: 0, x: 30 }} delay={0.1}
            className="bg-neutral-950/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl h-full">
            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[10px] text-neutral-500 tracking-wide">contribution_graph — abhay1999</span>
              </div>
              <div className="flex items-center gap-3">
                {totalContribs !== null && (
                  <span className="font-mono text-[10px] text-neutral-500">
                    <span className="text-emerald-400 font-bold">{totalContribs.toLocaleString()}</span> contributions this year
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${heatmapMeta.dotClass} shadow-[0_0_6px_rgba(52,211,153,0.8)] ${heatmapSource === 'live' ? 'opacity-pulse' : ''}`} />
                  <span className={`font-mono text-[10px] ${heatmapMeta.textClass}`}>{heatmapMeta.label}</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              {heatmapLoading && (
                <div className="flex items-center justify-center h-48">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-emerald-400/60 border-t-emerald-400 rounded-full animate-spin" />
                    <span className="font-mono text-xs text-neutral-500">fetching github activity...</span>
                  </div>
                </div>
              )}

              {heatmapError && (
                <div className="flex items-center justify-center h-48">
                  <span className="font-mono text-xs text-neutral-600">Could not load contribution data. Showing static data until a cached snapshot is available.</span>
                </div>
              )}

              {!heatmapLoading && !heatmapError && weeks.length > 0 && (
                <div className="overflow-x-auto">
                  {/* Month labels */}
                  <div className="relative flex gap-[3px] mb-1 pl-[18px]">
                    {monthLabels.map(({ label, col }) => (
                      <div key={`${label}-${col}`} className="absolute font-mono text-[9px] text-neutral-600" style={{ left: `${18 + col * 13}px` }}>
                        {label}
                      </div>
                    ))}
                    <div className="h-3" />
                  </div>

                  {/* Day labels + grid */}
                  <div className="flex gap-[3px]">
                    <div className="flex flex-col gap-[3px] mr-1 flex-shrink-0">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="w-3 h-[10px] font-mono text-[8px] text-neutral-700 flex items-center justify-center">
                          {i % 2 === 1 ? d : ''}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-[3px]">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[3px]">
                          {week.map((day, di) => (
                            <div key={di}
                              title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                              className={`w-[10px] h-[10px] rounded-[2px] ${CELL_CLS[day.level]} hover:scale-125 transition-transform cursor-default`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-neutral-600">
                      <span className="text-neutral-500">github.com/abhay1999</span> · last 52 weeks
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] text-neutral-600">Less</span>
                      {CELL_CLS.map((cls, i) => (
                        <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${cls}`} />
                      ))}
                      <span className="font-mono text-[9px] text-neutral-600">More</span>
                    </div>
                  </div>

                  {/* Bottom stats bar */}
                  <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.05]">
                    {[
                      { label: 'TOTAL COMMITS',  value: totalContribs?.toLocaleString() ?? '—', color: 'text-emerald-400' },
                      { label: 'ACTIVE WEEKS',   value: `${weeks.filter(w => w.some(d => d.count > 0)).length}`, color: 'text-cyan-400' },
                      { label: 'LONGEST STREAK', value: (() => {
                          let max = 0, cur = 0
                          for (const d of contribs) { cur = d.count > 0 ? cur + 1 : 0; if (cur > max) max = cur }
                          return `${max}d`
                        })(), color: 'text-purple-400' },
                    ].map(s => (
                      <div key={s.label} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                        <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`font-mono text-base font-black ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default DevOpsLive
