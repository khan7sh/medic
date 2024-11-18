'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Settings,
  FileSpreadsheet,
  LogOut,
  Building2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuthCheck } from '@/hooks/use-auth-check'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  useAuthCheck()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user?.user_metadata?.role !== 'admin') {
        router.push('/auth/login')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const navigation = [
    {
      name: 'Bookings',
      href: '/appointed',
      icon: Calendar,
      current: pathname === '/appointed'
    },
    {
      name: 'Report Data',
      href: '/appointed/reports',
      icon: FileSpreadsheet,
      current: pathname === '/appointed/reports'
    },
    {
      name: 'Manage',
      href: '/appointed/manage',
      icon: Settings,
      current: pathname === '/appointed/manage'
    },
    {
      name: 'Inquiries',
      href: '/admin/business-inquiries',
      icon: Building2,
      current: pathname === '/admin/business-inquiries'
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 px-3 py-2 rounded-lg text-sm font-medium",
                item.current
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}