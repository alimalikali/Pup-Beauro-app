"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Heart, Filter, UserCheck, ChevronRight, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInView } from "framer-motion"

// Export the component as a named export
export function HowItWorks() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      icon: Heart,
      title: "Define Purpose",
      description:
        "Discover and articulate your life mission, values, and what drives you through our AI-guided process.",
      longDescription:
        "Our AI-powered questionnaire helps you explore your core values, life goals, and relationship expectations. Through thoughtful prompts and reflective exercises, you'll gain clarity on what truly matters to you in a life partner. This self-discovery process is the foundation for meaningful connections.",
      image: "https://images.unsplash.com/photo-1522152302542-71a8e5172aa1?q=80&w=2574&auto=format&fit=crop",
      color: "from-rose-500/20 to-rose-500/5",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
    },
    {
      icon: Filter,
      title: "Set Filters",
      description:
        "Specify your preferences and requirements for a partner, from religion to education and personality traits.",
      longDescription:
        "Based on your purpose profile, you'll set meaningful filters that go beyond surface-level preferences. Our advanced filtering system allows you to prioritize what truly matters - whether it's shared values, life goals, or specific attributes. These filters help narrow your search to truly compatible matches.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2574&auto=format&fit=crop",
      color: "from-purple-500/20 to-purple-500/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      icon: UserCheck,
      title: "Match",
      description: "Our algorithm connects you with compatible partners who share your purpose and meet your criteria.",
      longDescription:
        "Our proprietary matching algorithm goes beyond traditional dating apps by focusing on purpose alignment. We analyze hundreds of compatibility factors to find meaningful connections. Each match includes a detailed compatibility report showing exactly why you were matched and highlighting your shared values and complementary traits.",
      image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2571&auto=format&fit=crop",
      color: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
  ]

  // Function to render the icon component dynamically
  const renderIcon = (index: number) => {
    if (index === null || index < 0 || index >= steps.length) return null
    const IconComponent = steps[index].icon
    return <IconComponent className={`h-5 w-5 ${steps[index].iconColor}`} />
  }

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background -z-10" />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div ref={containerRef} style={{ opacity, scale, y }} className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3"
          >
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">Our Process</span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our purpose-first approach helps you find a partner who aligns with what matters most to you.
          </motion.p>
        </div>

        {/* Process steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 hidden md:block" />

          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className={`flex flex-col md:flex-row items-center mb-16 last:mb-0 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step number */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground items-center justify-center font-bold z-10 hidden md:flex`}
                  style={{ top: `calc(${index * 33.3}% + 2rem)` }}
                >
                  {index + 1}
                </div>

                {/* Content card */}
                <div className="w-full md:w-1/2 p-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <Card
                      className={`h-full border-none overflow-hidden bg-gradient-to-br ${step.color} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shrink-0`}
                          >
                            <StepIcon className={`h-7 w-7 ${step.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground mb-4">{step.description}</p>
                            <Button variant="outline" className="group" onClick={() => setActiveStep(index)}>
                              Learn More
                              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full bg-primary/5 -z-10" />
                    <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-primary/10 -z-10" />
                  </motion.div>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 p-4 hidden md:block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative h-80 rounded-2xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white text-xl font-bold mb-2">Step {index + 1}</h4>
                      <p className="text-white/80 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
            Start Your Journey
          </Button>
        </motion.div>
      </motion.div>

      {/* Detailed step modal */}
      <AnimatePresence>
        {activeStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveStep(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card relative max-w-4xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10"
                onClick={() => setActiveStep(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={activeStep !== null ? steps[activeStep].image || "/placeholder.svg" : "/placeholder.svg"}
                    alt={activeStep !== null ? steps[activeStep].title : "Step details"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold">
                      {activeStep !== null ? steps[activeStep].title : ""}
                    </h3>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        activeStep !== null ? steps[activeStep].iconBg : ""
                      } flex items-center justify-center`}
                    >
                      {activeStep !== null && renderIcon(activeStep)}
                    </div>
                    <h3 className="text-xl font-bold">
                      Step {activeStep !== null ? activeStep + 1 : ""}:{" "}
                      {activeStep !== null ? steps[activeStep].title : ""}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {activeStep !== null ? steps[activeStep].longDescription : ""}
                  </p>
                  <Button className="w-full" onClick={() => setActiveStep(null)}>
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// Make sure the component is also exported as default
export default HowItWorks
