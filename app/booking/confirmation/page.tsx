'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BookingLayout from '@/components/booking/bookingLayout'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  
  // Log all search params for debugging
  console.log('Search params:', Object.fromEntries(searchParams.entries()))
  
  const bookingDetails = {
    service: searchParams.get('title') ? decodeURIComponent(searchParams.get('title')!) : '',
    location: searchParams.get('locationName') ? decodeURIComponent(searchParams.get('locationName')!) : '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    paymentMethod: 'Online Payment',
    paymentStatus: 'Paid',
    price: searchParams.get('price') || ''
  }

  // Log booking details for debugging
  console.log('Booking details:', bookingDetails)

  return (
    <BookingLayout
      currentStep={6}
      title="Booking Confirmed"
      description="Your appointment has been successfully scheduled"
    >
      <div className="text-center px-4 sm:px-0">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        
        <div className="max-w-md mx-auto bg-secondary/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          <div className="space-y-3 text-left text-sm sm:text-base">
            {bookingDetails.service && (
              <p><span className="font-medium">Service:</span> {bookingDetails.service}</p>
            )}
            {bookingDetails.location && (
              <p><span className="font-medium">Location:</span> {bookingDetails.location}</p>
            )}
            {bookingDetails.date && (
              <p><span className="font-medium">Date:</span> {bookingDetails.date}</p>
            )}
            {bookingDetails.time && (
              <p><span className="font-medium">Time:</span> {bookingDetails.time}</p>
            )}
            {bookingDetails.name && (
              <p><span className="font-medium">Name:</span> {bookingDetails.name}</p>
            )}
            {bookingDetails.email && (
              <p><span className="font-medium">Email:</span> {bookingDetails.email}</p>
            )}
            <p><span className="font-medium">Payment Method:</span> {bookingDetails.paymentMethod}</p>
            <p><span className="font-medium">Payment Status:</span> {bookingDetails.paymentStatus}</p>
            {bookingDetails.price && (
              <p><span className="font-medium">Price:</span> £{bookingDetails.price}</p>
            )}
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
          A confirmation email has been sent to your email address.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button className="w-full sm:w-auto" variant="outline">
            <Link href="/booking/services">Book Another</Link>
          </Button>
        </div>
      </div>
    </BookingLayout>
  )
}
