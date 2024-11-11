import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Users, Clock, Shield, MapPin, Phone, Calendar } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const values = [
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'All our medical assessments are conducted by GMC-registered doctors following DVLA guidelines.'
  },
  {
    icon: Clock,
    title: 'Efficiency',
    description: 'Quick turnaround times with same-day results for most assessments.'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Dedicated to providing excellent service and support throughout your assessment.'
  },
  {
    icon: Award,
    title: 'Expertise',
    description: 'Years of experience in conducting driver medical assessments across the UK.'
  }
]

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative hero-gradient py-24">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Medical team"
              layout="fill"
              objectFit="cover"
              className="opacity-5"
            />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-extrabold gradient-text mb-6">
                About MedicalD4
              </h1>
              <p className="text-2xl text-muted-foreground">
                Your trusted partner for professional driver medical assessments across the UK.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-extrabold gradient-text mb-8">Our Story</h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Founded with a vision to make driver medical assessments more accessible and affordable, MedicalD4 has grown to become one of the UK's leading providers of medical assessment services.
                  </p>
                  <p>
                    We understand the vital role that professional drivers play in keeping our economy moving, and we're committed to providing efficient, high-quality medical assessments that meet all regulatory requirements.
                  </p>
                  <p>
                    Our network of GMC-registered doctors and state-of-the-art facilities ensures that every driver receives the highest standard of medical assessment, with the convenience and affordability they deserve.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Medical consultation"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center gradient-text mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="card-hover bg-white">
                  <CardContent className="pt-6">
                    <value.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold gradient-text mb-8">Get in Touch</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Have questions about our services? Our team is here to help you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-xl shadow-lg">
                  <Phone className="h-6 w-6 text-primary" />
                  <span className="text-lg">020 1234 5678</span>
                </div>
                <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-xl shadow-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span className="text-lg">Locations Nationwide</span>
                </div>
              </div>
              <Button asChild size="lg" className="shadow-lg shadow-primary/25">
                <Link href="/booking/services" className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Assessment
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}