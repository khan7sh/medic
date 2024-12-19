import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PaymentMetadata } from '@/types/payment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: Request) {
  try {
    const { amount, metadata } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'gbp',
      metadata: {
        bookingId: metadata.bookingId,
        serviceTitle: metadata.serviceTitle,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    )
  }
}
