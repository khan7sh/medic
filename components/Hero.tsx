"use client"

import { ArrowRight, MapPin, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] hero-gradient flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8"
        alt="Medical examination background"
        layout="fill"
        objectFit="cover"
        priority
        className="absolute inset-0 z-0 opacity-10"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold gradient-text mb-4 sm:mb-6">
            Medical D4 Assessments
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-3xl sm:text-4xl font-bold text-primary">£55</span>
            <span className="text-lg sm:text-xl text-muted-foreground">(VAT & Eye Test Included)</span>
          </div>
          <p className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-foreground/90 font-medium">
            We provide the cheapest medical assessments, eye test included, for drivers nationwide.
          </p>
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto text-base sm:text-lg text-foreground/80">
            <p className="font-medium">Trusted by thousands of drivers and companies across the UK.</p>
            <p className="mt-2 font-medium">Fast, reliable, and DVLA-approved assessments.</p>
          </div>
          <div className="mt-8 sm:mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
              >
                <Link href="/booking/services" className="flex items-center">
                  Book Your Medical
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
              >
                <Link href="/clinics" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Find A Clinic
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
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
