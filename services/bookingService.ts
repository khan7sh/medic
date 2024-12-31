import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { BookingConfirmationEmail } from '@/components/emails/BookingConfirmation'

export interface BookingData {
  service_id: string
  service_title: string
  location: string
  date: string
  time: string
  price: number
  first_name: string
  last_name: string
  date_of_birth: string
  email: string
  phone: string
  postcode: string
  license?: string
  vehicle_type?: string
  employer?: string
  voucher_code?: string
  hear_about_us: string
  marketing_consent: boolean
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_method?: 'online' | 'inPerson'
  payment_status?: 'pending' | 'paid' | 'failed'
  payment_intent_id?: string
}

export async function createBooking(bookingData: BookingData) {
  try {
    const [day, month, year] = bookingData.date_of_birth.split('/');
    const formattedDateOfBirth = `${year}-${month}-${day}`;

    const formattedBookingData = {
      ...bookingData,
      date_of_birth: formattedDateOfBirth,
      status: 'pending' as const,
      payment_status: bookingData.payment_method === 'inPerson' ? 'pending' : undefined,
      payment_method: bookingData.payment_method
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([formattedBookingData])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      throw new Error(`Booking failed: ${bookingError.message}`);
    }

    return booking;
  } catch (error) {
    console.error('CreateBooking error:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(booking: BookingData) {
  try {
    console.log('Attempting to send confirmation email with data:', booking)
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_title: booking.service_title,
        location: booking.location,
        date: booking.date,
        time: booking.time,
        first_name: booking.first_name,
        last_name: booking.last_name,
        email: booking.email,
        payment_method: booking.payment_method,
        payment_status: booking.payment_status,
        price: booking.price
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Email API response error:', data)
      throw new Error(data.error || 'Failed to send email')
    }

    return data
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw error
  }
} 