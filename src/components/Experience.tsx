"use client"

import { motion } from 'framer-motion'
import { Calendar, MapPin, Briefcase, GraduationCap, ChevronRight, Building2 } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORK = [
  {
    id: '01',
    role: 'Full-Stack Developer',
    company: 'AvlokanIAS & Others',
    type: 'Freelance',
    period: 'Apr 2025 – Aug 2025',
    location: 'Remote',
    highlights: [
      'Built AvlokanIAS UPSC platform — scaled to 5000+ concurrent users on launch',
      'Delivered end-to-end portfolio & gov-tech products for multiple clients',
      'Architected real-time hackathon portal handling 10,000+ applicants',
    ],
    tech: ['React', 'Next.js', 'Node.js', 'AWS', 'MongoDB'],
    accentBorder:  'border-t-cyan-500',
    accentText:    'text-cyan-400',
    badgeBg:       'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    pillBg:        'bg-cyan-900/40 text-cyan-200 border-cyan-500/25',
    chevronColor:  'text-cyan-400',
    glowStyle:     '0 0 60px -15px rgba(6,182,212,0.2)',
    dotColor:      'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]',
    gridColor:     'rgba(34,211,238,0.04)',
  },
  {
    id: '02',
    role: 'Associate Software Engineer',
    company: 'QTIMINDS Pvt Ltd',
    type: 'Full-time',
    period: 'Dec 2023 – Jan 2025',
    location: 'India',
    highlights: [
      'Architected and deployed Netflix clone on Amazon EKS with full DevSecOps pipeline',
      'Built high-performance Real Estate listing platform with advanced search & auth',
      'Migrated legacy monolith into containerised microservices on Kubernetes',
    ],
    tech: ['Python', 'React', 'Docker', 'Kubernetes', 'AWS'],
    accentBorder:  'border-t-purple-500',
    accentText:    'text-purple-400',
    badgeBg:       'bg-purple-500/10 text-purple-300 border-purple-500/25',
    pillBg:        'bg-purple-900/40 text-purple-200 border-purple-500/25',
    chevronColor:  'text-purple-400',
    glowStyle:     '0 0 60px -15px rgba(168,85,247,0.2)',
    dotColor:      'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)]',
    gridColor:     'rgba(168,85,247,0.04)',
  },
]

const EDU = {
  degree:      'Integrated B.Tech + M.Tech — Information Technology',
  institution: 'ABV — Indian Institute of Information Technology (ABV-IIIT), Gwalior',
  period:      '2018 – 2023',
  cgpa:        '7.32 / 10',
  highlights:  ['Data Structures & Algorithms', 'System Design', 'Cloud Computing', 'Software Engineering'],
}

// ─── Component ────────────────────────────────────────────────────────────────
const Experience = () => {
  return (
    <section id="experience" className="relative py-28 overflow-hidden bg-black">

      {/* ── Background ──────────────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.022]" style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.8) 1px,transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[40%] opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(to right,rgba(139,92,246,0.9) 1px,transparent 1px),linear-gradient(to bottom,rgba(139,92,246,0.9) 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
        }} />
        {/* Traces */}
        <div className="absolute top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent">
          <motion.div animate={{ x: ['-100%','200%'] }} transition={{ duration: 6, repeat: Infinity, ease:'linear', repeatDelay: 4 }}
            className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
        <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent">
          <motion.div animate={{ x: ['200%','-100%'] }} transition={{ duration: 7, repeat: Infinity, ease:'linear', repeatDelay: 3 }}
            className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/4 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }} className="mb-14">
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-purple-400">$</span>
            <span className="text-neutral-400">resume</span>
            <span className="text-neutral-600">~/career</span>
            <span className="text-white">›</span>
            <span className="text-cyan-400">timeline</span>
            <span className="text-neutral-300">.render()</span>
            <motion.span animate={{ opacity:[1,0] }} transition={{ duration:0.7, repeat:Infinity }}
              className="w-1.5 h-3.5 bg-purple-400 inline-block ml-0.5" />
          </div>
          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">03.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Experience</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">&amp; Education</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </motion.div>

        {/* ── Work — 2 columns ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {WORK.map((job, idx) => (
            <motion.div key={job.id}
              initial={{ opacity:0, y:30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-40px' }}
              transition={{ duration:0.7, delay: idx * 0.1, ease:'easeOut' }}
              className="group relative rounded-2xl border border-t-2 border-white/[0.07] overflow-hidden bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-300"
              style={{ borderTopColor: undefined, boxShadow: job.glowStyle }}
            >
              {/* Top accent border override */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${job.accentBorder.replace('border-t-','bg-')}`} />

              {/* Subtle grid */}
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.6]"
                style={{ backgroundImage:`linear-gradient(to right,${job.gridColor} 1px,transparent 1px),linear-gradient(to bottom,${job.gridColor} 1px,transparent 1px)`, backgroundSize:'24px 24px' }} />

              <div className="relative p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center`}>
                        <Briefcase size={13} className={job.accentText} />
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 rounded-full border ${job.badgeBg}`}>
                        {job.type}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold text-white group-hover:${job.accentText} transition-colors leading-tight mt-2`}>
                      {job.role}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 size={11} className="text-neutral-600" />
                      <span className="text-sm text-neutral-400 font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end text-neutral-500 text-[11px] font-mono mb-1">
                      <Calendar size={10} />
                      {job.period}
                    </div>
                    <div className="flex items-center gap-1 justify-end text-neutral-600 text-[11px] font-mono">
                      <MapPin size={10} />
                      {job.location}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.05] mb-4" />

                {/* Highlights */}
                <ul className="space-y-2 mb-4">
                  {job.highlights.map((pt, i) => (
                    <motion.li key={i}
                      initial={{ opacity:0, x:-8 }}
                      whileInView={{ opacity:1, x:0 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.35, delay: idx * 0.1 + i * 0.07 }}
                      className="flex items-start gap-2 text-[13px] text-neutral-400 leading-snug"
                    >
                      <ChevronRight size={12} className={`${job.chevronColor} shrink-0 mt-0.5`} />
                      {pt}
                    </motion.li>
                  ))}
                </ul>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.05]">
                  {job.tech.map(t => (
                    <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${job.pillBg}`}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Education — full-width slim card ────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:25 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-30px' }}
          transition={{ duration:0.7, delay:0.2 }}
          className="group relative rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.025] hover:bg-white/[0.04] transition-all duration-300"
          style={{ boxShadow:'0 0 60px -15px rgba(245,158,11,0.15)' }}
        >
          {/* Amber top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500" />

          {/* Subtle grid */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.5]"
            style={{ backgroundImage:`linear-gradient(to right,rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(245,158,11,0.04) 1px,transparent 1px)`, backgroundSize:'24px 24px' }} />

          <div className="relative p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">

              {/* Left — icon + degree */}
              <div className="flex items-start gap-4 lg:flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <GraduationCap size={18} className="text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/25">
                      Education
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                    {EDU.degree}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-0.5">{EDU.institution}</p>
                </div>
              </div>

              {/* Divider (desktop) */}
              <div className="hidden lg:block w-px h-16 bg-white/[0.06]" />

              {/* Right — subjects only */}
              <div className="flex flex-wrap gap-1.5 lg:shrink-0">
                {EDU.highlights.map(h => (
                  <span key={h} className="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-amber-900/30 text-amber-200 border-amber-500/20">{h}</span>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Experience
