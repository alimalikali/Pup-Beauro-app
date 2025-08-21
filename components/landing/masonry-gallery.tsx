"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { X, ImageIcon } from "lucide-react"
import { LazyImage } from "@/components/lazy-image"

// Define the image data with real Unsplash images
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    alt: "Couple smiling together",
    caption: "Sarah & Ahmed found each other through shared educational values",
    height: 500,
  },
  {
    src: "https://images.unsplash.com/photo-1529636798458-92182e662485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    alt: "Couple at graduation",
    caption: "Omar & Layla connected over their passion for social justice",
    height: 700,
  },
  {
    src: "https://images.unsplash.com/photo-1511405889574-b01de1da5441?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    alt: "Couple volunteering",
    caption: "Yusuf & Aisha bonded through their environmental activism",
    height: 400,
  },
  {
    src: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    alt: "Couple at conference",
    caption: "Zainab & Khalid met through their shared spiritual journey",
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    alt: "Couple teaching together",
    caption: "Fatima & Ibrahim now run educational workshops together",
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1439539698758-ba2680ecadb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    alt: "Couple at community event",
    caption: "Noor & Hassan found purpose in community building",
    height: 550,
  },
  {
    src: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    alt: "Couple hiking together",
    caption: "Maya & Ali share a passion for environmental conservation",
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    alt: "Couple working on project",
    caption: "Leila & Karim collaborate on community art initiatives",
    height: 520,
  },
]

export function MasonryGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [selectedImage, setSelectedImage] = useState<null | (typeof galleryImages)[0]>(null)
  const [columns, setColumns] = useState(3)
  const [masonryImages, setMasonryImages] = useState<(typeof galleryImages)[]>([])

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1)
      } else if (window.innerWidth < 1024) {
        setColumns(2)
      } else {
        setColumns(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Distribute images into columns for masonry layout
  useEffect(() => {
    const columnArrays: (typeof galleryImages)[] = Array.from({ length: columns }, () => [])

    // Sort images by height (optional, creates a more balanced layout)
    const sortedImages = [...galleryImages].sort((a, b) => a.height - b.height)

    // Distribute images across columns
    sortedImages.forEach((image, index) => {
      // Find the column with the least height
      const shortestColumnIndex = columnArrays
        .map((column) => column.reduce((acc, img) => acc + img.height, 0))
        .reduce((minIndex, height, index, heights) => (height < heights[minIndex] ? index : minIndex), 0)

      columnArrays[shortestColumnIndex].push(image)
    })

    setMasonryImages(columnArrays)
  }, [columns])

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
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const openLightbox = (image: (typeof galleryImages)[0]) => {
    setSelectedImage(image)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  return (
    <section className="py-20 bg-muted/30" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real People. Real Stories.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how purpose-aligned couples are building meaningful relationships and changing the world together.
          </p>
        </motion.div>

        <div className="flex flex-wrap -mx-2">
          {masonryImages.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`px-2 w-full ${columns === 1 ? "w-full" : columns === 2 ? "sm:w-1/2" : "sm:w-1/2 lg:w-1/3"}`}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="space-y-4"
              >
                {column.map((image, imageIndex) => (
                  <motion.div
                    key={imageIndex}
                    className="break-inside-avoid"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className="relative overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => openLightbox(image)}
                    >
                      <div className="relative" style={{ height: `${image.height / 2}px` }}>
                        <LazyImage
                          id={`gallery-${columnIndex}-${imageIndex}`}
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loadingClassName="bg-muted/50"
                          fallback={
                            <div className="flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          }
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                        <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">{image.caption}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative">
              <LazyImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                loadingClassName="bg-black/50 h-[80vh]"
                fallback={
                  <div className="flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/50" />
                  </div>
                }
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white rounded-b-lg">
                <p className="text-lg font-medium">{selectedImage.caption}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
