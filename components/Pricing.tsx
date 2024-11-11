import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-foreground mb-16">Affordable Pricing</h2>
        <div className="max-w-lg mx-auto">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-center text-primary">£50</CardTitle>
              <CardDescription className="text-center text-lg mt-2">VAT & Eye Test Included</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                <li>Comprehensive medical assessment</li>
                <li>Eye test included</li>
                <li>Valid for all driver types</li>
                <li>Nationwide service</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                <Link href="#book">Book Your Medical</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}