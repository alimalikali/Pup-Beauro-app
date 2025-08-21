"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Play, Volume2, VolumeX } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah & Ahmed",
    role: "Educational Reformers",
    thumbnail:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    videoUrl: "#",
    quote: "Finding someone who shares our passion for educational reform has been life-changing.",
  },
  {
    id: 2,
    name: "Layla & Omar",
    role: "Environmental Activists",
    thumbnail:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    videoUrl: "#",
    quote: "We're now working on projects together that neither of us could accomplish alone.",
  },
  {
    id: 3,
    name: "Fatima & Yusuf",
    role: "Spiritual Guides",
    thumbnail:
      "https://images.unsplash.com/photo-1537884944318-390069bb8665?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    videoUrl: "#",
    quote: "Our shared spiritual journey has created a foundation for a purposeful relationship.",
  },
  {
    id: 4,
    name: "Aisha & Khalid",
    role: "Healthcare Innovators",
    thumbnail:
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    videoUrl: "#",
    quote: "Together, we're bringing healthcare to communities that need it most.",
  },
]

export function VideoTestimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)

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
    <section className="py-24 bg-muted/30" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Hear Their Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real couples sharing how purpose-aligned relationships changed their lives.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="relative rounded-xl overflow-hidden group"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="aspect-video relative">
                <Image
                  src={testimonial.thumbnail || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Play button overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300 cursor-pointer"
                  onClick={() => setActiveVideo(testimonial.id)}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </div>
                </div>

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                  <p className="text-white/80">{testimonial.role}</p>
                </div>

                {/* Subtitles that appear on hover */}
                <div className="absolute bottom-16 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 text-white p-3 rounded-lg text-center">
                    <p className="text-sm">"{testimonial.quote}"</p>
                  </div>
                </div>
              </div>

              {/* Video modal */}
              {activeVideo === testimonial.id && (
                <motion.div
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveVideo(null)}
                >
                  <motion.div
                    className="relative max-w-4xl w-full aspect-video"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* For demo purposes, showing the thumbnail instead of actual video */}
                    <div className="relative w-full h-full">
                      <Image
                        src={testimonial.thumbnail || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-2xl font-bold text-white">{testimonial.name}</h3>
                        <p className="text-white/80 mb-2">{testimonial.role}</p>
                        <p className="text-white">"{testimonial.quote}"</p>
                      </div>
                      <button
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
