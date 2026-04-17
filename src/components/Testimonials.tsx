"use client"

import { Linkedin } from 'lucide-react'
import Reveal from '@/components/Reveal'
import TiltCard from '@/components/TiltCard'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      "Abhay consistently delivered high-quality, production-ready code. His ability to architect microservices on Kubernetes and debug complex CI/CD pipeline issues saved us weeks. A genuinely exceptional engineer who takes ownership end-to-end.",
    name: 'Rahul Verma',
    role: 'Engineering Manager',
    company: 'QTIMINDS',
    initials: 'RV',
    accentClass:  'text-cyan-400',
    borderClass:  'border-cyan-500/20',
    hoverBorder:  'hover:border-cyan-400/45',
    bgClass:      'bg-cyan-500/5',
    avatarClass:  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    quoteClass:   'text-cyan-400/20',
    boxShadow:    '0 0 60px -20px rgba(34,211,238,0.2)',
  },
  {
    id: 't2',
    quote:
      "One of the most self-driven students I've mentored at IIIT Allahabad. Abhay's open-source contribution to Helm (CNCF) during final year demonstrated rare real-world engineering maturity — most developers don't achieve that in years.",
    name: 'Dr. Anand Mishra',
    role: 'Associate Professor, CSE',
    company: 'IIIT Allahabad',
    initials: 'AM',
    accentClass:  'text-purple-400',
    borderClass:  'border-purple-500/20',
    hoverBorder:  'hover:border-purple-400/45',
    bgClass:      'bg-purple-500/5',
    avatarClass:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
    quoteClass:   'text-purple-400/20',
    boxShadow:    '0 0 60px -20px rgba(168,85,247,0.2)',
  },
  {
    id: 't3',
    quote:
      "Abhay built our entire AvlokanIAS platform from scratch — video streaming, auth, payments. He handled 5,000+ concurrent users on launch day without a single outage. His React + AWS architecture is the backbone of our business today.",
    name: 'Ashish Srivastava',
    role: 'Founder & CEO',
    company: 'AvlokanIAS',
    initials: 'AS',
    accentClass:  'text-emerald-400',
    borderClass:  'border-emerald-500/20',
    hoverBorder:  'hover:border-emerald-400/45',
    bgClass:      'bg-emerald-500/5',
    avatarClass:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    quoteClass:   'text-emerald-400/20',
    boxShadow:    '0 0 60px -20px rgba(16,185,129,0.2)',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-black">

      {/* ── Background System ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 select-none">

        {/* Micro circuit grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Perspective floor grid */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[45%] opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(34,211,238,0.9) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34,211,238,0.9) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
          }}
        />

        {/* Horizontal circuit traces */}
        <div className="absolute top-[35%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent">
          <div className="trace-x-fwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute top-[68%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <div className="trace-x-bwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{ animationDuration: '7s' }} />
        </div>

        {/* Vertical circuit traces */}
        <div className="absolute top-0 left-[12%] h-full w-px bg-gradient-to-b from-transparent via-purple-500/10 to-transparent">
          <div className="trace-y-fwd absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{ animationDuration: '9s' }} />
        </div>
        <div className="absolute top-0 right-[12%] h-full w-px bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent">
          <div className="trace-y-bwd absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" style={{ animationDuration: '8s' }} />
        </div>

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <Reveal className="mb-14">
          {/* Terminal prompt */}
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-purple-400">$</span>
            <span className="text-neutral-400">social</span>
            <span className="text-neutral-600">~/proof</span>
            <span className="text-white">›</span>
            <span className="text-cyan-400">endorsements</span>
            <span className="text-neutral-300">.fetch()</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5" />
          </div>

          <div className="flex items-end gap-5">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">What They</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Say</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </Reveal>

        {/* ── Testimonial Cards ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-14 [perspective:1200px]">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal
              key={t.id}
              from={{ opacity: 0, y: 50 }}
              delay={idx * 0.12}
              className="group [perspective:900px]"
            >
              <TiltCard
                className={`relative flex flex-col h-full rounded-2xl bg-neutral-950/65 backdrop-blur-xl border ${t.borderClass} ${t.hoverBorder} transition-all duration-300 p-7 overflow-hidden`}
                style={{ boxShadow: t.boxShadow }}
              >
                {/* Corner accent lines */}
                <div aria-hidden="true" className={`absolute top-0 left-0 w-8 h-px ${t.accentClass} opacity-40`} style={{ background: 'currentColor' }} />
                <div aria-hidden="true" className={`absolute top-0 left-0 w-px h-8 ${t.accentClass} opacity-40`} style={{ background: 'currentColor' }} />
                <div aria-hidden="true" className={`absolute bottom-0 right-0 w-8 h-px ${t.accentClass} opacity-25`} style={{ background: 'currentColor' }} />
                <div aria-hidden="true" className={`absolute bottom-0 right-0 w-px h-8 ${t.accentClass} opacity-25`} style={{ background: 'currentColor' }} />

                {/* Large decorative quote mark */}
                <div
                  aria-hidden="true"
                  className={`absolute top-4 right-5 font-serif text-[7rem] leading-none select-none pointer-events-none ${t.quoteClass}`}
                  style={{ transform: 'translateZ(-5px)' }}
                >
                  &quot;
                </div>

                {/* Quote text */}
                <blockquote
                  className="text-[13.5px] text-neutral-300 leading-relaxed flex-1 mb-7 relative z-10"
                  style={{ transform: 'translateZ(12px)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Separator */}
                <div className={`h-px w-full bg-gradient-to-r from-transparent ${t.borderClass} to-transparent mb-5`} />

                {/* Attribution */}
                <div className="flex items-center gap-3" style={{ transform: 'translateZ(14px)' }}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl border ${t.avatarClass} flex items-center justify-center flex-shrink-0 font-bold text-xs`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">{t.name}</p>
                    <p className="text-neutral-500 text-[11px] font-mono mt-0.5 truncate">{t.role} · {t.company}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* ── LinkedIn Endorsement CTA ─────────────────────────────────────── */}
        <Reveal
          from={{ opacity: 0, y: 20 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="text-center sm:text-left">
            <p className="text-neutral-400 text-sm">Worked with me? I&apos;d love an endorsement.</p>
            <p className="font-mono text-[10px] text-neutral-600 mt-0.5">Your review helps recruiters make better decisions.</p>
          </div>
          <a
            href="https://linkedin.com/in/abhay-chaurasiya"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-500/8 text-blue-300 hover:bg-blue-500/15 hover:border-blue-400/50 transition-all duration-300 font-medium text-sm flex-shrink-0 hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.4)]"
          >
            <Linkedin size={15} />
            <span>Endorse on LinkedIn</span>
          </a>
        </Reveal>

      </div>
    </section>
  )
}

export default Testimonials
