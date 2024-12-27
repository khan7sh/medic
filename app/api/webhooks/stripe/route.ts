import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { BookingConfirmationEmail } from '@/components/emails/BookingConfirmation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata

      if (!metadata) {
        throw new Error('No metadata found in session')
      }

      console.log('Webhook metadata:', metadata)

      // Update booking status in database
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'online',
          payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString()
        })
        .eq('email', session.customer_email)
        .eq('service_title', metadata.title)
        .eq('date', metadata.date)
        .eq('time', metadata.time)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Send confirmation email
      try {
        await resend.emails.send({
          from: 'Medical Assessments <bookings@medicald4.com>',
          to: session.customer_email!,
          subject: 'Your Medical Assessment Booking Confirmation',
          react: BookingConfirmationEmail({
            customerName: metadata.name,
            serviceName: metadata.title,
            location: metadata.locationName,
            date: metadata.date,
            time: metadata.time,
            price: (session.amount_total! / 100).toString(),
            paymentMethod: 'Online Payment',
            paymentStatus: 'Paid'
          })
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 