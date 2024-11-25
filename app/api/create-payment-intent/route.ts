import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: Request) {
  try {
    const { amount, email, name, serviceTitle } = await req.json()

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
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment`,
      customer_email: email,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Payment session error:', error)
    return NextResponse.json(
      { error: 'Error creating payment session' },
      { status: 500 }
    )
  }
}
