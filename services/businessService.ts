import { supabase } from '@/lib/supabase'

interface BusinessInquiry {
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  enquiry_type: string
  message: string
}

export async function createBusinessInquiry(inquiryData: BusinessInquiry) {
  const { data, error } = await supabase
    .from('business_inquiries')
    .insert([inquiryData])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
} 