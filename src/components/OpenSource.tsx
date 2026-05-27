"use client"

import { useState, useEffect } from 'react'
import { GitMerge, GitPullRequest, ArrowUpRight, Star, ExternalLink, Zap, Shield, GitBranch, BarChart3 } from 'lucide-react'
import { fetchJsonWithTimeout, readCachedValue, writeCachedValue, type DataSourceState } from '@/lib/client-data'
import Reveal from '@/components/Reveal'

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
  accentClass: string
  tagClass: string
  orgBgClass: string
  orgTextClass: string
  borderAccent: string
  glowColor: string
  dotClass: string
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

// ─── Compact card themes ──────────────────────────────────────────────────────
const MERGED_THEMES = [
  { accentClass: 'text-cyan-400',    tagClass: 'bg-cyan-900/40 text-cyan-200 border-cyan-500/30',    orgBgClass: 'bg-cyan-500/15 border-cyan-400/40',    orgTextClass: 'text-cyan-300',    borderAccent: 'border-l-cyan-500',    glowColor: 'rgba(34,211,238,0.15)',   dotClass: 'bg-cyan-400'    },
  { accentClass: 'text-amber-400',   tagClass: 'bg-amber-900/40 text-amber-200 border-amber-500/30', orgBgClass: 'bg-amber-500/15 border-amber-400/40',  orgTextClass: 'text-amber-300',   borderAccent: 'border-l-amber-500',   glowColor: 'rgba(251,191,36,0.15)',   dotClass: 'bg-amber-400'   },
  { accentClass: 'text-purple-400',  tagClass: 'bg-purple-900/40 text-purple-200 border-purple-500/30',orgBgClass: 'bg-purple-500/15 border-purple-400/40',orgTextClass: 'text-purple-300', borderAccent: 'border-l-purple-500',  glowColor: 'rgba(192,132,252,0.15)',  dotClass: 'bg-purple-400'  },
  { accentClass: 'text-emerald-400', tagClass: 'bg-emerald-900/40 text-emerald-200 border-emerald-500/30',orgBgClass: 'bg-emerald-500/15 border-emerald-400/40',orgTextClass: 'text-emerald-300',borderAccent: 'border-l-emerald-500',glowColor: 'rgba(52,211,153,0.15)',   dotClass: 'bg-emerald-400' },
  { accentClass: 'text-rose-400',    tagClass: 'bg-rose-900/40 text-rose-200 border-rose-500/30',    orgBgClass: 'bg-rose-500/15 border-rose-400/40',    orgTextClass: 'text-rose-300',    borderAccent: 'border-l-rose-500',    glowColor: 'rgba(251,113,133,0.15)', dotClass: 'bg-rose-400'    },
  { accentClass: 'text-blue-400',    tagClass: 'bg-blue-900/40 text-blue-200 border-blue-500/30',    orgBgClass: 'bg-blue-500/15 border-blue-400/40',    orgTextClass: 'text-blue-300',    borderAccent: 'border-l-blue-500',    glowColor: 'rgba(96,165,250,0.15)',  dotClass: 'bg-blue-400'    },
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
// ─── Org logos (GitHub avatar URLs) ──────────────────────────────────────────
const ORG_LOGOS: Record<string, string> = {
  'golang/tools':             'golang',
  'golang/website':           'golang',
  'golang/go':                'golang',
  'jaegertracing/jaeger':     'jaegertracing',
  'helm/helm':                'helm',
  'helm/helm-www':            'helm',
  'goreleaser/goreleaser':    'goreleaser',
  'argoproj/argo-cd':         'argoproj',
  'meshery/meshery':          'layer5io',
  'layer5io/layer5':          'layer5io',
  'docker/cli':               'docker',
  'docker/buildx':            'docker',
  'grafana/grafana':          'grafana',
  'jenkinsci/jenkins':        'jenkinsci',
  'NVIDIA/NeMo-Retriever':    'NVIDIA',
  'openvinotoolkit/openvino': 'openvinotoolkit',
  'Rancheroo/r8s':            'Rancheroo',
  'agentgateway/agentgateway':'agentgateway',
  'kubernetes/kubernetes':    'kubernetes',
  'kubernetes/contributor-site':'kubernetes',
  'prometheus/prometheus':    'prometheus',
  'hashicorp/terraform':      'hashicorp',
  'thanos-io/thanos':         'thanos-io',
  'open-telemetry/opentelemetry-go': 'open-telemetry',
  'kgateway-dev/kgateway':    'kgateway-dev',
  'tektoncd/pipeline':        'tektoncd',
}

// eslint-disable-next-line @next/next/no-img-element
function OrgLogo({ repo, orgInitial, size = 32, className = '' }: { repo: string; orgInitial: string; size?: number; className?: string }) {
  const slug = ORG_LOGOS[repo]
  if (slug) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`https://github.com/${slug}.png?size=${size * 2}`} alt={slug} width={size} height={size} className={`rounded-full object-cover ${className}`} />
  }
  return <span className="font-black font-mono">{orgInitial}</span>
}

const SPECIAL_BADGE_STYLES: Record<string, string> = {
  'Ships in gopls': 'bg-sky-950/70 border-sky-500/40 text-sky-300',
  'Reviewed':       'bg-indigo-950/70 border-indigo-500/40 text-indigo-300',
  'CNCF':           'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
  'go.dev':         'bg-sky-950/70 border-sky-400/40 text-sky-300',
}

function getOpenTheme(repo: string) {
  const code = (repo.charCodeAt(0) ?? 0) + (repo.charCodeAt(1) ?? 0)
  return OPEN_THEMES[code % OPEN_THEMES.length]
}
function repoFromUrl(url: string) { return url.replace('https://api.github.com/repos/', '') }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
function formatShortDate(iso: string) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
function inferTags(title: string, repo: string): string[] {
  const t = (title + ' ' + repo).toLowerCase()
  const tags: string[] = []
  if (['jaeger','goreleaser','meshery','helm','argo','prometheus'].some(r => t.includes(r))) tags.push('Go')
  if (t.includes('helm') || t.includes('chart'))   tags.push('Helm')
  if (t.includes('kube') || t.includes('k8s'))     tags.push('Kubernetes')
  if (t.includes('docker'))                         tags.push('Docker')
  if (t.includes('typescript') || t.includes('grafana/grafana')) tags.push('TypeScript')
  if (t.includes('java') || t.includes('jenkins')) tags.push('Java')
  if (t.includes('gha') || t.includes('workflow')) tags.push('GHA')
  if (t.includes('security') || t.includes('csp')) tags.push('Security')
  if (['helm/helm','jaeger','argoproj'].some(r => t.includes(r))) tags.push('CNCF')
  if (t.includes('grafana') || t.includes('monitor')) tags.push('Grafana')
  if (t.includes('database') || t.includes('n+1')) tags.push('Database')
  if (t.includes('android'))                        tags.push('Android')
  if (t.includes('observab') || t.includes('spm')) tags.push('Observability')
  if (t.includes('golang/website') || t.includes('gomod') || t.includes('gomod-ref')) tags.push('Docs')
  return tags.length > 0 ? tags.slice(0, 3) : ['Open Source']
}

