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
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-xs">
            <a href="#home" className="text-2xl font-bold tracking-tighter text-white inline-block mb-3">
              Abhay.
            </a>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              I architect reliable, scalable cloud-native systems and automation pipelines.
            </p>
            {/* Social Links Minimum */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  <link.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-12 md:gap-20 text-sm text-neutral-500">
            <div>
              <p className="font-semibold text-white mb-4">Focus</p>
              <ul className="space-y-2">
                <li>Cloud Infrastructure</li>
                <li>Kubernetes & DevOps</li>
                <li>Backend Engineering</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-neutral-600 gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <p>© {currentYear} Abhay Chaurasiya. All rights reserved.</p>
            <p className="hidden md:block text-neutral-800">•</p>
            <p>Built with Next.js & Tailwind. Deployed on Vercel.</p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-mono text-[10px] group"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
              <ChevronUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer
