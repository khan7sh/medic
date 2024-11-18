import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useAuthCheck() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      const userRole = session.user?.user_metadata?.role
      if (userRole !== 'admin') {
        router.push('/')
      }
    }

    // Initial check
    checkAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])
}