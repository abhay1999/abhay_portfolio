"use client"

import { Github, Linkedin, Code, ChevronUp } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/abhay1999', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/abhay-chaurasiya', label: 'LinkedIn' },
    { icon: Code, href: 'https://leetcode.com/u/imt_2018005/', label: 'LeetCode' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-black border-t border-white/5 pt-16 pb-8 overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="text-center md:text-left">
            <a href="#home" className="text-3xl font-bold tracking-tighter text-white inline-block mb-4">
              Abhay.
            </a>
            <p className="text-neutral-500 max-w-sm">
              Crafting premium digital experiences through scalable engineering and modern design.
            </p>
          </div>

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-lg"
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-neutral-600 gap-4">
          <p>© {currentYear} Abhay Chaurasiya. All rights reserved.</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors uppercase tracking-widest font-medium text-xs group"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
              <ChevronUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer
