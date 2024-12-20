import Link from 'next/link'
import { Star } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MedicalD4</h3>
            <p className="text-muted-foreground mb-4">
              Professional driver medical assessments across the UK.
            </p>
            <a 
              href="https://www.trustpilot.com/review/medicald4.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary/80"
            >
              <Star className="h-4 w-4 mr-1 fill-current" />
              View reviews on Trustpilot
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/booking/services" className="text-muted-foreground hover:text-foreground">
                  Book Medical
                </Link>
              </li>
              <li>
                <Link href="/taxi-medicals" className="text-muted-foreground hover:text-foreground">
                  Taxi Medicals
                </Link>
              </li>
              <li>
                <Link href="/business-services" className="text-muted-foreground hover:text-foreground">
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>17 Emery Avenue</p>
              <p>Newcastle Under Lyme</p>
              <p>Staffordshire ST5 2JG</p>
              <p className="mt-4">Email: info@medicald4.com</p>
              <p>Tel: 07415788851</p>
            </address>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MedicalD4. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}