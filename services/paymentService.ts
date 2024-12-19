import { supabase } from '@/lib/supabase';
import { PaymentIntent, PaymentMetadata } from '@/types/payment';
import { createStripePaymentIntent, retrievePaymentIntent } from './stripeService';

interface PaymentIntentRequest {
  amount: number
  metadata: {
    bookingId: string
    serviceTitle: string
    customerName: string
    customerEmail: string
  }
}

export async function createPaymentIntent({ amount, metadata }: PaymentIntentRequest) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, metadata }),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment intent')
  }

  return response.json()
}

export async function verifyPaymentStatus(paymentIntentId: string) {
  try {
    const paymentIntent = await retrievePaymentIntent(paymentIntentId)
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single()

    if (error) throw error
    
    return {
      booking,
      paymentStatus: paymentIntent.status
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    throw error
  }
}

export async function updatePaymentStatus(bookingId: string, status: string, paymentIntentId?: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: status,
        payment_intent_id: paymentIntentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (error) throw error
  } catch (error) {
    console.error('Payment status update error:', error)
    throw error
  }
}

export async function handleStripePayment(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  return stripe.confirmCardPayment(clientSecret);
} 