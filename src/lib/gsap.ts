/**
 * Register GSAP plugins once, app-wide.
 * Import this at the top of any file that uses ScrollTrigger.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
