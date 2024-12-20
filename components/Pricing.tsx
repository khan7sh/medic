import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Download } from 'lucide-react'

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-foreground mb-8 sm:mb-16">Affordable Pricing</h2>
        <div className="max-w-lg mx-auto">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-4xl sm:text-5xl font-bold text-center text-primary">£55</CardTitle>
              <CardDescription className="text-center text-base sm:text-lg mt-2">VAT & Eye Test Included</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                <li>Comprehensive medical assessment</li>
                <li>Eye test included</li>
                <li>Valid for all driver types</li>
                <li>Nationwide service</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg">
                <Link href="/booking/services">Book Your Medical</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg">
                <a 
                  href="https://d4drivers.uk/wp-content/uploads/2020/06/2022-D4-Medical-Form-Blank.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Download D4 Form
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}