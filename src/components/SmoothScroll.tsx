"use client"

import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      lerp: 0.1,          // 0.1 is the sweet spot — responsive yet buttery
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
    })

    // ── Connect Lenis scroll position → GSAP ScrollTrigger ──────────────────
    // This is the official Lenis + GSAP integration:
    //   - lenis.on('scroll') notifies ScrollTrigger every frame so pinned
    //     sections, scrub tweens, and trigger points stay in sync with the
    //     virtual (Lenis) scroll position rather than native scroll.
    //   - gsap.ticker drives lenis.raf() so both systems share one RAF loop.
    //   - lagSmoothing(0) disables GSAP's built-in lag-smoothing, which would
    //     conflict with Lenis's own interpolation.
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
