import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import BookingConfirmationEmail from '@/components/emails/BookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const booking = await request.json()
    console.log('Received booking data for email:', booking)

    if (!booking.email || !booking.first_name || !booking.service_title) {
      console.error('Missing required fields:', booking)
      return NextResponse.json(
        { error: 'Missing required fields for email' },
        { status: 400 }
      )
    }

    console.log('Attempting to send email with Resend...')
    const { data, error } = await resend.emails.send({
      from: 'Medical D4 <khan7akh@gmail.com>',
      reply_to: 'khan7akh@gmail.com',
      to: booking.email,
      subject: 'Your Medical Assessment Booking Confirmation',
      react: BookingConfirmationEmail({
        customerName: `${booking.first_name} ${booking.last_name}`,
        serviceName: booking.service_title,
        location: booking.location,
        date: booking.date,
        time: booking.time,
        price: booking.price.toString(),
        paymentMethod: booking.payment_method === 'online' ? 'Online Payment' : 'Pay at Clinic',
        paymentStatus: booking.payment_status === 'paid' ? 'Paid' : 'Pending'
      })
    })

    if (error) {
      console.error('Resend API error details:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Email sent successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Failed to send client email:', error)
    console.error('Error details:', error.message)
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    )
  }
} 