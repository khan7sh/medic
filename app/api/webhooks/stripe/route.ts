import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendConfirmationEmail } from '@/services/bookingService'
import { supabase } from '@/lib/supabase'

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
    const metadata = session.metadata
    
    try {
      const bookingData = {
        first_name: metadata?.name?.split(' ')[0] || '',
        last_name: metadata?.name?.split(' ')[1] || '',
        email: session.customer_email!,
        service_title: metadata?.title || '',
        location: metadata?.locationName || '',
        date: metadata?.date || '',
        time: metadata?.time || '',
        price: (session.amount_total! / 100).toString(),
        payment_method: 'online',
        payment_status: 'paid',
        status: 'confirmed'
      }

      // Save to database
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (bookingError) {
        throw new Error(`Failed to save booking: ${bookingError.message}`)
      }

      // Send confirmation email
      await sendConfirmationEmail({
        ...bookingData,
        customerName: `${bookingData.first_name} ${bookingData.last_name}`,
        serviceName: bookingData.service_title
      })

    } catch (error) {
      console.error('Error processing webhook:', error)
    }
  }

  return NextResponse.json({ received: true })
} 