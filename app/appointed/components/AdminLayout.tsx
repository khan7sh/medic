'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Settings,
  FileSpreadsheet
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

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
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}