import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe secret key is not configured' },
      { status: 500 }
    )
  }

  try {
    const { amount, email, name, serviceTitle } = await req.json()

    if (!amount || !email || !name || !serviceTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&paymentMethod=online`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment`,
      customer_email: email,
      metadata: {
        service_title: serviceTitle,
        customer_name: name
      }
    })

    if (!session?.id) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Payment session error:', error)
    return NextResponse.json(
      { error: 'Error creating payment session' },
      { status: 500 }
    )
  }
}
