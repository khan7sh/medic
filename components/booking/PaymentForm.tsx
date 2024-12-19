'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, useStripe, useElements } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { handleStripePayment } from '@/services/paymentService'
import { useToast } from '@/hooks/use-toast'

interface PaymentFormProps {
  clientSecret: string;
}

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    try {
      setIsProcessing(true)
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      )

      if (error) {
        throw error
      }

      if (paymentIntent.status === 'succeeded') {
        // Get the current URL search params
        const currentParams = new URLSearchParams(window.location.search)
        
        // Construct confirmation URL with all necessary parameters
        const params = new URLSearchParams({
          service: currentParams.get('service') || '',
          title: currentParams.get('title') || '',
          price: currentParams.get('price') || '',
          location: currentParams.get('location') || '',
          locationName: currentParams.get('locationName') || '',
          date: currentParams.get('date') || '',
          time: currentParams.get('time') || '',
          name: currentParams.get('name') || '',
          email: currentParams.get('email') || '',
          paymentMethod: 'online',
          paymentStatus: 'paid'
        })

        router.push(`/booking/confirmation?${params.toString()}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment processing failed",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
} 