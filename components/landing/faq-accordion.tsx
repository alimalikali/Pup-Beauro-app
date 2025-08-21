"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How is Pup different from other dating apps?",
    answer:
      "Unlike traditional dating apps that focus on superficial traits, Pup matches people based on shared purpose, values, and life missions. We believe that relationships built on aligned purpose create the strongest foundation for lasting connection.",
  },
  {
    question: "How does the purpose matching algorithm work?",
    answer:
      "Our proprietary algorithm analyzes multiple dimensions of purpose alignment, including core values, life missions, and complementary archetypes. We look beyond surface-level interests to find deep compatibility based on what truly matters to you.",
  },
  {
    question: "Is Pup only for people seeking marriage?",
    answer:
      "While many of our users are seeking marriage, Pup is for anyone looking for purpose-aligned relationships. Whether you're seeking a life partner, a collaborator on meaningful projects, or someone who shares your vision for change, Pup can help you find your match.",
  },
  {
    question: "How long does it typically take to find a match?",
    answer:
      "The timeline varies for each person, but our users typically begin receiving quality matches within the first month. Because we focus on meaningful connections rather than quantity, you may receive fewer matches than on other platforms, but they will be significantly more aligned with your purpose.",
  },
  {
    question: "Can I use Pup if I'm not sure about my purpose yet?",
    answer:
      "Many of our users are still exploring their purpose. Our onboarding process includes tools to help you clarify your values and mission, and our community features connect you with others on similar journeys of purpose discovery.",
  },
  {
    question: "Is there a free version of Pup?",
    answer:
      "Yes, we offer a free basic membership that allows you to create a profile, receive matches, and send a limited number of messages. Our premium tiers offer additional features like advanced filtering, priority matching, and unlimited messaging.",
  },
]

export function FaqAccordion() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [openItem, setOpenItem] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  return (
    <section className="py-24 bg-muted/30" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about finding your purpose partner.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="border-none bg-background rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
