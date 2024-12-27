'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function StripeReturn() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking')
    
    if (pendingBooking) {
      try {
        const bookingData = JSON.parse(pendingBooking)
        const params = new URLSearchParams({
          service: bookingData.service || '',
          title: encodeURIComponent(bookingData.title || ''),
          price: bookingData.price?.toString() || '',
          location: bookingData.location || '',
          locationName: encodeURIComponent(bookingData.locationName || ''),
          date: bookingData.date || '',
          time: bookingData.time || '',
          name: bookingData.name || '',
          email: bookingData.email || '',
          paymentMethod: 'online',
          paymentStatus: 'paid'
        })

        localStorage.removeItem('pendingBooking')
        router.push(`/booking/confirmation?${params.toString()}`)
      } catch (error) {
        console.error('Error processing booking:', error)
        toast({
          title: 'Error',
          description: 'Failed to process booking confirmation',
          variant: 'destructive',
        })
      }
    } else {
      router.push('/booking/services')
    }
  }, [router, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
} 