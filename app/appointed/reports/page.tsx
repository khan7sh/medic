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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { Download, TrendingUp, Users, PoundSterling, Calendar, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { DateRangePicker } from '@/components/ui/date-range-picker'

interface BookingStats {
  total: number
  completed: number
  cancelled: number
  pending: number
  revenue: number
  [key: string]: number
}

interface ServiceStats {
  name: string
  bookings: number
  revenue: number
}

interface LocationStats {
  name: string
  bookings: number
  revenue: number
}

interface Booking {
  id: string
  service_title: string
  location: string
  date: string
  time: string
  status: 'pending' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  price: number
  created_at: string | null
  date_of_birth: string
  email: string
  employer: string | null
  first_name: string
  hear_about_us: string
  last_name: string
  license: string | null
  payment_intent_id: string | null
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface DateRange {
  from: Date
  to: Date
}

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('7days')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date()
  })
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
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [peakTimes, setPeakTimes] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  async function fetchStats() {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('created_at', startOfDay(dateRange.from).toISOString())
        .lte('created_at', endOfDay(dateRange.to).toISOString())

      if (error) throw error
      if (!bookings) return

      // Process basic stats
      const statsData = bookings.reduce((acc: BookingStats, booking) => {
        acc.total++
        if (booking.status && booking.status in acc) {
          acc[booking.status]++
        }
        if (booking.payment_status === 'paid' && booking.price) {
          acc.revenue += booking.price
        }
        return acc
      }, {
        total: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        revenue: 0
      })

      setStats(statsData)

      // Process service stats
      const serviceData = bookings.reduce((acc: Record<string, ServiceStats>, booking) => {
        const title = booking.service_title || 'Unknown'
        if (!acc[title]) {
          acc[title] = { name: title, bookings: 0, revenue: 0 }
        }
        acc[title].bookings++
        if (booking.payment_status === 'paid' && booking.price) {
          acc[title].revenue += booking.price
        }
        return acc
      }, {})

      setServiceStats(Object.values(serviceData))

      // Process location stats
      const locationData = bookings.reduce((acc: Record<string, LocationStats>, booking) => {
        const location = booking.location || 'Unknown'
        if (!acc[location]) {
          acc[location] = { name: location, bookings: 0, revenue: 0 }
        }
        acc[location].bookings++
        if (booking.payment_status === 'paid' && booking.price) {
          acc[location].revenue += booking.price
        }
        return acc
      }, {})

      setLocationStats(Object.values(locationData))

      // Process daily bookings and revenue
      const dailyData = bookings.reduce((acc: Record<string, { bookings: number, revenue: number }>, booking) => {
        if (!booking.created_at) return acc
        const date = format(new Date(booking.created_at), 'yyyy-MM-dd')
        if (!acc[date]) {
          acc[date] = { bookings: 0, revenue: 0 }
        }
        acc[date].bookings++
        if (booking.payment_status === 'paid' && booking.price) {
          acc[date].revenue += booking.price
        }
        return acc
      }, {})

      const dailyStats = Object.entries(dailyData).map(([date, data]) => ({
        date: format(new Date(date), 'MMM dd'),
        ...data
      }))

      setDailyBookings(dailyStats)
      setRevenueData(dailyStats)

      // Process peak booking times
      const timeData = bookings.reduce((acc: Record<number, number>, booking) => {
        if (!booking.created_at) return acc
        const hour = new Date(booking.created_at).getHours()
        if (!acc[hour]) {
          acc[hour] = 0
        }
        acc[hour]++
        return acc
      }, {})

      setPeakTimes(
        Object.entries(timeData).map(([hour, count]) => ({
          hour: `${parseInt(hour)}:00`,
          bookings: count
        }))
      )
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  async function exportReport() {
    const csvData = [
      ['Date Range', `${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`],
      [''],
      ['Overall Stats'],
      ['Total Bookings', stats.total],
      ['Completed Bookings', stats.completed],
      ['Cancelled Bookings', stats.cancelled],
      ['Pending Bookings', stats.pending],
      ['Total Revenue', `£${stats.revenue}`],
      [''],
      ['Service Performance'],
      ['Service', 'Bookings', 'Revenue'],
      ...serviceStats.map(stat => [
        stat.name,
        stat.bookings,
        `£${stat.revenue}`
      ]),
      [''],
      ['Location Performance'],
      ['Location', 'Bookings', 'Revenue'],
      ...locationStats.map(stat => [
        stat.name,
        stat.bookings,
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <Button onClick={exportReport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Bookings & Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#0088FE"
                      name="Bookings"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00C49F"
                      name="Revenue (£)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Peak Booking Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakTimes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Existing Service Distribution Chart */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Services Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bookings" fill="#0088FE" name="Bookings" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#00C49F" name="Revenue (£)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}