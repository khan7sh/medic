'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '../components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { TimePicker } from '@/components/ui/time-picker'
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

interface LocationFreeze {
  id: string
  location_id: string
  date: string
  start_time?: string
  end_time?: string
  is_full_day: boolean
  reason: string
}

interface Service {
  id: string
  title: string
  price: number
  duration: string
  isAvailable: boolean
}

interface Location {
  id: string
  name: string
  freezes: LocationFreeze[]
}

export default function ManagePage() {
  const [services, setServices] = useState<Service[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isFullDay, setIsFullDay] = useState(true)
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [freezeReason, setFreezeReason] = useState('')
  const { toast } = useToast()

  // Fetch services and locations with their freezes
  useEffect(() => {
    fetchServices()
    fetchLocations()
  }, [])

  async function fetchServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
    if (data) {
      setServices(data as Service[])
    }
  }

  async function fetchLocations() {
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('*')

    if (locationsError) {
      console.error('Error fetching locations:', locationsError)
      return
    }

    const { data: freezesData, error: freezesError } = await supabase
      .from('location_freezes')
      .select('*')

    if (freezesError) {
      console.error('Error fetching freezes:', freezesError)
      return
    }

    const locationsWithFreezes = locationsData.map(location => ({
      ...location,
      freezes: freezesData.filter(freeze => freeze.location_id === location.id)
    }))

    setLocations(locationsWithFreezes)
  }

  async function toggleServiceAvailability(serviceId: string, isAvailable: boolean) {
    try {
      const { error } = await supabase
        .from('services')
        .update({ isAvailable })
        .eq('id', serviceId)

      if (error) throw error

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, isAvailable } : service
      ))

      toast({
        title: 'Service Updated',
        description: `Service availability has been ${isAvailable ? 'enabled' : 'disabled'}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service availability',
        variant: 'destructive',
      })
    }
  }

  async function addLocationFreeze() {
    if (!selectedLocation || !selectedDate || !freezeReason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    try {
      const freezeData = {
        location_id: selectedLocation,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: isFullDay ? null : startTime,
        end_time: isFullDay ? null : endTime,
        is_full_day: isFullDay,
        reason: freezeReason
      }

      const { error } = await supabase
        .from('location_freezes')
        .insert([freezeData])

      if (error) throw error

      setFreezeReason('') // Reset reason
      toast({
        title: 'Location Frozen',
        description: `Location has been frozen for ${isFullDay ? 'the entire day' : 'the selected time period'}`,
      })

      fetchLocations()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to freeze location',
        variant: 'destructive',
      })
    }
  }

  async function removeLocationFreeze(freezeId: string) {
    try {
      const { error } = await supabase
        .from('location_freezes')
        .delete()
        .eq('id', freezeId)

      if (error) throw error

      toast({
        title: 'Freeze Removed',
        description: 'Location freeze has been removed',
      })

      // Refresh locations
      fetchLocations()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove freeze',
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Manage Services & Availability</h1>
        
        <div className="grid gap-6">
          {/* Services Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        £{service.price} - {service.duration}
                      </p>
                    </div>
                    <Switch
                      checked={service.isAvailable}
                      onCheckedChange={(checked) => toggleServiceAvailability(service.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Freeze Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Location Availability</CardTitle>
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
                  />

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isFullDay}
                      onCheckedChange={setIsFullDay}
                    />
                    <span>Freeze entire day</span>
                  </div>

                  {!isFullDay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <TimePicker value={startTime} onChange={setStartTime} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <TimePicker value={endTime} onChange={setEndTime} />
                      </div>
                    </div>
                  )}

                  <Input
                    placeholder="Reason for freezing (e.g., Bank Holiday, Staff Training)"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    className="w-full"
                  />

                  <Button onClick={addLocationFreeze}>
                    Freeze Location
                  </Button>
                </div>

                {/* Active Freezes */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Active Freezes</h3>
                  <div className="space-y-2">
                    {locations.map(location => (
                      <div key={location.id}>
                        {location.freezes.map(freeze => (
                          <div key={freeze.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(freeze.date), 'dd MMM yyyy')}
                                {freeze.is_full_day 
                                  ? ' - Full Day'
                                  : ` - ${freeze.start_time} to ${freeze.end_time}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Reason: {freeze.reason}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLocationFreeze(freeze.id)}
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