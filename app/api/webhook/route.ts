import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  if (!sig) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    )
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata) {
          const { error } = await supabase
            .from('bookings')
            .insert([{
              service_id: session.metadata.service,
              service_title: session.metadata.title,
              location: session.metadata.location,
              date: session.metadata.date,
              time: session.metadata.time,
              price: session.metadata.price,
              first_name: session.metadata.name.split(' ')[0],
              last_name: session.metadata.name.split(' ')[1] || '',
              email: session.metadata.email,
              status: 'confirmed',
              payment_method: 'online',
              payment_status: 'paid',
              payment_intent_id: session.payment_intent as string
            }])

          if (error) {
            console.error('Error saving booking:', error)
            return NextResponse.json(
              { error: 'Failed to save booking' },
              { status: 500 }
            )
          }
        }
        break

      case 'payment_intent.payment_failed':
        // Handle failed payment if needed
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
