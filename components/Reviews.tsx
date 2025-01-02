'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: "John D.",
    role: "HGV Driver",
    content: "Excellent service! Quick, professional, and very affordable. Highly recommended for all drivers.",
    rating: 5,
    location: "Manchester"
  },
  {
    name: "Sarah M.",
    role: "Taxi Driver",
    content: "I was impressed by how smooth and efficient the whole process was. The staff were very friendly and helpful.",
    rating: 5,
    location: "London"
  },
  {
    name: "Robert L.",
    role: "Bus Company Manager",
    content: "We've been using MedicalD4 for our company's driver assessments, and they've been fantastic. Great service and competitive pricing.",
    rating: 5,
    location: "Birmingham"
  }
]

export default function Reviews() {
  const reviewsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.classList.remove('opacity-0')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    )

    const reviewElements = reviewsRef.current?.querySelectorAll('.review-card')
    reviewElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
              What Our Customers Say
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Read what our satisfied customers have to say about our services
          </p>
        </div>

        <div 
          ref={reviewsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-1"
        >
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="review-card opacity-0 card-hover bg-white dark:bg-gray-800 group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-4 sm:p-6 relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 sm:h-10 sm:w-10 text-primary/10 transition-all duration-300 group-hover:text-primary/20" />
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  {review.content}
                </p>

                <div className="border-t pt-4 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{review.name}</div>
                    <div className="text-sm text-primary/80">{review.role}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {review.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}