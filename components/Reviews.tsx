import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: "John D.",
    role: "HGV Driver",
    content: "Excellent service! Quick, professional, and very affordable. Highly recommended for all drivers.",
    rating: 5
  },
  {
    name: "Sarah M.",
    role: "Taxi Driver",
    content: "I was impressed by how smooth and efficient the whole process was. The staff were very friendly and helpful.",
    rating: 5
  },
  {
    name: "Robert L.",
    role: "Bus Company Manager",
    content: "We've been using MedicalD4 for our company's driver assessments, and they've been fantastic. Great service and competitive pricing.",
    rating: 5
  }
]

export default function Reviews() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center gradient-text mb-16">What Our Customers Say</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="card-hover bg-white">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{review.content}</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{review.name}</div>
                  <div className="text-sm text-primary/80">{review.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}