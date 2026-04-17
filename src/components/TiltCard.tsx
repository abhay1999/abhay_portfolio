"use client"

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Max rotation in degrees. Default 8 */
  maxRot?: number
  /** translateZ of inner content layer. Default 25 */
  depth?: number
}

/**
 * GPU-accelerated 3-D tilt card driven by GSAP quickTo.
 * Drop-in replacement for the framer-motion TiltCard (useMotionValue + useSpring + useTransform).
 */
export default function TiltCard({ children, className, style, maxRot = 8, depth = 25 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  // quickTo creates a pre-compiled setter that GSAP updates on each mouse move
  // without restarting a tween — much cheaper than spring physics on every frame.
  const rotX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rotY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    // Lazily create quickTo setters the first time the user hovers
    if (!rotX.current) {
      rotX.current = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' })
      rotY.current = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' })
    }

    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5   // -0.5 … 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5

    rotX.current!(-ny * maxRot * 2)   // rotateX: positive = tilt top away
    rotY.current!( nx * maxRot * 2)   // rotateY: positive = tilt right away
  }

  const onMouseLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d', ...style }}
    >
      <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ transform: `translateZ(${depth + 10}px)` }}
      />
    </div>
  )
}
