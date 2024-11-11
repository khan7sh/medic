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
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
          <span>{service.title}</span>
        </CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {service.duration}
          </div>
          <div className="flex items-center font-medium text-foreground">
            <PoundSterling className="h-4 w-4 mr-1" />
            {service.price}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleBookClick}
        >
          Select Service
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
