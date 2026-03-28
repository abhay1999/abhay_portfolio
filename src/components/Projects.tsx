"use client"

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, ArrowUpRight, Star, GitFork } from 'lucide-react'

// ─── TiltCard ─────────────────────────────────────────────────────────────────
const TiltCard = ({
  children, className, style,
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => {
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateZ(30px)' }} />
    </motion.div>
  )
}

// ─── GitHub SVG icon ──────────────────────────────────────────────────────────
const GithubIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

// ─── Featured Projects ────────────────────────────────────────────────────────
const FEATURED = [
  {
    id: '01',
    repo: 'abhay1999/self-healing-k8s-platform',
    title: 'Self-Healing K8s Platform',
    description: 'Production-grade Kubernetes platform with automated failure detection, self-healing loops, and observability stack. Custom operators, Prometheus alerting, and GitOps-based remediation pipelines.',
    techStack: ['Kubernetes', 'Go', 'Prometheus', 'Helm', 'GitOps'],
    github: 'https://github.com/abhay1999/self-healing-k8s-platform',
    liveDemo: '',
    category: 'DevOps',
    highlight: '3 custom K8s operators',
    accentColor: 'emerald',
    terminal: {
      title: 'self-healing-k8s ~ kubectl',
      prompt: '$ kubectl get pods -n platform',
      rows: [
        { text: 'NAME                     READY   STATUS    ', dim: true },
        { text: 'self-healer-ctrl-x9k2    1/1     Running   ', dim: false },
        { text: 'prometheus-server-m7p1   1/1     Running   ', dim: false },
        { text: 'alertmanager-0           1/1     Running   ', dim: false },
      ],
      status: '✓ self-healing loop: ACTIVE',
    },
    pillClass:       'bg-emerald-900/40 text-emerald-200 border-emerald-500/25',
    borderClass:     'border-emerald-500/20 hover:border-emerald-400/50',
    gradientClass:   'from-emerald-950/50 via-neutral-900/80 to-black',
    accentText:      'text-emerald-400',
    titleHoverClass: 'group-hover:text-emerald-300',
    statusClass:     'text-emerald-400',
    termBorderClass: 'border-emerald-500/15',
    termBgClass:     'bg-emerald-950/30',
    highlightClass:  'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    boxShadow:       '0 0 60px -20px rgba(16,185,129,0.22)',
    numberClass:     'text-emerald-400/8',
    gridColor:       'rgba(52,211,153,0.05)',
    scanClass:       'via-emerald-400/50',
  },
  {
    id: '02',
    repo: 'abhay1999/abhay_portfolio',
    title: 'Developer Portfolio',
    description: 'This portfolio — built with Next.js 14, Tailwind, and Framer Motion. Features 3D TiltCards, live GitHub API, circuit-board backgrounds, and a full DevOps setup with Docker + Nginx.',
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind', 'Docker'],
    github: 'https://github.com/abhay1999/abhay_portfolio',
    liveDemo: '',
    category: 'Full-Stack',
    highlight: 'Live GitHub API · 3D UI',
    accentColor: 'cyan',
    terminal: {
      title: 'abhay-portfolio ~ next',
      prompt: '$ npm run build',
      rows: [
        { text: '▲ Next.js 14.2.5 (static export)', dim: true },
        { text: '✓ Compiled successfully           ', dim: false },
        { text: '✓ Generating static pages (8/8)  ', dim: false },
        { text: '✓ Docker image built              ', dim: false },
      ],
      status: '✓ deployed · nginx serving',
    },
    pillClass:       'bg-cyan-900/40 text-cyan-200 border-cyan-500/25',
    borderClass:     'border-cyan-500/20 hover:border-cyan-400/50',
    gradientClass:   'from-cyan-950/50 via-neutral-900/80 to-black',
    accentText:      'text-cyan-400',
    titleHoverClass: 'group-hover:text-cyan-300',
    statusClass:     'text-cyan-400',
    termBorderClass: 'border-cyan-500/15',
    termBgClass:     'bg-cyan-950/30',
    highlightClass:  'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    boxShadow:       '0 0 60px -20px rgba(34,211,238,0.22)',
    numberClass:     'text-cyan-400/8',
    gridColor:       'rgba(34,211,238,0.05)',
    scanClass:       'via-cyan-400/50',
  },
  {
    id: '03',
    repo: 'abhay1999/Netflix-Clone-Deployment-on-Amazon-EKS',
    title: 'Netflix Clone on EKS',
    description: 'End-to-end Netflix clone on Amazon EKS — full DevSecOps pipeline with Terraform, Jenkins CI/CD, Docker, SonarQube, Trivy security scanning, Prometheus & Grafana monitoring.',
    techStack: ['AWS EKS', 'Terraform', 'Jenkins', 'Docker', 'Trivy'],
    github: 'https://github.com/abhay1999/Netflix-Clone-Deployment-on-Amazon-EKS',
    liveDemo: '',
    category: 'DevSecOps',
    highlight: '0 critical vulns · full CI/CD',
    accentColor: 'red',
    terminal: {
      title: 'netflix-eks ~ terraform',
      prompt: '$ terraform apply -target=module.eks',
      rows: [
        { text: 'aws_eks_cluster.netflix: Creating...', dim: true },
        { text: 'aws_eks_cluster.netflix: Complete   ', dim: false },
        { text: '✓ Jenkins pipeline: PASSED          ', dim: false },
        { text: '✓ Trivy scan: 0 critical found      ', dim: false },
      ],
      status: '✓ EKS cluster: RUNNING',
    },
    pillClass:       'bg-red-900/40 text-red-200 border-red-500/25',
    borderClass:     'border-red-500/20 hover:border-red-400/50',
    gradientClass:   'from-red-950/50 via-neutral-900/80 to-black',
    accentText:      'text-red-400',
    titleHoverClass: 'group-hover:text-red-300',
    statusClass:     'text-red-400',
    termBorderClass: 'border-red-500/15',
    termBgClass:     'bg-red-950/30',
    highlightClass:  'bg-red-500/10 border-red-500/20 text-red-300',
    boxShadow:       '0 0 60px -20px rgba(239,68,68,0.22)',
    numberClass:     'text-red-400/8',
    gridColor:       'rgba(248,113,113,0.05)',
    scanClass:       'via-red-400/50',
  },
  {
    id: '04',
    repo: '',
    title: 'AvlokanIAS Educational Hub',
    description: 'Full-scale e-learning platform for UPSC aspirants — video streaming, secure auth, payment integration, and admin dashboard. Scaled to 5000+ concurrent users on launch day using AWS infrastructure.',
    techStack: ['React', 'Node.js', 'MySQL', 'AWS', 'Video Streaming'],
    github: '',
    liveDemo: 'https://avlokanias.com',
    category: 'Full-Stack',
    highlight: '5000+ concurrent users',
    accentColor: 'purple',
    terminal: {
      title: 'avlokan-ias ~ server',
      prompt: '$ node server.js --env=production',
      rows: [
        { text: 'Connecting to MySQL... OK          ', dim: true },
        { text: 'Video CDN: initialized             ', dim: false },
        { text: 'Payment gateway: connected         ', dim: false },
        { text: 'Listening on :443 (SSL)            ', dim: false },
      ],
      status: '● 5000+ users online',
    },
    pillClass:       'bg-purple-900/40 text-purple-200 border-purple-500/25',
    borderClass:     'border-purple-500/20 hover:border-purple-400/50',
    gradientClass:   'from-purple-950/50 via-neutral-900/80 to-black',
    accentText:      'text-purple-400',
    titleHoverClass: 'group-hover:text-purple-300',
    statusClass:     'text-purple-400',
    termBorderClass: 'border-purple-500/15',
    termBgClass:     'bg-purple-950/30',
    highlightClass:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    boxShadow:       '0 0 60px -20px rgba(168,85,247,0.22)',
    numberClass:     'text-purple-400/8',
    gridColor:       'rgba(192,132,252,0.05)',
    scanClass:       'via-purple-400/50',
  },
]

type RepoStats = Record<string, { stars: number; forks: number }>

// ─── Component ────────────────────────────────────────────────────────────────
const Projects = () => {
  const [stats, setStats] = useState<RepoStats>({})

  useEffect(() => {
    const repos = FEATURED.filter(p => p.repo).map(p => p.repo)
    Promise.all(
      repos.map(repo =>
        fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const map: RepoStats = {}
      results.forEach((data, i) => {
        if (data) map[repos[i]] = { stars: data.stargazers_count, forks: data.forks_count }
      })
      setStats(map)
    })
  }, [])

  return (
    <section id="projects" className="relative py-24 overflow-hidden bg-black">

      {/* ── Background ──────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.8) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.9) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
        }} />
        <div className="absolute top-[22%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
        <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/12 to-transparent">
          <motion.div animate={{ x: ['200%', '-100%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-500/4 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/4 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-neutral-500">
            <span className="text-cyan-400">$</span>
            <span className="text-neutral-400">build</span>
            <span className="text-neutral-600">~/projects</span>
            <span className="text-white">›</span>
            <span className="text-purple-400">project_manifest</span>
            <span className="text-neutral-300">.load()</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
              className="w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5" />
          </div>

          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">05.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Featured</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Projects</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
          <p className="text-sm text-neutral-600 mt-3 font-mono">
            <span className="text-neutral-500">4 handpicked projects</span> · more on{' '}
            <a href="https://github.com/abhay1999" target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors">GitHub</a>
          </p>
        </motion.div>

        {/* ── Project Grid ─────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {FEATURED.map((project, idx) => {
            const repoStats = project.repo ? stats[project.repo] : undefined
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40, rotateX: 6 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, delay: idx * 0.09, ease: 'easeOut' }}
                className="group [perspective:900px]"
              >
                <TiltCard
                  className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 bg-gradient-to-br ${project.gradientClass} ${project.borderClass}`}
                  style={{ boxShadow: project.boxShadow }}
                >
                  {/* ── Terminal Visual Strip ── */}
                  <div className={`relative overflow-hidden border-b ${project.termBorderClass}`}>

                    {/* Subtle grid bg */}
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
                      backgroundImage: `linear-gradient(to right, ${project.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${project.gridColor} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }} />

                    {/* Scan line */}
                    <motion.div
                      aria-hidden="true"
                      animate={{ y: ['-200%', '600%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 3 + idx }}
                      className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${project.scanClass} to-transparent opacity-60 pointer-events-none z-10`}
                    />

                    {/* macOS title bar */}
                    <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${project.termBorderClass} bg-black/40 backdrop-blur-sm`}>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 ml-1 tracking-wide truncate">{project.terminal.title}</span>

                      {/* Category pill pushed right */}
                      <span className={`ml-auto shrink-0 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${project.pillClass}`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Terminal body */}
                    <div className={`relative px-4 pt-3 pb-3 font-mono text-[11px] leading-[1.7] ${project.termBgClass} overflow-hidden`}>
                      {/* Ghost number — behind terminal text */}
                      <span aria-hidden="true" className={`absolute -bottom-2 right-2 font-black text-[5rem] leading-none select-none pointer-events-none ${project.numberClass}`}>
                        {project.id}
                      </span>
                      <div className={`relative z-10 mb-1 ${project.accentText}`}>{project.terminal.prompt}</div>
                      {project.terminal.rows.map((row, i) => (
                        <div key={i} className={`relative z-10 ${row.dim ? 'text-neutral-600' : 'text-neutral-300'}`}>
                          {row.text}
                        </div>
                      ))}
                      <div className={`relative z-10 mt-1.5 font-semibold ${project.statusClass}`}>
                        {project.terminal.status}
                      </div>
                    </div>
                  </div>

                  {/* ── Card Content ── */}
                  <div className="flex flex-col flex-1 p-5" style={{ transform: 'translateZ(8px)' }}>

                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`text-[17px] font-bold text-white ${project.titleHoverClass} transition-colors duration-300 leading-snug`}>
                        {project.title}
                      </h3>
                      <ArrowUpRight size={15}
                        className={`${project.accentText} opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
                    </div>

                    {/* Highlight badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-semibold tracking-wide ${project.highlightClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {project.highlight}
                      </span>
                    </div>

                    <p className="text-[13px] text-neutral-400 leading-relaxed flex-1 mb-4">
                      {project.description}
                    </p>

                    {/* Tech pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map(tech => (
                        <span key={tech} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${project.pillClass}`}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* ── Bottom row: stats + links ── */}
                    <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-white/[0.07]">

                      {/* Stars / Forks */}
                      <div className="flex items-center gap-2">
                        {repoStats && repoStats.stars > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-mono text-neutral-500">{repoStats.stars}</span>
                          </div>
                        )}
                        {repoStats && repoStats.forks > 0 && (
                          <div className="flex items-center gap-1">
                            <GitFork size={10} className="text-neutral-600" />
                            <span className="text-[10px] font-mono text-neutral-500">{repoStats.forks}</span>
                          </div>
                        )}
                        {!repoStats && !project.github && (
                          <span className="text-[10px] font-mono text-neutral-700">Private</span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${project.accentText} hover:opacity-75 transition-opacity`}
                          >
                            <GithubIcon size={11} />
                            Repo
                          </a>
                        )}
                        {project.github && project.liveDemo && (
                          <span className="text-neutral-700">·</span>
                        )}
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors"
                          >
                            <ExternalLink size={10} />
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </TiltCard>
              </motion.div>
            )
          })}
        </div>

        {/* ── Footer CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <a
            href="https://github.com/abhay1999"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/15 text-white rounded-2xl hover:bg-white hover:text-black transition-all duration-300 font-medium hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <GithubIcon size={17} />
            <span>View All Projects on GitHub</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  )
}

export default Projects
