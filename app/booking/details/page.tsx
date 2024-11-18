'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import BookingLayout from '@/components/booking/bookingLayout'
import BookingDetailsForm from '@/components/booking/BookingDetailsForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Calendar, FileText } from 'lucide-react'

export default function BookingDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const serviceTitle = searchParams.get('title')
  const locationId = searchParams.get('location')
  const locationName = searchParams.get('locationName')
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  return (
    <BookingLayout
      currentStep={4}
      title="Complete Your Booking"
      description="Fill in your details to confirm your appointment"
    >
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Booking Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center text-sm sm:text-base text-muted-foreground">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
            <span>Medical Type: {decodeURIComponent(serviceTitle || '')}</span>
          </div>
          <div className="flex items-center text-sm sm:text-base text-muted-foreground">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
            <span>Location: {decodeURIComponent(locationName || '')}</span>
          </div>
          <div className="flex items-center text-sm sm:text-base text-muted-foreground">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
            <span>Date & Time: {date} {time}</span>
          </div>
        </CardContent>
      </Card>

      <BookingDetailsForm />
    </BookingLayout>
  )
} 