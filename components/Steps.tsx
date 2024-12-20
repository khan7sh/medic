import { MapPin, Calendar, UserCheck, Clock } from 'lucide-react'

const steps = [
  { icon: MapPin, title: 'Choose your Location', description: 'Select a convenient location near you' },
  { icon: Calendar, title: 'Date and Time', description: 'Pick a suitable date and time slot' },
  { icon: UserCheck, title: 'Meet your GMC approved Doctor', description: 'Consult with our certified medical professionals' },
  { icon: Clock, title: 'Same Day Results', description: 'Get your results quickly and efficiently' },
]

export default function Steps() {
  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-background to-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center gradient-text mb-8 sm:mb-16">How It Works</h2>
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-4 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
          {steps.map((step, index) => (
            <div key={index} className="flex items-start mb-8 sm:mb-16 last:mb-0 relative group">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl sm:rounded-2xl p-2 sm:p-4 z-10 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
                <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="ml-4 sm:ml-8 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-primary/10 flex-grow group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3 text-foreground">{step.title}</h3>
                <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}