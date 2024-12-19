'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createPaymentIntent, updatePaymentStatus } from '@/services/paymentService'

interface PaymentFormProps {
  amount: number
  bookingId: string
  metadata: {
    serviceTitle: string
    customerName: string
    customerEmail: string
  }
}

export default function PaymentForm({ amount, bookingId, metadata }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)

    try {
      // Create payment intent
      const { clientSecret, id: paymentIntentId } = await createPaymentIntent({
        amount,
        metadata: {
          bookingId,
          ...metadata
        }
      })

      // Update booking with payment intent ID
      await updatePaymentStatus(bookingId, 'pending', paymentIntentId)

      // Confirm card payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: metadata.customerName,
            email: metadata.customerEmail
          }
        }
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      // Payment successful - redirect to return URL
      router.push(`/booking/return?payment_intent=${paymentIntentId}`)
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'An error occurred during payment',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#9e2146'
              }
            }
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  )
} 