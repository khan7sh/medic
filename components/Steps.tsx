'use client'

import { useEffect, useRef } from 'react'
import { MapPin, Calendar, UserCheck, Clock } from 'lucide-react'

const steps = [
  { 
    icon: MapPin, 
    title: 'Choose your Location', 
    description: 'Select a convenient location near you',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    icon: Calendar, 
    title: 'Date and Time', 
    description: 'Pick a suitable date and time slot',
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    icon: UserCheck, 
    title: 'Meet your GMC approved Doctor', 
    description: 'Consult with our certified medical professionals',
    color: 'from-violet-500 to-violet-600'
  },
  { 
    icon: Clock, 
    title: 'Same Day Results', 
    description: 'Get your results quickly and efficiently',
    color: 'from-purple-500 to-purple-600'
  },
]

export default function Steps() {
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.classList.remove('opacity-0')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    )

    const stepsElements = stepsRef.current?.querySelectorAll('.step-item')
    stepsElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-background to-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              How It Works
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete your medical assessment in four simple steps
          </p>
        </div>

        <div ref={stepsRef} className="max-w-4xl mx-auto relative">
          <div 
            className="absolute left-8 sm:left-12 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/30 to-transparent"
            style={{ 
              background: 'linear-gradient(to bottom, rgb(var(--primary) / 0.3) 0%, transparent 100%)'
            }}
          />
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="step-item opacity-0 flex items-start mb-12 sm:mb-16 last:mb-0 relative group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-4 z-10 shadow-lg shadow-primary/10 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300 group-hover:scale-110`}>
                <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              
              <div className="relative ml-6 sm:ml-12 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg ring-1 ring-primary/10 flex-grow group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                <div className="absolute left-0 top-6 h-0.5 w-6 sm:w-12 bg-gradient-to-r from-primary/30 to-transparent -translate-x-full" />
                
                <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200">
                  {step.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}