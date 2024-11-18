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
  { id: 'bedford', name: 'Bedford', slug: 'bedford-mk40', postcode: 'MK40 1UH' },
  { id: 'birmingham', name: 'Birmingham', slug: 'birmingham-b66', postcode: 'B66 4TB' },
  { id: 'bolton', name: 'Bolton', slug: 'bolton-bl6', postcode: 'BL6 4RQ' },
  { id: 'cambridge', name: 'Cambridge', slug: 'cambridge-cb1', postcode: 'CB1 9XQ' },
  { id: 'hertfordshire', name: 'Hertfordshire', slug: 'hertfordshire-sg5', postcode: 'SG5 1AR' },
  { id: 'newcastle', name: 'Newcastle Under Lyme', slug: 'newcastle-st5', postcode: 'ST5 2JG' },
  { id: 'peterborough', name: 'Peterborough', slug: 'peterborough-pe2', postcode: 'PE2 6XU' },
  { id: 'plymouth', name: 'Plymouth', slug: 'plymouth-pl9', postcode: 'PL9 9JB' },
  { id: 'southampton', name: 'Southampton', slug: 'southampton-so16', postcode: 'SO16 4NW' }
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