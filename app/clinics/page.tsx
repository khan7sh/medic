'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock, Calendar, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { calculateDistance } from '@/utils/distance'
import { useToast } from '@/hooks/use-toast'

// Using the same locations data from LocationSelector
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

type ClinicWithDistance = typeof clinicDetails[number] & {
  distance?: number;
}

export default function ClinicsPage() {
  const [postcode, setPostcode] = useState('')
  const [sortedClinics, setSortedClinics] = useState<ClinicWithDistance[]>(clinicDetails)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const findNearestClinics = async () => {
    setIsLoading(true)
    try {
      const userRes = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
      const userData = await userRes.json()

      if (!userData.result) {
        throw new Error('Invalid postcode')
      }

      const userLocation = {
        latitude: userData.result.latitude,
        longitude: userData.result.longitude
      }

      const clinicsWithDistances = await Promise.all(
        clinicDetails.map(async (clinic) => {
          const clinicRes = await fetch(`https://api.postcodes.io/postcodes/${clinic.postcode}`)
          const clinicData = await clinicRes.json()
          
          const distance = calculateDistance(userLocation, {
            latitude: clinicData.result.latitude,
            longitude: clinicData.result.longitude
          })

          return {
            ...clinic,
            distance
          }
        })
      )

      // Sort all clinics by distance
      const sorted = clinicsWithDistances.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      setSortedClinics(sorted)
    } catch (error) {
      toast({
        title: "Error",
        description: "Please enter a valid UK postcode",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    className="text-lg py-6 bg-white"
                  />
                  <Button 
                    onClick={findNearestClinics}
                    size="lg"
                    className="px-8 w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Find Nearest Clinic'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinics Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedClinics.map((clinic, index) => (
                <Card 
                  key={clinic.id} 
                  className={`overflow-hidden transition-shadow duration-300 ${
                    clinic.distance && index === 0 
                      ? 'ring-2 ring-primary shadow-lg transform hover:-translate-y-1' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={clinic.image}
                      alt={clinic.fullName}
                      layout="fill"
                      objectFit="cover"
                    />
                    {clinic.distance && index === 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        Nearest
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{clinic.fullName}</CardTitle>
                    {clinic.distance && (
                      <p className="text-lg font-semibold text-primary">
                        {clinic.distance.toFixed(1)} miles away
                        {index === 0 && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            (Nearest location)
                          </span>
                        )}
                      </p>
                    )}
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
                      <Button asChild variant="outline" className="w-full mt-4">
                        <Link 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          View on Maps
                        </Link>
                      </Button>
                      <Button asChild className="w-full mt-2">
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
