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

interface Service {
  id: string
  service_code: string
  title: string
  description: string | null
  price: number
  duration: string
  isAvailable: boolean
  created_at?: string | null
  updated_at?: string | null
}

interface Location {
  id: string
  name: string
  unavailable_dates: string[]
}

export default function ManagePage() {
  const [services, setServices] = useState<Service[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const { toast } = useToast()

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
    const { data, error } = await supabase
      .from('locations')
      .select('*')
    if (data) {
      setLocations(data)
    }
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

  async function updateLocationAvailability() {
    if (!selectedLocation || selectedDates.length === 0) return

    try {
      const formattedDates = selectedDates.map(date => format(date, 'yyyy-MM-dd'))
      
      const { error } = await supabase
        .from('location_availability')
        .upsert({
          location_id: selectedLocation,
          unavailable_dates: formattedDates
        })

      if (error) throw error

      toast({
        title: 'Availability Updated',
        description: 'Location availability has been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update location availability',
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

          {/* Location Availability Management */}
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

                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="rounded-md border"
                />

                <Button onClick={updateLocationAvailability}>
                  Update Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}