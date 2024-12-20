'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-foreground mb-8 sm:mb-16">About MedicalD4</h2>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          <div className="w-full lg:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
              alt="Medical professional with patient"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground">
              <p className="leading-relaxed">
                MedicalD4 is a leading provider of medical assessments for drivers across the UK. With years of experience and a commitment to excellence, we offer affordable and comprehensive medical services to ensure the safety and compliance of drivers in various industries.
              </p>
              <p className="leading-relaxed">
                Our team of qualified medical professionals specializes in conducting thorough assessments, including eye tests, for a wide range of driver types. From taxi and private hire drivers to HGV and bus operators, we cater to all your medical certification needs.
              </p>
              <p className="leading-relaxed">
                At MedicalD4, we pride ourselves on our efficient service, competitive pricing, and nationwide coverage. Our goal is to make the medical assessment process as smooth and convenient as possible for both individual drivers and businesses.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                <Link href="/booking/services" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Book Your Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}