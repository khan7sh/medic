import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      locationName,
      date,
      time,
      name,
      email,
      amount
    } = body

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: title,
              description: `${locationName} - ${date} ${time}`
            },
            unit_amount: amount, // amount in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/stripe-return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment`,
      customer_email: email,
      metadata: {
        title,
        locationName,
        date,
        time,
        name,
        email
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 