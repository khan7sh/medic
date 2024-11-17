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
import { toast } from '@/components/ui/use-toast'

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

  const serviceId = searchParams.get('service')
  const serviceTitle = searchParams.get('title')
  const servicePrice = searchParams.get('price')
  const location = searchParams.get('location')

  const handleBack = () => {
    router.push(`/booking/locations?service=${serviceId}&price=${servicePrice}&title=${serviceTitle}`)
  }

  const handleBooking = () => {
    if (date && timeSlot) {
      const formattedDate = format(date, 'dd MMMM yyyy')
      router.push(`/booking/details?service=${serviceId}&title=${encodeURIComponent(serviceTitle || '')}&price=${servicePrice}&location=${encodeURIComponent(location || '')}&date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(timeSlot)}`)
    }
  }

  async function checkLocationAvailability(date: Date, location: string) {
    const { data: freezes, error } = await supabase
      .from('location_freezes')
      .select('*')
      .eq('location_id', location)
      .eq('date', format(date, 'yyyy-MM-dd'))
      .single()

    if (freezes) {
      setFrozenInfo(freezes)
      toast({
        title: 'Location Unavailable',
        description: `This location is unavailable: ${freezes.reason}`,
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  const handleDateSelect = async (date: Date) => {
    const isAvailable = await checkLocationAvailability(date, location)
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
              <span>{decodeURIComponent(location || '')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
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

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="px-8 py-6 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Location
        </Button>
        <Button
          size="lg"
          onClick={handleBooking}
          disabled={!date || !timeSlot}
          className="px-8 py-6 text-lg"
        >
          Confirm Booking
          <Clock className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </BookingLayout>
  )
} 