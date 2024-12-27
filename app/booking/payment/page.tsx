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
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { VALID_DISCOUNT_CODES, validateVoucherCode } from '@/constants/discounts'
import { sendConfirmationEmail } from '@/services/bookingService'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'inPerson'>()
  const { toast } = useToast()
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [usedDiscountCodes, setUsedDiscountCodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('usedDiscountCodes')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Add this useEffect to store parameters on page load
  useEffect(() => {
    const params = {
      service: searchParams.get('service'),
      title: searchParams.get('title'),
      price: searchParams.get('price'),
      location: searchParams.get('location'),
      locationName: decodeURIComponent(searchParams.get('locationName') || ''),
      date: searchParams.get('date'),
      time: searchParams.get('time'),
      name: searchParams.get('name'),
      email: searchParams.get('email')
    }
    
    // Only store if we have the essential parameters
    if (params.service && params.title && params.price) {
      localStorage.setItem('bookingParams', JSON.stringify(params))
    } else {
      // If we don't have parameters in URL, try to get them from localStorage
      const storedParams = localStorage.getItem('bookingParams')
      if (storedParams) {
        const parsedParams = JSON.parse(storedParams)
        // Ensure locationName is properly encoded in the URL
        const searchParams = new URLSearchParams({
          ...parsedParams,
          locationName: encodeURIComponent(parsedParams.locationName || '')
        })
        router.replace(`/booking/payment?${searchParams.toString()}`)
      }
    }
  }, [searchParams, router])

  useEffect(() => {
    console.log('Current URL params:', {
      service: searchParams.get('service'),
      title: searchParams.get('title'),
      price: searchParams.get('price'),
      location: searchParams.get('location'),
      locationName: searchParams.get('locationName'),
      date: searchParams.get('date'),
      time: searchParams.get('time'),
      name: searchParams.get('name'),
      email: searchParams.get('email')
    })
  }, [searchParams])

  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const location = searchParams.get('location')
  const locationName = searchParams.get('locationName')
    ? decodeURIComponent(searchParams.get('locationName') || '')
    : 'Location not found'
  const date = searchParams.get('date')
  const time = searchParams.get('time')
  const name = searchParams.get('name')
  const email = searchParams.get('email')

  const handlePayment = async () => {
    const finalAmount = Number(servicePrice) - appliedDiscount
    
    try {
      setIsLoading(true)
      
      // Store booking data in localStorage before payment
      const bookingData = {
        service: searchParams.get('service'),
        title: decodeURIComponent(serviceTitle || ''),
        price: finalAmount,
        location: searchParams.get('location'),
        locationName: decodeURIComponent(locationName || ''),
        date: searchParams.get('date'),
        time: searchParams.get('time'),
        name: name,
        email: email,
        paymentMethod: 'online',
        paymentStatus: 'pending'
      }
      
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData))

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(finalAmount),
          email: email,
          name: name,
          serviceTitle: decodeURIComponent(serviceTitle || ''),
          metadata: bookingData
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment session creation failed')
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (error) {
        throw error
      }

      // After successful booking creation and payment
      // Email will be sent via webhook after payment confirmation
      
      // Continue with the redirect
      router.push(`/booking/confirmation?service=${searchParams.get('service')}&title=${searchParams.get('title')}&price=${finalAmount}&location=${searchParams.get('location')}&locationName=${encodeURIComponent(locationName || '')}&date=${searchParams.get('date')}&time=${searchParams.get('time')}&name=${searchParams.get('name')}&email=${searchParams.get('email')}&paymentMethod=online`)
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyDiscount = () => {
    setIsApplyingDiscount(true)
    
    if (!validateVoucherCode(discountCode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid discount code",
        variant: "destructive",
      })
      setIsApplyingDiscount(false)
      return
    }

    const upperCaseCode = discountCode.toUpperCase()
    const discountData = VALID_DISCOUNT_CODES[upperCaseCode]
    
    setAppliedDiscount(discountData.amount)
    toast({
      title: "Discount Applied",
      description: `£${discountData.amount} discount has been applied to your booking`,
    })
    
    setIsApplyingDiscount(false)
  }

  const finalPrice = Number(servicePrice) - appliedDiscount

  const handleBack = () => {
    const params = new URLSearchParams({
      service: searchParams.get('service') || '',
      title: searchParams.get('title') || '',
      price: searchParams.get('price') || '',
      location: searchParams.get('location') || '',
      locationName: searchParams.get('locationName') || '',
      date: searchParams.get('date') || '',
      time: searchParams.get('time') || ''
    })
    router.push(`/booking/details?${params.toString()}`)
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
            <div>{locationName || 'No location selected'}</div>
            <div className="text-muted-foreground">Date & Time:</div>
            <div>{date} at {time}</div>
            <div className="text-muted-foreground">Name:</div>
            <div>{name}</div>
            <div className="text-muted-foreground">Email:</div>
            <div>{email}</div>
            <div className="text-muted-foreground font-medium">Total Amount:</div>
            <div className="font-semibold">£{servicePrice}</div>
          </div>
          
          <div className="space-y-4 border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button 
                variant="outline" 
                onClick={handleApplyDiscount}
                disabled={!discountCode || isApplyingDiscount}
              >
                {isApplyingDiscount ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span>£{servicePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-primary font-medium">-£{appliedDiscount}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Final Price:</span>
                  <span className="text-primary">£{finalPrice}</span>
                </div>
              </div>
            )}
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
          onClick={handleBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!paymentMethod || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <>
              {paymentMethod === 'online' ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              ) : (
                <>
                  Pay at Clinic
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </BookingLayout>
  )
}
