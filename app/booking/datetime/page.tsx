'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CalendarIcon, Clock, MapPin, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import BookingLayout from '@/components/booking/bookingLayout'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

const timeSlots = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45',
  '17:00'
]

const SLOTS_PER_PAGE = 8; // Show 8 slots at a time (4 rows of 2)

export default function DateTimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0);

  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const locationId = searchParams.get('location')
  const locationName = searchParams.get('locationName')

  useEffect(() => {
    if (date && locationId && locationName) {
      console.log('Fetching slots for location:', locationName)
      fetchAvailableSlots(date, locationId)
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('booking-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `location=eq.${locationName}`
          },
          () => {
            fetchAvailableSlots(date, locationId)
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [date, locationId, locationName])

  async function fetchAvailableSlots(selectedDate: Date, locationId: string) {
    setIsLoadingSlots(true)
    try {
      // Format the date consistently for comparison
      const formattedDate = format(selectedDate, 'dd MMMM yyyy')
      const dbFormattedDate = format(selectedDate, 'yyyy-MM-dd')

      // Fetch existing bookings for the selected date and location
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('time')
        .eq('location', locationName)
        .eq('date', formattedDate)
        .in('status', ['pending', 'confirmed'])

      if (bookingsError) throw bookingsError

      // Fetch unavailable slots for the selected date and location
      const { data: unavailableData, error: unavailableError } = await supabase
        .from('location_unavailable')
        .select('*')
        .eq('location_id', locationId)
        .eq('date', dbFormattedDate)

      if (unavailableError) throw unavailableError

      // Create a Set of booked times for O(1) lookup
      const bookedTimes = new Set(bookings?.map(b => b.time))

      // Get all unavailable times from the unavailable slots
      const unavailableTimes = new Set<string>()
      unavailableData?.forEach(slot => {
        if (slot.is_full_day) {
          // If full day is unavailable, add all time slots
          timeSlots.forEach(time => unavailableTimes.add(time))
        } else {
          // Add specific unavailable time slots
          slot.time_slots.forEach(time => unavailableTimes.add(time))
        }
      })

      // Filter available slots (not booked AND not unavailable)
      const available = timeSlots.filter(slot => 
        !bookedTimes.has(slot) && !unavailableTimes.has(slot)
      )
      
      // Sort by time
      const sortedAvailable = available.sort((a, b) => {
        const timeA = new Date(`1970/01/01 ${a}`)
        const timeB = new Date(`1970/01/01 ${b}`)
        return timeA.getTime() - timeB.getTime()
      })

      setAvailableSlots(sortedAvailable)
      setCurrentPage(0)
    } catch (error) {
      console.error('Error fetching availability:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch available time slots',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleDateSelect = async (selectedDate: Date) => {
    if (selectedDate < new Date()) return
    setDate(selectedDate)
    setTimeSlot('')
  }

  const handleBack = () => {
    router.push(`/booking/locations?service=${serviceId}&title=${encodeURIComponent(serviceTitle || '')}&price=${servicePrice}&location=${locationId}&locationName=${encodeURIComponent(locationName || '')}`)
  }

  async function handleBooking() {
    if (!date || !timeSlot || !serviceId || !locationId) {
      toast({
        title: 'Error',
        description: 'Please select both date and time',
        variant: 'destructive',
      })
      return
    }

    try {
      // Navigate to the details page with all necessary parameters
      router.push(
        `/booking/details?` + 
        `service=${serviceId}` +
        `&title=${encodeURIComponent(serviceTitle || '')}` +
        `&price=${servicePrice}` +
        `&location=${locationId}` +
        `&locationName=${encodeURIComponent(locationName || '')}` +
        `&date=${format(date, 'dd MMMM yyyy')}` +
        `&time=${timeSlot}`
      )
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: 'Booking Failed',
        description: 'Failed to create new booking. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Calculate total pages and current page slots
  const totalPages = Math.ceil(availableSlots.length / SLOTS_PER_PAGE);
  const currentSlots = availableSlots.slice(
    currentPage * SLOTS_PER_PAGE,
    (currentPage + 1) * SLOTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(curr => curr - 1);
    }
  };

  return (
    <BookingLayout
      currentStep={3}
      title="Book Your Appointment"
      description="Choose your preferred date and time"
    >
      {/* Booking Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
          <CardDescription>Review your selection before booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">{decodeURIComponent(serviceTitle || '')}</span>
              <span className="ml-auto font-semibold">£{servicePrice}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span>{decodeURIComponent(locationName || '')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border w-full max-w-[350px] mx-auto"
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Select Time</CardTitle>
            <CardDescription>
              Available 15-minute slots for {date ? format(date, 'dd MMMM yyyy') : 'selected date'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSlots ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : !date ? (
              <p className="text-center text-muted-foreground">
                Please select a date first
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No available slots for this date
              </p>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-2 gap-2">
                  {currentSlots.map((time) => (
                    <Button
                      key={time}
                      variant={timeSlot === time ? "default" : "outline"}
                      className="w-full py-6 text-sm sm:text-base"
                      onClick={() => setTimeSlot(time)}
                    >
                      {time} - {time === '17:00' ? '17:15' : timeSlots[timeSlots.indexOf(time) + 1]}
                    </Button>
                  ))}
                </div>
                
                {/* Navigation arrows */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="h-8 w-8"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Back to Location
        </Button>
        <Button
          size="lg"
          onClick={handleBooking}
          disabled={!date || !timeSlot}
          className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
        >
          Confirm Booking
          <Clock className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </BookingLayout>
  )
} 