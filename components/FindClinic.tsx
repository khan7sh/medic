'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Using the same locations data
const locations = [
  { id: 'bedford', name: 'Bedford MK40 1UH', postcode: 'MK40 1UH' },
  { id: 'birmingham', name: 'Birmingham, B66 4TB', postcode: 'B66 4TB' },
  { id: 'bolton', name: 'Bolton, BL6 4RQ', postcode: 'BL6 4RQ' },
  { id: 'cambridge', name: 'Cambridge CB1 9XQ', postcode: 'CB1 9XQ' },
  { id: 'hertfordshire', name: 'Hertfordshire, SG5 1AR', postcode: 'SG5 1AR' },
  { id: 'newcastle', name: 'Newcastle Under Lyme ST5 2JG', postcode: 'ST5 2JG' },
  { id: 'peterborough', name: 'Peterborough, PE2 6XU', postcode: 'PE2 6XU' },
  { id: 'plymouth', name: 'Plymouth PL99JB', postcode: 'PL9 9JB' },
  { id: 'southampton', name: 'Southampton SO16 4NW', postcode: 'SO16 4NW' },
]

const clinicDetails = locations.map(location => ({
  ...location,
  fullName: `MedicalD4 ${location.name.split(',')[0]} Clinic`,
  phone: '020 1234 5678',
  email: `${location.id}@medicald4.com`,
  hours: 'Mon-Fri: 9am-5pm',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2035&q=80'
}))

export default function FindClinic() {
  const [postcode, setPostcode] = useState('')
  const [nearestClinic, setNearestClinic] = useState<typeof clinicDetails[0] | null>(null)

  const findNearestClinic = () => {
    // For demo purposes, just show a random clinic
    // In production, you would want to use a postcode lookup API
    const randomClinic = clinicDetails[Math.floor(Math.random() * clinicDetails.length)]
    setNearestClinic(randomClinic)
  }

  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center gradient-text mb-8">Find Your Nearest Clinic</h2>
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter your postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="text-lg py-6"
            />
            <Button 
              onClick={findNearestClinic}
              size="lg"
              className="px-8"
            >
              Search
            </Button>
          </div>
        </div>

        {nearestClinic && (
          <Card className="max-w-2xl mx-auto overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
              <Image
                src={nearestClinic.image}
                alt={nearestClinic.fullName}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{nearestClinic.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span>{nearestClinic.name}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <span>{nearestClinic.phone}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <span>{nearestClinic.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span>{nearestClinic.hours}</span>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href={`/booking/services?location=${nearestClinic.id}`}>
                    Book at this Clinic
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
} 