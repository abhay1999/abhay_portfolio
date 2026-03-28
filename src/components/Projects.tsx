"use client"

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GithubIcon, ExternalLink, ArrowUpRight } from 'lucide-react'

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: '02',
    title: 'Netflix Clone Architecture',
    description:
      'Microservices-based Netflix clone on Amazon EKS with video streaming, authentication, and recommendation algorithms.',
    techStack: ['React', 'Node.js', 'AWS EKS', 'Docker', 'MongoDB'],
    github: 'https://github.com/abhay1999/netflix-clone',
    liveDemo: '',
    category: 'Full-Stack',
    numberClass:     'text-red-400/12',
    pillClass:       'bg-red-900/40 text-red-200 border-red-500/25',
    borderClass:     'border-red-500/20 hover:border-red-400/50',
    gradientClass:   'from-red-950/60 via-neutral-900/80 to-neutral-950',
    blobClass:       'bg-red-500/30',
    scanClass:       'bg-red-400',
    orbitClass:      'border-red-500/25',
    orbitDotClass:   'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,1)]',
    nodeClass:       'bg-red-400 shadow-[0_0_9px_rgba(248,113,113,0.9)]',
    accentText:      'text-red-400',
    titleHoverClass: 'group-hover:text-red-400',
    arrowHoverClass: 'group-hover:text-red-400',
    boxShadow:       '0 0 80px -20px rgba(239,68,68,0.28)',
    gridColor:       'rgba(248,113,113,0.07)',
  },
  {
    id: '03',
    title: 'Real Estate Platform',
    description:
      'High-performance property listing platform with advanced search, secure auth, and an intuitive admin dashboard.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'AWS S3', 'Tailwind'],
    github: 'https://github.com/abhay1999/real-estate',
    liveDemo: '',
    category: 'Full-Stack',
    numberClass:     'text-emerald-400/12',
    pillClass:       'bg-emerald-900/40 text-emerald-200 border-emerald-500/25',
    borderClass:     'border-emerald-500/20 hover:border-emerald-400/50',
    gradientClass:   'from-emerald-950/60 via-neutral-900/80 to-neutral-950',
    blobClass:       'bg-emerald-500/30',
    scanClass:       'bg-emerald-400',
    orbitClass:      'border-emerald-500/25',
    orbitDotClass:   'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]',
    nodeClass:       'bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.9)]',
    accentText:      'text-emerald-400',
    titleHoverClass: 'group-hover:text-emerald-400',
    arrowHoverClass: 'group-hover:text-emerald-400',
    boxShadow:       '0 0 80px -20px rgba(16,185,129,0.28)',
    gridColor:       'rgba(52,211,153,0.07)',
  },
  {
    id: '04',
    title: 'AvlokanIAS Educational Hub',
    description:
      'E-learning platform scaling to thousands of concurrent video streams for UPSC aspirants across India.',
    techStack: ['React', 'MySQL', 'AWS', 'Video Streaming'],
    github: 'https://github.com/abhay1999/avlokan-ias',
    liveDemo: 'https://avlokanias.com',
    category: 'Full-Stack',
    numberClass:     'text-purple-400/12',
    pillClass:       'bg-purple-900/40 text-purple-200 border-purple-500/25',
    borderClass:     'border-purple-500/20 hover:border-purple-400/50',
    gradientClass:   'from-purple-950/60 via-neutral-900/80 to-neutral-950',
    blobClass:       'bg-purple-500/30',
    scanClass:       'bg-purple-400',
    orbitClass:      'border-purple-500/25',
    orbitDotClass:   'bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,1)]',
    nodeClass:       'bg-purple-400 shadow-[0_0_9px_rgba(192,132,252,0.9)]',
    accentText:      'text-purple-400',
    titleHoverClass: 'group-hover:text-purple-400',
    arrowHoverClass: 'group-hover:text-purple-400',
    boxShadow:       '0 0 80px -20px rgba(168,85,247,0.28)',
    gridColor:       'rgba(192,132,252,0.07)',
  },
  {
    id: '05',
    title: 'Government Hackathon Portal',
    description:
      'Real-time event management system with live registrations, submissions, and leaderboards via WebSockets.',
    techStack: ['React', 'Socket.io', 'MongoDB', 'AWS'],
    github: 'https://github.com/abhay1999/hackathon-platform',
    liveDemo: '',
    category: 'Full-Stack',
    numberClass:     'text-amber-400/12',
    pillClass:       'bg-amber-900/40 text-amber-200 border-amber-500/25',
    borderClass:     'border-amber-500/20 hover:border-amber-400/50',
    gradientClass:   'from-amber-950/60 via-neutral-900/80 to-neutral-950',
    blobClass:       'bg-amber-500/30',
    scanClass:       'bg-amber-400',
    orbitClass:      'border-amber-500/25',
    orbitDotClass:   'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)]',
    nodeClass:       'bg-amber-400 shadow-[0_0_9px_rgba(251,191,36,0.9)]',
    accentText:      'text-amber-400',
    titleHoverClass: 'group-hover:text-amber-400',
    arrowHoverClass: 'group-hover:text-amber-400',
    boxShadow:       '0 0 80px -20px rgba(245,158,11,0.28)',
    gridColor:       'rgba(251,191,36,0.07)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Projects = () => {
  return (
    <section id="projects" className="relative py-32 overflow-hidden bg-black">

      {/* ── Background System ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">

        {/* Micro circuit grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,211,238,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Perspective floor grid */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139,92,246,0.9) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139,92,246,0.9) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
          }}
        />

        {/* Horizontal circuit traces */}
        <div className="absolute top-[22%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
        </div>
        <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/12 to-transparent">
          <motion.div
            animate={{ x: ['200%', '-100%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          />
        </div>

        {/* Vertical circuit traces */}
        <div className="absolute top-0 left-[18%] h-full w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
            className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
          />
        </div>
        <div className="absolute top-0 right-[18%] h-full w-px bg-gradient-to-b from-transparent via-orange-500/10 to-transparent">
          <motion.div
            animate={{ y: ['200%', '-100%'] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
            className="absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent"
          />
        </div>

        {/* Intersection glow nodes */}
        <div className="absolute top-[22%] left-[18%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
        <div className="absolute top-[22%] right-[18%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_12px_3px_rgba(251,146,60,0.6)]" />
        <div className="absolute top-[70%] left-[18%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
        <div className="absolute top-[70%] right-[18%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_3px_rgba(192,132,252,0.6)]" />

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          {/* Terminal prompt */}
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-cyan-400">$</span>
            <span className="text-neutral-400">build</span>
            <span className="text-neutral-600">~/projects</span>
            <span className="text-white">›</span>
            <span className="text-purple-400">project_manifest</span>
            <span className="text-neutral-300">.load()</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5"
            />
          </div>

          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">05.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Featured</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Projects</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </motion.div>

        {/* ── Project Grid ─────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {PROJECTS.map((project, idx) => (
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
                {/* ── Visual Strip ── */}
                <div className="relative h-52 overflow-hidden flex items-center justify-center flex-shrink-0">

                  {/* Micro grid with accent color */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${project.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${project.gridColor} 1px, transparent 1px)`,
                      backgroundSize: '22px 22px',
                    }}
                  />

                  {/* Bottom fade */}
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-transparent to-black/25" />

                  {/* Corner glow nodes */}
                  <div aria-hidden="true" className={`absolute top-3 left-3 w-1.5 h-1.5 rounded-full ${project.nodeClass}`} />
                  <div aria-hidden="true" className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${project.nodeClass}`} />
                  <div aria-hidden="true" className={`absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full ${project.nodeClass}`} />
                  <div aria-hidden="true" className={`absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full ${project.nodeClass}`} />

                  {/* Corner bracket lines */}
                  <div aria-hidden="true" className={`absolute top-3 left-3 w-6 h-px ${project.scanClass} opacity-40`} />
                  <div aria-hidden="true" className={`absolute top-3 left-3 w-px h-6 ${project.scanClass} opacity-40`} />
                  <div aria-hidden="true" className={`absolute top-3 right-3 w-6 h-px ${project.scanClass} opacity-40`} />
                  <div aria-hidden="true" className={`absolute bottom-3 left-3 w-6 h-px ${project.scanClass} opacity-40`} />

                  {/* Accent blob */}
                  <div aria-hidden="true" className={`absolute w-44 h-44 rounded-full blur-[60px] opacity-35 ${project.blobClass}`} />

                  {/* Orbit ring around the ghost number */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + idx * 4, repeat: Infinity, ease: 'linear' }}
                    className={`absolute w-32 h-32 rounded-full border ${project.orbitClass}`}
                  >
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${project.orbitDotClass}`} />
                  </motion.div>
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 14 + idx * 3, repeat: Infinity, ease: 'linear' }}
                    className={`absolute w-20 h-20 rounded-full border ${project.orbitClass} opacity-50`}
                  >
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full ${project.orbitDotClass}`} />
                  </motion.div>

                  {/* Ghost project number */}
                  <span
                    aria-hidden="true"
                    className={`relative z-10 text-8xl font-black font-mono leading-none select-none ${project.numberClass}`}
                  >
                    {project.id}
                  </span>

                  {/* Animated horizontal scan line */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ y: ['-300%', '800%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 4 + idx }}
                    className={`absolute left-0 right-0 h-px ${project.scanClass} opacity-40`}
                  />

                  {/* Category pill — top-left */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${project.pillClass}`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Action icons — top-right on hover */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} on GitHub`}
                        className="w-8 h-8 rounded-full bg-black/75 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200"
                      >
                        <GithubIcon size={13} />
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} live demo`}
                        className="w-8 h-8 rounded-full bg-black/75 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* ── Card Content ── */}
                <div className="flex flex-col flex-1 p-6" style={{ transform: 'translateZ(8px)' }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className={`text-xl font-bold text-white ${project.titleHoverClass} transition-colors duration-300 leading-snug`}>
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={16}
                      className={`text-neutral-600 ${project.arrowHoverClass} shrink-0 mt-0.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                    />
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed flex-1 mb-5">
                    {project.description}
                  </p>

                  <div className={`flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.07]`}>
                    {project.techStack.map(tech => (
                      <span key={tech} className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md border ${project.pillClass}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* ── Footer CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <a
            href="https://github.com/abhay1999"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/15 text-white rounded-2xl hover:bg-white hover:text-black transition-all duration-300 font-medium hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            <GithubIcon size={17} />
            <span>View All on GitHub</span>
            <ArrowUpRight
              size={15}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </motion.div>

      </div>
    </section>
  )
}

export default Projects
