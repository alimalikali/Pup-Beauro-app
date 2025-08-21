"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, User } from "lucide-react"
import { LazyImage } from "@/components/lazy-image"

// Define testimonial data with real Unsplash images
const testimonials = [
  {
    quote:
      "Finding someone who shares my passion for educational reform has been life-changing. We're now working on projects together that neither of us could accomplish alone.",
    name: "Sarah Ahmed",
    role: "Educational Advocate",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "New York, USA",
  },
  {
    quote:
      "I was tired of dating apps that focus on superficial traits. Pup connected me with someone who shares my spiritual journey and life goals. It's been transformative.",
    name: "Omar Farooq",
    role: "Spiritual Guide",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "Toronto, Canada",
  },
  {
    quote:
      "As an environmental activist, finding a partner who shares my passion was crucial. Thanks to Pup, I found my perfect match who complements my work and vision.",
    name: "Layla Mahmoud",
    role: "Climate Activist",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    location: "London, UK",
  },
  {
    quote:
      "The purpose-first approach helped me find someone who truly understands my mission to improve healthcare in underserved communities. We're now life partners in every sense.",
    name: "Yusuf Ibrahim",
    role: "Healthcare Innovator",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    location: "Chicago, USA",
  },
]

export function SplitTestimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  return (
    <section className="py-20" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Voices of Purpose</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from couples who found each other through shared purpose and values.
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
            >
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl overflow-hidden">
                    <LazyImage
                      id={`testimonial-${index}`}
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      fallback={
                        <div className="flex items-center justify-center h-full w-full bg-muted">
                          <User className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      }
                    />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-3 py-1 font-medium">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              <Card
                className={`w-full md:w-2/3 border-none shadow-lg ${index % 2 === 0 ? "md:rounded-l-3xl" : "md:rounded-r-3xl"}`}
              >
                <CardContent className="p-6 md:p-8">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-lg md:text-xl mb-6 italic">{testimonial.quote}</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
