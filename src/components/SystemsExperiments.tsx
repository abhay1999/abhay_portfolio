"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { GitCommit, Package, FlaskConical, Shield, Rocket, CheckCircle2, Loader2, Circle, Play, RefreshCw } from 'lucide-react'
import Reveal from '@/components/Reveal'

// ─── Pipeline stages ──────────────────────────────────────────────────────────
type StageStatus = 'idle' | 'running' | 'passed' | 'failed'

const STAGES = [
  {
    id: 'trigger',
    name: 'Trigger',
    icon: GitCommit,
    accentClass: 'text-neutral-400',
    glowColor: 'rgba(156,163,175,0.6)',
    durationMs: 800,
    logs: [
      { t: 0,   line: '$ git push origin main' },
      { t: 300, line: 'Webhook received — push event on main' },
      { t: 600, line: 'Pipeline #142 queued · commit: 9008d24' },
    ],
  },
  {
    id: 'build',
    name: 'Build',
    icon: Package,
    accentClass: 'text-blue-400',
    glowColor: 'rgba(96,165,250,0.6)',
    durationMs: 3800,
    logs: [
      { t: 0,    line: '$ docker build -t app:142 .' },
      { t: 600,  line: 'Step 1/8: FROM node:18-alpine' },
      { t: 1200, line: 'Step 4/8: RUN npm ci --only=production' },
      { t: 2200, line: 'Step 6/8: COPY . .' },
      { t: 3000, line: 'Step 8/8: EXPOSE 3000' },
      { t: 3600, line: '✓ Image built: 148 MB · layer cache: 74%' },
    ],
  },
  {
    id: 'test',
    name: 'Test',
    icon: FlaskConical,
    accentClass: 'text-cyan-400',
    glowColor: 'rgba(34,211,238,0.6)',
    durationMs: 3400,
    logs: [
      { t: 0,    line: '$ jest --coverage --runInBand' },
      { t: 800,  line: 'PASS  src/api/health.test.ts' },
      { t: 1500, line: 'PASS  src/operator/controller.test.ts' },
      { t: 2200, line: 'PASS  src/helm/values.test.ts' },
      { t: 2900, line: '✓ 47 tests passed  |  0 failed  |  coverage: 84%' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    accentClass: 'text-amber-400',
    glowColor: 'rgba(251,191,36,0.6)',
    durationMs: 2800,
    logs: [
      { t: 0,    line: '$ trivy image app:142 --exit-code 1' },
      { t: 700,  line: 'Scanning image layers...' },
      { t: 1400, line: '✓ 0 CRITICAL  ·  2 MEDIUM (ignored)  ·  0 HIGH' },
      { t: 1900, line: '$ sonar-scanner -Dsonar.projectKey=app' },
      { t: 2500, line: '✓ SonarQube Quality Gate: PASSED' },
    ],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    icon: Rocket,
    accentClass: 'text-emerald-400',
    glowColor: 'rgba(52,211,153,0.6)',
    durationMs: 3200,
    logs: [
      { t: 0,    line: '$ docker push registry.io/app:142' },
      { t: 700,  line: '$ helm upgrade --install app ./chart --atomic' },
      { t: 1400, line: 'Release "app" has been upgraded. Happy Helming!' },
      { t: 2000, line: '$ kubectl rollout status deploy/app -n prod' },
      { t: 2700, line: '✓ Deployment: 3/3 replicas Ready — pipeline SUCCESS' },
    ],
  },
]

type LogEntry = { id: number; line: string; stageId: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StageIcon({ stage, status }: { stage: typeof STAGES[0]; status: StageStatus }) {
  const Icon = stage.icon
  if (status === 'passed') return <CheckCircle2 size={16} className="text-emerald-400" />
  if (status === 'running') return <Loader2 size={16} className={`${stage.accentClass} animate-spin`} />
  if (status === 'failed')  return <Circle size={16} className="text-red-400" />
  return <Icon size={16} className="text-neutral-700" />
}

// ─── Component ────────────────────────────────────────────────────────────────
const SystemsExperiments = () => {
  const [statuses, setStatuses]   = useState<Record<string, StageStatus>>({})
  const [logs, setLogs]           = useState<LogEntry[]>([])
  const [activeStage, setActive]  = useState<string | null>(null)
  const [buildNum, setBuildNum]   = useState(142)
  const [totalMs, setTotalMs]     = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isDone, setIsDone]       = useState(false)
  const logRef   = useRef<HTMLDivElement>(null)
  const runRef   = useRef(false)
  const logIdRef = useRef(0)

  const appendLog = useCallback((line: string, stageId: string) => {
    setLogs(prev => [...prev, { id: logIdRef.current++, line, stageId }].slice(-60))
  }, [])

  const runPipeline = useCallback(async () => {
    if (runRef.current) return
    runRef.current = true
    setIsRunning(true)
    setIsDone(false)
    setLogs([])
    setStatuses({})
    setActive(null)
    const num = buildNum + 1
    setBuildNum(num)
    const start = Date.now()

    for (const stage of STAGES) {
      if (!runRef.current) break
      setActive(stage.id)
      setStatuses(prev => ({ ...prev, [stage.id]: 'running' }))

      for (const entry of stage.logs) {
        if (!runRef.current) break
        await new Promise(r => setTimeout(r, entry.t === 0 ? 0 : entry.t - (stage.logs[stage.logs.indexOf(entry) - 1]?.t ?? 0)))
        appendLog(entry.line.replace('142', String(num)), stage.id)
      }

      const elapsed = stage.logs[stage.logs.length - 1]?.t ?? 0
      await new Promise(r => setTimeout(r, stage.durationMs - elapsed))

      setStatuses(prev => ({ ...prev, [stage.id]: 'passed' }))
    }

    setTotalMs(Date.now() - start)
    setActive(null)
    setIsRunning(false)
    setIsDone(true)
    runRef.current = false
  }, [buildNum, appendLog])

  useEffect(() => {
    const t = setTimeout(() => runPipeline(), 800)
    return () => { clearTimeout(t); runRef.current = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const handleTrigger = () => {
    runRef.current = false
    setTimeout(() => runPipeline(), 50)
  }

  const fmtDuration = (ms: number) => ms >= 60000 ? `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s` : `${(ms / 1000).toFixed(1)}s`

  return (
    <section id="systems" className="relative py-20 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 60%, #080628 0%, #040316 45%, #000 100%)' }}>

      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(96,165,250,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.8) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Reveal className="mb-10">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-blue-400">$</span>
            <span className="text-neutral-400">experiments</span>
            <span className="text-neutral-600">~/systems</span>
            <span className="text-white">›</span>
            <span className="text-blue-400">pipeline</span>
            <span className="text-neutral-300">.trigger()</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-blue-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">Systems</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mt-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Systems &</span>{' '}
                <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Experiments</span>
              </h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-4" />
          </div>
        </Reveal>

        {/* ── CI/CD Pipeline Demo ──────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 40 }}>
          <div className="relative rounded-3xl border border-blue-500/15 bg-gradient-to-br from-neutral-950/90 via-black/95 to-blue-950/10 overflow-hidden"
            style={{ boxShadow: '0 0 80px -30px rgba(96,165,250,0.12)' }}>

            {/* Scanline */}
            <div aria-hidden="true"
              className="scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none z-20" />

            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-[11px] text-neutral-500">CI/CD Pipeline Demo · GitHub Actions → EKS</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-neutral-600">Build #{buildNum}</span>
                {isDone && totalMs > 0 && (
                  <span className="font-mono text-[10px] text-emerald-400">
                    ✓ {fmtDuration(totalMs)}
                  </span>
                )}
                <button
                  onClick={handleTrigger}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 hover:scale-[1.03] active:scale-[0.97]"
                >
                  {isRunning
                    ? <><Loader2 size={10} className="animate-spin" /> Running</>
                    : <><Play size={10} /> Trigger Build</>
                  }
                </button>
              </div>
            </div>

            {/* Pipeline stages */}
            <div className="px-5 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-0 overflow-x-auto">
                {STAGES.map((stage, idx) => {
                  const status = statuses[stage.id] ?? 'idle'
                  const isActive = activeStage === stage.id
                  return (
                    <div key={stage.id} className="flex items-center shrink-0">
                      {/* Stage node */}
                      <div className={`relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-300 min-w-[88px] ${
                        isActive  ? 'bg-white/[0.05] border border-white/10' :
                        status === 'passed' ? 'bg-emerald-500/5 border border-emerald-500/15' :
                        'bg-white/[0.02] border border-white/[0.04]'
                      }`}>
                        {/* Glow on active */}
                        {isActive && (
                          <div className="opacity-pulse absolute inset-0 rounded-2xl border pointer-events-none"
                            style={{ borderColor: stage.glowColor, boxShadow: `0 0 20px -5px ${stage.glowColor}` }} />
                        )}
                        <StageIcon stage={stage} status={status} />
                        <span className={`font-mono text-[10px] font-semibold ${
                          status === 'passed' ? 'text-emerald-400' :
                          isActive ? stage.accentClass : 'text-neutral-600'
                        }`}>{stage.name}</span>
                        {status === 'passed' && (
                          <span className="font-mono text-[8px] text-emerald-500/70">PASSED</span>
                        )}
                        {isActive && (
                          <span className={`opacity-pulse font-mono text-[8px] ${stage.accentClass}`}>RUNNING</span>
                        )}
                        {status === 'idle' && !isActive && (
                          <span className="font-mono text-[8px] text-neutral-800">QUEUED</span>
                        )}
                      </div>

                      {/* Connector */}
                      {idx < STAGES.length - 1 && (
                        <div className="flex items-center w-8 shrink-0">
                          <div className={`h-px w-full transition-colors duration-500 ${
                            statuses[STAGES[idx + 1]?.id ?? ''] === 'passed' || statuses[STAGES[idx + 1]?.id ?? ''] === 'running' || activeStage === STAGES[idx + 1]?.id
                              ? 'bg-emerald-500/50' : 'bg-white/10'
                          }`} />
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 ${
                            statuses[stage.id] === 'passed' ? 'bg-emerald-400' : 'bg-white/15'
                          }`} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Log output + stage details */}
            <div className="grid lg:grid-cols-[1fr_300px] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

              {/* Live log stream */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-black/20">
                  <div className="flex items-center gap-2">
                    <div className={`${isRunning ? 'opacity-pulse' : ''} w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-blue-400' : isDone ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Pipeline Logs</span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-700">{logs.length} lines</span>
                </div>
                <div ref={logRef} className="p-4 font-mono text-[11px] space-y-1 overflow-y-auto bg-black/30"
                  style={{ minHeight: '220px', maxHeight: '220px', scrollbarWidth: 'none' }}>
                  {logs.map(entry => {
                    const stage = STAGES.find(s => s.id === entry.stageId)
                    const isSuccess = entry.line.startsWith('✓')
                    return (
                      <div key={entry.id} className="flex gap-2 leading-relaxed">
                        <span className={`shrink-0 ${stage?.accentClass ?? 'text-neutral-600'} opacity-60`}>›</span>
                        <span className={isSuccess ? 'text-emerald-300' : 'text-neutral-400'}>{entry.line}</span>
                      </div>
                    )
                  })}
                  {isRunning && (
                    <div className="flex gap-2">
                      <span className="text-neutral-600">›</span>
                      <span className="cursor-blink text-blue-400">█</span>
                    </div>
                  )}
                  {!isRunning && !isDone && logs.length === 0 && (
                    <span className="text-neutral-700">Waiting for pipeline trigger...</span>
                  )}
                </div>
              </div>

              {/* Stage summary panel */}
              <div className="p-4 space-y-2">
                <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-3">Stage Summary</p>
                {STAGES.map(stage => {
                  const status = statuses[stage.id] ?? 'idle'
                  const isActive = activeStage === stage.id
                  return (
                    <div key={stage.id}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all duration-300 ${
                        isActive  ? 'bg-white/[0.04] border-white/10' :
                        status === 'passed' ? 'bg-emerald-500/5 border-emerald-500/10' :
                        'bg-white/[0.02] border-white/[0.04]'
                      }`}>
                      <StageIcon stage={stage} status={status} />
                      <span className={`font-mono text-xs flex-1 ${
                        status === 'passed' ? 'text-neutral-300' :
                        isActive ? 'text-white font-semibold' : 'text-neutral-700'
                      }`}>{stage.name}</span>
                      <span className={`font-mono text-[9px] ${
                        status === 'passed' ? 'text-emerald-400' :
                        isActive ? stage.accentClass : 'text-neutral-800'
                      }`}>
                        {status === 'passed' ? '✓' : isActive ? '...' : '○'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Before / After impact bar */}
            <div className="border-t border-white/[0.06] bg-black/30 px-5 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                <div>
                  <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">Before — Manual Deploy</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-red-400/70 line-through">45 min</span>
                    <span className="font-mono text-[10px] text-neutral-600">error-prone · single env · no rollback</span>
                  </div>
                </div>
                <div className="text-2xl text-neutral-700 hidden sm:block">→</div>
                <div>
                  <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-1">After — Automated Pipeline</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-black text-emerald-400">~4 min</span>
                    <span className="font-mono text-[10px] text-neutral-600">0 CVEs · 84% coverage · auto-rollback</span>
                  </div>
                </div>
                <div className="sm:ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <RefreshCw size={11} className="text-emerald-400" />
                  <span className="font-mono text-[11px] font-bold text-emerald-300">~91% faster</span>
                </div>
              </div>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  )
}

export default SystemsExperiments
