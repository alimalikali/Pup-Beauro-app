"use client"

import { useState, useEffect } from "react"
import { MatchCard } from "@/components/matches/match-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Match } from "@/types/match"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function MatchesList() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minScore: 70,
    domain: "",
    religion: "",
  })

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/matches", {
          credentials: "include", // Important for sending cookies
        })

        if (response.status === 401) {
          toast.error("Please sign in to view matches")
          router.push("/sign-in")
          return
        }

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        setMatches(data)
        setFilteredMatches(data)
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast.error(error instanceof Error ? error.message : "Failed to load matches. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [router])

  useEffect(() => {
    // Apply filters and search
    let results = [...matches]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (match) =>
          match.name.toLowerCase().includes(query) ||
          match.purpose.domain.toLowerCase().includes(query) ||
          match.purpose.archetype.toLowerCase().includes(query) ||
          match.profession.toLowerCase().includes(query),
      )
    }

    // Apply filters
    if (filters.minScore > 0) {
      results = results.filter((match) => match.compatibilityScore >= filters.minScore)
    }

    if (filters.domain) {
      results = results.filter((match) => match.purpose.domain === filters.domain)
    }

    if (filters.religion) {
      results = results.filter((match) => match.religion === filters.religion)
    }

    setFilteredMatches(results)
  }, [searchQuery, filters, matches])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      minScore: 70,
      domain: "",
      religion: "",
    })
    setSearchQuery("")
  }

  // Get unique domains from matches
  const domains = Array.from(new Set(matches.map((match) => match.purpose.domain)))
  // Get unique religions from matches
  const religions = Array.from(new Set(matches.map((match) => match.religion)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/30 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filter Matches</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Minimum Compatibility</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[filters.minScore]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleFilterChange("minScore", value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{filters.minScore}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Purpose Domain</Label>
                  <Select value={filters.domain} onValueChange={(value) => handleFilterChange("domain", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any domain</SelectItem>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Religion</Label>
                  <Select value={filters.religion} onValueChange={(value) => handleFilterChange("religion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any religion</SelectItem>
                      {religions.map((religion) => (
                        <SelectItem key={religion} value={religion}>
                          {religion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Matches</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="high">High Compatibility</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches
                .filter((match) => match.isNew)
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="high" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches
                .filter((match) => match.compatibilityScore >= 85)
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
