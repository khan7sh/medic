import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Building2, Bus, GraduationCap } from 'lucide-react'

const services = [
  { name: 'Training Centres', icon: GraduationCap, description: 'Comprehensive medical assessments for driver training centres.' },
  { name: 'Haulage Companies', icon: Building2, description: 'Efficient medical services for haulage company drivers.' },
  { name: 'Bus Companies', icon: Bus, description: 'Specialized medical assessments for bus and coach drivers.' },
]

export default function BusinessServices() {
  return (
    <section id="business" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-foreground mb-8">Business Services</h2>
        <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">Medical provider for training centres and haulage/bus companies</p>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.name} className="bg-background hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <service.icon className="h-8 w-8 text-primary" />
                  <span>{service.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}