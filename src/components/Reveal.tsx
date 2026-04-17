"use client"

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface RevealProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** GSAP vars for the FROM state. Defaults to { opacity:0, y:30 } */
  from?: gsap.TweenVars
  duration?: number
  delay?: number
  /** ScrollTrigger start. Defaults to 'top 88%' */
  start?: string
}

/**
 * Drop-in replacement for <motion.div initial={...} whileInView={...} viewport={{ once:true }}>
 * Uses GSAP ScrollTrigger so it respects the Lenis virtual scroll position.
 */
export default function Reveal({
  children,
  className,
  style,
  from = { opacity: 0, y: 30 },
  duration = 0.75,
  delay = 0,
  start = 'top 88%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set initial state immediately so there's no flash of visible content
    gsap.set(el, { ...from })

    const to: gsap.TweenVars = {
      opacity: 1,
      y: 0,
      x: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
        // ScrollTrigger is already synced to Lenis via SmoothScroll.tsx
      },
    }

    const tween = gsap.to(el, to)

    return () => {
      tween.kill()
      ScrollTrigger.getAll()
        .filter(st => st.trigger === el)
        .forEach(st => st.kill())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
