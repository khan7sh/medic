'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LocationSelector from '@/components/booking/LocationSelector'
import ProgressSteps from '@/components/booking/ProgressSteps'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar } from 'lucide-react'
import BookingLayout from '@/components/booking/bookingLayout'

export default function LocationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedLocation, setSelectedLocation] = useState('')

  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')

  const handleBack = () => {
    router.push(`/booking/services?service=${serviceId}`)
  }

  const handleNext = () => {
    if (selectedLocation) {
      router.push(`/booking/datetime?service=${serviceId}&price=${servicePrice}&title=${serviceTitle}&location=${encodeURIComponent(selectedLocation)}`)
    }
  }

  return (
    <BookingLayout
      currentStep={2}
      title="Choose Your Location"
      description="Select a convenient clinic location for your assessment"
    >
      {serviceTitle && servicePrice && (
        <div className="bg-secondary/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Selected Service:</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg">{decodeURIComponent(serviceTitle)}</span>
            <span className="text-primary font-semibold">£{servicePrice}</span>
          </div>
        </div>
      )}

      <LocationSelector
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Services
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!selectedLocation}
          className="px-8 py-6 text-lg"
        >
          Book Appointment
          <Calendar className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </BookingLayout>
  )
} 