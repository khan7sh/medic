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
        console.log('Retrieved booking data:', bookingData)
        
        // Make sure all required fields are present
        if (!bookingData.title || !bookingData.locationName || !bookingData.date || 
            !bookingData.time || !bookingData.name || !bookingData.email) {
          console.error('Missing required booking data:', bookingData)
          throw new Error('Incomplete booking data')
        }

        const params = new URLSearchParams()
        params.set('title', encodeURIComponent(bookingData.title))
        params.set('locationName', encodeURIComponent(bookingData.locationName))
        params.set('date', bookingData.date)
        params.set('time', bookingData.time)
        params.set('name', bookingData.name)
        params.set('email', bookingData.email)
        params.set('paymentMethod', 'online')
        params.set('paymentStatus', 'paid')
        params.set('price', bookingData.price.toString())

        console.log('Redirecting with params:', params.toString())
        localStorage.removeItem('pendingBooking')
        router.replace(`/booking/confirmation?${params.toString()}`)
      } catch (error) {
        console.error('Error processing booking:', error)
        toast({
          title: 'Error',
          description: 'Failed to process booking confirmation',
          variant: 'destructive',
        })
        router.push('/booking/services')
      }
    } else {
      console.log('No pending booking found')
      router.push('/booking/services')
    }
  }, [router, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
} 