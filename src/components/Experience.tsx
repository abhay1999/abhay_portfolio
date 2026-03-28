"use client"

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Calendar, MapPin, Briefcase, GraduationCap, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

// ─── Shared tilt wrapper ──────────────────────────────────────────────────────

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
  const mx = useSpring(x, { stiffness: 100, damping: 25 })
  const my = useSpring(y, { stiffness: 100, damping: 25 })
  const rotateX = useTransform(my, [-0.5, 0.5], ['4deg', '-4deg'])
  const rotateY = useTransform(mx, [-0.5, 0.5], ['-4deg', '4deg'])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      className={className}
    >
      {children}
      {/* Glassy reflection overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/[0.04] via-white/[0.02] to-transparent z-50"
      />
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ENTRIES = [
  {
    id: '01',
    type: 'Work' as const,
    current: false,
    role: 'Full-Stack Developer',
    subtitle: 'Freelance',
    company: 'AvlokanIAS & Others',
    period: 'Apr 2025 – Aug 2025',
    location: 'Remote',
    description:
      'Consulting and building digital products for clients across edtech and gov-tech. Focusing on scalable architecture and seamless user experiences.',
    highlights: [
      'Developed end-to-end portfolio websites for personal brands',
      'Built a Government Hackathon platform handling 10,000+ applicants',
      'Engineered core features for the AvlokanIAS UPSC preparation platform',
    ],
    tech: ['React', 'Next.js', 'Node.js', 'AWS', 'MongoDB'],
    icon: Briefcase,
    // Static accent classes per card
    cardGradient: 'from-cyan-950/60 via-slate-900/80 to-neutral-950',
    cardBorder: 'border-cyan-500/20 hover:border-cyan-400/50',
    panelGradient: 'from-cyan-900/40 to-blue-900/20',
    numberColor: 'text-cyan-400/[0.07]',
    ringA: 'border-cyan-500/15',
    ringB: 'border-cyan-400/25',
    ringC: 'border-cyan-300/35',
    iconRing: 'bg-cyan-500/20 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.5)]',
    iconColor: 'text-cyan-300',
    dot1: 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,1)]',
    dot2: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]',
    pill: 'bg-cyan-900/50 text-cyan-200 border-cyan-500/30',
    chevron: 'text-cyan-400',
    typeBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    glowBox: '0 0 100px -20px rgba(6,182,212,0.3)',
    connectorColor: 'from-cyan-500/30 via-purple-500/20',
  },
  {
    id: '02',
    type: 'Work' as const,
    current: false,
    role: 'Associate Software Engineer',
    subtitle: 'Full-time',
    company: 'QTIMINDS Pvt Ltd',
    period: 'Dec 2023 – Jan 2025',
    location: 'India',
    description:
      'Worked within a fast-paced agile team delivering full-stack features, cloud infrastructure, and performance optimization at scale.',
    highlights: [
      'Architected and deployed a scalable Netflix Clone on Amazon EKS',
      'Built a high-performance Real Estate property listing platform',
      'Migrated legacy monolithic services into containerised microservices',
    ],
    tech: ['Python', 'React', 'Docker', 'Kubernetes', 'AWS'],
    icon: Briefcase,
    cardGradient: 'from-purple-950/60 via-slate-900/80 to-neutral-950',
    cardBorder: 'border-purple-500/20 hover:border-purple-400/50',
    panelGradient: 'from-purple-900/40 to-violet-900/20',
    numberColor: 'text-purple-400/[0.07]',
    ringA: 'border-purple-500/15',
    ringB: 'border-purple-400/25',
    ringC: 'border-purple-300/35',
    iconRing: 'bg-purple-500/20 border-purple-400/40 shadow-[0_0_40px_rgba(168,85,247,0.5)]',
    iconColor: 'text-purple-300',
    dot1: 'bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,1)]',
    dot2: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,1)]',
    pill: 'bg-purple-900/50 text-purple-200 border-purple-500/30',
    chevron: 'text-purple-400',
    typeBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    glowBox: '0 0 100px -20px rgba(168,85,247,0.25)',
    connectorColor: 'from-purple-500/30 via-amber-500/20',
  },
  {
    id: '03',
    type: 'Education' as const,
    current: false,
    role: 'B.Tech + M.Tech Dual Degree',
    subtitle: 'Education',
    company: 'IIIT Gwalior',
    period: 'Graduated',
    location: 'Gwalior, India',
    description:
      'Indian Institute of Information Technology. Completed an integrated 5-year dual degree program in Information Technology.',
    highlights: [
      'Coursework in Data Structures, Algorithms, and Software Engineering',
      'Participated in multiple national hackathons and coding competitions',
      'Built foundational expertise in full-stack development & system design',
    ],
    tech: ['Data Structures', 'Algorithms', 'C++', 'Python', 'System Design'],
    icon: GraduationCap,
    cardGradient: 'from-amber-950/60 via-slate-900/80 to-neutral-950',
    cardBorder: 'border-amber-500/20 hover:border-amber-400/50',
    panelGradient: 'from-amber-900/40 to-yellow-900/20',
    numberColor: 'text-amber-400/[0.07]',
    ringA: 'border-amber-500/15',
    ringB: 'border-amber-400/25',
    ringC: 'border-amber-300/35',
    iconRing: 'bg-amber-500/20 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.5)]',
    iconColor: 'text-amber-300',
    dot1: 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)]',
    dot2: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)]',
    pill: 'bg-amber-900/50 text-amber-200 border-amber-500/30',
    chevron: 'text-amber-400',
    typeBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    glowBox: '0 0 100px -20px rgba(245,158,11,0.25)',
    connectorColor: 'from-amber-500/30 via-transparent',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Experience = () => {
  return (
    <section id="experience" className="relative py-32 overflow-hidden bg-black [perspective:2000px]">

      {/* Ambient background orbs */}
      <div aria-hidden="true" className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-amber-500/3 rounded-full blur-[200px] pointer-events-none" />

      {/* 3D perspective floor grid */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'rotateX(70deg) translateY(60px)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 20%, transparent 80%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-24"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">03.</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Experience</span>{' '}
            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              &amp; Education
            </span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent ml-4" />
        </motion.div>

        {/* ── Timeline entries ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          {ENTRIES.map((entry, idx) => (
            <div key={entry.id}>

              {/* ── Card ─────────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard
                  className={`group relative flex flex-col lg:flex-row overflow-hidden rounded-3xl border transition-all duration-500 bg-gradient-to-br ${entry.cardGradient} ${entry.cardBorder}`}
                  style={{ boxShadow: entry.glowBox } as React.CSSProperties}
                >
                  {/* ── Visual Panel ─────────────────────────────────────── */}
                  <div
                    className={`relative lg:w-[38%] min-h-[200px] lg:min-h-0 flex items-center justify-center overflow-hidden bg-gradient-to-br ${entry.panelGradient}`}
                    style={{ transform: 'translateZ(0px)' }}
                  >
                    {/* Subtle dot-grid texture */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle, #ffffff12 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    {/* Right-edge fade into content */}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden lg:block" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 lg:hidden" />

                    {/* Ghost number */}
                    <span
                      aria-hidden="true"
                      className={`absolute text-[10rem] font-black font-mono leading-none select-none ${entry.numberColor} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                    >
                      {entry.id}
                    </span>

                    {/* Orbit system */}
                    <div className="relative z-10 flex items-center justify-center">
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        className={`absolute w-52 h-52 rounded-full border ${entry.ringA}`}
                      />
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                        className={`absolute w-36 h-36 rounded-full border ${entry.ringB}`}
                      />
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className={`absolute w-20 h-20 rounded-full border ${entry.ringC}`}
                      />

                      {/* Centre icon */}
                      <div
                        className={`relative z-20 w-14 h-14 rounded-2xl border flex items-center justify-center backdrop-blur-xl ${entry.iconRing}`}
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        <entry.icon size={26} className={entry.iconColor} />
                      </div>

                      {/* Orbiting dot — outer ring */}
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-52 h-52"
                      >
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${entry.dot1}`} />
                      </motion.div>

                      {/* Orbiting dot — middle ring */}
                      <motion.div
                        aria-hidden="true"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-36 h-36"
                      >
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${entry.dot2}`} />
                      </motion.div>
                    </div>
                  </div>

                  {/* ── Content Panel ────────────────────────────────────── */}
                  <div
                    className="lg:w-[62%] p-8 lg:p-10 flex flex-col justify-center"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-5">
                      <span className={`px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full border ${entry.typeBadge}`}>
                        {entry.type}
                      </span>
                      {entry.current && (
                        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Current
                        </span>
                      )}
                      <span className="ml-auto text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {entry.period}
                      </span>
                    </div>

                    {/* Role + company */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight group-hover:text-white/90 transition-colors">
                      {entry.role}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-300 mb-1">
                      <entry.icon size={15} className="text-neutral-500 shrink-0" />
                      <span className="font-medium">{entry.company}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-500 text-sm">{entry.subtitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-6">
                      <MapPin size={12} />
                      <span>{entry.location}</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.06] mb-6" />

                    {/* Description */}
                    <p className="text-neutral-400 leading-relaxed mb-5 text-[15px]">
                      {entry.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2.5 mb-7">
                      {entry.highlights.map((point, pIdx) => (
                        <motion.li
                          key={pIdx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.12 + pIdx * 0.08 }}
                          className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed"
                        >
                          <ChevronRight
                            size={15}
                            className={`${entry.chevron} shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform`}
                          />
                          {point}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Tech pills */}
                    <div className="flex flex-wrap gap-2 pt-5 border-t border-white/[0.06]">
                      {entry.tech.map((t) => (
                        <span
                          key={t}
                          className={`text-xs font-mono px-3 py-1 rounded-lg border transition-colors duration-200 group-hover:border-white/20 ${entry.pill}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              {/* ── Connector between cards ───────────────────────────────── */}
              {idx < ENTRIES.length - 1 && (
                <div className="flex flex-col items-center py-1" aria-hidden="true">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.12 + 0.4 }}
                    className={`w-px h-8 bg-gradient-to-b ${entry.connectorColor} to-transparent origin-top`}
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.12 + 0.6 }}
                    className="w-1.5 h-1.5 rounded-full bg-white/20"
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.12 + 0.7 }}
                    className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent origin-top"
                  />
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Experience
