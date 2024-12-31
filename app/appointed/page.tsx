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
  Mail, 
  Phone, 
  Check, 
  X, 
  CheckCircle, 
  Users, 
  Clock, 
  Calendar,
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  FileDown
} from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface Booking {
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
  payment_status: 'pending' | 'paid' | 'failed'
  price: number
  created_at: string
  updated_at: string | null
  date_of_birth: string
  employer: string | null
  hear_about_us: string
  license: string | null
  payment_intent_id: string | null
}

interface FilterState {
  status: string
  paymentStatus: string
  location: string
  search: string
  dateRange: DateRange | undefined
}

const initialFilters: FilterState = {
  status: 'all',
  paymentStatus: 'all',
  location: 'all',
  search: '',
  dateRange: {
    from: new Date(),
    to: new Date()
  }
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800'
}

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [locations, setLocations] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchLocations()
  }, [filters, sortConfig])

  async function fetchLocations() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('location')
        .not('location', 'is', null)
        .order('location')

      if (error) throw error

      const uniqueLocations = Array.from(new Set(data.map(item => item.location)))
      setLocations(uniqueLocations)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  async function fetchBookings() {
    setLoading(true)
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status as Booking['status'])
      }
      
      if (filters.paymentStatus !== 'all') {
        query = query.eq('payment_status', filters.paymentStatus as Booking['payment_status'])
      }

      if (filters.location !== 'all') {
        query = query.eq('location', filters.location)
      }

      if (filters.dateRange?.from && filters.dateRange?.to) {
        const fromDate = format(filters.dateRange.from, 'yyyy-MM-dd')
        const toDate = format(filters.dateRange.to, 'yyyy-MM-dd')
        query = query
          .gte('date', fromDate)
          .lte('date', toDate)
      }

      const { data, error } = await query

      if (error) throw error

      const transformedData = (data || []).map(item => ({
        ...item,
        status: item.status || 'pending',
        payment_status: item.payment_status || 'pending',
        price: typeof item.price === 'number' ? item.price : 0
      })) as Booking[]

      let filteredData = transformedData

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredData = filteredData.filter(booking =>
          `${booking.first_name} ${booking.last_name} ${booking.email} ${booking.service_title}`
            .toLowerCase()
            .includes(searchTerm)
        )
      }

      setBookings(filteredData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(bookingId: string, newStatus: Booking['status']) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Booking status updated successfully',
      })

      fetchBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      })
    }
  }

  function handleSort(key: string) {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  function exportBookings() {
    const csvData = [
      ['Booking ID', 'Service', 'Customer Name', 'Email', 'Phone', 'Location', 'Date', 'Time', 'Status', 'Payment Status', 'Price'],
      ...bookings.map(booking => [
        booking.id,
        booking.service_title,
        `${booking.first_name} ${booking.last_name}`,
        booking.email,
        booking.phone,
        booking.location,
        booking.date,
        booking.time,
        booking.status,
        booking.payment_status,
        `£${booking.price}`
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Bookings Dashboard</h1>
          <Button onClick={exportBookings}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Bookings
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker
                  value={filters.dateRange || { from: undefined, to: undefined }}
                  onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range || undefined }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('service_title')}>
                      Service
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('first_name')}>
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                      Date & Time
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{booking.service_title}</TableCell>
                      <TableCell>
                        <div>
                          {booking.first_name} {booking.last_name}
                          <div className="text-sm text-muted-foreground">
                            {booking.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {format(new Date(booking.date), 'MMM dd, yyyy')}
                          <div className="text-sm text-muted-foreground">
                            {booking.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[booking.payment_status]}>
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setIsDetailsOpen(true)
                                  }}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStatusChange(booking.id, 'completed')}
                                  disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Completed</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                  disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Cancel Booking</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Service</label>
                    <p className="text-sm">{selectedBooking.service_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Price</label>
                    <p className="text-sm">£{selectedBooking.price}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer</label>
                    <p className="text-sm">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm">{selectedBooking.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="text-sm">{format(new Date(selectedBooking.date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Time</label>
                    <p className="text-sm">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={statusColors[selectedBooking.status]}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment</label>
                    <Badge className={paymentStatusColors[selectedBooking.payment_status]}>
                      {selectedBooking.payment_status}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedBooking.email}`}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Customer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}