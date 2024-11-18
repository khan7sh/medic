"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Stethoscope } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
              MedicalD4
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-2 flex-1 max-w-3xl mx-8">
            <Link 
              href="/taxi-medicals" 
              className="px-6 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              Taxi Medicals
            </Link>
            <Link 
              href="/business-services" 
              className="px-6 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              Business Services
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              About
            </Link>
            <Link 
              href="/faq" 
              className="px-6 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              FAQ
            </Link>
          </nav>

          {/* Book Now Button - Desktop */}
          <div className="hidden md:flex items-center">
            <Button asChild size="lg" className="px-8 py-6 text-base font-medium">
              <Link href="/booking/services">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 border-t bg-background/95 backdrop-blur md:hidden shadow-lg">
          <nav className="container py-4">
            <div className="flex flex-col space-y-2 px-4">
              <Link 
                href="/taxi-medicals" 
                className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Taxi Medicals
              </Link>
              <Link 
                href="/business-services" 
                className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Business Services
              </Link>
              <Link 
                href="/about" 
                className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/faq" 
                className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
            <div className="mt-6 px-6">
              <Button asChild className="w-full py-6 text-base font-medium">
                <Link href="/booking/services" onClick={() => setIsMenuOpen(false)}>
                  Book Now
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
