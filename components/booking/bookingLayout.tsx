'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProgressSteps from '@/components/booking/ProgressSteps'

interface BookingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title: string;
  description?: string;
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
      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ProgressSteps currentStep={currentStep} />
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold gradient-text mb-4">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
