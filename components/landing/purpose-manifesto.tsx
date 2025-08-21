"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

export function PurposeManifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  const manifestoLines = [
    "We believe that purpose is the foundation of lasting love.",
    "We believe that shared values create stronger bonds than shared interests.",
    "We believe that your life's mission deserves a partner who amplifies it.",
    "We believe that compatibility is about alignment, not similarity.",
    "We believe that marriage should be a partnership of purpose.",
  ]

  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section id="manifesto" className="py-24 md:py-32 bg-black text-white" ref={containerRef}>
      <motion.div
        className="container mx-auto px-4"
        style={{ opacity, y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-light mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            Our Manifesto
          </motion.h2>

          <div className="space-y-12 md:space-y-16">
            {manifestoLines.map((line, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="text-3xl md:text-5xl font-serif leading-tight tracking-tight"
              >
                {line}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-24 text-center text-xl font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: manifestoLines.length * 0.2 + 0.5, duration: 1 }}
          >
            This is why we built Pup.
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
