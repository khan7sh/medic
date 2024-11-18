'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clock, PoundSterling, ArrowRight } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    icon: LucideIcon | string
    duration: string
    price: number
  }
  isSelected: boolean
  onSelect: () => void
  onBook: () => void
}

export default function ServiceCard({ 
  service, 
  isSelected, 
  onSelect, 
  onBook 
}: ServiceCardProps) {
  const IconComponent = service.icon as LucideIcon

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onSelect()
  }

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBook()
  }

  return (
    <div className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
      isSelected ? 'border-primary' : 'border-border'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">{service.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <span className="text-sm text-muted-foreground">Duration: {service.duration}</span>
            <span className="text-lg font-semibold text-primary">£{service.price}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleBookClick}
          className="w-full sm:w-auto mt-4 sm:mt-0"
        >
          Book Now
        </Button>
      </div>
    </div>
  )
}
