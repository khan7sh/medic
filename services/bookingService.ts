import { supabase } from '@/lib/supabase'

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
}

export async function createBooking(bookingData: BookingData) {
  try {
    const [day, month, year] = bookingData.date_of_birth.split('/');
    const formattedDateOfBirth = `${year}-${month}-${day}`;

    const formattedBookingData = {
      ...bookingData,
      date_of_birth: formattedDateOfBirth,
      status: 'pending' as const
    };

    // Create booking first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([formattedBookingData])
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Booking failed: ${bookingError.message}`);
    }

    // Create basic audit log entry
    await supabase
      .from('admin_audit_log')
      .insert({
        booking_id: booking.id,
        action: 'booking_created',
        admin_email: 'info@medicald4.com'
      });

    try {
      await sendConfirmationEmail(bookingData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return booking;
  } catch (error) {
    console.error('CreateBooking error:', error);
    throw error;
  }
}

async function sendConfirmationEmail(booking: BookingData) {
  // Implement email sending logic here
  // You can use services like SendGrid, AWS SES, or Resend
} 