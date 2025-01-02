"use client"

import { ArrowRight, MapPin, Download, CheckCircle2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  const highlights = [
    'DVLA Approved',
    'Same Day Service',
    'Eye Test Included',
    'Nationwide Coverage'
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-background via-background/95 to-secondary/10">
      <div className="absolute inset-0 bg-grid-white/10 bg-grid [mask-image:radial-gradient(white,transparent_70%)]" />
      
      <Image
        src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8"
        alt="Medical examination background"
        layout="fill"
        objectFit="cover"
        priority
        className="absolute inset-0 z-0 opacity-5"
      />

      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10 h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center -mt-16 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-16 px-1 sm:px-4">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary animate-fade-in w-full sm:w-auto">
              <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                Save £5 on your medical assessment! Use code <span className="font-bold">2025D</span> at checkout.
                <span className="text-primary/80 ml-1 hidden sm:inline">(Valid until Dec 31, 2025)</span>
              </span>
            </div>

            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary animate-fade-in w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-medium mx-auto">Trusted by 10,000+ Drivers</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold mb-4 sm:mb-8 animate-fade-in-up px-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              Medical D4 Assessments
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 animate-fade-in-up [animation-delay:200ms]">
            <span className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">£55</span>
            <span className="text-base sm:text-xl text-muted-foreground">(VAT & Eye Test Included)</span>
          </div>

          <p className="max-w-md mx-auto text-base sm:text-xl md:text-2xl text-foreground/90 font-medium mb-8 sm:mb-12 animate-fade-in-up [animation-delay:400ms] px-3">
            We provide the cheapest medical assessments, eye test included, for drivers nationwide.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 animate-fade-in-up [animation-delay:600ms] px-2">
            {highlights.map((highlight, index) => (
              <div 
                key={highlight}
                className="flex items-center space-x-2 text-muted-foreground text-sm sm:text-base"
              >
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up [animation-delay:800ms] px-3 sm:px-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Link href="/booking/services" className="flex items-center justify-center">
                  Book Your Medical
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/clinics" className="flex items-center justify-center">
                  <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Find A Clinic
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5"
              >
                <a 
                  href="https://d4drivers.uk/wp-content/uploads/2020/06/2022-D4-Medical-Form-Blank.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Download D4 Form
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
