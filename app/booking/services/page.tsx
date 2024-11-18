'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Car,
  Truck,
  Bus,
  Ambulance,
  Forklift,
  Home as HomeIcon,
  Plane,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocationSelector from '@/components/booking/LocationSelector'
import ServiceCard from '@/components/booking/ServiceCard'
import { Button } from '@/components/ui/button'
import ProgressSteps from '@/components/booking/ProgressSteps'
import BookingLayout from '@/components/booking/bookingLayout'

const services = [
  {
    id: 'hgv',
    title: 'HGV/LGV Medical',
    description: 'Your full HGV/LGV Medical including Eye Test',
    icon: Truck,
    duration: '15 min',
    price: 50
  },
  {
    id: 'taxi',
    title: 'Taxi/Private Hire & PCO & TPH/204',
    description: 'Your full Taxi D4 Medical Assessment & Eye Test',
    icon: Car,
    duration: '15 min',
    price: 50
  },
  {
    id: 'bus',
    title: 'Bus/PCV Driver Medical',
    description: 'Your full Bus/PCV Medical including Eye Test',
    icon: Bus,
    duration: '15 min',
    price: 50
  },
  {
    id: 'ambulance',
    title: 'Ambulance Driver Medical',
    description: 'Your full Ambulance Medical including Eye Test',
    icon: Ambulance,
    duration: '15 min',
    price: 50
  },
  {
    id: 'forklift',
    title: 'Fork Lift Driver Medical',
    description: 'Your full FLT Medical including Eye Test',
    icon: Forklift,
    duration: '15 min',
    price: 50
  },
  {
    id: 'motorhome',
    title: 'Motorhome Medical',
    description: 'Your full Motorhome Medical including Eye Test',
    icon: HomeIcon,
    duration: '15 min',
    price: 50
  },
  {
    id: 'airside',
    title: 'Airside Medical',
    description: 'AIRSIDE DRIVER MEDICAL ASSESSMENTS',
    icon: Plane,
    duration: '30 min',
    price: 120
  },
  {
    id: 'jockey',
    title: 'Jockey Medicals',
    description: 'Complete medical assessment for jockeys',
    icon: HomeIcon,
    duration: '1 hr',
    price: 150
  },
  {
    id: 'racing',
    title: 'National Motor/Bike Racing Medical',
    description: 'Your full motor/bike racing Medical including Eye test',
    icon: HomeIcon,
    duration: '15 min',
    price: 80
  },
  {
    id: 'home',
    title: 'Medical in your home',
    description: 'Driver Medical for Group 2 Drivers. Doctor will be doing house visit.',
    icon: HomeIcon,
    duration: '15 min',
    price: 165
  }
]

export default function ServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '')

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    const selectedServiceDetails = services.find(s => s.id === serviceId)
    router.push(`/booking/locations?service=${serviceId}&price=${selectedServiceDetails?.price}&title=${encodeURIComponent(selectedServiceDetails?.title || '')}`)
  }

  return (
    <BookingLayout
      currentStep={1}
      title="Select Your Service"
      description="Choose the type of medical assessment you need"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedService === service.id}
            isLocationSelected={true}
            onSelect={() => handleServiceSelect(service.id)}
            onBook={() => handleServiceSelect(service.id)}
          />
        ))}
      </div>
    </BookingLayout>
  )
}