import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing Stripe secret key');
    return NextResponse.json(
      { error: 'Stripe configuration error' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('Missing base URL');
    return NextResponse.json(
      { error: 'Configuration error: Base URL not set' },
      { status: 500 }
    )
  }

  try {
    const { amount, email, name, serviceTitle, metadata } = await req.json()
    console.log('Received payment request:', { amount, email, name, serviceTitle });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: serviceTitle,
              description: `Medical Assessment Booking for ${name}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/booking/stripe-return`,
      cancel_url: `${baseUrl}/booking/payment?${window.location.search}`,
      customer_email: email,
      metadata: metadata || {}
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating payment session' },
      { status: 500 }
    )
  }
}
