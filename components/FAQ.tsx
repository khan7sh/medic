import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What does a medical assessment include?",
    answer: "Our medical assessment includes a comprehensive health check, vision test, and any specific examinations required for your driver type. The assessment ensures you meet the health standards set by regulatory bodies."
  },
  {
    question: "How long does the medical assessment take?",
    answer: "Typically, a medical assessment takes about 30-45 minutes. However, this can vary depending on individual circumstances and the type of assessment required."
  },
  {
    question: "Do I need to bring anything to my appointment?",
    answer: "Yes, please bring a form of identification (such as a driver's license), any relevant medical history, and your current glasses or contact lenses if you wear them."
  },
  {
    question: "How often do I need to renew my medical certificate?",
    answer: "The renewal frequency depends on your age and the type of license you hold. Generally, it's every 5 years for drivers under 45, and more frequently for older drivers or those with certain medical conditions."
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center text-foreground mb-16">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}