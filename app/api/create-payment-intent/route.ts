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

  try {
    const { amount, email, name, serviceTitle } = await req.json()
    console.log('Received payment request:', { amount, email, name, serviceTitle });

    if (!amount || !email || !name || !serviceTitle) {
      console.error('Missing required fields:', { amount, email, name, serviceTitle });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating Stripe session with amount:', amount * 100);
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
            unit_amount: Math.round(amount * 100), // Ensure integer amount
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&paymentMethod=online`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/payment`,
      customer_email: email,
    })

    console.log('Session created:', session.id);
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating payment session' },
      { status: 500 }
    )
  }
}
