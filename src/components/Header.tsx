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
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-2xl transition-all duration-500
          ${scrolled
            ? 'bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-2xl'
            : 'bg-transparent border border-transparent'
          }`}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={e => scrollToSection(e, '#home')}
          className="text-xl font-bold tracking-tighter text-white"
        >
          Abhay.
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={e => scrollToSection(e, item.href)}
                className={`relative text-sm font-medium transition-colors duration-300 pb-0.5 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.name}
                {/* Glowing active dot */}
                <span
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 transition-all duration-400"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateX(-50%) scale(${isActive ? 1 : 0})`,
                    boxShadow: isActive ? '0 0 8px 2px rgba(34,211,238,0.8)' : 'none',
                  }}
                />
              </a>
            )
          })}
          <a
            href="#contact"
            onClick={e => scrollToSection(e, '#contact')}
            className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="md:hidden p-3 -mr-2 text-neutral-400 hover:text-white transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
