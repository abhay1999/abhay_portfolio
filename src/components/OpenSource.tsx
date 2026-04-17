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
    description: 'Official Go toolchain — home of gopls, the Go language server powering VSCode, JetBrains, Neovim, and every major IDE. 3 CLs merged, all reviewed by Alan Donovan (Go core team, Google).',
    mergedCount: 3,
    openCount: 0,
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/25',
    glowColor: 'rgba(56,189,248,0.12)',
    headerBg: 'from-sky-950/40 to-black/60',
    repoStars: '10k+',
    orgInitial: 'G',
    prs: [
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
      },
      {
        number: 762540,
        icon: Shield,
        iconClass: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        title: 'gopls Completion Fix',
        subtitle: 'gopls/completion · CL #762540',
        problem: 'gopls completion triggered right after "//" produced malformed output — missing the required space before a declaration.',
        solution: 'Fixed the completion engine to prepend a space when completing immediately after "//" before any declaration.',
        impact: 'Eliminates malformed comment output for all Go developers. Reviewed by Alan Donovan & Dmitri Shuralyov (Google). Ships via gopls auto-update.',
        url: 'https://go-review.googlesource.com/c/tools/+/762540',
        tags: ['Go', 'gopls', 'IDE', 'Completion'],
      },
    ],
  },
  {
    org: 'jaegertracing/jaeger',
    orgDisplay: 'Jaeger',
    badge: 'CNCF Incubating',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    description: 'Production-grade distributed tracing platform used at Uber, Netflix, and thousands of orgs. Part of the CNCF ADR-007 observability stack migration.',
    mergedCount: 4,
    openCount: 1,
    accentClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/25',
    glowColor: 'rgba(34,211,238,0.12)',
    headerBg: 'from-cyan-950/40 to-black/60',
    repoStars: '20k+',
    orgInitial: 'J',
    prs: [
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
      },
      {
        number: 8215,
        icon: GitBranch,
        iconClass: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        title: 'Grafana + SPM Restore',
        subtitle: 'ADR-007 Step 1',
        problem: 'Grafana service was removed from the docker-compose SPM example, breaking the full local observability stack for all users.',
        solution: 'Restored Grafana + SPM to the docker-compose example as the first step of the ADR-007 migration.',
        impact: 'Unblocked every developer trying to run the full Jaeger monitoring stack locally. First PR in the ADR-007 chain.',
        url: 'https://github.com/jaegertracing/jaeger/pull/8215',
        tags: ['Docker', 'Grafana', 'Observability'],
      },
    ],
  },
]

