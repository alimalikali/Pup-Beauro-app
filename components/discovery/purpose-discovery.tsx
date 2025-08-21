"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Target, Users, Heart, Filter, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileCard } from "@/components/profiles/profile-card"
import type { Profile } from "@/types/profile"
import { toast } from "sonner"

interface PurposeFilter {
  domain: string
  archetype: string
  modality: string
  minCompatibility: number
  location: string
  ageRange: [number, number]
}

export function PurposeDiscovery() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<PurposeFilter>({
    domain: "",
    archetype: "",
    modality: "",
    minCompatibility: 70,
    location: "",
    ageRange: [25, 45]
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, searchQuery, profiles])

  const fetchProfiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profiles", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }

      const data = await response.json()
      setProfiles(data.profiles)
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast.error("Failed to load profiles")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let results = [...profiles]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (profile) =>
          profile.name.toLowerCase().includes(query) ||
          profile.purpose.domain.toLowerCase().includes(query) ||
          profile.purpose.archetype.toLowerCase().includes(query) ||
          profile.purpose.narrative.toLowerCase().includes(query)
      )
    }

    // Apply purpose filters
    if (filters.domain) {
      results = results.filter((profile) => profile.purpose.domain === filters.domain)
    }

    if (filters.archetype) {
      results = results.filter((profile) => profile.purpose.archetype === filters.archetype)
    }

    if (filters.modality) {
      results = results.filter((profile) => profile.purpose.modality === filters.modality)
    }

    // Apply location filter
    if (filters.location) {
      results = results.filter(
        (profile) =>
          profile.city.toLowerCase().includes(filters.location.toLowerCase()) ||
          profile.state.toLowerCase().includes(filters.location.toLowerCase()) ||
          profile.country.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Apply age filter
    results = results.filter(
      (profile) => profile.age >= filters.ageRange[0] && profile.age <= filters.ageRange[1]
    )

    setFilteredProfiles(results)
  }

  const handleFilterChange = (key: keyof PurposeFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      domain: "",
      archetype: "",
      modality: "",
      minCompatibility: 70,
      location: "",
      ageRange: [25, 45]
    })
    setSearchQuery("")
  }

  const purposeDomains = [
    "PERSONAL_GROWTH",
    "EDUCATION",
    "SPIRITUALITY",
    "HEALTHCARE",
    "TECHNOLOGY",
    "FINANCE",
    "ARTS",
    "COMMUNITY"
  ]

  const purposeArchetypes = [
    "LEADER",
    "FOLLOWER",
    "SUPPORTER",
    "PARTNER",
    "INDEPENDENT"
  ]

  const purposeModalities = [
    "ONLINE",
    "OFFLINE",
    "HYBRID"
  ]

  const getCompatibilityColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100"
    if (score >= 70) return "text-blue-600 bg-blue-100"
    if (score >= 55) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by purpose, name, or narrative..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
          Purpose Filters
        </Button>
      </div>

      {/* Purpose Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Purpose-Based Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Purpose Domain</Label>
                    <Select value={filters.domain} onValueChange={(value) => handleFilterChange("domain", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any domain</SelectItem>
                        {purposeDomains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Purpose Archetype</Label>
                    <Select value={filters.archetype} onValueChange={(value) => handleFilterChange("archetype", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any archetype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any archetype</SelectItem>
                        {purposeArchetypes.map((archetype) => (
                          <SelectItem key={archetype} value={archetype}>
                            {archetype}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Purpose Modality</Label>
                    <Select value={filters.modality} onValueChange={(value) => handleFilterChange("modality", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any modality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any modality</SelectItem>
                        {purposeModalities.map((modality) => (
                          <SelectItem key={modality} value={modality}>
                            {modality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="City, State, or Country"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
                    <Slider
                      value={filters.ageRange}
                      min={18}
                      max={80}
                      step={1}
                      onValueChange={(value) => handleFilterChange("ageRange", value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Compatibility: {filters.minCompatibility}%</Label>
                    <Slider
                      value={[filters.minCompatibility]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleFilterChange("minCompatibility", value[0])}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Users className="h-4 w-4 mr-1" />
            {filteredProfiles.length} profiles found
          </Badge>
          {filters.domain && (
            <Badge variant="outline">
              <Target className="h-4 w-4 mr-1" />
              {filters.domain}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing purpose-aligned matches
        </div>
      </div>

      {/* Results Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="high">High Compatibility</TabsTrigger>
          <TabsTrigger value="purpose">Purpose Focused</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No purpose-aligned matches found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your purpose filters or search criteria
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles
              .filter((profile) => {
                // This would use real compatibility scores from your matching algorithm
                const mockScore = Math.random() * 100
                return mockScore >= 80
              })
              .map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="purpose" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles
              .filter((profile) => profile.purpose.domain && profile.purpose.archetype)
              .map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Purpose Insights */}
      {filteredProfiles.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Purpose Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {purposeDomains.filter(domain => 
                    filteredProfiles.some(profile => profile.purpose.domain === domain)
                  ).length}
                </div>
                <div className="text-sm text-muted-foreground">Purpose Domains</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {filteredProfiles.filter(profile => profile.purpose.archetype).length}
                </div>
                <div className="text-sm text-muted-foreground">Archetypes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {filteredProfiles.filter(profile => profile.purpose.modality).length}
                </div>
                <div className="text-sm text-muted-foreground">Modalities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



