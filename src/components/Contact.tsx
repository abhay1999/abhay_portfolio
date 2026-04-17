"use client"

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, Linkedin, Zap } from 'lucide-react'
import emailjs from '@emailjs/browser'
import Reveal from '@/components/Reveal'

const EJS_SERVICE  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ''
const EJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const EJS_KEY      = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ''

const GithubSVG = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

// ─── Static Data ──────────────────────────────────────────────────────────────

const CONTACTS = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'abhaychaurasiya19@gmail.com',
    href: 'mailto:abhaychaurasiya19@gmail.com',
    icon: Mail,
    accentClass:      'text-cyan-400',
    bgClass:          'bg-cyan-500/10',
    borderClass:      'border-cyan-500/20',
    hoverBorderClass: 'hover:border-cyan-400/45',
    hoverTextClass:   'group-hover:text-cyan-400',
    glowClass:        'group-hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.35)]',
    dotClass:         'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]',
  },
  {
    id: 'phone',
    label: 'PHONE',
    value: '+91 8299211830',
    href: 'tel:+918299211830',
    icon: Phone,
    accentClass:      'text-purple-400',
    bgClass:          'bg-purple-500/10',
    borderClass:      'border-purple-500/20',
    hoverBorderClass: 'hover:border-purple-400/45',
    hoverTextClass:   'group-hover:text-purple-400',
    glowClass:        'group-hover:shadow-[0_0_20px_-5px_rgba(192,132,252,0.35)]',
    dotClass:         'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]',
  },
  {
    id: 'location',
    label: 'LOCATION',
    value: 'India',
    href: undefined,
    icon: MapPin,
    accentClass:      'text-emerald-400',
    bgClass:          'bg-emerald-500/10',
    borderClass:      'border-emerald-500/20',
    hoverBorderClass: 'hover:border-emerald-400/45',
    hoverTextClass:   'group-hover:text-emerald-400',
    glowClass:        'group-hover:shadow-[0_0_20px_-5px_rgba(52,211,153,0.35)]',
    dotClass:         'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]',
  },
]

