import { supabase } from '@/lib/supabase';
import { PaymentIntent, PaymentMetadata } from '@/types/payment';
import { createStripePaymentIntent, retrievePaymentIntent } from './stripeService';

export async function createPaymentIntent(amount: number, metadata: PaymentMetadata) {
  try {
    // First update booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'pending',
        payment_method: 'online',
        updated_at: new Date().toISOString()
      })
      .eq('id', metadata.bookingId)
      .select()
      .single()

    if (bookingError) throw bookingError

    const paymentIntent = await createStripePaymentIntent(amount, metadata)
    
    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({ 
        payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', metadata.bookingId)

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    }
  } catch (error) {
    console.error('Payment intent creation error:', error)
    throw error
  }
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
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error) {
    console.error('Payment status update error:', error);
    throw error;
  }
}

export async function handleStripePayment(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  return stripe.confirmCardPayment(clientSecret);
} 