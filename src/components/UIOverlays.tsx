"use client"

import { motion, useScroll, useSpring } from 'framer-motion'

const UIOverlays = () => {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 })

  return (
    <>
      {/* Elegant minimalist scroll progress bar */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
        style={{ scaleX: progress, transformOrigin: '0% 50%' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500 to-purple-500" />
      </motion.div>
    </>
  )
}

export default UIOverlays
