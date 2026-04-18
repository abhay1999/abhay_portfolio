"use client"

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import SpotlightCursor from './SpotlightCursor'

const UIOverlays = () => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // scaleX 0→1 tied to total page scroll progress.
    // ScrollTrigger is synced to Lenis via SmoothScroll.tsx so this tracks
    // the virtual scroll position, not the native one.
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        gsap.set(bar, { scaleX: self.progress })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      <SpotlightCursor />
      {/* Scroll progress bar */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-transparent via-cyan-500 to-purple-500"
        style={{ transform: 'scaleX(0)' }}
      />
    </>
  )
}

export default UIOverlays
