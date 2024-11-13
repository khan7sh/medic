import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for the appointed route
  if (req.nextUrl.pathname.startsWith('/appointed')) {
    // If no session exists, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Optional: Check for admin role if you have role-based authentication
    const userRole = session.user?.user_metadata?.role
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/appointed/:path*'
  ]
}