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
    href: '/booking/services?type=taxi',
    description: 'Complete medical assessments for taxi and private hire drivers'
  },
  { 
    name: 'HGV/LGV & Lorry/Truck', 
    icon: Truck, 
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
    href: '/booking/services?type=hgv',
    description: 'Medical examinations for heavy goods vehicle operators'
  },
  { 
    name: 'Bus/Minibus', 
    icon: Bus, 
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    href: '/booking/services?type=bus',
    description: 'Medical certifications for bus and minibus drivers'
  },
  { 
    name: 'Forklift & Private Hire', 
    icon: Forklift, 
    image: 'https://images.unsplash.com/photo-1580901368919-7738efb0f87e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    href: '/booking/services?type=forklift',
    description: 'Medical assessments for forklift operators and private hire drivers'
  },
]

export default function Services() {
  return (
    <section id="services" className="py-12 sm:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              Our Services
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Professional medical assessments for all types of drivers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <Card 
              key={service.name} 
              className="group card-hover overflow-hidden bg-white dark:bg-gray-800 flex flex-col transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <span>{service.name}</span>
                  </h3>
                </div>
              </div>

              <CardContent className="flex-grow p-4 sm:p-6">
                <p className="text-sm sm:text-base text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>

              <CardFooter className="p-4 sm:p-6 pt-0 sm:pt-0">
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                >
                  <Link href={service.href} className="text-sm sm:text-base">
                    Book Your Medical
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
