"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function VideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Purpose-First Approach</h2>
          <p className="text-xl text-muted-foreground">
            See how Pup is transforming the way people find meaningful relationships through shared purpose and values.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="aspect-video">
            {/* YouTube embed with native video fallback */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&modestbranding=1"
              title="Pup: Purpose-First Relationships"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Sarah & Ahmed's Journey</h3>
              <p className="text-sm md:text-base max-w-2xl">
                "We connected through our shared passion for educational reform. Now we're building a school together
                that combines our complementary approaches."
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-muted-foreground italic">"When you align on purpose, everything else falls into place."</p>
        </motion.div>
      </div>
    </section>
  )
}
