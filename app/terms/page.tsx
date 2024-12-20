'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ScrollText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <ScrollText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Terms and Conditions</h1>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              These terms and conditions outline the rules and regulations for the use of MedicalD4's services.
            </p>

            <div className="space-y-8 sm:space-y-12">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using our services, you accept and agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, you must not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">2. Medical Assessment Services</h2>
                <p className="text-muted-foreground">
                  2.1. All medical assessments are conducted by GMC-registered doctors.<br />
                  2.2. The results of medical assessments are based on professional medical opinion.<br />
                  2.3. We cannot guarantee the outcome of any medical assessment.<br />
                  2.4. All required documentation must be provided at the time of assessment.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">3. Appointments and Cancellations</h2>
                <p className="text-muted-foreground">
                  3.1. Appointments must be booked in advance.<br />
                  3.2. 24 hours notice is required for cancellations.<br />
                  3.3. Late cancellations or no-shows may incur a fee.<br />
                  3.4. We reserve the right to reschedule appointments if necessary.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">4. Payments</h2>
                <p className="text-muted-foreground">
                  4.1. Payment is required at the time of booking or service.<br />
                  4.2. All prices are inclusive of VAT where applicable.<br />
                  4.3. Refunds are subject to our cancellation policy.<br />
                  4.4. Card payments may incur a 2.5% transaction fee at locations.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
                <p className="text-muted-foreground">
                  5.1. We process personal data in accordance with our Privacy Policy.<br />
                  5.2. Medical records are kept confidential and secure.<br />
                  5.3. Information may be shared with relevant authorities as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">6. Liability</h2>
                <p className="text-muted-foreground">
                  6.1. We provide services with reasonable care and skill.<br />
                  6.2. We are not liable for any indirect or consequential losses.<br />
                  6.3. Our liability is limited to the cost of the services provided.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">7. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  For any questions about these terms, please contact us at:{' '}
                  <a href="mailto:info@medicald4.com">info@medicald4.com</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 