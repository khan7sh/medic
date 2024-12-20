'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            This privacy policy applies between you, the User of this Website, and medicald4 limited, 
            the owner and provider of this Website. medicald4 limited takes the privacy of your information very seriously.
          </p>

          <div className="bg-secondary/50 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
            <p className="text-base sm:text-lg font-medium">Please read this privacy policy carefully.</p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Definitions and Interpretation</h2>
              <div className="grid gap-6 sm:gap-8">
                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Data</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Collectively all information that you submit to medicald4 limited via the Website.
                  </p>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Data Protection Laws</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Any applicable law relating to the processing of personal Data, including but not limited to the GDPR, 
                    and any national implementing and supplementary laws, regulations and secondary legislation.
                  </p>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">GDPR</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">The UK General Data Protection Regulation.</p>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">medicald4 limited, we or us</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    medicald4 limited, a company incorporated in with registered number 13861105 whose registered office 
                    is at 2 Smithfield, Leonard Coates Way, Stoke On Trent ST1 4FD.
                  </p>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">User or you</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Any third party that accesses the Website and is not either (i) employed by medicald4 limited and acting in the course 
                    of their employment or (ii) engaged as a consultant or otherwise providing services to medicald4 limited and accessing 
                    the Website in connection with the provision of such services.
                  </p>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Website</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    The website that you are currently using, www.medicald4.com, and any sub-domains of this site unless expressly 
                    excluded by their own terms and conditions.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">How We Collect Data</h2>
              <div className="grid gap-6 sm:gap-8">
                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Data given to us by you</h3>
                  <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-2">
                    <li>When you contact us through any means</li>
                    <li>When you register with us</li>
                    <li>When you make payments</li>
                    <li>When you use our services</li>
                  </ul>
                </div>

                <div className="bg-secondary/20 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Data collected automatically</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    We automatically collect information about your visit to the Website, including your IP address, 
                    visit dates and times, and how you interact with our content.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Marketing Communications</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                For direct marketing via email, we require your consent through either:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-2">
                <li>Soft opt-in (for existing customers)</li>
                <li>Explicit consent (for new customers)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                We implement technical and organizational measures to protect your Data, including:
              </p>
              <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-2">
                <li>Password-protected account access</li>
                <li>Secure server storage</li>
                <li>Regular security assessments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                We retain your Data only for as long as necessary to fulfill the purposes outlined in this policy 
                or as required by law. You may request deletion of your Data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Changes to this Policy</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                medicald4 limited reserves the right to change this privacy policy as necessary. Changes will be 
                posted immediately on the Website.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                For privacy-related queries or to exercise your rights, contact us at:{' '}
                <a href="mailto:info@medicald4.com" className="text-primary hover:underline">
                  info@medicald4.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 