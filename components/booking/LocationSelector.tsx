'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

const locations = [
  { id: '1', name: 'Bedford', slug: 'bedford-mk40', postcode: 'MK40 1UH' },
  { id: '2', name: 'Birmingham', slug: 'birmingham-b66', postcode: 'B66 4TB' },
  { id: '3', name: 'Bolton', slug: 'bolton-bl6', postcode: 'BL6 4RQ' },
  { id: '4', name: 'Cambridge', slug: 'cambridge-cb1', postcode: 'CB1 9XQ' },
  { id: '5', name: 'Hertfordshire', slug: 'hertfordshire-sg5', postcode: 'SG5 1AR' },
  { id: '6', name: 'Newcastle Under Lyme', slug: 'newcastle-st5', postcode: 'ST5 2JG' },
  { id: '7', name: 'Peterborough', slug: 'peterborough-pe2', postcode: 'PE2 6XU' },
  { id: '8', name: 'Plymouth', slug: 'plymouth-pl9', postcode: 'PL9 9JB' },
  { id: '9', name: 'Southampton', slug: 'southampton-so16', postcode: 'SO16 4NW' }
]

interface LocationSelectorProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
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
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}