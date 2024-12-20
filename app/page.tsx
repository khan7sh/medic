import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Steps from '@/components/Steps'
import Services from '@/components/Services'
import Reviews from '@/components/Reviews'
import BusinessServices from '@/components/BusinessServices'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import FindClinic from '@/components/FindClinic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Steps />
        <Services />
        <FindClinic />
        <Reviews />
        <BusinessServices />
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}