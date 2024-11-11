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
  { id: 'bedford', name: 'Bedford MK40 1UH' },
  { id: 'birmingham', name: 'Birmingham, B66 4TB' },
  { id: 'bolton', name: 'Bolton, BL6 4RQ' },
  { id: 'cambridge', name: 'Cambridge CB1 9XQ' },
  { id: 'hertfordshire', name: 'Hertfordshire, SG5 1AR' },
  { id: 'newcastle', name: 'Newcastle Under Lyme ST5 2JG' },
  { id: 'peterborough', name: 'Peterborough, PE2 6XU' },
  { id: 'plymouth', name: 'Plymouth PL99JB' },
  { id: 'southampton', name: 'Southampton SO16 4NW' },
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