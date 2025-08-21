"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"

// Purpose tags for visualization
const purposeTags = [
  { text: "Education", color: "bg-primary" },
  { text: "Social Justice", color: "bg-blue-500" },
  { text: "Environment", color: "bg-green-500" },
  { text: "Healthcare", color: "bg-red-500" },
  { text: "Spirituality", color: "bg-purple-500" },
  { text: "Technology", color: "bg-yellow-500" },
  { text: "Arts", color: "bg-pink-500" },
  { text: "Community", color: "bg-orange-500" },
]

// Archetypes for visualization
const archetypes = [
  { text: "Teacher", emoji: "👨‍🏫" },
  { text: "Healer", emoji: "🧠" },
  { text: "Builder", emoji: "👷" },
  { text: "Advocate", emoji: "🗣️" },
  { text: "Connector", emoji: "🤝" },
  { text: "Innovator", emoji: "💡" },
  { text: "Guardian", emoji: "🛡️" },
  { text: "Strategist", emoji: "🧩" },
]

export function MatchmakingVisualizer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [person1, setPerson1] = useState<{ purpose: string; archetype: string; color: string } | null>(null)
  const [person2, setPerson2] = useState<{ purpose: string; archetype: string; color: string } | null>(null)
  const [isMatching, setIsMatching] = useState(false)
  const [matchScore, setMatchScore] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100])

  // Simulate the matchmaking process
  useEffect(() => {
    if (isInView && !isMatching) {
      const interval = setInterval(() => {
        // Generate random person profiles
        const randomPurpose1 = purposeTags[Math.floor(Math.random() * purposeTags.length)]
        const randomArchetype1 = archetypes[Math.floor(Math.random() * archetypes.length)]
        const randomPurpose2 = purposeTags[Math.floor(Math.random() * purposeTags.length)]
        const randomArchetype2 = archetypes[Math.floor(Math.random() * archetypes.length)]

        setPerson1({
          purpose: randomPurpose1.text,
          archetype: randomArchetype1.text,
          color: randomPurpose1.color,
        })
        setPerson2({
          purpose: randomPurpose2.text,
          archetype: randomArchetype2.text,
          color: randomPurpose2.color,
        })

        setIsMatching(true)

        // Calculate match score after a delay
        setTimeout(() => {
          // Higher score if purposes match, medium if archetypes match
          let score = 0
          if (randomPurpose1.text === randomPurpose2.text) {
            score += 60
          } else {
            score += 30
          }

          if (randomArchetype1.text === randomArchetype2.text) {
            score += 20
          } else {
            score += 10
          }

          // Add some randomness
          score += Math.floor(Math.random() * 20)
          setMatchScore(Math.min(score, 98))

          // Reset after showing the result
          setTimeout(() => {
            setIsMatching(false)
            setMatchScore(null)
          }, 3000)
        }, 2000)
      }, 6000)

      return () => clearInterval(interval)
    }
  }, [isInView, isMatching])

  return (
    <section className="py-24" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Purpose-First Matching</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our algorithm connects people based on shared purpose and complementary archetypes.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Person 1 */}
            <AnimatePresence mode="wait">
              {person1 && (
                <motion.div
                  key={`${person1.purpose}-${person1.archetype}`}
                  className="w-full md:w-1/3 bg-muted/50 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 rounded-full bg-background mx-auto mb-4 flex items-center justify-center text-4xl">
                    👤
                  </div>
                  <h3 className="text-xl font-bold mb-4">Person 1</h3>
                  <div className="space-y-3">
                    <div className={`${person1.color} text-white px-3 py-1 rounded-full inline-block`}>
                      {person1.purpose}
                    </div>
                    <div className="bg-muted px-3 py-1 rounded-full inline-block">
                      {person1.archetype} {archetypes.find((a) => a.text === person1.archetype)?.emoji || ""}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connection visualization */}
            <div className="relative w-full md:w-1/4 h-40 flex items-center justify-center">
              <AnimatePresence>
                {isMatching && matchScore === null && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="absolute text-sm font-medium">Matching...</p>
                  </motion.div>
                )}

                {matchScore !== null && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="text-2xl font-bold text-primary">{matchScore}%</div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: matchScore / 100 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                          clipPath: `circle(${(matchScore / 100) * 50}% at 50% 50%)`,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connection line */}
              <div className="absolute left-0 right-0 h-1 bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isMatching ? 1 : 0 }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Person 2 */}
            <AnimatePresence mode="wait">
              {person2 && (
                <motion.div
                  key={`${person2.purpose}-${person2.archetype}`}
                  className="w-full md:w-1/3 bg-muted/50 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 rounded-full bg-background mx-auto mb-4 flex items-center justify-center text-4xl">
                    👤
                  </div>
                  <h3 className="text-xl font-bold mb-4">Person 2</h3>
                  <div className="space-y-3">
                    <div className={`${person2.color} text-white px-3 py-1 rounded-full inline-block`}>
                      {person2.purpose}
                    </div>
                    <div className="bg-muted px-3 py-1 rounded-full inline-block">
                      {person2.archetype} {archetypes.find((a) => a.text === person2.archetype)?.emoji || ""}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-muted-foreground">
              Our algorithm analyzes purpose domains, archetypes, and modalities to find your ideal match.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
