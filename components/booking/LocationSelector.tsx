'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Location {
  id: string
  name: string
  slug: string
  postcode: string
  isFrozen?: boolean
  freezeReason?: string
}

interface LocationSelectorProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocationsWithFreezes()
  }, [])

  async function fetchLocationsWithFreezes() {
    try {
      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*')

      if (locationsError) throw locationsError

      // Fetch today's freezes
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: freezesData, error: freezesError } = await supabase
        .from('location_freezes')
        .select('*')
        .eq('date', today)

      if (freezesError) throw freezesError

      // Combine locations with freeze data
      const locationsWithFreezes = locationsData.map(location => {
        const freeze = freezesData?.find(f => f.location_id === location.id)
        return {
          ...location,
          isFrozen: !!freeze,
          freezeReason: freeze?.reason
        }
      })

      setLocations(locationsWithFreezes)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span>Choose Location</span>
        </CardTitle>
        <CardDescription>Select your preferred assessment location</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem
                key={location.id}
                value={location.id}
                disabled={location.isFrozen}
                className="relative"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{location.name}</span>
                  {location.isFrozen && (
                    <div className="flex items-center text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Temporarily Unavailable</span>
                    </div>
                  )}
                </div>
                {location.isFrozen && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {location.freezeReason}
                  </p>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}