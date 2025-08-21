"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Heart, Users, Compass, Lightbulb } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Purpose-First",
    description:
      "We believe that purpose is the foundation of lasting love. When two people share a mission, they build something greater than themselves.",
  },
  {
    icon: Users,
    title: "Authentic Connection",
    description:
      "True compatibility goes beyond surface-level interests. We connect people based on their core values and life missions.",
  },
  {
    icon: Compass,
    title: "Guided Journey",
    description:
      "Finding your purpose partner is a journey. We provide the tools, insights, and support to help you navigate this path.",
  },
  {
    icon: Lightbulb,
    title: "Intentional Matching",
    description:
      "Our approach is deliberate and thoughtful. We use purpose alignment to create meaningful connections that last.",
  },
]

export function ValuesGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-24" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The principles that guide our mission to connect purpose-aligned partners.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-xl hover:bg-muted/50 transition-colors duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="text-2xl font-light italic max-w-2xl mx-auto">
            "We don't just connect people. We connect purposes."
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
