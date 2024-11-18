import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Lock, Cookie } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            This Cookie Policy explains how MedicalD4 uses cookies and similar technologies to recognize you when you visit our website.
          </p>

          <div className="grid gap-8 mb-12">
            <div className="flex gap-4">
              <Cookie className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used by website owners to make their websites work, or work more efficiently, as well as 
                  to provide reporting information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">How we use cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Essential cookies: Required for the website to function properly</li>
                  <li>Functionality cookies: Remember your preferences and choices</li>
                  <li>Analytics cookies: Help us understand how visitors interact with our website</li>
                  <li>Performance cookies: Help us improve website performance and user experience</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Lock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your cookie choices</h2>
                <p className="text-muted-foreground">
                  You can control and manage cookies in various ways. You can modify your browser settings to decline cookies 
                  if you prefer. However, this may prevent you from taking full advantage of the website.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Essential Cookies:</strong> These cookies are necessary for the website to function 
              properly. They enable core functionality such as security, network management, and accessibility.
            </p>
            <p>
              <strong className="text-foreground">Analytics Cookies:</strong> These cookies help us understand how visitors interact 
              with our website by collecting and reporting information anonymously.
            </p>
            <p>
              <strong className="text-foreground">Functional Cookies:</strong> These cookies enable the website to provide enhanced 
              functionality and personalization. They may be set by us or by third-party providers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 