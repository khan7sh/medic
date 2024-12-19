'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export default function StripeReturn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    async function verifyPayment() {
      try {
        const paymentIntentId = searchParams.get('payment_intent')
        if (!paymentIntentId) throw new Error('No payment intent ID found')

        // Verify payment status in database
        const { data: booking, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', paymentIntentId)
          .single()

        if (error) throw error
        if (!booking) throw new Error('Booking not found')

        if (booking.payment_status !== 'paid') {
          throw new Error('Payment not completed')
        }

        // Redirect to confirmation with booking details
        const params = new URLSearchParams({
          service: booking.service_id,
          title: booking.service_title,
          price: booking.price.toString(),
          location: booking.location,
          locationName: encodeURIComponent(booking.location_name),
          date: booking.date,
          time: booking.time,
          name: `${booking.first_name} ${booking.last_name}`,
          email: booking.email,
          paymentMethod: 'online',
          paymentStatus: 'paid'
        })

        router.push(`/booking/confirmation?${params.toString()}`)
      } catch (error) {
        console.error('Payment verification error:', error)
        toast({
          title: "Payment Verification Failed",
          description: "There was an issue verifying your payment. Please contact support.",
          variant: "destructive",
        })
        router.push('/booking/services')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [router, searchParams, toast])

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Verifying payment...</p>
      </div>
    )
  }

  return null
} 