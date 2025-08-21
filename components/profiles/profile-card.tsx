"use client"

import type React from "react"

import { CompatibilityChart } from "@/components/matches/compatibility-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Profile } from "@/types/profile"
import { motion } from "framer-motion"
import {
  BadgeCheck, BookOpen,
  BrainCircuit, Briefcase, ChevronRight, Cigarette, CircleDot, Globe2, GraduationCap, Heart, MapPin, PillBottle, Ruler,
  Scale, Sparkles, User2, Vote, Wine, X
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface ProfileCardProps {
  profile: Profile
}

interface CompatibilityScore {
  overall: number
  domain: number
  archetype: number
  modality: number
}

const ensureArray = <T,>(value: T[] | undefined | null): T[] => {
  return Array.isArray(value) ? value : [];
};

const formatMeasurement = (value: number | undefined | null, unit: string): string => {
  return value ? `${value}${unit}` : "Not specified";
};

const formatText = (value: string | undefined | null): string => {
  return value || "Not specified";
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return "Invalid date";
  }
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPassed, setIsPassed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore>({
    overall: 0,
    domain: 0,
    archetype: 0,
    modality: 0
  })

  // Calculate compatibility score when profile changes
  useEffect(() => {
    const calculateCompatibility = () => {
      // This is a simplified compatibility calculation
      // In a real app, you'd call your matching algorithm API
      const domainScore = profile.purpose?.domain === "PERSONAL_GROWTH" ? 85 : 
                         profile.purpose?.domain === "EDUCATION" ? 80 : 
                         profile.purpose?.domain === "SPIRITUALITY" ? 75 : 60
      
      const archetypeScore = profile.purpose?.archetype === "PARTNER" ? 90 :
                            profile.purpose?.archetype === "LEADER" ? 80 :
                            profile.purpose?.archetype === "SUPPORTER" ? 75 : 65
      
      const modalityScore = profile.purpose?.modality === "HYBRID" ? 85 :
                           profile.purpose?.modality === "ONLINE" ? 75 :
                           profile.purpose?.modality === "OFFLINE" ? 70 : 60
      
      const overall = Math.round((domainScore * 0.4) + (archetypeScore * 0.3) + (modalityScore * 0.3))
      
      setCompatibilityScore({
        overall,
        domain: domainScore,
        archetype: archetypeScore,
        modality: modalityScore
      })
    }

    calculateCompatibility()
  }, [profile])

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
                src={profile?.avatar || "/placeholder.svg?height=192&width=384"}
                alt={profile?.name || "Profile"}
                fill
                className="object-cover"
              />
              {profile?.isNew && <Badge className="absolute top-3 right-3 bg-primary">New</Badge>}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{profile?.name || "Anonymous"}</h3>
                <p className="text-white/80">{profile?.purpose?.archetype || "No archetype specified"}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">Purpose Domain</div>
                <Badge variant="outline">{profile?.purpose?.domain || "Not specified"}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {profile?.city || "City"}, {profile?.state || "State"}, {profile?.country || "Country"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.education || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{profile?.profession || "Not specified"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Compatibility</div>
                  <div className="text-2xl font-bold">{compatibilityScore.overall}%</div>
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
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Profile Details
              {profile.isVerified && (
                <BadgeCheck className="h-5 w-5 text-primary" />
              )}
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <div className="overflow-y-auto h-[calc(90vh-8rem)] mt-4">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={profile?.avatar || "/placeholder.svg?height=256&width=384"}
                        alt={profile?.name || "Profile"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-2xl font-bold">{profile?.name || "Anonymous"}</h2>
                      {profile?.isNew && <Badge>New</Badge>}
                      {profile?.isActive && (
                        <Badge variant="secondary">
                          <CircleDot className="h-3 w-3 text-green-500 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User2 className="h-4 w-4" />
                        <span>{profile?.age || "Age not specified"} years • {formatText(profile?.gender)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {profile?.city || "City"}, {profile?.state || "State"}, {profile?.country || "Country"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{formatText(profile?.education)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{formatText(profile?.profession)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{formatText(profile?.religion)}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5" />
                        Purpose Profile
                      </h3>
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground">Domain</div>
                          <div className="font-medium">{formatText(profile?.purpose?.domain)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Archetype</div>
                          <div className="font-medium">{formatText(profile?.purpose?.archetype)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Modality</div>
                          <div className="font-medium">{formatText(profile?.purpose?.modality)}</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-sm text-muted-foreground">Purpose Narrative</div>
                          <p className="text-sm mt-1">{formatText(profile?.purpose?.narrative)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Interests & Hobbies</h3>
                      <div className="flex flex-wrap gap-2">
                        {ensureArray(profile?.interests).length > 0 ? (
                          ensureArray(profile?.interests).map((interest) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No interests specified</span>
                        )}
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
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Physical Attributes</h3>
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Height</div>
                          <div>{formatMeasurement(profile?.height, " cm")}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Weight</div>
                          <div>{formatMeasurement(profile?.weight, " kg")}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Lifestyle</h3>
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Cigarette className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Smoking</div>
                          <div>{formatText(profile?.smoke)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wine className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Alcohol</div>
                          <div>{formatText(profile?.alcohol)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PillBottle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Drugs</div>
                          <div>{formatText(profile?.drugs)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Political Views</h3>
                    <div className="flex flex-wrap gap-2">
                      {ensureArray(profile?.politics).length > 0 ? (
                        ensureArray(profile?.politics).map((view) => (
                          <Badge key={view} variant="outline">
                            <Vote className="h-4 w-4 mr-1" />
                            {view}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No political views specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compatibility" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Compatibility Score
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Overall Compatibility</span>
                        <span className="font-bold">{compatibilityScore.overall}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${compatibilityScore.overall}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Domain Match</span>
                        <Badge variant="outline">{compatibilityScore.domain}% match</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Archetype Match</span>
                        <Badge variant="outline">{compatibilityScore.archetype}% match</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Modality Match</span>
                        <Badge variant="outline">{compatibilityScore.modality}% match</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Compatibility Chart</h3>
                    <CompatibilityChart
                      userPurpose={{
                        domain: "PERSONAL_GROWTH",
                        archetype: "PARTNER",
                        modality: "HYBRID",
                      }}
                      matchPurpose={profile?.purpose || {
                        domain: "Not specified",
                        archetype: "Not specified",
                        modality: "Not specified",
                        narrative: "Not specified"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Match Analysis</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm">
                      {compatibilityScore.overall >= 80 ? 
                        "This profile shows exceptional compatibility with your purpose and values. The alignment in domain, archetype, and modality suggests strong potential for a meaningful connection." :
                        compatibilityScore.overall >= 65 ?
                        "This profile demonstrates good compatibility potential. While there are some differences, the overall alignment suggests a promising connection worth exploring." :
                        "This profile shows moderate compatibility. There may be some differences in approach or focus areas, but it could still lead to an interesting connection."
                      }
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Status</h3>
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Marital Status</div>
                        <div>{formatText(profile?.maritalStatus)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Looking For</div>
                        <div>{formatText(profile?.lookingFor)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Language</div>
                        <div>{formatText(profile?.language)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Personality Type</div>
                        <div>{formatText(profile?.personality)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Current Location</div>
                          <div>
                            {profile?.city || "City"}, {profile?.state || "State"}, {profile?.country || "Country"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Account Status</h3>
                    <div className="flex flex-wrap gap-4">
                      <Badge variant={profile?.isVerified ? "default" : "secondary"}>
                        <BadgeCheck className="h-4 w-4 mr-1" />
                        {profile?.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                      <Badge variant={profile?.isActive ? "default" : "secondary"}>
                        <CircleDot className="h-4 w-4 mr-1" />
                        {profile?.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Member since {formatDate(profile?.createdAt || new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
