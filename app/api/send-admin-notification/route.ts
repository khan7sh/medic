import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'khan7akh@gmail.com'

export async function POST(request: Request) {
  try {
    const booking = await request.json()
    
    const { data, error } = await resend.emails.send({
      from: 'Medical D4 <khan7akh@gmail.com>',
      to: ADMIN_EMAIL,
      subject: 'New Booking Notification',
      html: `
        <h2>New Booking Received</h2>
        <p>A new booking has been made with the following details:</p>
        <ul>
          <li><strong>Service:</strong> ${booking.service_title}</li>
          <li><strong>Location:</strong> ${booking.location}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Customer Name:</strong> ${booking.first_name} ${booking.last_name}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Price:</strong> £${booking.price}</li>
          <li><strong>Payment Status:</strong> ${booking.payment_status}</li>
        </ul>
        <p>Please check the admin dashboard for more details.</p>
      `
    })

    if (error) {
      console.error('Admin notification error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    return NextResponse.json(
      { error: 'Failed to send admin notification' },
      { status: 500 }
    )
  }
} 