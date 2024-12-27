import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: Request) {
  const { amount, email, name, serviceTitle, metadata } = await request.json()
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: serviceTitle,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment`,
      customer_email: email,
      metadata: {
        name,
        serviceTitle,
        locationName: metadata.location,
        date: metadata.date,
        time: metadata.time,
        email,
        payment_method: 'online',
        payment_status: 'paid'
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating payment session' },
      { status: 500 }
    )
  }
}
