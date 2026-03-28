"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GitMerge, GitPullRequest, ArrowUpRight, Star, ExternalLink } from 'lucide-react'

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
  const sx = useSpring(x, { stiffness: 110, damping: 18 })
  const sy = useSpring(y, { stiffness: 110, damping: 18 })
  const rotateX = useTransform(sy, [-0.5, 0.5], ['6deg', '-6deg'])
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg'])

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
      <div style={{ transform: 'translateZ(22px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: 'translateZ(30px)' }}
      />
    </motion.div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
type MergedPR = {
  number: number
  repo: string
  orgInitial: string
  title: string
  description: string
  tags: string[]
  mergedAt: string
  repoStars: string
  url: string
  borderClass: string
  gradientClass: string
  glowStyle: string
  orbClass: string
  dotClass: string
  dot2Class: string
  orgBgClass: string
  orgTextClass: string
  tagClass: string
  accentClass: string
  btnGradient: string
  btnGlow: string
  scanClass: string
  gridColor: string
}

type OpenPR = {
  number: number
  repo: string
  orgInitial: string
  title: string
  tags: string[]
  date: string
  url: string
  dotClass: string
  borderClass: string
  bgClass: string
  orgClass: string
}

// ─── Color Palettes (all static Tailwind strings) ─────────────────────────────
const MERGED_THEMES = [
  {
    borderClass:   'border-cyan-500/25 hover:border-cyan-400/55',
    gradientClass: 'from-cyan-950/55 via-slate-900/75 to-blue-950/55',
    glowStyle:     '0 0 80px -20px rgba(6,182,212,0.35)',
    orbClass:      'border-cyan-500/18',
    dotClass:      'bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,1)]',
    dot2Class:     'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]',
    orgBgClass:    'bg-cyan-500/20 border-cyan-400/50',
    orgTextClass:  'text-cyan-300',
    tagClass:      'bg-cyan-900/40 text-cyan-200 border-cyan-500/30',
    accentClass:   'text-cyan-400',
    btnGradient:   'from-cyan-500 to-blue-500',
    btnGlow:       'shadow-[0_0_22px_rgba(6,182,212,0.4)]',
    scanClass:     'via-cyan-400/50',
    gridColor:     'rgba(34,211,238,0.06)',
  },
  {
    borderClass:   'border-amber-500/25 hover:border-amber-400/55',
    gradientClass: 'from-amber-950/55 via-neutral-900/75 to-orange-950/55',
    glowStyle:     '0 0 80px -20px rgba(245,158,11,0.35)',
    orbClass:      'border-amber-500/18',
    dotClass:      'bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,1)]',
    dot2Class:     'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,1)]',
    orgBgClass:    'bg-amber-500/20 border-amber-400/50',
    orgTextClass:  'text-amber-300',
    tagClass:      'bg-amber-900/40 text-amber-200 border-amber-500/30',
    accentClass:   'text-amber-400',
    btnGradient:   'from-amber-500 to-orange-500',
    btnGlow:       'shadow-[0_0_22px_rgba(245,158,11,0.4)]',
    scanClass:     'via-amber-400/50',
    gridColor:     'rgba(251,191,36,0.06)',
  },
  {
    borderClass:   'border-purple-500/25 hover:border-purple-400/55',
    gradientClass: 'from-purple-950/55 via-slate-900/75 to-indigo-950/55',
    glowStyle:     '0 0 80px -20px rgba(168,85,247,0.35)',
    orbClass:      'border-purple-500/18',
    dotClass:      'bg-purple-400 shadow-[0_0_14px_rgba(192,132,252,1)]',
    dot2Class:     'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,1)]',
    orgBgClass:    'bg-purple-500/20 border-purple-400/50',
    orgTextClass:  'text-purple-300',
    tagClass:      'bg-purple-900/40 text-purple-200 border-purple-500/30',
    accentClass:   'text-purple-400',
    btnGradient:   'from-purple-500 to-indigo-500',
    btnGlow:       'shadow-[0_0_22px_rgba(168,85,247,0.4)]',
    scanClass:     'via-purple-400/50',
    gridColor:     'rgba(192,132,252,0.06)',
  },
  {
    borderClass:   'border-emerald-500/25 hover:border-emerald-400/55',
    gradientClass: 'from-emerald-950/55 via-slate-900/75 to-teal-950/55',
    glowStyle:     '0 0 80px -20px rgba(16,185,129,0.35)',
    orbClass:      'border-emerald-500/18',
    dotClass:      'bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,1)]',
    dot2Class:     'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,1)]',
    orgBgClass:    'bg-emerald-500/20 border-emerald-400/50',
    orgTextClass:  'text-emerald-300',
    tagClass:      'bg-emerald-900/40 text-emerald-200 border-emerald-500/30',
    accentClass:   'text-emerald-400',
    btnGradient:   'from-emerald-500 to-teal-500',
    btnGlow:       'shadow-[0_0_22px_rgba(16,185,129,0.4)]',
    scanClass:     'via-emerald-400/50',
    gridColor:     'rgba(52,211,153,0.06)',
  },
  {
    borderClass:   'border-rose-500/25 hover:border-rose-400/55',
    gradientClass: 'from-rose-950/55 via-slate-900/75 to-pink-950/55',
    glowStyle:     '0 0 80px -20px rgba(244,63,94,0.35)',
    orbClass:      'border-rose-500/18',
    dotClass:      'bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,1)]',
    dot2Class:     'bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,1)]',
    orgBgClass:    'bg-rose-500/20 border-rose-400/50',
    orgTextClass:  'text-rose-300',
    tagClass:      'bg-rose-900/40 text-rose-200 border-rose-500/30',
    accentClass:   'text-rose-400',
    btnGradient:   'from-rose-500 to-pink-500',
    btnGlow:       'shadow-[0_0_22px_rgba(244,63,94,0.4)]',
    scanClass:     'via-rose-400/50',
    gridColor:     'rgba(251,113,133,0.06)',
  },
  {
    borderClass:   'border-blue-500/25 hover:border-blue-400/55',
    gradientClass: 'from-blue-950/55 via-slate-900/75 to-sky-950/55',
    glowStyle:     '0 0 80px -20px rgba(59,130,246,0.35)',
    orbClass:      'border-blue-500/18',
    dotClass:      'bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,1)]',
    dot2Class:     'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)]',
    orgBgClass:    'bg-blue-500/20 border-blue-400/50',
    orgTextClass:  'text-blue-300',
    tagClass:      'bg-blue-900/40 text-blue-200 border-blue-500/30',
    accentClass:   'text-blue-400',
    btnGradient:   'from-blue-500 to-sky-500',
    btnGlow:       'shadow-[0_0_22px_rgba(59,130,246,0.4)]',
    scanClass:     'via-blue-400/50',
    gridColor:     'rgba(96,165,250,0.06)',
  },
]

const OPEN_THEMES = [
  { dotClass: 'bg-blue-400',    borderClass: 'border-l-blue-500/50',    bgClass: 'bg-blue-950/20',    orgClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'       },
  { dotClass: 'bg-emerald-400', borderClass: 'border-l-emerald-500/50', bgClass: 'bg-emerald-950/20', orgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'},
  { dotClass: 'bg-green-400',   borderClass: 'border-l-green-500/50',   bgClass: 'bg-green-950/20',   orgClass: 'bg-green-500/20 text-green-300 border-green-500/30'    },
  { dotClass: 'bg-sky-400',     borderClass: 'border-l-sky-500/50',     bgClass: 'bg-sky-950/20',     orgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30'          },
  { dotClass: 'bg-red-400',     borderClass: 'border-l-red-500/50',     bgClass: 'bg-red-950/20',     orgClass: 'bg-red-500/20 text-red-300 border-red-500/30'          },
  { dotClass: 'bg-orange-400',  borderClass: 'border-l-orange-500/50',  bgClass: 'bg-orange-950/20',  orgClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { dotClass: 'bg-cyan-400',    borderClass: 'border-l-cyan-500/50',    bgClass: 'bg-cyan-950/20',    orgClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'       },
  { dotClass: 'bg-indigo-400',  borderClass: 'border-l-indigo-500/50',  bgClass: 'bg-indigo-950/20',  orgClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { dotClass: 'bg-teal-400',    borderClass: 'border-l-teal-500/50',    bgClass: 'bg-teal-950/20',    orgClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30'       },
  { dotClass: 'bg-purple-400',  borderClass: 'border-l-purple-500/50',  bgClass: 'bg-purple-950/20',  orgClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getOpenTheme(repo: string) {
  const code = (repo.charCodeAt(0) ?? 0) + (repo.charCodeAt(1) ?? 0)
  return OPEN_THEMES[code % OPEN_THEMES.length]
}

function repoFromUrl(url: string): string {
  return url.replace('https://api.github.com/repos/', '')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function inferTags(title: string, repo: string): string[] {
  const t = (title + ' ' + repo).toLowerCase()
  const tags: string[] = []
  if (t.includes('helm') || t.includes('chart'))                                                           tags.push('Helm')
  if (t.includes('kube') || t.includes('kubernetes') || t.includes('k8s'))                                tags.push('Kubernetes')
  if (t.includes('docker') || t.includes('container'))                                                    tags.push('Docker')
  if (['jaeger','goreleaser','meshery','helm','argo','prometheus'].some(r => t.includes(r)))               tags.push('Go')
  if (t.includes('typescript') || t.includes('grafana/grafana'))                                          tags.push('TypeScript')
  if (t.includes('java') || t.includes('jenkins'))                                                        tags.push('Java')
  if (t.includes('gha') || t.includes('github action') || t.includes('workflow'))                         tags.push('GHA')
  if (t.includes('security') || t.includes('csp') || t.includes('xss') || t.includes('frame-option'))    tags.push('Security')
  if (['helm/helm','jaeger','argoproj'].some(r => t.includes(r)))                                         tags.push('CNCF')
  if (t.includes('grafana') || t.includes('dashboard') || t.includes('monitor'))                          tags.push('Grafana')
  if (t.includes('ci') || t.includes('release'))                                                          tags.push('CI/CD')
  if (t.includes('database') || t.includes('sql') || t.includes('query') || t.includes('n+1'))           tags.push('Database')
  if (t.includes('android'))                                                                               tags.push('Android')
  if (t.includes('observab') || t.includes('spm') || t.includes('metric'))                                tags.push('Observability')
  if (t.includes('testing') || t.includes('linter') || t.includes('overflow'))                            tags.push('Testing')
  if (t.includes('nvidia') || t.includes('nemo') || t.includes('nim'))                                    tags.push('AI/ML')
  return tags.length > 0 ? tags.slice(0, 3) : ['Open Source']
}

// ─── Static Fallback Data ─────────────────────────────────────────────────────
const STATIC_MERGED: MergedPR[] = [
  {
    number: 31931,
    repo: 'helm/helm',
    orgInitial: 'H',
    title: 'pkg/kube: remove legacy import comments',
    description: 'Fixed a legacy bug causing downstream Kythe static analysis failures by migrating pre-Go modules import path comments to modern go.mod conventions across the entire pkg/kube package.',
    tags: ['Go', 'Kubernetes', 'CNCF'],
    mergedAt: 'Mar 12, 2026',
    repoStars: '29k+',
    url: 'https://github.com/helm/helm/pull/31931',
    ...MERGED_THEMES[0],
  },
  {
    number: 6462,
    repo: 'goreleaser/goreleaser',
    orgInitial: 'G',
    title: 'fix: filterOut returns excluded tag when multiple ignore_tags are set',
    description: 'Resolved a release pipeline bug where multiple ignore_tags configurations caused incorrect tag exclusion logic, preventing valid releases from being filtered out incorrectly.',
    tags: ['Go', 'CI/CD', 'Release Automation'],
    mergedAt: 'Mar 17, 2026',
    repoStars: '14k+',
    url: 'https://github.com/goreleaser/goreleaser/pull/6462',
    ...MERGED_THEMES[1],
  },
  {
    number: 8215,
    repo: 'jaegertracing/jaeger',
    orgInitial: 'J',
    title: 'feat(monitor): restore Grafana to SPM docker-compose example',
    description: 'Restored the Grafana service to the Service Performance Monitoring docker-compose configuration as part of the ADR-007 observability stack migration, enabling out-of-the-box SPM dashboards.',
    tags: ['Go', 'Grafana', 'Docker', 'CNCF'],
    mergedAt: 'Mar 21, 2026',
    repoStars: '20k+',
    url: 'https://github.com/jaegertracing/jaeger/pull/8215',
    ...MERGED_THEMES[2],
  },
  {
    number: 8216,
    repo: 'jaegertracing/jaeger',
    orgInitial: 'J',
    title: 'feat(monitor): Go SDK dashboard generator — ADR-007 Step 2a',
    description: 'Implemented a Go SDK-based Grafana dashboard generator for the Service Performance Monitoring stack as part of ADR-007 Step 2a, enabling programmatic dashboard provisioning for the Jaeger observability pipeline.',
    tags: ['Go', 'Grafana', 'CNCF', 'Observability'],
    mergedAt: 'Mar 24, 2026',
    repoStars: '20k+',
    url: 'https://github.com/jaegertracing/jaeger/pull/8216',
    ...MERGED_THEMES[3],
  },
]

const STATIC_OPEN: OpenPR[] = [
  { number: 26918,  repo: 'argoproj/argo-cd',         orgInitial: 'A', title: 'fix: add X-Frame-Options and CSP headers to Swagger UI endpoints',              tags: ['Go', 'Security'],        date: 'Mar 19', url: 'https://github.com/argoproj/argo-cd/pull/26918',          dotClass: 'bg-blue-400',    borderClass: 'border-l-blue-500/50',    bgClass: 'bg-blue-950/20',   orgClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'     },
  { number: 18039,  repo: 'meshery/meshery',           orgInitial: 'M', title: 'fix: optimize GetSystemDatabase to avoid N+1 queries',                          tags: ['Go', 'Database'],        date: 'Mar 18', url: 'https://github.com/meshery/meshery/pull/18039',           dotClass: 'bg-emerald-400', borderClass: 'border-l-emerald-500/50', bgClass: 'bg-emerald-950/20',orgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'},
  { number: 1645,   repo: 'NVIDIA/NeMo-Retriever',     orgInitial: 'N', title: 'helm: add nodeSelector and tolerations to NIMCache templates',                  tags: ['Helm', 'Kubernetes'],    date: 'Mar 18', url: 'https://github.com/NVIDIA/NeMo-Retriever/pull/1645',      dotClass: 'bg-green-400',   borderClass: 'border-l-green-500/50',   bgClass: 'bg-green-950/20',  orgClass: 'bg-green-500/20 text-green-300 border-green-500/30'  },
  { number: 6861,   repo: 'docker/cli',                orgInitial: 'D', title: 'testing: address G115 integer overflow conversion warnings and re-enable linter',tags: ['Go', 'Testing'],         date: 'Mar 17', url: 'https://github.com/docker/cli/pull/6861',                 dotClass: 'bg-sky-400',     borderClass: 'border-l-sky-500/50',     bgClass: 'bg-sky-950/20',    orgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30'        },
  { number: 26473,  repo: 'jenkinsci/jenkins',         orgInitial: 'J', title: 'Fix ParserConfigurator to not reference Jenkins class on agents',                tags: ['Java', 'Jenkins'],       date: 'Mar 17', url: 'https://github.com/jenkinsci/jenkins/pull/26473',         dotClass: 'bg-red-400',     borderClass: 'border-l-red-500/50',     bgClass: 'bg-red-950/20',    orgClass: 'bg-red-500/20 text-red-300 border-red-500/30'        },
  { number: 120374, repo: 'grafana/grafana',           orgInitial: 'G', title: 'fix(email): remove external remote content from email templates',                tags: ['TypeScript', 'Security'],date: 'Mar 15', url: 'https://github.com/grafana/grafana/pull/120374',          dotClass: 'bg-orange-400',  borderClass: 'border-l-orange-500/50',  bgClass: 'bg-orange-950/20', orgClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30'},
  { number: 31933,  repo: 'helm/helm',                 orgInitial: 'H', title: 'remove legacy import comments from remaining packages',                          tags: ['Go', 'CNCF'],            date: 'Mar 12', url: 'https://github.com/helm/helm/pull/31933',                 dotClass: 'bg-cyan-400',    borderClass: 'border-l-cyan-500/50',    bgClass: 'bg-cyan-950/20',   orgClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'     },
  { number: 34645,  repo: 'openvinotoolkit/openvino',  orgInitial: 'O', title: 'GHA(Android): parameterize emulator test artifact names via matrix',            tags: ['GHA', 'Android'],        date: 'Mar 12', url: 'https://github.com/openvinotoolkit/openvino/pull/34645',  dotClass: 'bg-indigo-400',  borderClass: 'border-l-indigo-500/50',  bgClass: 'bg-indigo-950/20', orgClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'},
  { number: 114,    repo: 'Rancheroo/r8s',             orgInitial: 'R', title: 'feat: add multi-arch Docker image and GHCR publish workflow',                   tags: ['Docker', 'GHA'],         date: 'Mar 11', url: 'https://github.com/Rancheroo/r8s/pull/114',               dotClass: 'bg-teal-400',    borderClass: 'border-l-teal-500/50',    bgClass: 'bg-teal-950/20',   orgClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30'     },
]

// ─── Component ────────────────────────────────────────────────────────────────
const OpenSource = () => {
  const [mergedPRs, setMergedPRs] = useState<MergedPR[]>(STATIC_MERGED)
  const [openPRs,   setOpenPRs]   = useState<OpenPR[]>(STATIC_OPEN)
  const [isLive,    setIsLive]    = useState(false)

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const headers = { Accept: 'application/vnd.github.v3+json' }
        const [mRes, oRes] = await Promise.all([
          fetch('https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:merged&per_page=30&sort=updated&order=desc', { headers }),
          fetch('https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:open&per_page=30&sort=updated&order=desc',   { headers }),
        ])
        if (!mRes.ok || !oRes.ok) return
        const [mData, oData] = await Promise.all([mRes.json(), oRes.json()])

        // Merged: keep static entries (with rich descriptions), append any new ones
        const knownNumbers = new Set(STATIC_MERGED.map(p => p.number))
        const updatedMerged: MergedPR[] = [...STATIC_MERGED]
        let newIdx = 0
        for (const item of (mData.items ?? [])) {
          if (!knownNumbers.has(item.number)) {
            const repo  = repoFromUrl(item.repository_url)
            const theme = MERGED_THEMES[(STATIC_MERGED.length + newIdx) % MERGED_THEMES.length]
            updatedMerged.push({
              number:      item.number,
              repo,
              orgInitial:  repo.split('/')[0][0]?.toUpperCase() ?? '?',
              title:       item.title,
              description: item.title,
              tags:        inferTags(item.title, repo),
              mergedAt:    formatDate(item.closed_at ?? item.created_at),
              repoStars:   '',
              url:         item.html_url,
              ...theme,
            })
            newIdx++
          }
        }

        // Open: fully live — filter out ancient junk PRs (2018 test repos)
        const liveOpen: OpenPR[] = (oData.items ?? [])
          .filter((item: { title: string; created_at: string }) =>
            item.created_at > '2020-01-01' && item.title.trim().split(' ').length > 1
          )
          .map((item: { number: number; repository_url: string; title: string; created_at: string; html_url: string }) => {
            const repo  = repoFromUrl(item.repository_url)
            const theme = getOpenTheme(repo)
            return {
              number:     item.number,
              repo,
              orgInitial: repo.split('/')[0][0]?.toUpperCase() ?? '?',
              title:      item.title,
              tags:       inferTags(item.title, repo),
              date:       formatShortDate(item.created_at),
              url:        item.html_url,
              ...theme,
            }
          })

        setMergedPRs(updatedMerged)
        setOpenPRs(liveOpen.length > 0 ? liveOpen : STATIC_OPEN)
        setIsLive(true)
      } catch {
        // silently keep static fallback
      }
    }
    fetchPRs()
  }, [])

  const mergedCount = mergedPRs.length
  const openCount   = openPRs.length
  const totalCount  = mergedCount + openCount

  const STATS = [
    { value: String(mergedCount), label: 'Merged PRs',  icon: GitMerge,       accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]'  },
    { value: String(openCount),   label: 'Open PRs',    icon: GitPullRequest,  accent: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]'  },
    { value: '8+',                label: 'Orgs',        icon: Star,            accent: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]' },
    { value: '60k+',              label: 'Repo Stars',  icon: Star,            accent: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]'  },
  ]

  return (
    <section id="opensource" className="relative py-32 overflow-hidden bg-black">

      {/* ── Background System ─────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(52,211,153,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52,211,153,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(52,211,153,0.9) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(52,211,153,0.9) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
          }}
        />
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/12 to-transparent">
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
        </div>
        <div className="absolute top-[68%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <motion.div animate={{ x: ['200%', '-100%'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
        <div className="absolute top-0 left-[15%] h-full w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent">
          <motion.div animate={{ y: ['-100%', '200%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
            className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent" />
        </div>
        <div className="absolute top-0 right-[15%] h-full w-px bg-gradient-to-b from-transparent via-purple-500/10 to-transparent">
          <motion.div animate={{ y: ['200%', '-100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
        </div>
        <div className="absolute top-[20%] left-[15%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
        <div className="absolute top-[20%] right-[15%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
        <div className="absolute top-[68%] left-[15%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_3px_rgba(192,132,252,0.6)]" />
        <div className="absolute top-[68%] right-[15%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_12px_3px_rgba(251,191,36,0.6)]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />
        <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/4 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">git</span>
            <span className="text-neutral-600">~/github</span>
            <span className="text-white">›</span>
            <span className="text-emerald-400">pr_activity</span>
            <span className="text-neutral-300">.scan()</span>
            {isLive && (
              <span className="flex items-center gap-1 ml-1">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-emerald-500 text-[10px]">live</span>
              </span>
            )}
            {!isLive && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
                className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5" />
            )}
          </div>

          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">04.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Open Source</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Contributions</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </motion.div>

        {/* ── Stats Bar ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-16"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${s.bg} ${s.border} ${s.glow} backdrop-blur-sm`}
            >
              <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                <s.icon size={16} className={s.accent} />
              </div>
              <div>
                <div className={`text-2xl font-black font-mono ${s.accent} leading-none`}>{s.value}</div>
                <div className="text-[11px] text-neutral-500 font-medium mt-0.5 leading-none">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Merged PRs ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-7"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 font-mono">Merged Pull Requests</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
          <span className="text-xs font-mono text-neutral-600">{mergedCount} merged</span>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5 mb-16">
          {mergedPRs.map((pr, idx) => (
            <motion.div
              key={pr.number}
              initial={{ opacity: 0, y: 40, rotateX: 6 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
              className="group [perspective:900px]"
            >
              <TiltCard
                className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 bg-gradient-to-br ${pr.gradientClass} ${pr.borderClass}`}
                style={{ boxShadow: pr.glowStyle }}
              >
                {/* Grid texture */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage: `linear-gradient(to right,${pr.gridColor} 1px,transparent 1px),linear-gradient(to bottom,${pr.gridColor} 1px,transparent 1px)`,
                    backgroundSize: '28px 28px',
                  }}
                />
                {/* Scan line */}
                <motion.div
                  animate={{ y: ['-100%', '600%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 6 + idx }}
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${pr.scanClass} to-transparent pointer-events-none z-20`}
                />

                {/* ── Visual Strip ── */}
                <div className="relative h-44 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div aria-hidden="true" className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div aria-hidden="true" className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div aria-hidden="true" className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div aria-hidden="true" className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-white/20" />

                  <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 20 + idx * 4, repeat: Infinity, ease: 'linear' }}
                    className={`absolute w-32 h-32 rounded-full border ${pr.orbClass}`}>
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${pr.dotClass}`} />
                  </motion.div>
                  <motion.div aria-hidden="true" animate={{ rotate: -360 }} transition={{ duration: 14 + idx * 3, repeat: Infinity, ease: 'linear' }}
                    className={`absolute w-20 h-20 rounded-full border ${pr.orbClass} opacity-60`}>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full ${pr.dot2Class}`} />
                  </motion.div>

                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.8 }}
                    className={`relative z-10 w-14 h-14 rounded-2xl ${pr.orgBgClass} border flex items-center justify-center backdrop-blur-xl`}
                  >
                    <span className={`text-xl font-black font-mono ${pr.orgTextClass} select-none`}>{pr.orgInitial}</span>
                  </motion.div>

                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-500/40 backdrop-blur-md">
                    <GitMerge size={9} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-300 font-mono tracking-widest">MERGED</span>
                  </div>

                  {pr.repoStars && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                      <Star size={9} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-mono text-neutral-300">{pr.repoStars}</span>
                    </div>
                  )}
                </div>

                {/* ── Content ── */}
                <div className="flex flex-col flex-1 p-6" style={{ transform: 'translateZ(8px)' }}>
                  <div className="mb-1">
                    <span className={`text-[11px] font-mono ${pr.accentClass} opacity-70`}>{pr.repo} #{pr.number}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
                    {pr.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed flex-1 mb-4 line-clamp-3">
                    {pr.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pr.tags.map(t => (
                      <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${pr.tagClass}`}>{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
                    <span className="text-[11px] text-neutral-600 font-mono">{pr.mergedAt}</span>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View PR #${pr.number} on GitHub`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r ${pr.btnGradient} text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity ${pr.btnGlow}`}
                    >
                      View PR
                      <ArrowUpRight size={11} />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* ── Active Contributions ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-7"
        >
          <div className="flex items-center gap-2.5">
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-mono">Active Contributions</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
          <span className="text-xs font-mono text-neutral-600">{openCount} open</span>
        </motion.div>

        {/* Terminal panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-slate-950/80 via-black/90 to-cyan-950/20 overflow-hidden mb-10"
          style={{ boxShadow: '0 0 80px -25px rgba(34,211,238,0.12)' }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right,rgba(34,211,238,0.8) 1px,transparent 1px),linear-gradient(to bottom,rgba(34,211,238,0.8) 1px,transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Title bar */}
          <div className="relative flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs font-mono text-neutral-500 tracking-wider">gh pr list --author abhay1999 --state open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div animate={{ opacity: isLive ? [1, 0.4, 1] : 1 }} transition={{ duration: 1.4, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-neutral-600'}`} />
              <span className={`text-[10px] font-mono ${isLive ? 'text-cyan-400' : 'text-neutral-600'}`}>
                {isLive ? 'LIVE' : 'CACHED'}
              </span>
            </div>
          </div>

          {/* PR list */}
          <div className="p-5 grid sm:grid-cols-2 gap-3">
            {openPRs.map((pr, idx) => (
              <motion.a
                key={pr.number}
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className={`group/pr relative flex items-start gap-3 p-4 rounded-2xl border-l-2 ${pr.borderClass} ${pr.bgClass} border border-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-9 h-9 rounded-xl border text-xs font-black font-mono flex items-center justify-center shrink-0 ${pr.orgClass}`}>
                  {pr.orgInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-neutral-600 truncate">{pr.repo}</span>
                    <span className="text-[10px] font-mono text-neutral-700 shrink-0">#{pr.number}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-snug line-clamp-2 group-hover/pr:text-white transition-colors mb-2">
                    {pr.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pr.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-500 border border-white/[0.05]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-500/25">
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: idx * 0.15 }}
                      className={`w-1.5 h-1.5 rounded-full ${pr.dotClass}`} />
                    <span className="text-[9px] font-mono text-cyan-400 font-bold">OPEN</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-700">{pr.date}</span>
                  <ExternalLink size={10} className="text-neutral-700 group-hover/pr:text-neutral-400 transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>

          <div className="h-4 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>

        {/* ── GitHub CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://github.com/abhay1999"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/25 text-white rounded-2xl hover:border-emerald-400/50 hover:from-emerald-500/25 hover:to-cyan-500/25 transition-all duration-300 font-medium"
            style={{ boxShadow: '0 0 30px -10px rgba(52,211,153,0.2)' }}
          >
            <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-emerald-400">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View GitHub Profile
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
            <GitPullRequest size={12} className="text-cyan-500/50" />
            <span>{totalCount}+ total contributions · {isLive ? 'live data' : 'growing'}</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default OpenSource
