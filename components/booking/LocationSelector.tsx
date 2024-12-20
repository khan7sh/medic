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
import { MapPin, AlertCircle, Loader2 } from 'lucide-react'
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
  onLocationChange: (locationId: string, locationName: string) => void
}

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocationsWithFreezes()
  }, [])

  async function fetchLocationsWithFreezes() {
    try {
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*')
        .order('name')

      if (locationsError) throw locationsError

      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: freezesData, error: freezesError } = await supabase
        .from('location_freezes')
        .select('*')
        .eq('date', today)

      if (freezesError) throw freezesError

      const locationsWithFreezes = locationsData.map(location => ({
        ...location,
        isFrozen: freezesData?.some(f => f.location_id === location.id),
        freezeReason: freezesData?.find(f => f.location_id === location.id)?.reason
      }))

      console.log('Fetched locations:', locationsWithFreezes)
      setLocations(locationsWithFreezes)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLoading(false)
    }
  }

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId)
    if (location) {
      onLocationChange(locationId, `${location.name} (${location.postcode})`)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
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
        <Select value={selectedLocation} onValueChange={handleLocationSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem
                key={location.id}
                value={location.id}
                disabled={location.isFrozen}
              >
                {location.name} ({location.postcode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}