"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Open Source', href: '#opensource' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll, { passive: true } as EventListenerOptions)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: top - 80, // offset for header
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4 sm:px-6 pointer-events-none"
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
          onClick={(e) => scrollToSection(e, '#home')}
          className="text-xl font-bold tracking-tighter text-white"
        >
          Abhay.
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 -mr-2 text-neutral-400 hover:text-white transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 pointer-events-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl md:hidden"
          >
            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="mt-2 px-4 py-3 text-sm font-medium text-black bg-white rounded-xl text-center hover:bg-neutral-200 transition-colors"
              >
                Hire Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
