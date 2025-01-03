import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Car, Truck, Bus, Forklift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

const services = [
  { 
    name: 'TFL/PCO & Taxi', 
    icon: Car, 
    image: 'https://images.unsplash.com/photo-1562619371-b67725b6fde2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    href: '/booking/services?type=taxi'
  },
  { 
    name: 'HGV/LGV & Lorry/Truck', 
    icon: Truck, 
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
    href: '/booking/services?type=hgv'
  },
  { 
    name: 'Bus/Minibus', 
    icon: Bus, 
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    href: '/booking/services?type=bus'
  },
  { 
    name: 'Forklift & Private Hire', 
    icon: Forklift, 
    image: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    href: '/booking/services?type=forklift'
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center gradient-text mb-16">Our Services</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.name} className="card-hover overflow-hidden bg-white flex flex-col">
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <service.icon className="h-6 w-6 text-primary" />
                  <span>{service.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive medical assessments for {service.name} drivers
                </p>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button asChild className="w-full">
                  <Link href={service.href}>Book Your Medical</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
