import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { BookingConfirmationEmail } from '@/components/emails/BookingConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const booking = await request.json()
    
    const { data, error } = await resend.emails.send({
      from: 'Medical D4 <khan7akh@gmail.com>',
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
      console.error('Client email error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to send client email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 