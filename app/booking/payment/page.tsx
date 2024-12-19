'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import BookingLayout from '@/components/booking/bookingLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, Lock, AlertCircle } from 'lucide-react'
import PaymentMethodSelector from '@/components/booking/PaymentMethodSelector'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { createPaymentIntent, updatePaymentStatus } from '@/services/paymentService'
import PaymentForm from '@/components/booking/PaymentForm'
import { supabase } from '@/lib/supabase'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientSecret, setClientSecret] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'inPerson'>()
  const { toast } = useToast()

  // Get booking details from URL params
  const bookingDetails = {
    service: searchParams.get('title'),
    price: Number(searchParams.get('price')),
    location: searchParams.get('locationName'),
    date: searchParams.get('date'),
    time: searchParams.get('time'),
    name: searchParams.get('name'),
    email: searchParams.get('email'),
  }

  const handlePayment = async () => {
    if (paymentMethod === 'inPerson') {
      await handleInPersonPayment()
      return
    }

    try {
      setIsLoading(true)
      const paymentIntent = await createPaymentIntent(bookingDetails.price, {
        bookingId: searchParams.get('bookingId') || '',
        serviceTitle: bookingDetails.service || '',
        customerName: bookingDetails.name || '',
        customerEmail: bookingDetails.email || '',
      })

      setClientSecret(paymentIntent.client_secret)
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment initialization failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInPersonPayment = async () => {
    try {
      setIsLoading(true)
      
      // Update booking status for in-person payment
      await supabase
        .from('bookings')
        .update({
          payment_method: 'inPerson',
          payment_status: 'pending',
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', searchParams.get('bookingId'))

      // Redirect to confirmation
      const params = new URLSearchParams({
        service: searchParams.get('service') || '',
        title: searchParams.get('title') || '',
        price: searchParams.get('price') || '',
        location: searchParams.get('location') || '',
        locationName: searchParams.get('locationName') || '',
        date: searchParams.get('date') || '',
        time: searchParams.get('time') || '',
        name: searchParams.get('name') || '',
        email: searchParams.get('email') || '',
        paymentMethod: 'inPerson',
        paymentStatus: 'pending'
      })

      router.push(`/booking/confirmation?${params.toString()}`)
    } catch (error) {
      console.error('In-person payment setup error:', error)
      toast({
        title: "Error",
        description: "Failed to process in-person payment setup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BookingLayout
      currentStep={5}
      title="Payment"
      description="Complete your booking by selecting a payment method"
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-muted-foreground">Service:</div>
            <div>{decodeURIComponent(bookingDetails.service || '')}</div>
            <div className="text-muted-foreground">Location:</div>
            <div>{decodeURIComponent(bookingDetails.location || '') || 'No location selected'}</div>
            <div className="text-muted-foreground">Date & Time:</div>
            <div>{bookingDetails.date} at {bookingDetails.time}</div>
            <div className="text-muted-foreground">Name:</div>
            <div>{bookingDetails.name}</div>
            <div className="text-muted-foreground">Email:</div>
            <div>{bookingDetails.email}</div>
            <div className="text-muted-foreground font-medium">Total Amount:</div>
            <div className="font-semibold">£{bookingDetails.price}</div>
          </div>
        </CardContent>
      </Card>

      <PaymentMethodSelector
        onSelect={setPaymentMethod}
        selectedMethod={paymentMethod}
      />

      {clientSecret && paymentMethod === 'online' && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      )}

      {paymentMethod === 'inPerson' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment will be required at the clinic before your appointment.
            Please arrive 10 minutes early to process payment.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!paymentMethod || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              {paymentMethod === 'online' ? 'Pay Now' : 'Continue'}
              <CreditCard className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </BookingLayout>
  )
}