// ─── Featured Contributions ───────────────────────────────────────────────────
const FEATURED_PROJECTS = [
  {
    org: 'golang/tools',
    orgDisplay: 'Go Toolchain',
    badge: 'Official Go SDK · Ships in gopls',
    badgeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    description: 'Official Go toolchain — home of gopls, the Go language server powering VSCode, JetBrains, Neovim, and every major IDE. 7 CLs merged, all reviewed by Alan Donovan (Go core team, Google).',
    mergedCount: 7,
    openCount: 2,
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/25',
    glowColor: 'rgba(56,189,248,0.12)',
    headerBg: 'from-sky-950/40 to-black/60',
    repoStars: '10k+',
    orgInitial: 'G',
    prs: [
      {
        number: 639,
        icon: GitBranch,
        iconClass: 'text-sky-400',
        iconBg: 'bg-sky-500/10 border-sky-500/20',
        title: 'appendlen Analyzer',
        subtitle: 'gopls/internal/analysis · PR #639',
        problem: 'No automated analysis existed to warn about appending to a slice that was already pre-allocated to its final size, causing memory overhead.',
        solution: 'Built the appendlen static analyzer in gopls to detect slice pre-allocation patterns and suggest index assignment or capacity offsets.',
        impact: 'Reduces memory reallocation overhead automatically in Go codebases. Ships in gopls. Reviewed & merged by Alan Donovan (Google).',
        url: 'https://github.com/golang/tools/pull/639',
        tags: ['Go', 'AST', 'gopls', 'Optimization'],
        badges: ['Ships in gopls', 'Reviewed'],
      },
      {
        number: 633,
        icon: Zap,
        iconClass: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'Named Func Hover Doc',
        subtitle: 'gopls/hover · PR #633',
        problem: 'Hovering over function literals assigned to named function types (like middleware) hid the documentation of the target type.',
        solution: 'Updated hover resolution in gopls to detect named function type definitions and render their doc comments on literal targets.',
        impact: 'Improves documentation coverage and readability inside IDEs. Ships in gopls. Reviewed by Alan Donovan.',
        url: 'https://github.com/golang/tools/pull/633',
        tags: ['Go', 'gopls', 'IDE', 'Developer Exp'],
        badges: ['Ships in gopls', 'Reviewed'],
      },
      {
        number: 627,
        icon: GitBranch,
        iconClass: 'text-sky-400',
        iconBg: 'bg-sky-500/10 border-sky-500/20',
        title: 'slicesbackward Analyzer',
        subtitle: 'go/analysis/passes/modernize · PR #627',
        problem: 'Go codebases still used manual backward for-loops — no automated way to detect or modernize them to Go 1.23 idioms.',
        solution: 'Built a 422-line full AST analyzer that detects backward for-loops and suggests slices.Backward (Go 1.23). Edge-case guards + golden-file tests.',
        impact: 'Ships in gopls to every Go developer worldwide. Fixes golang/go#78484. Reviewed & merged by Alan Donovan (Google).',
        url: 'https://github.com/golang/tools/pull/627',
        tags: ['Go', 'AST', 'gopls', 'Go 1.23'],
        badges: ['Ships in gopls', 'Reviewed'],
      },
      {
        number: 629,
        icon: Zap,
        iconClass: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'stringscut Analyzer',
        subtitle: 'modernize/stringscut · PR #629',
        problem: 'Code using strings.Split/SplitN[0] is more verbose and error-prone than strings.Cut — no tooling to auto-migrate these patterns.',
        solution: '267-line AST pass that detects Split/SplitN[0] patterns and rewrites them to strings.Cut (Go 1.18). 5 patch sets, comprehensive edge-case handling.',
        impact: 'Ships in gopls to all Go developers globally. Reviewed by Alan Donovan & Madeline Kalil (Google). Modernizes every Go 1.18+ codebase automatically.',
        url: 'https://github.com/golang/tools/pull/629',
        tags: ['Go', 'AST', 'gopls', 'Go 1.18'],
        badges: ['Ships in gopls', 'Reviewed'],
      },
    ],
  },
  {
    org: 'jaegertracing/jaeger',
    orgDisplay: 'Jaeger',
    badge: 'CNCF Incubating',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    description: 'Production-grade distributed tracing platform used at Uber, Netflix, and thousands of orgs. Part of the CNCF ADR-007 observability stack migration.',
    mergedCount: 5,
    openCount: 3,
    accentClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/25',
    glowColor: 'rgba(34,211,238,0.12)',
    headerBg: 'from-cyan-950/40 to-black/60',
    repoStars: '20k+',
    orgInitial: 'J',
    prs: [
      {
        number: 8274,
        icon: Shield,
        iconClass: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'revive deep-exit Rule',
        subtitle: 'Chore · PR #8274',
        problem: 'No static analysis checks prevented package-level functions from calling os.Exit directly, potentially causing ungraceful shutdowns.',
        solution: 'Enabled revive linter\'s deep-exit rule and refactored package components to return clean, handleable errors instead.',
        impact: 'Enforces robust error handling and daemon lifecycle control across the tracing engine. CNCF approved.',
        url: 'https://github.com/jaegertracing/jaeger/pull/8274',
        tags: ['Go', 'Linter', 'CNCF', 'Reliability'],
        badges: ['CNCF'],
      },
      {
        number: 8216,
        icon: BarChart3,
        iconClass: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        title: 'Go SDK Dashboard Generator',
        subtitle: 'ADR-007 Step 2a',
        problem: 'Jaeger SPM had static JSON dashboards — hard to maintain, impossible to keep in sync with changing metrics.',
        solution: 'Built a programmatic Go SDK dashboard generator that replaces static JSON with code-driven Grafana provisioning.',
        impact: 'Dynamic metric config across entire monitoring pipeline. Foundation for Jaeger\'s next-gen observability stack.',
        url: 'https://github.com/jaegertracing/jaeger/pull/8216',
        tags: ['Go', 'Grafana', 'SDK', 'Observability'],
        badges: ['CNCF'],
      },
      {
        number: 8240,
        icon: Shield,
        iconClass: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        title: 'CI Sync-Check Workflow',
        subtitle: 'ADR-007 Step 3',
        problem: 'Dashboard generator output could drift from what\'s committed — no automated way to catch it in CI.',
        solution: 'Added a GitHub Actions workflow that validates generator output matches committed dashboards on every PR.',
        impact: 'Prevents silent dashboard drift in CI/CD. Enforces consistency across the entire observability pipeline.',
        url: 'https://github.com/jaegertracing/jaeger/pull/8240',
        tags: ['Go', 'GitHub Actions', 'CI/CD'],
        badges: ['CNCF'],
      },
      {
        number: 8242,
        icon: Zap,
        iconClass: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
        title: 'MCP Server Response Limits',
        subtitle: 'jaegermcp reliability fix',
        problem: 'The jaegermcp server had no output size limit — unbounded responses could crash or hang MCP clients.',
        solution: 'Enforced response size limits in the MCP server tool handlers, with clean truncation and error surfacing.',
        impact: 'Improved reliability of Jaeger\'s MCP integration. Prevents resource exhaustion in tool response pipelines.',
        url: 'https://github.com/jaegertracing/jaeger/pull/8242',
        tags: ['Go', 'MCP', 'Reliability'],
        badges: ['CNCF'],
      },
    ],
  },
]

