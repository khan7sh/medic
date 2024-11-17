'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '../components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Download, TrendingUp, Users, PoundSterling, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface BookingStats {
  total: number
  completed: number
  cancelled: number
  pending: number
  revenue: number
}

interface ServiceStats {
  name: string
  bookings: number
  revenue: number
}

interface LocationStats {
  name: string
  bookings: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('7days')
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    revenue: 0
  })
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([])
  const [locationStats, setLocationStats] = useState<LocationStats[]>([])
  const [dailyBookings, setDailyBookings] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  async function fetchStats() {
    // Calculate date range based on timeframe
    const today = new Date()
    let startDate = new Date()
    switch (timeframe) {
      case '7days':
        startDate.setDate(today.getDate() - 7)
        break
      case '30days':
        startDate.setDate(today.getDate() - 30)
        break
      case '90days':
        startDate.setDate(today.getDate() - 90)
        break
    }

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
    
    if (bookings) {
      const stats = bookings.reduce((acc, booking) => ({
        total: acc.total + 1,
        completed: acc.completed + (booking.status === 'completed' ? 1 : 0),
        cancelled: acc.cancelled + (booking.status === 'cancelled' ? 1 : 0),
        pending: acc.pending + (booking.status === 'pending' ? 1 : 0),
        revenue: acc.revenue + (booking.status === 'completed' ? 50 : 0), // Assuming £50 per booking
      }), { total: 0, completed: 0, cancelled: 0, pending: 0, revenue: 0 })

      setStats(stats)

      // Process service stats
      const serviceData = bookings.reduce((acc: any, booking) => {
        if (!acc[booking.service_title]) {
          acc[booking.service_title] = { bookings: 0, revenue: 0 }
        }
        acc[booking.service_title].bookings++
        acc[booking.service_title].revenue += booking.status === 'completed' ? 50 : 0
        return acc
      }, {})

      setServiceStats(Object.entries(serviceData).map(([name, data]: [string, any]) => ({
        name,
        ...data
      })))

      // Process location stats
      const locationData = bookings.reduce((acc: any, booking) => {
        if (!acc[booking.location]) {
          acc[booking.location] = { bookings: 0 }
        }
        acc[booking.location].bookings++
        return acc
      }, {})

      setLocationStats(Object.entries(locationData).map(([name, data]: [string, any]) => ({
        name,
        ...data
      })))

      // Process daily bookings
      const dailyData = bookings.reduce((acc: any, booking) => {
        const date = booking.date
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date]++
        return acc
      }, {})

      setDailyBookings(Object.entries(dailyData).map(([date, count]) => ({
        date: format(new Date(date), 'MMM dd'),
        bookings: count
      })))
    }
  }

  async function exportReport() {
    const csvData = [
      ['Date', 'Service', 'Location', 'Status', 'Revenue'],
      ...serviceStats.map(stat => [
        format(new Date(), 'yyyy-MM-dd'),
        stat.name,
        '',
        '',
        `£${stat.revenue}`
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `booking-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <div className="flex gap-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <PoundSterling className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{stats.revenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceStats}
                      dataKey="bookings"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {serviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}