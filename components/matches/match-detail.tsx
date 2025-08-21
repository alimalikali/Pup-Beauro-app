"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompatibilityChart } from "@/components/matches/compatibility-chart"
import { Heart, ArrowLeft, MessageCircle, MapPin, GraduationCap, Briefcase, Calendar } from "lucide-react"
import { calculateMatches } from "@/lib/matching-algorithm"
import type { Match } from "@/types/match"

interface MatchDetailProps {
  matchId: string
}

export function MatchDetail({ matchId }: MatchDetailProps) {
  const [match, setMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchMatch = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call to get a specific match
        const matches = await calculateMatches()
        const foundMatch = matches.find((m) => m.id === matchId)
        setMatch(foundMatch || null)
      } catch (error) {
        console.error("Error fetching match:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatch()
  }, [matchId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/matches">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-80 bg-muted animate-pulse rounded-lg mb-4" />
            <div className="h-8 w-40 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded mb-6" />
            <div className="space-y-4">
              <div className="h-20 bg-muted animate-pulse rounded" />
              <div className="h-40 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-60 bg-muted animate-pulse rounded" />
            <div className="h-60 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Match not found</h2>
        <p className="text-muted-foreground mb-6">The match you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/matches">Back to Matches</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/matches">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{match.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-80">
                <Image
                  src={match.avatar || "/placeholder.svg?height=320&width=320"}
                  alt={match.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {match.isNew && <Badge className="absolute top-3 right-3 bg-primary">New</Badge>}
              </div>
              <div className="p-4">
                <h2 className="text-2xl font-bold">{match.name}</h2>
                <p className="text-muted-foreground mb-4">{match.age} years old</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{match.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{match.career}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{match.religion}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              className="flex-1 gap-2"
              variant={isLiked ? "default" : "outline"}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button className="flex-1 gap-2" variant="outline" disabled>
              <MessageCircle className="h-5 w-5" />
              Message
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="purpose">
                <TabsList className="mb-4">
                  <TabsTrigger value="purpose">Purpose Profile</TabsTrigger>
                  <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                </TabsList>
                <TabsContent value="purpose" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Purpose Summary</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Domain</div>
                        <div className="font-medium">{match.purpose.domain}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Archetype</div>
                        <div className="font-medium">{match.purpose.archetype}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Modality</div>
                        <div className="font-medium">{match.purpose.modality}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Purpose Narrative</h3>
                    <p className="text-muted-foreground">{match.purpose.narrative}</p>
                  </div>
                </TabsContent>
                <TabsContent value="compatibility" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Compatibility Score</h3>
                    <div className="bg-muted/30 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span>Overall Compatibility</span>
                        <span className="text-2xl font-bold">{match.compatibilityScore}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${match.compatibilityScore}%` }}></div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Purpose Alignment</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Domain Alignment</span>
                              <span>{match.purposeAlignment.domain}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${match.purposeAlignment.domain}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Archetype Alignment</span>
                              <span>{match.purposeAlignment.archetype}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${match.purposeAlignment.archetype}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Modality Alignment</span>
                              <span>{match.purposeAlignment.modality}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${match.purposeAlignment.modality}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <CompatibilityChart
                          userPurpose={{
                            domain: "Educational",
                            archetype: "Teacher",
                            modality: "Organizing",
                          }}
                          matchPurpose={match.purpose}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">AI Match Narrative</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p>{match.matchNarrative}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
