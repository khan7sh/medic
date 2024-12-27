import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendConfirmationEmail } from '@/services/bookingService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      const bookingData = {
        first_name: session.metadata?.first_name,
        last_name: session.metadata?.last_name,
        email: session.customer_email!,
        service_title: session.metadata?.serviceTitle,
        location: session.metadata?.locationName,
        date: session.metadata?.date,
        time: session.metadata?.time,
        price: session.amount_total! / 100,
        payment_method: 'online',
        payment_status: 'paid'
      }

      await sendConfirmationEmail(bookingData)
    } catch (error) {
      console.error('Error sending confirmation email:', error)
    }
  }

  return NextResponse.json({ received: true })
} 