const SOCIALS = [
  { label: 'GitHub',   Icon: GithubSVG,  href: 'https://github.com/abhay1999',                    accentClass: 'hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' },
  { label: 'LinkedIn', Icon: Linkedin,   href: 'https://linkedin.com/in/abhay-chaurasiya',        accentClass: 'hover:border-blue-400/50 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
]

// ─── Component ────────────────────────────────────────────────────────────────

const Contact = () => {
  const [formData, setFormData]     = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitted,  setSubmitted]  = useState(false)
  const [submitError,  setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        { from_name: formData.name, from_email: formData.email, message: formData.message },
        EJS_KEY,
      )
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', message: '' })
      }, 4000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSubmitError('Something went wrong. Please email me at abhaychaurasiya19@gmail.com')
      setTimeout(() => setSubmitError(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 70%, #050a28 0%, #020516 45%, #000 100%)' }}>

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
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139,92,246,0.9) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139,92,246,0.9) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            transform: 'perspective(700px) rotateX(58deg) translateY(20%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)',
          }}
        />

        {/* Horizontal circuit traces — CSS */}
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/12 to-transparent">
          <div className="trace-x-fwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{ animationDuration: '5s' }} />
        </div>
        <div className="absolute top-[72%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/12 to-transparent">
          <div className="trace-x-bwd absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" style={{ animationDuration: '6s' }} />
        </div>

        {/* Vertical circuit traces — CSS */}
        <div className="absolute top-0 left-[15%] h-full w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent">
          <div className="trace-y-fwd absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-emerald-400 to-transparent" style={{ animationDuration: '8s' }} />
        </div>
        <div className="absolute top-0 right-[15%] h-full w-px bg-gradient-to-b from-transparent via-orange-500/10 to-transparent">
          <div className="trace-y-bwd absolute top-0 left-0 h-32 w-px bg-gradient-to-b from-transparent via-orange-400 to-transparent" style={{ animationDuration: '7s' }} />
        </div>

        {/* Intersection glow nodes */}
        <div className="absolute top-[30%] left-[15%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
        <div className="absolute top-[30%] right-[15%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_12px_3px_rgba(251,146,60,0.6)]" />
        <div className="absolute top-[72%] left-[15%] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />
        <div className="absolute top-[72%] right-[15%] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_12px_3px_rgba(192,132,252,0.6)]" />

        {/* Ambient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/6 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full bg-cyan-500/6 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/4 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <Reveal className="mb-14">
          {/* Terminal prompt */}
          <div className="flex items-center gap-2 mb-5 font-mono text-xs text-neutral-500">
            <span className="text-purple-400">$</span>
            <span className="text-neutral-400">comm</span>
            <span className="text-neutral-600">~/channel</span>
            <span className="text-white">›</span>
            <span className="text-cyan-400">msg_transmit</span>
            <span className="text-neutral-300">.open()</span>
            <span className="cursor-blink w-1.5 h-3.5 bg-cyan-400 inline-block ml-0.5" />
          </div>

          <div className="flex items-end gap-5">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-1.5">09.</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Get In</span>{' '}
              <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Touch</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* ── Left: Contact Info Panel ──────────────────────────────────── */}
          <Reveal from={{ opacity: 0, x: -40 }} className="flex flex-col">
            {/* Main heading */}
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Let&apos;s Build<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                Reliable Systems
              </span>
            </h3>

            <p className="text-neutral-400 leading-relaxed mb-8 max-w-md text-base">
              I specialize in architecting resilient infrastructure and scalable delivery pipelines. If you&apos;re tackling complex engineering challenges, I&apos;d love to connect.
            </p>

            {/* Currently Open To Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-10 relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500">
              {/* Highlight accent on left */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500" />
              
              <h4 className="text-sm font-mono text-neutral-300 tracking-wider mb-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                CURRENTLY OPEN TO
              </h4>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <div>
                    <p className="text-sm text-neutral-200 font-medium mb-0.5">DevOps & SRE Positions</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">Full-time roles building and scaling resilient infrastructure.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                  <div>
                    <p className="text-sm text-neutral-200 font-medium mb-0.5">Preferred Projects</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">Platform engineering, Kubernetes migrations, and high-availability systems.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                  <div>
                    <p className="text-sm text-neutral-200 font-medium mb-0.5">Open Source Collaboration</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">GSoC, CNCF LFX mentorships, and core maintainer discussions.</p>
                  </div>
                </div>
              </div>
              
              {/* Expected Reply Time Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-xs font-mono tracking-wide">EXPECTED REPLY TIME</span>
                </div>
                <span className="text-xs font-mono text-cyan-300 tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">&lt; 24 HOURS</span>
              </div>
            </div>

            {/* Separator with circuit glow */}
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/30 via-white/10 to-transparent mb-10" />

            {/* Contact cards */}
            <div className="space-y-3 mb-10">
              {CONTACTS.map(contact => {
                const Wrapper = contact.href ? 'a' : 'div'
                const wrapperProps = contact.href
                  ? { href: contact.href, target: contact.id === 'email' || contact.id === 'phone' ? undefined : '_blank', rel: 'noreferrer' }
                  : {}

                return (
                  <Wrapper
                    key={contact.id}
                    {...(wrapperProps as Record<string, string>)}
                    className={`group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border ${contact.borderClass} ${contact.hoverBorderClass} ${contact.glowClass} transition-all duration-300 cursor-pointer`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${contact.bgClass} border ${contact.borderClass} flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
                      <contact.icon size={18} className={`${contact.accentClass} transition-colors`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${contact.dotClass}`} />
                        <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest">{contact.label}</p>
                      </div>
                      <p className={`text-sm font-medium text-neutral-200 ${contact.hoverTextClass} transition-colors duration-300 truncate`}>
                        {contact.value}
                      </p>
                    </div>
                  </Wrapper>
                )
              })}
            </div>

            {/* Social links */}
            <div>
              <p className="font-mono text-[9px] text-neutral-600 uppercase tracking-widest mb-4">Connect Online</p>
              <div className="flex items-center gap-3">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400 transition-all duration-300 ${s.accentClass}`}
                  >
                    <s.Icon size={17} />
                  </a>
                ))}

              </div>
            </div>
          </Reveal>

          {/* ── Right: Terminal Form Window ───────────────────────────────── */}
          <Reveal from={{ opacity: 0, y: 40 }} delay={0.15} className="relative">
            <div
              className="relative bg-neutral-950/75 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 80px -25px rgba(139,92,246,0.25), 0 0 40px -15px rgba(34,211,238,0.12)' }}
            >
              {/* Animated scan line — CSS */}
              <div
                aria-hidden="true"
                className="scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent pointer-events-none z-20"
              />

              {/* Corner accent nodes */}
              <div aria-hidden="true" className="absolute top-0 left-0 w-px h-10 bg-gradient-to-b from-cyan-400/60 to-transparent" />
              <div aria-hidden="true" className="absolute top-0 left-0 w-10 h-px bg-gradient-to-r from-cyan-400/60 to-transparent" />
              <div aria-hidden="true" className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-purple-400/60 to-transparent" />
              <div aria-hidden="true" className="absolute top-0 right-0 w-10 h-px bg-gradient-to-l from-purple-400/60 to-transparent" />
              <div aria-hidden="true" className="absolute bottom-0 left-0 w-px h-10 bg-gradient-to-t from-cyan-400/40 to-transparent" />
              <div aria-hidden="true" className="absolute bottom-0 right-0 w-px h-10 bg-gradient-to-t from-purple-400/40 to-transparent" />

              {/* macOS title bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-neutral-400 tracking-wide">msg_transmit.exe — SECURE CHANNEL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="opacity-pulse w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest">ENCRYPTED</span>
                </div>
              </div>

              {/* Form body */}
              <div className="p-6 lg:p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 min-h-[400px]">
                    {/* Success orb */}
                    <div className="opacity-pulse w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                      <CheckCircle size={36} className="text-emerald-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Transmission Complete</h4>
                    <p className="font-mono text-[11px] text-emerald-400 mb-4 tracking-wider">STATUS: MESSAGE_DELIVERED</p>
                    <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                      Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                    </p>
                    {/* Terminal success lines */}
                    <div className="mt-8 text-left w-full max-w-xs">
                      {[
                        { prefix: '›', text: 'Payload encrypted...', color: 'text-neutral-600' },
                        { prefix: '›', text: 'Channel established...', color: 'text-neutral-600' },
                        { prefix: '✓', text: 'Message delivered', color: 'text-emerald-400' },
                      ].map((line) => (
                        <p key={line.text} className={`font-mono text-[10px] ${line.color} mb-1`}>
                          {line.prefix} {line.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-400 font-mono text-xs">›</span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">sys.user_name</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-700 font-mono focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_20px_-5px_rgba(34,211,238,0.25)] transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <span className="text-purple-400 font-mono text-xs">›</span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">sys.user_email</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-700 font-mono focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_-5px_rgba(139,92,246,0.25)] transition-all duration-300"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="flex items-center gap-2 mb-2">
                        <span className="text-emerald-400 font-mono text-xs">›</span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">sys.message_body</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Hey Abhay, I'm reaching out about a DevOps role / GSoC / collab..."
                        className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-700 font-mono focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_-5px_rgba(52,211,153,0.25)] transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm rounded-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_30px_-8px_rgba(139,92,246,0.5)] hover:shadow-[0_0_45px_-8px_rgba(139,92,246,0.7)]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="font-mono tracking-widest text-xs">TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono tracking-widest text-xs">TRANSMIT MESSAGE</span>
                          <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Error message */}
                    {submitError && (
                      <p role="alert" className="text-center font-mono text-[10px] text-red-400 tracking-wider pt-1 animate-pulse">
                        ⚠ {submitError}
                      </p>
                    )}

                    {/* Footer note */}
                    {!submitError && (
                      <p className="text-center font-mono text-[9px] text-neutral-700 tracking-wider pt-1">
                        END-TO-END ENCRYPTED · RESPONSE WITHIN 24H
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  )
}

export default Contact