const OTHER_FEATURED = [
  {
    number: 1758,
    org: 'agentgateway/agentgateway',
    orgDisplay: 'Agentgateway',
    badge: 'AI Gateway · 3k+ ⭐',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    title: 'policies: add InferencePool targetRef support to AgentgatewayPolicy',
    description: 'Added support for InferencePool target references in the AgentgatewayPolicy router logic to allow custom traffic steering to AI model pools.',
    impact: 'Enables policy-driven routing and load balancing of AI requests across inference pools.',
    tags: ['Go', 'AI', 'Gateway'],
    badges: [],
    url: 'https://github.com/agentgateway/agentgateway/pull/1758',
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/25',
    glowColor: 'rgba(16,185,129,0.1)',
  },
  {
    number: 357,
    org: 'golang/website',
    orgDisplay: 'Go Website',
    badge: 'go.dev · Official Go Docs',
    badgeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    title: 'doc/modules/gomod-ref: document the ignore directive',
    description: 'The go.mod reference page at go.dev was missing the ignore directive entirely, even though it is documented in the Go Modules Reference. Added a full section — syntax, examples (relative path, named directory, block form), and usage notes — following the structure of exclude and retract.',
    impact: 'Fixes an official documentation gap (golang/go#78460) for every Go developer referencing the go.mod guide on go.dev.',
    tags: ['Go', 'Docs', 'go.dev'],
    badges: ['go.dev'],
    url: 'https://github.com/golang/website/pull/357',
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/25',
    glowColor: 'rgba(56,189,248,0.1)',
  },
  {
    number: 31981,
    org: 'helm/helm',
    orgDisplay: 'Helm',
    badge: 'CNCF Graduated · 30k+ ⭐',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    title: 'fix(kube): clarify server-side apply patch errors',
    description: 'Wrapped generic server-side apply patch errors with resource context and an explicit "server-side apply failed" prefix — conflict and incompatible-server messages left unchanged. Added regression coverage for duplicate-key typed patch errors.',
    impact: 'Operators debugging SSA failures in Helm now get actionable error context instead of raw API errors from pkg/kube.',
    tags: ['Go', 'CNCF', 'Kubernetes'],
    badges: ['CNCF'],
    url: 'https://github.com/helm/helm/pull/31981',
    accentClass: 'text-amber-400',
    borderClass: 'border-amber-500/25',
    glowColor: 'rgba(251,191,36,0.1)',
  },
  {
    number: 6462,
    org: 'goreleaser/goreleaser',
    orgDisplay: 'GoReleaser',
    badge: '16k+ ⭐',
    badgeClass: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    title: 'Fix filterOut tag selection bug',
    description: 'Function was returning the excluded tag instead of remaining tags when multiple ignore_tags patterns were configured — breaking release pipelines.',
    impact: 'Fixed silent release pipeline failures affecting any project using multiple ignore_tags in GoReleaser config.',
    tags: ['Go', 'CI/CD', 'Release'],
    url: 'https://github.com/goreleaser/goreleaser/pull/6462',
    accentClass: 'text-purple-400',
    borderClass: 'border-purple-500/25',
    glowColor: 'rgba(192,132,252,0.1)',
  },
]

// ─── Reviewer lookup (by PR/CL number) ───────────────────────────────────────
const PR_REVIEWERS: Record<number, string[]> = {
  627:    ['Alan Donovan'],
  629:    ['Alan Donovan', 'Madeline Kalil'],
  630:    ['Alan Donovan', 'Dmitri Shuralyov'],
  632:    ['Alan Donovan'],
  633:    ['Alan Donovan'],
  639:    ['Alan Donovan', 'Madeline Kalil'],
  762540: ['Alan Donovan', 'Dmitri Shuralyov'],
}

