import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import OpenSource from '@/components/OpenSource'
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
      <Skills />
      <Experience />
      <OpenSource />
      <Projects />
      {/* <Testimonials /> */}
      <Contact />
      <Footer />
    </main>
  )
}
