"use client"

import { useEffect, useRef } from 'react'

export default function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Start off-screen so there's no flash at (0,0)
    let tx = -1000, ty = -1000
    let cx = -1000, cy = -1000
    let raf = 0

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
      style={{
        width: 750,
        height: 750,
        borderRadius: '50%',
        willChange: 'transform',
        background:
          'radial-gradient(circle, rgba(6,182,212,0.055) 0%, rgba(168,85,247,0.025) 42%, transparent 70%)',
      }}
    />
  )
}
