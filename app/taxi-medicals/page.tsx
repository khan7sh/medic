'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Download, Calendar, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

const councilsRequiringSummary = [
  'Cambridge City', 'Cambridge South', 'Knowsley Council', 'Liverpool Council',
  'Manchester City Council', 'Newcastle Under Lyme', 'Oldham City Council',
  'Preston City Council', 'Rochdale City Council', 'Salford City Council',
  'Sefton Council', 'Shropshire Council', 'South Ribble Council', "St Helen's Council",
  'Stoke On Trent', 'Tameside Council', 'Telford & Wrekin Council',
  'Trafford Council', 'Warrington Borough Council', 'Wirral Council'
]

const councilsNotRequiringSummary = [
  'Blackpool Council', 'Dudley Council', 'High Peak Council',
  'Nuneaton & Bedworth Council', 'Solihull Metropolitan Council'
]

export default function TaxiMedicals() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-primary/5 to-background py-24">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1562619371-b67725b6fde2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Taxi background"
              layout="fill"
              objectFit="cover"
              className="opacity-5"
            />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-extrabold gradient-text mb-6"> 
                Taxi Medical Assessments
              </h1>
              <p className="text-2xl text-muted-foreground mb-8">
                Complete your taxi medical assessment with our DVLA-approved doctors. Fast, reliable, and affordable service nationwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="shadow-lg shadow-primary/25">
                  <Link href="/booking/services?service=taxi" className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Medical
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://assets.publishing.service.gov.uk/media/5e5e8d5be90e070ac5e0fb7f/d4_medical_examination_report.pdf" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download D4 Form
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Council Approved</h3>
              <p className="text-muted-foreground">Approved by multiple councils across the UK for taxi medical assessments.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">DVLA Compliant</h3>
              <p className="text-muted-foreground">All examinations follow the latest DVLA Medical D4 form requirements.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Nationwide Coverage</h3>
              <p className="text-muted-foreground">Convenient locations across the UK with the most competitive pricing.</p>
            </div>
          </div>

          {/* Council Requirements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Council Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Requires GP Summary</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {councilsRequiringSummary.map((council) => (
                    <div key={council} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary/60" />
                      <span className="text-muted-foreground">{council}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <CheckCircle className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">No GP Summary Required</h3>
                </div>
                <div className="space-y-3">
                  {councilsNotRequiringSummary.map((council) => (
                    <div key={council} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary/60" />
                      <span className="text-muted-foreground">{council}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-gradient-to-br from-primary/5 to-background rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Important Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>• If your council is not listed above, please contact us or check with your council directly.</p>
              <p>• Some councils require full Medical Records or a medical summary to be reviewed by the doctor signing your D4 form.</p>
              <p>• Please contact us prior to booking your taxi medical if you're unsure about your council's requirements.</p>
              <p>• For specific questions, please check our FAQ section or contact us using the chat feature.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}