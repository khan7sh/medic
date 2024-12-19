import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
) 