// ─── Static Fallback ──────────────────────────────────────────────────────────
const STATIC_MERGED: MergedPR[] = [
  { number: 8274,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: '[chore] enable revive deep-exit linter rule',                         description: 'Enabled revive linter deep-exit rule and refactored package-level violations to return clean errors instead.', tags: ['Go','CNCF','Reliability'],       mergedAt: 'May 24, 2026', repoStars: '23k+', url: 'https://github.com/jaegertracing/jaeger/pull/8274',   ...MERGED_THEMES[2] },
  { number: 1758,  repo: 'agentgateway/agentgateway', orgInitial: 'A', title: 'policies: add InferencePool targetRef support to AgentgatewayPolicy',  description: 'Added routing policy support for InferencePool target references inside AgentgatewayPolicy configuration.', tags: ['Go','AI','Gateway'], mergedAt: 'May 8, 2026', repoStars: '3k+', url: 'https://github.com/agentgateway/agentgateway/pull/1758', ...MERGED_THEMES[3] },
  { number: 7582,  repo: 'layer5io/layer5',       orgInitial: 'L', title: '[Sistent] Add Card component to the sistent components page',         description: 'Added the Sistent Card component to the Layer5 ecosystem components page.',                                      tags: ['React','CNCF'],                        mergedAt: 'Apr 22, 2026', repoStars: '1k+',  url: 'https://github.com/layer5io/layer5/pull/7582',   ...MERGED_THEMES[0] },
  { number: 31981, repo: 'helm/helm',            orgInitial: 'H', title: 'fix(kube): clarify server-side apply patch errors',                    description: 'Wrapped generic SSA patch errors with resource context and an explicit "server-side apply failed" prefix.',     tags: ['Go','Kubernetes','CNCF'],            mergedAt: 'Apr 20, 2026', repoStars: '30k+', url: 'https://github.com/helm/helm/pull/31981', ...MERGED_THEMES[2] },
  { number: 639,   repo: 'golang/tools',          orgInitial: 'G', title: 'gopls/internal/analysis: add appendlen analyzer',                     description: 'Added appendlen static analyzer in gopls to warn about appending to a slice pre-allocated to its final size.',    tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 17, 2026', repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/639',           ...MERGED_THEMES[4] },
  { number: 357,   repo: 'golang/website',        orgInitial: 'G', title: 'doc/modules/gomod-ref: document the ignore directive',                description: 'Added the missing ignore directive to the official go.mod reference on go.dev — syntax, examples, and notes.',    tags: ['Go','Docs','go.dev'],               mergedAt: 'Apr 16, 2026', repoStars: '436',  url: 'https://github.com/golang/website/pull/357',        ...MERGED_THEMES[5] },
  { number: 629,   repo: 'golang/tools',          orgInitial: 'G', title: 'modernize/stringscut: simplify Split/SplitN[0] to strings.Cut',       description: 'New analyzer replacing strings.Split/SplitN[0] patterns with strings.Cut (Go 1.18). Reviewed by Alan Donovan.',    tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 15, 2026', repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/629',           ...MERGED_THEMES[4] },
  { number: 630,   repo: 'golang/tools',          orgInitial: 'G', title: 'gopls/completion: prepend space when completing right after \"//\"',  description: 'Modified completion engine to prepend a space when completing immediately after "//" comment prefixes.',         tags: ['Go','gopls','IDE','Completion'],    mergedAt: 'Apr 10, 2026', repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/630',           ...MERGED_THEMES[1] },
  { number: 633,   repo: 'golang/tools',          orgInitial: 'G', title: 'gopls/hover: show named func type doc when hovering over func literal',description: 'Enhanced gopls hover to fetch and show documentation of named function types for hovered function literals.',       tags: ['Go','gopls','IDE','Go Toolchain'],  mergedAt: 'Apr 8, 2026',  repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/633',           ...MERGED_THEMES[0] },
  { number: 632,   repo: 'golang/tools',          orgInitial: 'G', title: 'gopls/implementation: fall back gracefully for non-dynamic calls',    description: 'Added clean fallback in gopls implementation requests for non-dynamic calls at parenthesis.',                    tags: ['Go','gopls','IDE','Go Toolchain'],  mergedAt: 'Apr 8, 2026',  repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/632',           ...MERGED_THEMES[3] },
  { number: 627,   repo: 'golang/tools',          orgInitial: 'G', title: 'go/analysis/passes/modernize: add slicesbackward analyzer',          description: 'New static analysis pass detecting backward for-loops and suggesting slices.Backward (Go 1.23). Ships in gopls.',  tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 3, 2026',  repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/627',           ...MERGED_THEMES[4] },
  { number: 628,   repo: 'golang/tools',          orgInitial: 'G', title: 'modernize/stringscut: simplify Split/SplitN[0] to strings.Cut',       description: 'Part of modernization AST analyzer: simplify Split/SplitN[0] expressions to strings.Cut.',                        tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 2, 2026',  repoStars: '8k+',  url: 'https://github.com/golang/tools/pull/628',           ...MERGED_THEMES[4] },
  { number: 8242,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'fix(jaegermcp): Enforce response limits',                             description: 'Enforced response size limits in the MCP server tool handlers to prevent resource exhaustion and hangs.',        tags: ['Go','CNCF','Reliability'],            mergedAt: 'Mar 26, 2026', repoStars: '23k+', url: 'https://github.com/jaegertracing/jaeger/pull/8242',   ...MERGED_THEMES[2] },
  { number: 8240,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'ci(monitor): add dashboard sync check for Go SDK generator',          description: 'Added GitHub Actions workflow verifying that committed dashboards match the output of the generator script.',   tags: ['Go','CNCF','Grafana'],                 mergedAt: 'Mar 25, 2026', repoStars: '23k+', url: 'https://github.com/jaegertracing/jaeger/pull/8240',   ...MERGED_THEMES[2] },
  { number: 8216,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'feat(monitor): Go SDK dashboard generator — ADR-007 Step 2a',        description: 'Implemented a Go SDK-based Grafana dashboard generator enabling programmatic dashboard provisioning for Jaeger SPM.',    tags: ['Go','Grafana','CNCF','Observability'], mergedAt: 'Mar 24, 2026', repoStars: '23k+', url: 'https://github.com/jaegertracing/jaeger/pull/8216', ...MERGED_THEMES[3] },
  { number: 8215,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'feat(monitor): restore Grafana to SPM docker-compose example',       description: 'Restored Grafana to the SPM docker-compose example as the first step of the ADR-007 observability stack migration.',     tags: ['Go','Docker','CNCF'],                 mergedAt: 'Mar 21, 2026', repoStars: '23k+', url: 'https://github.com/jaegertracing/jaeger/pull/8215',   ...MERGED_THEMES[2] },
  { number: 6462,  repo: 'goreleaser/goreleaser', orgInitial: 'G', title: 'fix: filterOut returns excluded tag when multiple ignore_tags set',   description: 'Resolved release pipeline bug where multiple ignore_tags patterns caused incorrect tag exclusion logic.',         tags: ['Go','CI/CD','Release'],               mergedAt: 'Mar 17, 2026', repoStars: '16k+', url: 'https://github.com/goreleaser/goreleaser/pull/6462',  ...MERGED_THEMES[1] },
  { number: 31931, repo: 'helm/helm',            orgInitial: 'H', title: 'pkg/kube: remove legacy import comments',                            description: 'Cleaned up pre-Go-modules Kythe import path comments from pkg/kube.',                                            tags: ['Go','Helm','Kubernetes'],              mergedAt: 'Mar 12, 2026', repoStars: '30k+', url: 'https://github.com/helm/helm/pull/31931',            ...MERGED_THEMES[0] },
]

const STATIC_OPEN: OpenPR[] = [
  { number: 1816,   repo: 'agentgateway/agentgateway', orgInitial: 'A', title: 'feat: EPP ordered destination-endpoint fallback', tags: ['Go', 'AI'], date: 'May 14', url: 'https://github.com/agentgateway/agentgateway/pull/1816', ...getOpenTheme('agentgateway/agentgateway') },
  { number: 78931,  repo: 'golang/go',                orgInitial: 'G', title: 'cmd/go: test go doc with trimpath GOROOT recovery', tags: ['Go', 'Docs'], date: 'Apr 24', url: 'https://github.com/golang/go/pull/78931', ...getOpenTheme('golang/go') },
  { number: 704,    repo: 'kubernetes/contributor-site', orgInitial: 'K', title: 'chore: align contributor Node version metadata', tags: ['Kubernetes'], date: 'Apr 24', url: 'https://github.com/kubernetes/contributor-site/pull/704', ...getOpenTheme('kubernetes/contributor-site') },
  { number: 18570,  repo: 'prometheus/prometheus',    orgInitial: 'P', title: '[codex] deps: consolidate direct yaml usage', tags: ['Go'], date: 'Apr 23', url: 'https://github.com/prometheus/prometheus/pull/18570', ...getOpenTheme('prometheus/prometheus') },
  { number: 8413,   repo: 'jaegertracing/jaeger',     orgInitial: 'J', title: 'test(jaegermcp): add progressive disclosure benchmarks', tags: ['Go', 'CNCF'], date: 'Apr 20', url: 'https://github.com/jaegertracing/jaeger/pull/8413', ...getOpenTheme('jaegertracing/jaeger') },
  { number: 2077,   repo: 'helm/helm-www',            orgInitial: 'H', title: 'docs(topics/plugins): mark page as legacy and link to Helm 4 plugin docs', tags: ['Go', 'Helm', 'CNCF'], date: 'Apr 17', url: 'https://github.com/helm/helm-www/pull/2077', ...getOpenTheme('helm/helm-www') },
  { number: 8391,   repo: 'jaegertracing/jaeger',     orgInitial: 'J', title: 'storage/elasticsearch: support spanKind in GetOperations', tags: ['Go', 'CNCF'], date: 'Apr 16', url: 'https://github.com/jaegertracing/jaeger/pull/8391', ...getOpenTheme('jaegertracing/jaeger') },
  { number: 637,    repo: 'golang/tools',             orgInitial: 'G', title: 'gopls/completion: validate ident source range before use as replacement', tags: ['Go', 'gopls'], date: 'Apr 13', url: 'https://github.com/golang/tools/pull/637', ...getOpenTheme('golang/tools') },
  { number: 3791,   repo: 'docker/buildx',            orgInitial: 'D', title: 'driver/kubernetes: add manifest-patch driver option', tags: ['Kubernetes', 'Docker'], date: 'Apr 9', url: 'https://github.com/docker/buildx/pull/3791', ...getOpenTheme('docker/buildx') },
  { number: 634,    repo: 'golang/tools',             orgInitial: 'G', title: 'gopls/hover: show named func type doc when hovering over func literal', tags: ['Go', 'gopls'], date: 'Apr 8', url: 'https://github.com/golang/tools/pull/634', ...getOpenTheme('golang/tools') },
  { number: 32005,  repo: 'helm/helm',                orgInitial: 'H', title: 'test(registry): cover OCI revision chart annotation', tags: ['Go', 'Helm', 'CNCF'], date: 'Apr 5', url: 'https://github.com/helm/helm/pull/32005', ...getOpenTheme('helm/helm') },
  { number: 8748,   repo: 'thanos-io/thanos',         orgInitial: 'T', title: 'api: add infos field to query API response for Prometheus compatibility', tags: ['Go'], date: 'Apr 3', url: 'https://github.com/thanos-io/thanos/pull/8748', ...getOpenTheme('thanos-io/thanos') },
  { number: 138176, repo: 'kubernetes/kubernetes',    orgInitial: 'K', title: 'scheduler: graduate plugin_execution_duration_seconds and scheduling_algorithm_duration_seconds metrics to BETA', tags: ['Kubernetes'], date: 'Apr 2', url: 'https://github.com/kubernetes/kubernetes/pull/138176', ...getOpenTheme('kubernetes/kubernetes') },
  { number: 8277,   repo: 'jaegertracing/jaeger',     orgInitial: 'J', title: '[otel-demo] upgrade to OpenSearch 3.x, Jaeger chart 4.x, add Spark dependencies', tags: ['Go', 'Helm', 'CNCF'], date: 'Apr 2', url: 'https://github.com/jaegertracing/jaeger/pull/8277', ...getOpenTheme('jaegertracing/jaeger') },
  { number: 18039,  repo: 'meshery/meshery',          orgInitial: 'M', title: 'fix: optimize GetSystemDatabase to avoid N+1 queries', tags: ['Go', 'Database'], date: 'Mar 18', url: 'https://github.com/meshery/meshery/pull/18039', ...getOpenTheme('meshery/meshery') },
  { number: 1645,   repo: 'NVIDIA/NeMo-Retriever',    orgInitial: 'N', title: 'helm: add nodeSelector and tolerations to NIMCache templates', tags: ['Go', 'Helm'], date: 'Mar 18', url: 'https://github.com/NVIDIA/NeMo-Retriever/pull/1645', ...getOpenTheme('NVIDIA/NeMo-Retriever') },
  { number: 6861,   repo: 'docker/cli',               orgInitial: 'D', title: 'testing: address G115 integer overflow conversion warnings and re-enable linter', tags: ['Docker'], date: 'Mar 17', url: 'https://github.com/docker/cli/pull/6861', ...getOpenTheme('docker/cli') },
  { number: 31933,  repo: 'helm/helm',                orgInitial: 'H', title: 'remove legacy import comments from remaining packages', tags: ['Go', 'Helm', 'CNCF'], date: 'Mar 12', url: 'https://github.com/helm/helm/pull/31933', ...getOpenTheme('helm/helm') },
  { number: 34645,  repo: 'openvinotoolkit/openvino', orgInitial: 'O', title: 'GHA(Android): parameterize emulator test artifact names via matrix', tags: ['GHA', 'Android'], date: 'Mar 12', url: 'https://github.com/openvinotoolkit/openvino/pull/34645', ...getOpenTheme('openvinotoolkit/openvino') },
  { number: 114,    repo: 'Rancheroo/r8s',            orgInitial: 'R', title: 'feat: add multi-arch Docker image and GHCR publish workflow (closes #112)', tags: ['Docker', 'GHA'], date: 'Mar 11', url: 'https://github.com/Rancheroo/r8s/pull/114', ...getOpenTheme('Rancheroo/r8s') }
]

const OPEN_SOURCE_CACHE_KEY = 'open-source:activity'
const OPEN_SOURCE_CACHE_TTL_MS = 1000 * 60 * 30

function getOpenSourceSourceMeta(state: DataSourceState) {
  if (state === 'live') {
    return {
      label: 'live data',
      badgeLabel: 'LIVE',
      dotClass: 'bg-cyan-400',
      textClass: 'text-cyan-400',
      headerClass: 'text-emerald-500',
    }
  }

  if (state === 'cached') {
    return {
      label: 'cached snapshot',
      badgeLabel: 'CACHED',
      dotClass: 'bg-amber-400',
      textClass: 'text-amber-400',
      headerClass: 'text-amber-400',
    }
  }

  return {
    label: 'static fallback',
    badgeLabel: 'STATIC',
    dotClass: 'bg-neutral-600',
    textClass: 'text-neutral-500',
    headerClass: 'text-neutral-500',
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const OpenSource = () => {
  const [mergedPRs, setMergedPRs] = useState<MergedPR[]>(STATIC_MERGED)
  const [openPRs,   setOpenPRs]   = useState<OpenPR[]>(STATIC_OPEN)
  const [dataSource, setDataSource] = useState<DataSourceState>('static')

  useEffect(() => {
    const cached = readCachedValue<{ mergedPRs: MergedPR[]; openPRs: OpenPR[] }>(
      OPEN_SOURCE_CACHE_KEY,
      OPEN_SOURCE_CACHE_TTL_MS
    )

    if (cached) {
      setMergedPRs(cached.value.mergedPRs)
      setOpenPRs(cached.value.openPRs)
      setDataSource('cached')
    }

    const fetchPRs = async () => {
      try {
        const headers = { Accept: 'application/vnd.github.v3+json' }
        const [mData, oData] = await Promise.all([
          fetchJsonWithTimeout<{ items?: Array<{ number: number; repository_url: string; title: string; closed_at?: string; created_at: string; html_url: string }> }>(
            'https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:merged&per_page=30&sort=updated&order=desc',
            { headers },
            5000
          ),
          fetchJsonWithTimeout<{ items?: Array<{ number: number; repository_url: string; title: string; created_at: string; html_url: string }> }>(
            'https://api.github.com/search/issues?q=author:abhay1999+type:pr+is:open&per_page=30&sort=updated&order=desc',
            { headers },
            5000
          ),
        ])

        const knownNumbers = new Set(STATIC_MERGED.map(p => p.number))
        const updatedMerged: MergedPR[] = [...STATIC_MERGED]
        let newIdx = 0
        for (const item of (mData.items ?? [])) {
          if (!knownNumbers.has(item.number)) {
            const repo  = repoFromUrl(item.repository_url)
            const theme = MERGED_THEMES[(STATIC_MERGED.length + newIdx) % MERGED_THEMES.length]
            updatedMerged.push({ number: item.number, repo, orgInitial: repo.split('/')[0][0]?.toUpperCase() ?? '?', title: item.title, description: item.title, tags: inferTags(item.title, repo), mergedAt: formatDate(item.closed_at ?? item.created_at), repoStars: '', url: item.html_url, ...theme })
            newIdx++
          }
        }

        const liveOpen: OpenPR[] = (oData.items ?? [])
          .filter((item: { title: string; created_at: string }) => item.created_at > '2020-01-01' && item.title.trim().split(' ').length > 1)
          .map((item: { number: number; repository_url: string; title: string; created_at: string; html_url: string }) => {
            const repo = repoFromUrl(item.repository_url)
            return { number: item.number, repo, orgInitial: repo.split('/')[0][0]?.toUpperCase() ?? '?', title: item.title, tags: inferTags(item.title, repo), date: formatShortDate(item.created_at), url: item.html_url, ...getOpenTheme(repo) }
          })

        setMergedPRs(updatedMerged)
        setOpenPRs(liveOpen.length > 0 ? liveOpen : STATIC_OPEN)
        setDataSource('live')
        writeCachedValue(OPEN_SOURCE_CACHE_KEY, {
          mergedPRs: updatedMerged,
          openPRs: liveOpen.length > 0 ? liveOpen : STATIC_OPEN,
        })
      } catch { /* keep static fallback */ }
    }
    fetchPRs()
  }, [])

  const mergedCount = mergedPRs.length
  const openCount   = openPRs.length
  const totalCount  = mergedCount + openCount
  const sourceMeta = getOpenSourceSourceMeta(dataSource)

  // Duplicate for infinite marquee loop
  const marqueeItems = [...mergedPRs, ...mergedPRs]

  const STATS = [
    { value: String(mergedCount), label: 'Merged PRs',  icon: GitMerge,      accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]'  },
    { value: String(openCount),   label: 'Open PRs',    icon: GitPullRequest, accent: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]'  },
    { value: '15+',               label: 'Orgs',        icon: Star,           accent: 'text-purple-400', bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]' },
    { value: '600k+',             label: 'Repo Stars',  icon: Star,           accent: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]'  },
  ]

  return (
    <section id="opensource" className="relative py-32 md:py-48 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 60% 30%, #0a0830 0%, #050418 45%, #000 100%)' }}>

      {/* Inject marquee keyframes */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee-track { animation: marquee 35s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Background ────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(rgba(52,211,153,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.8) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[45%] opacity-[0.06]" style={{ backgroundImage: `linear-gradient(to right, rgba(52,211,153,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,211,153,0.9) 1px, transparent 1px)`, backgroundSize: '60px 60px', transform: 'perspective(700px) rotateX(58deg) translateY(20%)', maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)' }} />
        {/* Circuit traces — CSS */}
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/12 to-transparent">
          <div className="trace-x-fwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ animationDuration: '5s' }} />
        </div>
        <div className="absolute top-[72%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <div className="trace-x-bwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{ animationDuration: '7s' }} />
        </div>
        <div className="absolute top-[20%] left-[15%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
        <div className="absolute top-[20%] right-[15%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/9 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <Reveal className="mb-12">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-emerald-400">$</span>
            <span className="text-neutral-400">git</span>
            <span className="text-neutral-600">~/github</span>
            <span className="text-white">›</span>
            <span className="text-emerald-400">pr_activity</span>
            <span className="text-neutral-300">.scan()</span>
            {dataSource === 'live' ? (
              <span className="flex items-center gap-1 ml-1">
                <span className="opacity-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-emerald-500 text-[10px]">live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 ml-1">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${sourceMeta.dotClass}`} />
                <span className={`text-[10px] ${sourceMeta.headerClass}`}>{sourceMeta.label}</span>
              </span>
            )}
          </div>
          <div className="flex items-end gap-5">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Open Source</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Contributions</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </Reveal>

        {/* ── Stats Bar ───────────────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => (
            <div key={s.label}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${s.bg} ${s.border} ${s.glow} backdrop-blur-sm`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                <s.icon size={16} className={s.accent} />
              </div>
              <div>
                <div className={`text-2xl font-black font-mono ${s.accent} leading-none`}>{s.value}</div>
                <div className="text-[11px] text-neutral-500 font-medium mt-0.5 leading-none">{s.label}</div>
              </div>
            </div>
          ))}
        </Reveal>

        {/* ── Reviewer Spotlight ──────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 24 }} className="mb-8">
          <div className="relative rounded-3xl border border-sky-500/20 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(8,12,50,0.85) 0%, rgba(0,0,0,0.92) 50%, rgba(14,8,46,0.85) 100%)', boxShadow: '0 0 70px -20px rgba(56,189,248,0.18)' }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left — headline */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                      <Star size={14} className="text-sky-400 fill-sky-400/30" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-sky-400/80">Code Review · golang/tools</p>
                      <p className="text-[10px] text-neutral-600 font-mono">Google · Go Core Team</p>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                    All 3 CLs reviewed by{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Alan Donovan</span>
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                    Alan Donovan is a member of Google&apos;s Go core team and co-author of{' '}
                    <em className="text-neutral-300">The Go Programming Language</em>. He directly reviewed and merged all three contributions to the official Go toolchain.
                  </p>

                  {/* PR pills */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: 'PR #627 · slicesbackward',   url: 'https://github.com/golang/tools/pull/627' },
                      { label: 'PR #629 · stringscut',        url: 'https://github.com/golang/tools/pull/629' },
                      { label: 'CL #762540 · gopls completion', url: 'https://go-review.googlesource.com/c/tools/+/762540' },
                    ].map(pill => (
                      <a key={pill.label} href={pill.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-sky-500/35 hover:bg-sky-950/30 transition-all duration-200 group/pill">
                        <GitMerge size={9} className="text-emerald-400" />
                        <span className="text-[10px] font-mono text-neutral-400 group-hover/pill:text-sky-300 transition-colors">{pill.label}</span>
                        <span className="text-[8px] font-bold text-emerald-300 font-mono bg-emerald-900/40 border border-emerald-500/25 px-1.5 py-0.5 rounded-full">MERGED</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right — reviewer chips */}
                <div className="flex flex-col gap-2.5 lg:min-w-[270px] w-full lg:w-auto">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-1">Reviewers</p>
                  {[
                    { name: 'Alan Donovan',     role: 'Go Core Team · Google',  prs: 'All 3 CLs', dotCls: 'bg-sky-400',    chipCls: 'bg-sky-950/40 border-sky-500/25',    nameCls: 'text-sky-200',    badgeCls: 'bg-sky-900/50 border-sky-500/25 text-sky-300',    initial: 'AD' },
                    { name: 'Madeline Kalil',   role: 'Google Engineer',         prs: 'PR #629',   dotCls: 'bg-indigo-400', chipCls: 'bg-indigo-950/40 border-indigo-500/25', nameCls: 'text-indigo-200', badgeCls: 'bg-indigo-900/50 border-indigo-500/25 text-indigo-300', initial: 'MK' },
                    { name: 'Dmitri Shuralyov', role: 'Go Team · Google',        prs: 'CL #762540',dotCls: 'bg-violet-400', chipCls: 'bg-violet-950/40 border-violet-500/25', nameCls: 'text-violet-200', badgeCls: 'bg-violet-900/50 border-violet-500/25 text-violet-300', initial: 'DS' },
                  ].map(r => (
                    <div key={r.name} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${r.chipCls}`}>
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[11px] font-black font-mono shrink-0 ${r.chipCls} ${r.nameCls}`}>{r.initial}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${r.nameCls} leading-tight`}>{r.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{r.role}</p>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${r.badgeCls} shrink-0`}>{r.prs}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Ecosystem Reach ─────────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-indigo-400">Ecosystem Reach</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent" />
            <span className="text-xs font-mono text-neutral-600">contributed across these projects</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {([
              { name: 'golang/go',              display: 'golang/go',      sub: 'Go Programming Language', stars: '134k+', accent: '#00add8', badge: 'Official SDK',     badgeBg: 'rgba(0,173,216,0.12)',  badgeBorder: 'rgba(0,173,216,0.3)' },
              { name: 'kubernetes/kubernetes',  display: 'kubernetes',     sub: 'Container Orchestration',stars: '122k+', accent: '#326ce5', badge: 'CNCF Graduated',   badgeBg: 'rgba(50,108,229,0.12)', badgeBorder: 'rgba(50,108,229,0.3)' },
              { name: 'grafana/grafana',        display: 'grafana',        sub: 'Analytics & Monitoring', stars: '74k+',  accent: '#f99d1c', badge: 'Data Visual',      badgeBg: 'rgba(249,157,28,0.12)',  badgeBorder: 'rgba(249,157,28,0.3)' },
              { name: 'prometheus/prometheus',  display: 'prometheus',     sub: 'Monitoring System',      stars: '64k+',  accent: '#e6522c', badge: 'CNCF Graduated',   badgeBg: 'rgba(230,82,44,0.12)',  badgeBorder: 'rgba(230,82,44,0.3)' },
              { name: 'hashicorp/terraform',    display: 'terraform',      sub: 'Infrastructure as Code', stars: '48k+',  accent: '#7b42bc', badge: 'IaC Tool',          badgeBg: 'rgba(123,66,188,0.12)',  badgeBorder: 'rgba(123,66,188,0.3)' },
              { name: 'helm/helm',              display: 'helm',           sub: 'K8s Package Manager',    stars: '30k+',  accent: '#818cf8', badge: 'CNCF Graduated',   badgeBg: 'rgba(129,140,248,0.12)', badgeBorder: 'rgba(129,140,248,0.3)' },
              { name: 'jenkinsci/jenkins',      display: 'jenkins',        sub: 'Automation Server',      stars: '25k+',  accent: '#d24939', badge: 'CI/CD Engine',     badgeBg: 'rgba(210,73,57,0.12)',  badgeBorder: 'rgba(210,73,57,0.3)' },
              { name: 'jaegertracing/jaeger',   display: 'jaeger',         sub: 'Distributed Tracing',    stars: '23k+',  accent: '#22d3ee', badge: 'CNCF Incubating',  badgeBg: 'rgba(34,211,238,0.12)', badgeBorder: 'rgba(34,211,238,0.3)' },
              { name: 'argoproj/argo-cd',       display: 'argo-cd',        sub: 'Declarative GitOps CD',  stars: '23k+',  accent: '#f46f40', badge: 'CNCF Graduated',   badgeBg: 'rgba(244,111,64,0.12)',  badgeBorder: 'rgba(244,111,64,0.3)' },
              { name: 'goreleaser/goreleaser',  display: 'goreleaser',     sub: 'Go Release Automation',  stars: '16k+',  accent: '#c084fc', badge: 'Release Tool',     badgeBg: 'rgba(192,132,252,0.12)', badgeBorder: 'rgba(192,132,252,0.3)' },
              { name: 'thanos-io/thanos',       display: 'thanos',         sub: 'Highly Available Metrics',stars: '14k+', accent: '#e6522c', badge: 'CNCF Incubating',  badgeBg: 'rgba(230,82,44,0.12)',  badgeBorder: 'rgba(230,82,44,0.3)' },
              { name: 'golang/tools',           display: 'golang/tools',   sub: 'Official Go Tools',      stars: '8k+',   accent: '#38bdf8', badge: 'Official Go',       badgeBg: 'rgba(56,189,248,0.12)', badgeBorder: 'rgba(56,189,248,0.3)' },
              { name: 'docker/cli',             display: 'docker/cli',     sub: 'Docker Command Line',    stars: '6k+',   accent: '#2496ed', badge: 'Official CLI',      badgeBg: 'rgba(36,150,237,0.12)',  badgeBorder: 'rgba(36,150,237,0.3)' },
              { name: 'agentgateway/agentgateway', display: 'agentgateway',sub: 'AI Agent Gateway',       stars: '3k+',   accent: '#10b981', badge: 'AI Gateway',       badgeBg: 'rgba(16,185,129,0.12)', badgeBorder: 'rgba(16,185,129,0.3)' },
              { name: 'layer5io/layer5',        display: 'layer5',         sub: 'Service Mesh Management',stars: '1k+',   accent: '#34d399', badge: 'CNCF Partner',      badgeBg: 'rgba(52,211,153,0.12)',  badgeBorder: 'rgba(52,211,153,0.3)' },
              { name: 'golang/website',         display: 'golang/website', sub: 'go.dev · Official Docs', stars: '436',   accent: '#38bdf8', badge: 'go.dev',           badgeBg: 'rgba(56,189,248,0.12)', badgeBorder: 'rgba(56,189,248,0.3)' },
            ] as const).map(r => (
              <div key={r.name}
                className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-200 group/eco">
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                  style={{ background: r.accent + '1a', border: `1px solid ${r.accent}40` }}>
                  <OrgLogo repo={r.name} orgInitial={r.display[0].toUpperCase()} size={36} className="w-9 h-9" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-neutral-200 leading-tight truncate group-hover/eco:text-white transition-colors">{r.display}</p>
                  <p className="text-[10px] text-neutral-600 font-mono mt-0.5">{r.sub}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  {r.stars ? (
                    <div className="flex items-center gap-0.5">
                      <Star size={9} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[9px] font-mono text-neutral-600">{r.stars}</span>
                    </div>
                  ) : <span />}
                  {r.badge && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full border"
                      style={{ background: r.badgeBg, borderColor: r.badgeBorder, color: r.accent }}>
                      {r.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Featured: Deep Dive Spotlight ───────────────────────────────── */}
        {FEATURED_PROJECTS.map((project) => (
          <Reveal key={project.org} className="mb-12">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                <span className="text-xs font-semibold tracking-wide uppercase text-cyan-400">Featured Project · Deep Dive</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
              <span className="text-xs font-mono text-neutral-600">{project.mergedCount} merged PRs · CNCF ecosystem</span>
            </div>

            {/* Hero card */}
            <div
              className={`relative rounded-3xl border ${project.borderClass} bg-gradient-to-br ${project.headerBg} overflow-hidden mb-4`}
              style={{ boxShadow: `0 0 60px -20px ${project.glowColor}` }}
            >
              {/* Subtle grid overlay */}
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(to right,rgba(34,211,238,0.8) 1px,transparent 1px),linear-gradient(to bottom,rgba(34,211,238,0.8) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

              {/* Header */}
              <div className={`relative px-6 py-5 border-b ${project.borderClass} flex flex-col sm:flex-row sm:items-center gap-3 justify-between`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border overflow-hidden flex items-center justify-center shrink-0" style={{ background: project.glowColor, borderColor: project.glowColor }}>
                    <OrgLogo repo={project.org} orgInitial={project.orgInitial} size={40} className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className={`text-xl font-bold ${project.accentClass}`}>{project.orgDisplay}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${project.badgeClass}`}>{project.badge}</span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-500 mt-0.5">{project.org} · {project.repoStars} stars</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30">
                    <GitMerge size={12} className="text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300 font-mono">{project.mergedCount} Merged PRs</span>
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm hidden lg:block">{project.description}</p>
                </div>
              </div>

              {/* Description — mobile */}
              <p className="lg:hidden text-xs text-neutral-400 px-6 py-3 border-b border-white/5">{project.description}</p>

              {/* PR cards grid */}
              <div className="p-4 grid sm:grid-cols-2 gap-3">
                {project.prs.map((pr) => (
                  <a
                    key={pr.number}
                    href={pr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group/pr relative flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* PR header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl border ${pr.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <pr.icon size={15} className={pr.iconClass} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{pr.title}</p>
                          <p className="text-[10px] font-mono text-neutral-600 mt-0.5">{pr.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] text-neutral-600">#{pr.number}</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-500/25">
                          <GitMerge size={8} className="text-emerald-400" />
                          <span className="text-[8px] font-bold text-emerald-300 font-mono">MERGED</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem → Solution */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="font-mono text-[9px] text-rose-400/80 uppercase tracking-wider w-16 shrink-0 pt-0.5">Problem</span>
                        <p className="text-[11px] text-neutral-500 leading-snug">{pr.problem}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[9px] text-emerald-400/80 uppercase tracking-wider w-16 shrink-0 pt-0.5">Fix</span>
                        <p className="text-[11px] text-neutral-300 leading-snug">{pr.solution}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[9px] text-cyan-400/80 uppercase tracking-wider w-16 shrink-0 pt-0.5">Impact</span>
                        <p className="text-[11px] text-cyan-200/70 leading-snug">{pr.impact}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-white/[0.05]">
                      <div className="flex flex-wrap gap-1">
                        {pr.tags.map(t => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.08] text-neutral-500">{t}</span>
                        ))}
                        {(pr as { badges?: string[] }).badges?.map(b => (
                          <span key={b} className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${SPECIAL_BADGE_STYLES[b] ?? 'bg-white/5 border-white/10 text-neutral-400'}`}>{b}</span>
                        ))}
                      </div>
                      {PR_REVIEWERS[pr.number] && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-wider">Reviewed by</span>
                          {PR_REVIEWERS[pr.number].map(r => (
                            <span key={r} className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-sky-950/50 border border-sky-500/25 text-sky-300">
                              <span className="w-1 h-1 rounded-full bg-sky-400 inline-block shrink-0" />
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1 text-neutral-600 group-hover/pr:text-cyan-400 transition-colors">
                          <span className="text-[10px] font-mono">View PR</span>
                          <ArrowUpRight size={11} className="group-hover/pr:translate-x-0.5 group-hover/pr:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* ── Other Featured Contributions ────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-400">Other Merged PRs</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {OTHER_FEATURED.map((pr) => (
              <a
                key={pr.number}
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className={`group/card flex flex-col gap-3 p-5 rounded-2xl border ${pr.borderClass} bg-white/[0.02] hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all duration-200`}
                style={{ boxShadow: `0 0 30px -12px ${pr.glowColor}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <OrgLogo repo={pr.org} orgInitial={pr.orgDisplay[0]} size={20} className="w-5 h-5" />
                      </div>
                      <span className={`text-sm font-bold ${pr.accentClass}`}>{pr.orgDisplay}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${pr.badgeClass}`}>{pr.badge}</span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-600">{pr.org} · PR #{pr.number}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-500/25 shrink-0">
                    <GitMerge size={9} className="text-emerald-400" />
                    <span className="text-[9px] font-bold text-emerald-300 font-mono">MERGED</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-200 leading-snug mb-2">{pr.title}</p>
                  <p className="text-[12px] text-neutral-500 leading-relaxed mb-2">{pr.description}</p>
                  <div className="flex gap-1.5 pt-1">
                    <span className="font-mono text-[9px] text-emerald-400/70 uppercase tracking-wider">Impact:</span>
                    <p className="text-[11px] text-emerald-200/60 leading-snug">{pr.impact}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <div className="flex flex-wrap gap-1">
                    {pr.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.08] text-neutral-500">{t}</span>
                    ))}
                    {(pr as { badges?: string[] }).badges?.map(b => (
                      <span key={b} className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${SPECIAL_BADGE_STYLES[b] ?? 'bg-white/5 border-white/10 text-neutral-400'}`}>{b}</span>
                    ))}
                  </div>
                  <div className={`flex items-center gap-1 ${pr.accentClass} opacity-60 group-hover/card:opacity-100 transition-opacity`}>
                    <span className="text-[10px] font-mono">View PR</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        {/* ── All Merged PRs — Infinite Marquee ───────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} className="mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-400">All Merged Pull Requests</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
            <span className="text-xs font-mono text-neutral-600">{mergedCount} merged · hover to pause</span>
          </div>
        </Reveal>

        {/* Marquee — full bleed overflow */}
        <Reveal from={{ opacity: 0 }} delay={0.1} className="relative mb-14">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="marquee-track flex gap-4 w-max">
              {marqueeItems.map((pr, idx) => (
                <a
                  key={`${pr.number}-${idx}`}
                  href={pr.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group/card relative flex flex-col w-[300px] shrink-0 rounded-2xl border-l-2 ${pr.borderAccent} border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300 overflow-hidden`}
                  style={{ boxShadow: `0 0 30px -10px ${pr.glowColor}` }}
                >
                  {/* Subtle grid */}
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: `linear-gradient(to right,rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.5) 1px,transparent 1px)`, backgroundSize: '20px 20px' }} />

                  <div className="relative p-4">
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl border overflow-hidden flex items-center justify-center shrink-0 ${pr.orgBgClass}`}>
                          <OrgLogo repo={pr.repo} orgInitial={pr.orgInitial} size={28} className="w-7 h-7" />
                        </div>
                        <div>
                          <div className={`text-[10px] font-mono ${pr.accentClass} leading-none`}>{pr.repo}</div>
                          <div className="text-[10px] font-mono text-neutral-600 mt-0.5">#{pr.number}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-500/30">
                        <GitMerge size={8} className="text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-300 font-mono">MERGED</span>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-xs text-neutral-300 leading-snug line-clamp-2 mb-3 group-hover/card:text-white transition-colors">
                      {pr.title}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pr.tags.map(t => (
                        <span key={t} className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${pr.tagClass}`}>{t}</span>
                      ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-700">{pr.mergedAt}</span>
                      <div className="flex items-center gap-2">
                        {pr.repoStars && (
                          <div className="flex items-center gap-0.5">
                            <Star size={8} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-[9px] font-mono text-neutral-600">{pr.repoStars}</span>
                          </div>
                        )}
                        <ArrowUpRight size={11} className={`${pr.accentClass} opacity-0 group-hover/card:opacity-100 transition-opacity`} />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Open PRs — Compact 3-column grid ────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="opacity-pulse w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <span className="text-xs font-semibold tracking-wide uppercase text-cyan-400">Active Contributions</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            <span className="text-xs font-mono text-neutral-600">{openCount} open</span>
          </div>
        </Reveal>

        {/* Terminal shell header */}
        <Reveal from={{ opacity: 0, y: 20 }} delay={0.1}
          className="relative rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-slate-950/80 via-black/90 to-cyan-950/20 overflow-hidden mb-10"
          style={{ boxShadow: '0 0 60px -20px rgba(34,211,238,0.1)' } as React.CSSProperties}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(to right,rgba(34,211,238,0.8) 1px,transparent 1px),linear-gradient(to bottom,rgba(34,211,238,0.8) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />

          {/* Title bar */}
          <div className="relative flex items-center gap-3 px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="flex-1 text-center text-[10px] sm:text-[11px] font-mono text-neutral-600 truncate">gh pr list --author abhay1999 --state open</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${sourceMeta.dotClass} ${dataSource === 'live' ? 'opacity-pulse' : ''}`} />
              <span className={`text-[9px] font-mono ${sourceMeta.textClass}`}>{sourceMeta.badgeLabel}</span>
            </div>
          </div>

          {/* 3-column compact grid */}
          <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {openPRs.map((pr, idx) => (
              <a key={pr.number} href={pr.url} target="_blank" rel="noreferrer"
                className={`group/pr flex items-center gap-3 p-3 rounded-xl border-l-2 ${pr.borderClass} ${pr.bgClass} border border-white/[0.04] hover:border-white/10 transition-all duration-200 cursor-pointer`}
              >
                <div className={`w-7 h-7 rounded-lg border overflow-hidden flex items-center justify-center shrink-0 ${pr.orgClass}`}>
                  <OrgLogo repo={pr.repo} orgInitial={pr.orgInitial} size={24} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-mono text-neutral-600 truncate">{pr.repo}</span>
                    <span className="text-[9px] font-mono text-neutral-700 shrink-0">#{pr.number}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug line-clamp-1 group-hover/pr:text-neutral-200 transition-colors">
                    {pr.title}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className={`opacity-pulse w-1.5 h-1.5 rounded-full ${pr.dotClass}`} style={{ animationDelay: `${idx * 0.15}s` }} />
                  <ExternalLink size={9} className="text-neutral-700 group-hover/pr:text-neutral-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        {/* ── GitHub CTA ──────────────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} delay={0.2}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://github.com/abhay1999" target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/25 text-white rounded-2xl hover:border-emerald-400/50 hover:from-emerald-500/25 hover:to-cyan-500/25 transition-all duration-300 font-medium"
            style={{ boxShadow: '0 0 30px -10px rgba(52,211,153,0.2)' }}>
            <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-emerald-400">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View GitHub Profile
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
            <GitPullRequest size={12} className="text-cyan-500/50" />
            <span>{totalCount}+ total contributions · {sourceMeta.label}</span>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

export default OpenSource
