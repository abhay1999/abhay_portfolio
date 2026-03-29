import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import InfraFlow from '@/components/InfraFlow'
import SystemsExperiments from '@/components/SystemsExperiments'
import OpenSource from '@/components/OpenSource'
import DevOpsLive from '@/components/DevOpsLive'
import DevOpsPlayground from '@/components/DevOpsPlayground'
import TechRadar from '@/components/TechRadar'
// import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function Home() {
  return (
    <main className="min-h-screen text-white relative grid-overlay noise-overlay pt-16 md:pt-20">
      <Header />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <OpenSource />
      <Skills />
      <InfraFlow />
      <SystemsExperiments />
      <DevOpsLive />
      <DevOpsPlayground />
      <TechRadar />
      {/* <Testimonials /> */}
      <Contact />
      <Footer />
    </main>
  )
}
