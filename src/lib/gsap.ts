/**
 * Register GSAP plugins once, app-wide.
 * Import this at the top of any file that uses ScrollTrigger.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Prevent GSAP from "catching up" after tab blur — keeps animation silky smooth
  gsap.ticker.lagSmoothing(0)
}

export { gsap, ScrollTrigger }
