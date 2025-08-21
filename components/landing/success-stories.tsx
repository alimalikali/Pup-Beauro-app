"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function SuccessStories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)

  const stories = [
    {
      title: "From Purpose to Partnership",
      description:
        "Maya and David both shared a passion for educational reform. After matching on Pup, they discovered their complementary approaches to the same mission. Now married, they run a nonprofit together.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "United by Shared Values",
      description:
        "Aisha and Omar found each other through their aligned spiritual journeys. Despite living in different countries, their shared purpose brought them together. They're now building a life centered around their faith.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Complementary Missions",
      description:
        "James and Sophia had different approaches but the same goal: environmental conservation. He focused on policy, she on community action. Together, they've created a powerful force for change.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
  }

  return (
    <section id="success-stories" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Real couples who found each other through shared purpose and values.
          </motion.p>
        </div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none bg-background/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={stories[activeIndex].image || "/placeholder.svg"}
                    alt={stories[activeIndex].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">{stories[activeIndex].title}</h3>
                  <p className="text-muted-foreground mb-6">{stories[activeIndex].description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {stories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={prevSlide} aria-label="Previous slide">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextSlide} aria-label="Next slide">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