const OTHER_FEATURED = [
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
    url: 'https://github.com/golang/website/pull/357',
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/25',
    glowColor: 'rgba(56,189,248,0.1)',
  },
  {
    number: 31931,
    org: 'helm/helm',
    orgDisplay: 'Helm',
    badge: 'CNCF Graduated · 29k+ ⭐',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    title: 'Remove legacy Go import path comments',
    description: 'Cleaned up pre-Go-modules Kythe import path comments from pkg/kube — Go module-based projects no longer require these annotations.',
    impact: 'Keeps the most widely used Kubernetes package manager\'s codebase idiomatic and free of legacy noise.',
    tags: ['Go', 'CNCF', 'Kubernetes'],
    url: 'https://github.com/helm/helm/pull/31931',
    accentClass: 'text-amber-400',
    borderClass: 'border-amber-500/25',
    glowColor: 'rgba(251,191,36,0.1)',
  },
  {
    number: 6462,
    org: 'goreleaser/goreleaser',
    orgDisplay: 'GoReleaser',
    badge: '14k+ ⭐',
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

// ─── Static Fallback ──────────────────────────────────────────────────────────
const STATIC_MERGED: MergedPR[] = [
  { number: 357,   repo: 'golang/website',        orgInitial: 'G', title: 'doc/modules/gomod-ref: document the ignore directive',                description: 'Added the missing ignore directive to the official go.mod reference on go.dev — syntax, examples (relative path, named dir, block form), and usage notes. Fixes golang/go#78460.', tags: ['Go','Docs','go.dev'],               mergedAt: 'Apr 17, 2026', repoStars: '',     url: 'https://github.com/golang/website/pull/357',        ...MERGED_THEMES[5] },
  { number: 629,   repo: 'golang/tools',          orgInitial: 'G', title: 'modernize/stringscut: simplify Split/SplitN[0] to strings.Cut',       description: 'New analyzer replacing strings.Split/SplitN[0] patterns with strings.Cut (Go 1.18). 267-line AST pass. Reviewed by Alan Donovan & Madeline Kalil (Google). Ships in gopls.', tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 15, 2026', repoStars: '10k+', url: 'https://github.com/golang/tools/pull/629',           ...MERGED_THEMES[4] },
  { number: 627,   repo: 'golang/tools',          orgInitial: 'G', title: 'go/analysis/passes/modernize: add slicesbackward analyzer',          description: 'New static analysis pass detecting backward for-loops and suggesting slices.Backward (Go 1.23). Ships in gopls. Reviewed by Alan Donovan (Go core team).',                tags: ['Go','AST','gopls','Go Toolchain'],  mergedAt: 'Apr 3, 2026',  repoStars: '10k+', url: 'https://github.com/golang/tools/pull/627',           ...MERGED_THEMES[4] },
  { number: 31931, repo: 'helm/helm',            orgInitial: 'H', title: 'pkg/kube: remove legacy import comments',                            description: 'Fixed legacy Kythe static analysis failures by migrating pre-Go modules import path comments to modern go.mod conventions.',  tags: ['Go','Kubernetes','CNCF'],           mergedAt: 'Mar 12, 2026', repoStars: '29k+', url: 'https://github.com/helm/helm/pull/31931',            ...MERGED_THEMES[0] },
  { number: 6462,  repo: 'goreleaser/goreleaser', orgInitial: 'G', title: 'fix: filterOut returns excluded tag when multiple ignore_tags set',   description: 'Resolved release pipeline bug where multiple ignore_tags caused incorrect tag exclusion logic.',                           tags: ['Go','CI/CD','Release'],             mergedAt: 'Mar 17, 2026', repoStars: '14k+', url: 'https://github.com/goreleaser/goreleaser/pull/6462',  ...MERGED_THEMES[1] },
  { number: 8215,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'feat(monitor): restore Grafana to SPM docker-compose example',       description: 'Restored Grafana to the SPM docker-compose as part of ADR-007 observability stack migration.',                           tags: ['Go','Grafana','Docker','CNCF'],     mergedAt: 'Mar 21, 2026', repoStars: '20k+', url: 'https://github.com/jaegertracing/jaeger/pull/8215',   ...MERGED_THEMES[2] },
  { number: 8216,  repo: 'jaegertracing/jaeger',  orgInitial: 'J', title: 'feat(monitor): Go SDK dashboard generator — ADR-007 Step 2a',        description: 'Implemented a Go SDK-based Grafana dashboard generator enabling programmatic dashboard provisioning for Jaeger SPM.',    tags: ['Go','Grafana','CNCF','Observability'], mergedAt: 'Mar 24, 2026', repoStars: '20k+', url: 'https://github.com/jaegertracing/jaeger/pull/8216', ...MERGED_THEMES[3] },
]

const STATIC_OPEN: OpenPR[] = [
  { number: 26918,  repo: 'argoproj/argo-cd',        orgInitial: 'A', title: 'fix: add X-Frame-Options and CSP headers to Swagger UI',               tags: ['Go','Security'],         date: 'Mar 19', url: 'https://github.com/argoproj/argo-cd/pull/26918',          dotClass: 'bg-blue-400',    borderClass: 'border-l-blue-500/50',    bgClass: 'bg-blue-950/20',   orgClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30'     },
  { number: 18039,  repo: 'meshery/meshery',          orgInitial: 'M', title: 'fix: optimize GetSystemDatabase to avoid N+1 queries',                  tags: ['Go','Database'],         date: 'Mar 18', url: 'https://github.com/meshery/meshery/pull/18039',           dotClass: 'bg-emerald-400', borderClass: 'border-l-emerald-500/50', bgClass: 'bg-emerald-950/20',orgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'},
  { number: 1645,   repo: 'NVIDIA/NeMo-Retriever',    orgInitial: 'N', title: 'helm: add nodeSelector and tolerations to NIMCache templates',          tags: ['Helm','Kubernetes'],     date: 'Mar 18', url: 'https://github.com/NVIDIA/NeMo-Retriever/pull/1645',      dotClass: 'bg-green-400',   borderClass: 'border-l-green-500/50',   bgClass: 'bg-green-950/20',  orgClass: 'bg-green-500/20 text-green-300 border-green-500/30'  },
  { number: 6861,   repo: 'docker/cli',               orgInitial: 'D', title: 'testing: address G115 integer overflow warnings and re-enable linter',  tags: ['Go','Testing'],          date: 'Mar 17', url: 'https://github.com/docker/cli/pull/6861',                 dotClass: 'bg-sky-400',     borderClass: 'border-l-sky-500/50',     bgClass: 'bg-sky-950/20',    orgClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30'        },
  { number: 26473,  repo: 'jenkinsci/jenkins',        orgInitial: 'J', title: 'Fix ParserConfigurator to not reference Jenkins class on agents',       tags: ['Java','Jenkins'],        date: 'Mar 17', url: 'https://github.com/jenkinsci/jenkins/pull/26473',         dotClass: 'bg-red-400',     borderClass: 'border-l-red-500/50',     bgClass: 'bg-red-950/20',    orgClass: 'bg-red-500/20 text-red-300 border-red-500/30'        },
  { number: 120374, repo: 'grafana/grafana',          orgInitial: 'G', title: 'fix(email): remove external remote content from email templates',       tags: ['TypeScript','Security'], date: 'Mar 15', url: 'https://github.com/grafana/grafana/pull/120374',          dotClass: 'bg-orange-400',  borderClass: 'border-l-orange-500/50',  bgClass: 'bg-orange-950/20', orgClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30'},
  { number: 31933,  repo: 'helm/helm',                orgInitial: 'H', title: 'remove legacy import comments from remaining packages',                 tags: ['Go','CNCF'],             date: 'Mar 12', url: 'https://github.com/helm/helm/pull/31933',                 dotClass: 'bg-cyan-400',    borderClass: 'border-l-cyan-500/50',    bgClass: 'bg-cyan-950/20',   orgClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'     },
  { number: 34645,  repo: 'openvinotoolkit/openvino', orgInitial: 'O', title: 'GHA(Android): parameterize emulator test artifact names via matrix',   tags: ['GHA','Android'],         date: 'Mar 12', url: 'https://github.com/openvinotoolkit/openvino/pull/34645',  dotClass: 'bg-indigo-400',  borderClass: 'border-l-indigo-500/50',  bgClass: 'bg-indigo-950/20', orgClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'},
  { number: 114,    repo: 'Rancheroo/r8s',            orgInitial: 'R', title: 'feat: add multi-arch Docker image and GHCR publish workflow',          tags: ['Docker','GHA'],          date: 'Mar 11', url: 'https://github.com/Rancheroo/r8s/pull/114',               dotClass: 'bg-teal-400',    borderClass: 'border-l-teal-500/50',    bgClass: 'bg-teal-950/20',   orgClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30'     },
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
    { value: '10+',               label: 'Orgs',        icon: Star,           accent: 'text-purple-400', bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]' },
    { value: '70k+',              label: 'Repo Stars',  icon: Star,           accent: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]'  },
  ]

  return (
    <section id="opensource" className="relative py-28 overflow-hidden bg-black">

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
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[140px]" />
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
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">04.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Open Source</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Contributions</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </Reveal>

        {/* ── Stats Bar ───────────────────────────────────────────────────── */}
        <Reveal from={{ opacity: 0, y: 20 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
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

        {/* ── Featured: Deep Dive Spotlight ───────────────────────────────── */}
        {FEATURED_PROJECTS.map((project) => (
          <Reveal key={project.org} className="mb-12">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-mono">Featured Project · Deep Dive</span>
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
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-lg font-mono ${project.accentClass}`} style={{ background: project.glowColor, borderColor: project.glowColor }}>{project.orgInitial}</div>
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
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                      <div className="flex flex-wrap gap-1">
                        {pr.tags.map(t => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.08] text-neutral-500">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600 group-hover/pr:text-cyan-400 transition-colors">
                        <span className="text-[10px] font-mono">View PR</span>
                        <ArrowUpRight size={11} className="group-hover/pr:translate-x-0.5 group-hover/pr:-translate-y-0.5 transition-transform" />
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
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 font-mono">Other Merged PRs</span>
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
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-400 font-mono">All Merged Pull Requests</span>
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
                        <div className={`w-8 h-8 rounded-xl border text-[11px] font-black font-mono flex items-center justify-center shrink-0 ${pr.orgBgClass} ${pr.orgTextClass}`}>
                          {pr.orgInitial}
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
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-mono">Active Contributions</span>
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
            <span className="flex-1 text-center text-[11px] font-mono text-neutral-600">gh pr list --author abhay1999 --state open</span>
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
                <div className={`w-7 h-7 rounded-lg border text-[10px] font-black font-mono flex items-center justify-center shrink-0 ${pr.orgClass}`}>
                  {pr.orgInitial}
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
