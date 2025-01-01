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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 sm:mb-8">
            <ProgressSteps currentStep={currentStep} />
          </div>
          
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">{title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{description}</p>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
