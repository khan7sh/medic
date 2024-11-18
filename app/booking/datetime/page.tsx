'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CalendarIcon, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ProgressSteps from '@/components/booking/ProgressSteps'
import BookingLayout from '@/components/booking/bookingLayout'
import { LocationFreeze } from '@/types'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
]

export default function DateTimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState('')
  const [frozenInfo, setFrozenInfo] = useState<LocationFreeze | null>(null)
  const { toast } = useToast()

  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const locationId = searchParams.get('location')
  const locationName = searchParams.get('locationName')

  const handleBack = () => {
    router.push(`/booking/locations?service=${serviceId}&price=${servicePrice}&title=${serviceTitle}`)
  }

  const handleBooking = () => {
    if (date && timeSlot) {
      const formattedDate = format(date, 'dd MMMM yyyy')
      router.push(`/booking/details?service=${serviceId}&title=${encodeURIComponent(serviceTitle || '')}&price=${servicePrice}&location=${locationId}&locationName=${encodeURIComponent(locationName || '')}&date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(timeSlot)}`)
    }
  }

  async function checkLocationAvailability(date: Date, locationId: string) {
    const { data: freezes, error } = await supabase
      .from('location_freezes')
      .select('*')
      .eq('location_id', locationId)
      .eq('date', format(date, 'yyyy-MM-dd'))

    if (error) {
      console.error('Error checking freezes:', error)
      return true
    }

    if (freezes && freezes.length > 0) {
      const freeze = freezes[0]
      toast({
        title: 'Location Unavailable',
        description: `This location is unavailable: ${freeze.reason}`,
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleDateSelect = async (date: Date) => {
    const locationId = searchParams.get('location')
    if (!locationId) return

    const isAvailable = await checkLocationAvailability(date, locationId)
    if (isAvailable) {
      setDate(date)
    }
  }

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
          </CardHeader>
          <CardContent>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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