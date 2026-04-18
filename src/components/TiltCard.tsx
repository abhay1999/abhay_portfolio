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
 * GPU-accelerated 3-D tilt card driven by GSAP quickTo,
 * with a dynamic glare highlight that follows the cursor.
 */
export default function TiltCard({ children, className, style, maxRot = 8, depth = 25 }: TiltCardProps) {
  const ref     = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const rotX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const rotY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return

    if (!rotX.current) {
      rotX.current = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' })
      rotY.current = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' })
    }

    const r  = el.getBoundingClientRect()
    const nx = (e.clientX - r.left)  / r.width  - 0.5
    const ny = (e.clientY - r.top)   / r.height - 0.5

    rotX.current!(-ny * maxRot * 2)
    rotY.current!( nx * maxRot * 2)

    // Dynamic glare — radial highlight follows cursor
    if (glareRef.current) {
      const x = ((e.clientX - r.left)  / r.width)  * 100
      const y = ((e.clientY - r.top)   / r.height) * 100
      glareRef.current.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 55%)`
      glareRef.current.style.opacity = '1'
    }
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' })
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' })
    }
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
      {/* Dynamic glare layer — sits above content but below interaction */}
      <div
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
        style={{ transform: `translateZ(${depth + 2}px)` }}
      />
    </div>
  )
}
