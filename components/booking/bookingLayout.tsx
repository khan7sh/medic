'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressSteps from './ProgressSteps'

interface BookingLayoutProps {
  children: React.ReactNode
  currentStep: number
  title: string
  description: string
}

export default function BookingLayout({
  children,
  currentStep,
  title,
  description
}: BookingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-12">
            <ProgressSteps currentStep={currentStep} />
          </div>
          
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">{title}</h1>
            <p className="text-sm sm:text-lg text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
