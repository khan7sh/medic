'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from './components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Download, 
  Mail, 
  Phone, 
  Check, 
  X, 
  CheckCircle, 
  Users, 
  Clock, 
  Calendar,
  Loader2 
} from 'lucide-react'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BookingData {
  id: string
  service_title: string
  location: string
  date: string
  time: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string | null
}

const ITEMS_PER_PAGE = 10

export default function AppointedPage() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [page, statusFilter])

  async function fetchBookings() {
    try {
      setIsLoading(true)
      
      // First, get the count of all bookings
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      if (count !== null) {
        setTotalCount(count)
      }

      // Then fetch the paginated data
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
      
      if (error) throw error

      if (data) {
        setBookings(data as BookingData[])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateBookingStatus(bookingId: string, newStatus: BookingData['status']) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error

      if (!data) {
        throw new Error('No data returned from update')
      }

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))

      // Show success toast
      toast({
        title: 'Status Updated',
        description: `Booking has been marked as ${newStatus}`,
      })

    } catch (error) {
      console.error('Error updating booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to update booking status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleExport = () => {
    try {
      const csvContent = [
        // CSV Headers
        ['Date', 'Time', 'Name', 'Email', 'Phone', 'Service', 'Location', 'Status'],
        // CSV Data
        ...filteredBookings.map(booking => [
          booking.date,
          booking.time,
          `${booking.first_name} ${booking.last_name}`,
          booking.email,
          booking.phone,
          booking.service_title,
          booking.location,
          booking.status
        ])
      ]
      .map(row => row.join(','))
      .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Export Successful',
        description: 'Bookings data has been exported to CSV',
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'Failed to export bookings data',
        variant: 'destructive',
      })
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const searchString = `${booking.first_name} ${booking.last_name} ${booking.email} ${booking.service_title}`.toLowerCase()
    const matchesSearch = searchTerm === '' || searchString.includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bookings Dashboard</h1>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredBookings.length}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredBookings.filter(b => b.date === format(new Date(), 'dd MMMM yyyy')).length}
              </div>
              <p className="text-xs text-muted-foreground">Appointments today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredBookings.filter(b => b.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Bookings</CardTitle>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bookings found
              </div>
            ) : (
              <>
                <ScrollArea className="w-full overflow-auto border rounded-md">
                  <div className="min-w-[800px]">
                    <table className="w-full border-collapse">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date & Time</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Customer</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Service</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Location</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr 
                            key={booking.id} 
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              {booking.date} {booking.time}
                            </td>
                            <td className="px-6 py-4">
                              <div>{booking.first_name} {booking.last_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.email}</div>
                            </td>
                            <td className="px-6 py-4">{booking.service_title}</td>
                            <td className="px-6 py-4">{booking.location}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
                                ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                                ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
                              `}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-2
                                  ${booking.status === 'confirmed' ? 'bg-green-600' : ''}
                                  ${booking.status === 'pending' ? 'bg-yellow-600' : ''}
                                  ${booking.status === 'cancelled' ? 'bg-red-600' : ''}
                                  ${booking.status === 'completed' ? 'bg-blue-600' : ''}
                                `} />
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => window.location.href = `mailto:${booking.email}`}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => window.location.href = `tel:${booking.phone}`}
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  {booking.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Confirm
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="w-full sm:w-auto"
                                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
                
                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {page * ITEMS_PER_PAGE + 1} to {Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} of {totalCount} bookings
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * ITEMS_PER_PAGE >= totalCount}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}