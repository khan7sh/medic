import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import AdminNotificationEmail from '@/components/emails/AdminNotification'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@optimizeai.agency'

export async function POST(request: Request) {
  try {
    const booking = await request.json()
    console.log('Sending admin notification for booking:', booking)
    
    const { data, error } = await resend.emails.send({
      from: 'Medical D4 <contact@optimizeai.agency>',
      replyTo: 'contact@optimizeai.agency',
      to: ADMIN_EMAIL,
      subject: `New Booking: ${booking.service_title} - ${booking.first_name} ${booking.last_name}`,
      react: AdminNotificationEmail({
        customerName: `${booking.first_name} ${booking.last_name}`,
        serviceName: booking.service_title,
        location: booking.location,
        date: booking.date,
        time: booking.time,
        price: booking.price.toString(),
        email: booking.email,
        paymentStatus: booking.payment_status
      })
    })

    if (error) {
      console.error('Admin notification error details:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Failed to send admin notification:', error)
    console.error('Error details:', error.message)
    return NextResponse.json(
      { error: 'Failed to send admin notification', details: error.message },
      { status: 500 }
    )
  }
} 