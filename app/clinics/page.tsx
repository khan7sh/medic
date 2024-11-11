'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock, Calendar, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Using the same locations data from LocationSelector
const locations = [
  { id: 'bedford', name: 'Bedford MK40 1UH' },
  { id: 'birmingham', name: 'Birmingham, B66 4TB' },
  { id: 'bolton', name: 'Bolton, BL6 4RQ' },
  { id: 'cambridge', name: 'Cambridge CB1 9XQ' },
  { id: 'hertfordshire', name: 'Hertfordshire, SG5 1AR' },
  { id: 'newcastle', name: 'Newcastle Under Lyme ST5 2JG' },
  { id: 'peterborough', name: 'Peterborough, PE2 6XU' },
  { id: 'plymouth', name: 'Plymouth PL99JB' },
  { id: 'southampton', name: 'Southampton SO16 4NW' },
]

// Extended clinic details
const clinicDetails = locations.map(location => ({
  ...location,
  fullName: `MedicalD4 ${location.name.split(',')[0]} Clinic`,
  phone: '020 1234 5678',
  email: `${location.id}@medicald4.com`,
  hours: 'Mon-Fri: 9am-5pm',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2035&q=80'
}))

export default function ClinicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-primary/5 to-background py-24">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=2028&q=80"
              alt="Medical clinic"
              layout="fill"
              objectFit="cover"
              className="opacity-5"
            />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-extrabold gradient-text mb-6">
                Our Clinic Locations
              </h1>
              <p className="text-2xl text-muted-foreground mb-8">
                Find your nearest MedicalD4 assessment center with convenient locations across the UK.
              </p>
            </div>
          </div>
        </div>

        {/* Clinics Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clinicDetails.map((clinic) => (
                <Card key={clinic.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image
                      src={clinic.image}
                      alt={clinic.fullName}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{clinic.fullName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        <span>{clinic.name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-5 w-5 mr-2 text-primary" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-5 w-5 mr-2 text-primary" />
                        <span>{clinic.email}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        <span>{clinic.hours}</span>
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link href={`/booking/services?location=${clinic.id}`}>
                          <Calendar className="mr-2 h-5 w-5" />
                          Book at this Clinic
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
