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
  const [selectedLocationName, setSelectedLocationName] = useState('')

  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')

  const handleLocationChange = (locationId: string, locationName: string) => {
    setSelectedLocation(locationId)
    setSelectedLocationName(locationName)
  }

  const handleBack = () => {
    router.push(`/booking/services?service=${serviceId}`)
  }

  const handleNext = () => {
    if (selectedLocation) {
      router.push(`/booking/datetime?service=${serviceId}&price=${servicePrice}&title=${serviceTitle}&location=${selectedLocation}&locationName=${encodeURIComponent(selectedLocationName)}`)
    }
  }

  return (
    <BookingLayout
      currentStep={2}
      title="Choose Your Location"
      description="Select a convenient clinic location for your assessment"
    >
      {serviceTitle && servicePrice && (
        <div className="bg-secondary/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Selected Service:</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <span className="text-base sm:text-lg break-words">{decodeURIComponent(serviceTitle)}</span>
            <span className="text-primary font-semibold text-base sm:text-lg">£{servicePrice}</span>
          </div>
        </div>
      )}

      <LocationSelector
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Back to Services
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!selectedLocation}
          className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
        >
          Book Appointment
          <Calendar className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </BookingLayout>
  )
} 