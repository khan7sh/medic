'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import BookingLayout from '@/components/booking/bookingLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, Lock, AlertCircle } from 'lucide-react'
import PaymentMethodSelector from '@/components/booking/PaymentMethodSelector'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'inPerson'>()

  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const locationName = searchParams.get('locationName')
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const name = searchParams.get('name')
  const email = searchParams.get('email')

  const handlePayment = async () => {
    if (paymentMethod === 'inPerson') {
      // Redirect to confirmation with in-person payment status
      router.push(`/booking/confirmation?service=${searchParams.get('service')}&title=${searchParams.get('title')}&price=${servicePrice}&location=${searchParams.get('location')}&date=${searchParams.get('date')}&time=${searchParams.get('time')}&name=${searchParams.get('name')}&email=${searchParams.get('email')}&paymentMethod=inPerson`)
      return
    }

    try {
      setIsLoading(true)
      
      // Create a payment session
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(servicePrice) * 100, // Convert to cents
          email: email,
          name: name,
          serviceTitle: serviceTitle,
        }),
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      })

      if (error) throw error

    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BookingLayout
      currentStep={5}
      title="Choose Payment Method"
      description="Select how you would like to pay"
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
            <div>{decodeURIComponent(serviceTitle || '')}</div>
            <div className="text-muted-foreground">Location:</div>
            <div>{decodeURIComponent(locationName || '')}</div>
            <div className="text-muted-foreground">Date & Time:</div>
            <div>{date} at {time}</div>
            <div className="text-muted-foreground">Name:</div>
            <div>{name}</div>
            <div className="text-muted-foreground">Email:</div>
            <div>{email}</div>
            <div className="text-muted-foreground font-medium">Total Amount:</div>
            <div className="font-medium text-primary">£{servicePrice}</div>
          </div>
          
          <PaymentMethodSelector
            onSelect={setPaymentMethod}
            selectedMethod={paymentMethod}
          />

          {paymentMethod === 'inPerson' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payment will be required at the clinic before your appointment. 
                Please arrive 10 minutes early to process payment.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isLoading || !paymentMethod}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            'Processing...'
          ) : paymentMethod === 'online' ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay £{servicePrice} Now
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </BookingLayout>
  )
}
