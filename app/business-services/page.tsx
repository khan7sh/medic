import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, Users, Clock, CheckCircle, FileCheck, Briefcase } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const benefits = [
  { 
    icon: Users,
    title: 'Dedicated Account Manager',
    description: 'Personal support for your business needs'
  },
  {
    icon: Clock,
    title: 'Priority Scheduling',
    description: 'Fast-track appointments for your drivers'
  },
  {
    icon: FileCheck,
    title: 'Bulk Booking Discounts',
    description: 'Special rates for multiple assessments'
  }
]

const services = [
  {
    title: 'Training Centres',
    description: 'Comprehensive medical assessment services for driver training facilities.',
    features: [
      'Quick turnaround for trainee drivers',
      'Flexible scheduling options',
      'Dedicated support for training programs',
      'Competitive group rates'
    ],
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    title: 'Haulage Companies',
    description: 'Streamlined medical services for fleet operators and logistics companies.',
    features: [
      'Fleet driver assessment programs',
      'Mobile medical units available',
      'Digital record management',
      'Priority booking system'
    ],
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    title: 'Bus Companies',
    description: 'Specialized medical assessments for bus and coach operators.',
    features: [
      'PSV-specific assessments',
      'Group booking coordination',
      'Flexible payment options',
      'Regular renewal reminders'
    ],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
]

export default function BusinessServices() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative hero-gradient py-24">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Business meeting"
              layout="fill"
              objectFit="cover"
              className="opacity-5"
            />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-extrabold gradient-text mb-6">
                Business Services
              </h1>
              <p className="text-2xl text-muted-foreground mb-8">
                Comprehensive medical assessment solutions for training centres, haulage companies, and transport operators.
              </p>
              <Button asChild size="lg" className="shadow-lg shadow-primary/25">
                <Link href="#contact" className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Contact Our Business Team
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center gradient-text mb-16">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="card-hover bg-white">
                  <CardContent className="pt-6">
                    <benefit.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center text-foreground mb-16">Our Business Solutions</h2>
            <div className="space-y-24">
              {services.map((service, index) => (
                <div key={service.title} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="lg:w-1/2">
                    <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold gradient-text mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our business team today to discuss your company's medical assessment needs and discover our tailored solutions.
            </p>
            <Button asChild size="lg" className="shadow-lg shadow-primary/25">
              <Link href="#contact" className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Schedule a Consultation
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}