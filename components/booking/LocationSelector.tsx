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
  { id: 'bedford', name: 'Bedford MK40 1UH', slug: 'bedford-mk40' },
  { id: 'birmingham', name: 'Birmingham, B66 4TB', slug: 'birmingham-b66' },
  { id: 'bolton', name: 'Bolton, BL6 4RQ', slug: 'bolton-bl6' },
  { id: 'cambridge', name: 'Cambridge CB1 9XQ', slug: 'cambridge-cb1' },
  { id: 'hertfordshire', name: 'Hertfordshire, SG5 1AR', slug: 'hertfordshire-sg5' },
  { id: 'newcastle', name: 'Newcastle Under Lyme ST5 2JG', slug: 'newcastle-st5' },
  { id: 'peterborough', name: 'Peterborough, PE2 6XU', slug: 'peterborough-pe2' },
  { id: 'plymouth', name: 'Plymouth PL99JB', slug: 'plymouth-pl9' },
  { id: 'southampton', name: 'Southampton SO16 4NW', slug: 'southampton-so16' },
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