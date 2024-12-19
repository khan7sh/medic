import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    switch (event.type) {
      case 'payment_intent.succeeded':
        await supabase
          .from('bookings')
          .update({ 
            payment_status: 'paid',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        await supabase
          .from('bookings')
          .update({ 
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 400 }
    )
  }
}
