'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Who needs to complete a D4 DVLA driver medical assessment?",
    answer: "A doctor will need to complete this form if you are applying for a lorry or bus driving licence. They can be completed by any GMC approved Doctor. The Medical D4 form will also need to be completed and send to your local council if you are applying for a Taxi License. Some councils require a medical summary from your GP. Please check your requirement with your local council, alternatively ask us in the chat about your council or give us a call on 07415788851."
  },
  {
    question: "What type of medicals do you provide?",
    answer: "We provide medical assessments for HGV/LGV drivers, Taxi/Private Hire drivers, Bus/PCV drivers, Ambulance drivers, Fork Lift operators, Motorhome drivers, Airside drivers, Jockeys, and Racing drivers. We also offer home visit services."
  },
  {
    question: "How do I book a medical assessment?",
    answer: "You can easily book your medical assessment through our online booking system. Simply select your service type, choose a convenient location, pick your preferred date and time, and complete the booking with your details and payment."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that plans can change. Please notify us at least 24 hours before your appointment if you need to cancel or reschedule. Late cancellations or no-shows may be subject to a fee."
  },
  {
    question: "How quickly can I get an appointment?",
    answer: "We offer flexible scheduling with same-day and next-day appointments often available. You can check real-time availability when booking through our website."
  },
  {
    question: "Who will do my D4 medical assessment?",
    answer: "Your medical assessment will be conducted by a GMC-registered doctor who is fully qualified and experienced in conducting driver medical assessments."
  },
  {
    question: "How can I pay for my medical assessment?",
    answer: "You can book and pay through our website. Arrange to pay on the day of your appointment. This can be done with card we accept CASH, VISA, MASTERCARD and CREDIT CARD. There is 2.5% card transaction fee if you pay by card at the location, there is no fee for bank transfers or when you make the payment online during your booking."
  },
  {
    question: "What do I need to bring to my D4 appointment?",
    answer: `Some local councils require full medical records from your GP. If you are unsure if your council requires this, please check with us.

Below is a list of the five items you will need to bring to your Medical D4 assessment:

1) D4 Medical form/ taxi medical form
2) Driving licence (and/or passport)
3) Your driving glasses and optical prescription (contact lenses must be removed for the 'uncorrected vision' eye test)
4) A list of all your current medication, the doses and the date you began taking them
5) Any hospital letters or details of hospital consultants who are treating you`
  },
  {
    question: "How long does the medical assessment take?",
    answer: "Most medical assessments take approximately 15-30 minutes to complete, depending on the type of assessment and individual circumstances."
  },
  {
    question: "Are you GDPR compliant?",
    answer: "Yes, we are fully GDPR compliant and take the protection of your personal data very seriously. All information is handled securely and confidentially."
  },
  {
    question: "Are your Doctors GMC approved?",
    answer: "Yes, all our doctors are GMC (General Medical Council) registered and approved to conduct driver medical assessments."
  },
  {
    question: "I am a Taxi driver and I forgot to bring a Medical Summary or relevant medical forms to my appointment?",
    answer: "It is your responsibility to bring your medical summary and medical forms. The Medical summary is required only for Taxi drivers and only for some councils please double check with us or your council if you don't know what is required. Medical summary is not required for Lorry/Bus drivers."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
          Frequently Asked Questions
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg px-4 sm:px-6"
              >
                <AccordionTrigger className="text-base sm:text-lg font-medium py-4 sm:py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4 sm:pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  )
} 