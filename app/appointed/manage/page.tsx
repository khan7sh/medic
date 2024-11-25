'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '../components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Clock, Calendar as CalendarIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface UnavailableSlot {
  id: string
  location_id: string
  date: string
  time_slots: string[]
  is_full_day: boolean
  reason: string
}

interface Location {
  id: string
  name: string
  slug: string
  postcode: string
  unavailable_slots: UnavailableSlot[]
}

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

export default function ManagePage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isFullDay, setIsFullDay] = useState(false)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchLocations()
  }, [])

  async function fetchLocations() {
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('id, name, slug, postcode')

    if (locationsError) {
      console.error('Error fetching locations:', locationsError)
      return
    }

    const { data: unavailableData, error: unavailableError } = await supabase
      .from('location_unavailable')
      .select('*')

    if (unavailableError) {
      console.error('Error fetching unavailable slots:', unavailableError)
      return
    }

    const locationsWithSlots = locationsData?.map(location => ({
      ...location,
      unavailable_slots: unavailableData?.filter(slot => slot.location_id === location.id) || []
    })) || []

    setLocations(locationsWithSlots)
  }

  async function markUnavailable() {
    if (!selectedLocation || !selectedDate || !reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    if (!isFullDay && selectedTimeSlots.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one time slot',
        variant: 'destructive',
      })
      return
    }

    try {
      const unavailableData = {
        location_id: selectedLocation,
        date: format(selectedDate, 'yyyy-MM-dd'),
        is_full_day: isFullDay,
        time_slots: isFullDay ? timeSlots : selectedTimeSlots,
        reason: reason
      }

      const { error } = await supabase
        .from('location_unavailable')
        .insert([unavailableData])

      if (error) throw error

      // Reset form
      setSelectedDate(undefined)
      setReason('')
      setSelectedTimeSlots([])
      setIsFullDay(false)
      
      toast({
        title: 'Success',
        description: `Time slots marked as unavailable`,
      })

      await fetchLocations()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update availability',
        variant: 'destructive',
      })
    }
  }

  async function removeUnavailability(slotId: string) {
    try {
      const { error } = await supabase
        .from('location_unavailable')
        .delete()
        .eq('id', slotId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Availability restored',
      })

      fetchLocations()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore availability',
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Manage Location Availability</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Unavailable Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isFullDay}
                      onCheckedChange={setIsFullDay}
                    />
                    <span>Mark entire day as unavailable</span>
                  </div>

                  {!isFullDay && (
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTimeSlots.includes(slot) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedTimeSlots(prev =>
                              prev.includes(slot)
                                ? prev.filter(s => s !== slot)
                                : [...prev, slot]
                            )
                          }}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}

                  <Input
                    placeholder="Reason (e.g., Staff Meeting, Training)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full"
                  />

                  <Button onClick={markUnavailable}>
                    Mark as Unavailable
                  </Button>
                </div>

                {/* Current Unavailable Slots */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Currently Unavailable Slots</h3>
                  <div className="space-y-2">
                    {locations.map(location => (
                      <div key={location.id}>
                        {location.unavailable_slots.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(slot.date), 'dd MMM yyyy')}
                                {slot.is_full_day 
                                  ? ' - Full Day'
                                  : ` - ${slot.time_slots.join(', ')}`}
                              </p>
                              <p className="text-sm text-red-500">Reason: {slot.reason}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUnavailability(slot.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}