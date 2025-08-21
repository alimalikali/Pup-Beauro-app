"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CompatibilityChart } from "@/components/matches/compatibility-chart"
import { Heart, X, ChevronRight, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import type { Match } from "@/types/match"

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPassed, setIsPassed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(true)
    setIsPassed(false)
  }

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPassed(true)
    setIsLiked(false)
  }

  if (isPassed) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogTrigger asChild>
          <Card className="h-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-muted">
              <Image
                src={match.avatar || "/placeholder.svg?height=192&width=384"}
                alt={match.name}
                fill
                className="object-cover"
              />
              {match.isNew && <Badge className="absolute top-3 right-3 bg-primary">New</Badge>}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{match.name}</h3>
                <p className="text-white/80">{match.purpose.archetype}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">Purpose Domain</div>
                <Badge variant="outline">{match.purpose.domain}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{match.location.city}, {match.location.state}, {match.location.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{match.education}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{match.profession}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Compatibility</div>
                  <div className="text-2xl font-bold">{match.compatibilityScore}%</div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={handlePass}>
                <X className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={match.avatar || "/placeholder.svg?height=256&width=384"}
                  alt={match.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-1">{match.name}</h2>
              <p className="text-muted-foreground mb-4">
                {match.age} • {match.location.city}, {match.location.state}, {match.location.country}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{match.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{match.profession}</span>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="mt-2">
                        {match.religion}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Purpose Narrative</h3>
                  <p className="text-sm text-muted-foreground">{match.purpose.narrative}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2"
                  variant={isLiked ? "default" : "outline"}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button
                  className="flex-1 gap-2"
                  variant="outline"
                  onClick={() => {
                    setIsPassed(true)
                    setShowDetails(false)
                  }}
                >
                  <X className="h-5 w-5" />
                  Pass
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Compatibility Analysis</h3>
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Overall Compatibility</span>
                    <span className="font-bold">{match.compatibilityScore}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${match.compatibilityScore}%` }}></div>
                  </div>
                </div>

                <CompatibilityChart
                  userPurpose={{
                    domain: "Educational",
                    archetype: "Teacher",
                    modality: "Organizing",
                  }}
                  matchPurpose={match.purpose}
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">AI Match Narrative</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm">{match.matchNarrative}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Purpose Alignment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Domain: {match.purpose.domain}</span>
                    <Badge variant="outline">{match.purpose.domain}% match</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Archetype: {match.purpose.archetype}</span>
                    <Badge variant="outline">{match.purpose.archetype}% match</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Modality: {match.purpose.modality}</span>
                    <Badge variant="outline">{match.purpose.modality}% match</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
