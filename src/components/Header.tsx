"use client"

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap } from '@/lib/gsap'

const NAV_ITEMS = [
  { name: 'Home',        href: '#home',       id: 'home'       },
  { name: 'About',       href: '#about',      id: 'about'      },
  { name: 'Experience',  href: '#experience', id: 'experience' },
  { name: 'Projects',    href: '#projects',   id: 'projects'   },
  { name: 'Open Source', href: '#opensource', id: 'opensource' },
  { name: 'Skills',      href: '#skills',     id: 'skills'     },
  { name: 'Contact',     href: '#contact',    id: 'contact'    },
]

const Header = () => {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const headerRef = useRef<HTMLElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  // Slide-down entrance on mount
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 },
    )
  }, [])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section via IntersectionObserver
  // rootMargin: '-35% 0px -55% 0px' → 10% trigger band near the upper-center
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0, rootMargin: '-35% 0px -55% 0px' },
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Animate mobile menu in/out
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    if (isMenuOpen) {
      gsap.fromTo(el, { opacity: 0, y: -10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' })
    } else {
      gsap.to(el, { opacity: 0, scale: 0.97, duration: 0.15, ease: 'power2.in' })
    }
  }, [isMenuOpen])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - 80, behavior: 'smooth' })
    }
  }

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4 sm:px-6 pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div
        className={`pointer-events-auto flex items-center justify-between mx-auto transition-all duration-500 rounded-full origin-top
          ${scrolled
            ? 'w-[90%] max-w-4xl px-4 py-2.5 bg-neutral-950/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),0_0_15px_-5px_rgba(34,211,238,0.1)] scale-[0.98] -translate-y-0.5'
            : 'w-full max-w-5xl px-6 py-3.5 bg-neutral-950/40 backdrop-blur-md border border-white/5 shadow-lg'
          }`}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={e => scrollToSection(e, '#home')}
          className="flex items-center gap-3 group"
        >
          <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border border-white/10 group-hover:border-cyan-400/50 transition-all duration-300 ${scrolled ? 'w-8 h-8' : 'w-9 h-9'}`}>
            <span className={`font-mono font-bold text-white group-hover:text-cyan-400 transition-colors ${scrolled ? 'text-xs' : 'text-sm'}`}>A.</span>
          </div>
          <span className={`font-mono text-white tracking-widest uppercase transition-all duration-300 ${scrolled ? 'text-[10px] opacity-0 w-0 overflow-hidden' : 'text-xs opacity-100'}`}>
            System
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/20 border border-white/5">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={e => scrollToSection(e, item.href)}
                className={`relative px-4 py-1.5 text-[13px] font-normal tracking-wide transition-all duration-300 rounded-full ${
                  isActive ? 'text-cyan-50' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-white/10 rounded-full border border-cyan-500/30 shadow-[inset_0_0_12px_rgba(34,211,238,0.1)]" />
                )}
                <span className="relative z-10">{item.name}</span>
                {/* Glowing active indicator */}
                {isActive && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-4 h-px bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                )}
              </a>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={e => scrollToSection(e, '#contact')}
            className={`flex items-center gap-2 px-5 font-mono font-bold tracking-widest text-black bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 uppercase ${scrolled ? 'py-2 text-[10px]' : 'py-2.5 text-xs'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            HIRE ME
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        ref={mobileRef}
        className={`absolute top-20 left-4 right-4 pointer-events-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        style={{ opacity: 0 }}
      >
        <nav className="flex flex-col p-4">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={e => scrollToSection(e, item.href)}
                className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/5'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)] flex-shrink-0" />
                )}
                {item.name}
              </a>
            )
          })}
          <a
            href="#contact"
            onClick={e => scrollToSection(e, '#contact')}
            className="mt-2 px-4 py-3 text-sm font-medium text-black bg-white rounded-xl text-center hover:bg-neutral-200 transition-colors"
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
