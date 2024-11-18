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

interface Location {
  id: string
  name: string
  slug: string
  postcode: string
  freezes: LocationFreeze[]
}

export default function ManagePage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isFullDay, setIsFullDay] = useState(true)
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [freezeReason, setFreezeReason] = useState('')
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

    const { data: freezesData, error: freezesError } = await supabase
      .from('location_freezes')
      .select('*')

    if (freezesError) {
      console.error('Error fetching freezes:', freezesError)
      return
    }

    console.log('Locations:', locationsData)
    console.log('Freezes:', freezesData)

    const locationsWithFreezes = locationsData?.map(location => ({
      ...location,
      freezes: freezesData?.filter(freeze => freeze.location_id === location.id) || []
    })) || []

    setLocations(locationsWithFreezes)
  }

  async function addLocationFreeze() {
    console.log('Selected Location:', selectedLocation)
    console.log('Selected Date:', selectedDate)
    console.log('Freeze Reason:', freezeReason)

    if (!selectedLocation || !selectedDate || !freezeReason) {
      console.log('Missing fields:', {
        location: !selectedLocation,
        date: !selectedDate,
        reason: !freezeReason
      })
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

      console.log('Attempting to add freeze:', freezeData)

      const { data, error } = await supabase
        .from('location_freezes')
        .insert([freezeData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Freeze added successfully:', data)

      // Reset form
      setSelectedDate(undefined)
      setFreezeReason('')
      setStartTime('')
      setEndTime('')
      
      toast({
        title: 'Success',
        description: `Location has been frozen for ${isFullDay ? 'the entire day' : 'the selected time period'}`,
      })

      // Refresh locations
      await fetchLocations()
    } catch (error: any) {
      console.error('Full error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to freeze location. Please try again.',
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
        <h1 className="text-3xl font-bold mb-8">Manage Location Availability</h1>
        
        <div className="grid gap-6">
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
                              <p className="text-sm text-red-500">Reason: {freeze.reason}</p>
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