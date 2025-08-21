"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Profile } from "@/types/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter, Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { ProfileCard } from "./profile-card"



interface ProfilesResponse {
  profiles: Profile[]
  pagination: {
    total: number
    pages: number
    current: number
    perPage: number
  }
}

const filterFormSchema = z.object({
  gender: z.array(z.enum(["MALE", "FEMALE", "OTHER"])).optional(),
  minAge: z.number().min(18).max(100).nullable(),
  maxAge: z.number().min(18).max(100).nullable(),
  religion: z.array(z.enum([
    "ISLAM",
    "CHRISTIANITY",
    "HINDUISM",
    "BUDDHISM",
    "JUDAISM",
    "SIKHISM",
    "JAINISM",
    "BAHAI",
    "ZOROASTRIANISM",
    "SHINTO",
    "TAOISM",
    "AGNOSTIC",
    "ATHEIST",
    "SPIRITUAL_BUT_NOT_RELIGIOUS",
    "PAGAN",
    "INDIGENOUS",
    "OTHER",
  ])).optional(),
  education: z.array(z.enum([
    "NO_FORMAL_EDUCATION",
    "PRIMARY",
    "SECONDARY",
    "HIGH_SCHOOL",
    "DIPLOMA",
    "ASSOCIATE",
    "BACHELORS",
    "MASTERS",
    "MBA",
    "PHD",
    "POSTDOC",
    "VOCATIONAL",
    "SELF_TAUGHT",
    "BOOTCAMP",
    "OTHER",
  ])).optional(),
  profession: z.array(z.enum([
    "ENGINEERING",
    "SOFTWARE_DEVELOPMENT",
    "DATA_SCIENCE",
    "ARTIFICIAL_INTELLIGENCE",
    "MEDICINE",
    "DENTISTRY",
    "NURSING",
    "EDUCATION",
    "BUSINESS",
    "ENTREPRENEUR",
    "FINANCE",
    "MARKETING",
    "SALES",
    "LAW",
    "GOVERNMENT",
    "PUBLIC_SERVICE",
    "DESIGN",
    "WRITING",
    "JOURNALISM",
    "ARTS",
    "FILM",
    "MUSIC",
    "SPORTS",
    "AGRICULTURE",
    "ARCHITECTURE",
    "PSYCHOLOGY",
    "SOCIAL_WORK",
    "FREELANCER",
    "STUDENT",
    "UNEMPLOYED",
    "HOMEMAKER",
    "OTHER",
  ])).optional(),
  personality: z.array(z.enum(["INTROVERT", "EXTROVERT", "AMBIVERENT", "OTHER"])).optional(),
  country: z.array(z.string()).optional(),
  state: z.array(z.string()).optional(),
  city: z.array(z.string()).optional(),
  maritalStatus: z.array(z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])).optional(),
  lookingFor: z.array(z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])).optional(),
  motherTounge: z.array(z.string()).optional(),
  purposeDomain: z.array(z.string()).optional(),
  purposeArchetype: z.array(z.string()).optional(),
  purposeModality: z.array(z.string()).optional(),
})

type FilterFormValues = z.infer<typeof filterFormSchema>

// Define enum values
const RELIGION_OPTIONS = [
  "ISLAM",
  "CHRISTIANITY",
  "HINDUISM",
  "BUDDHISM",
  "JUDAISM",
  "SIKHISM",
  "JAINISM",
  "BAHAI",
  "ZOROASTRIANISM",
  "SHINTO",
  "TAOISM",
  "AGNOSTIC",
  "ATHEIST",
  "SPIRITUAL_BUT_NOT_RELIGIOUS",
  "PAGAN",
  "INDIGENOUS",
  "OTHER",
] as const

const EDUCATION_OPTIONS = [
  "NO_FORMAL_EDUCATION",
  "PRIMARY",
  "SECONDARY",
  "HIGH_SCHOOL",
  "DIPLOMA",
  "ASSOCIATE",
  "BACHELORS",
  "MASTERS",
  "MBA",
  "PHD",
  "POSTDOC",
  "VOCATIONAL",
  "SELF_TAUGHT",
  "BOOTCAMP",
  "OTHER",
] as const

const PROFESSION_OPTIONS = [
  "ENGINEERING",
  "SOFTWARE_DEVELOPMENT",
  "DATA_SCIENCE",
  "ARTIFICIAL_INTELLIGENCE",
  "MEDICINE",
  "DENTISTRY",
  "NURSING",
  "EDUCATION",
  "BUSINESS",
  "ENTREPRENEUR",
  "FINANCE",
  "MARKETING",
  "SALES",
  "LAW",
  "GOVERNMENT",
  "PUBLIC_SERVICE",
  "DESIGN",
  "WRITING",
  "JOURNALISM",
  "ARTS",
  "FILM",
  "MUSIC",
  "SPORTS",
  "AGRICULTURE",
  "ARCHITECTURE",
  "PSYCHOLOGY",
  "SOCIAL_WORK",
  "FREELANCER",
  "STUDENT",
  "UNEMPLOYED",
  "HOMEMAKER",
  "OTHER",
] as const

const PERSONALITY_OPTIONS = ["INTROVERT", "EXTROVERT", "AMBIVERENT", "OTHER"] as const
const MARITAL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"] as const

export function ProfilesList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [data, setData] = useState<ProfilesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      gender: searchParams.getAll("gender") as FilterFormValues["gender"] || [],
      minAge: (() => {
        const minAge = searchParams.get("minAge")
        return minAge ? parseInt(minAge) : null
      })(),
      maxAge: (() => {
        const maxAge = searchParams.get("maxAge")
        return maxAge ? parseInt(maxAge) : null
      })(),
      religion: searchParams.getAll("religion") as FilterFormValues["religion"] || [],
      education: searchParams.getAll("education") as FilterFormValues["education"] || [],
      profession: searchParams.getAll("profession") as FilterFormValues["profession"] || [],
      personality: searchParams.getAll("personality") as FilterFormValues["personality"] || [],
      country: searchParams.getAll("country") || [],
      state: searchParams.getAll("state") || [],
      city: searchParams.getAll("city") || [],
      maritalStatus: searchParams.getAll("maritalStatus") as FilterFormValues["maritalStatus"] || [],
      lookingFor: searchParams.getAll("lookingFor") as FilterFormValues["lookingFor"] || [],
      motherTounge: searchParams.getAll("motherTounge") || [],
      purposeDomain: searchParams.getAll("purposeDomain") as FilterFormValues["purposeDomain"] || [],
      purposeArchetype: searchParams.getAll("purposeArchetype") as FilterFormValues["purposeArchetype"] || [],
      purposeModality: searchParams.getAll("purposeModality") as FilterFormValues["purposeModality"] || [],
    },
  })

  // Get current filter values from URL
  const currentFilters = {
    page: searchParams.get("page") ?? "1",
    search: searchParams.get("search") ?? "",
    sortBy: searchParams.get("sortBy") ?? "createdAt",
    sortOrder: searchParams.get("sortOrder") ?? "desc",
  }

  // Update URL with filters
  const updateFilters = (updates: Partial<typeof currentFilters & FilterFormValues>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      // Remove existing values for this key
      params.delete(key);
      
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array values by adding multiple entries
          value.forEach((item) => {
            if (item) {
              params.append(key, item.toString());
            }
          });
        } else {
          // Handle non-array values
          params.set(key, value.toString());
        }
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  }

  const onSubmitFilters = (values: FilterFormValues) => {
    updateFilters({ ...values, page: "1" })
    setIsFilterOpen(false)
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams(searchParams)
        console.log(params.toString())
        const response = await fetch(`/api/profiles?${params.toString()}`)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || "Failed to load profiles")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching profiles:", error)
        setError(error instanceof Error ? error.message : "Failed to load profiles")
        toast.error(error instanceof Error ? error.message : "Failed to load profiles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfiles()
  }, [searchParams])

  // Reset form when searchParams change to keep form in sync with URL
  useEffect(() => {
    form.reset({
      gender: searchParams.getAll("gender") as FilterFormValues["gender"] || [],
      minAge: (() => {
        const minAge = searchParams.get("minAge")
        return minAge ? parseInt(minAge) : null
      })(),
      maxAge: (() => {
        const maxAge = searchParams.get("maxAge")
        return maxAge ? parseInt(maxAge) : null
      })(),
      religion: searchParams.getAll("religion") as FilterFormValues["religion"] || [],
      education: searchParams.getAll("education") as FilterFormValues["education"] || [],
      profession: searchParams.getAll("profession") as FilterFormValues["profession"] || [],
      personality: searchParams.getAll("personality") as FilterFormValues["personality"] || [],
      country: searchParams.getAll("country") || [],
      state: searchParams.getAll("state") || [],
      city: searchParams.getAll("city") || [],
      maritalStatus: searchParams.getAll("maritalStatus") as FilterFormValues["maritalStatus"] || [],
      lookingFor: searchParams.getAll("lookingFor") as FilterFormValues["lookingFor"] || [],
      motherTounge: searchParams.getAll("motherTounge") || [],
      purposeDomain: searchParams.getAll("purposeDomain") as FilterFormValues["purposeDomain"] || [],
      purposeArchetype: searchParams.getAll("purposeArchetype") as FilterFormValues["purposeArchetype"] || [],
      purposeModality: searchParams.getAll("purposeModality") as FilterFormValues["purposeModality"] || [],
    })
  }, [searchParams, form])

  const handleSearch = (value: string) => {
    updateFilters({ search: value, page: "1" })
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page: page.toString() })
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)
    updateFilters({ sortOrder: newOrder })
  }

  const resetFilters = () => {
    // Reset form to initial values
    form.reset({
      gender: [],
      minAge: null,
      maxAge: null,
      religion: [],
      education: [],
      profession: [],
      personality: [],
      country: [],
      state: [],
      city: [],
      maritalStatus: [],
      lookingFor: [],
      motherTounge: [],
      purposeDomain: [],
      purposeArchetype: [],
      purposeModality: [],
    })
    router.push(pathname)
  }

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) => !["page", "search", "sortBy", "sortOrder"].includes(key)
  ).length

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.refresh()}>Try Again</Button>
      </div>
    )
  }

  if (!data) return null

  const { profiles, pagination } = data

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No profiles found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              className="pl-9"
              value={currentFilters.search ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {currentFilters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => handleSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Filter Profiles</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitFilters)} className="space-y-6 py-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select genders"
                            options={[
                              { value: "MALE", label: "Male" },
                              { value: "FEMALE", label: "Female" },
                              { value: "OTHER", label: "Other" },
                            ]}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Age Range</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Min age"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Max age"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select religions"
                            options={RELIGION_OPTIONS.map(option => ({
                              value: option,
                              label: option.replace(/_/g, " ").toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select education levels"
                            options={EDUCATION_OPTIONS.map(option => ({
                              value: option,
                              label: option.replace(/_/g, " ").toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select professions"
                            options={PROFESSION_OPTIONS.map(option => ({
                              value: option,
                              label: option.replace(/_/g, " ").toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select personalities"
                            options={PERSONALITY_OPTIONS.map(option => ({
                              value: option,
                              label: option.replace(/_/g, " ").toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Location</FormLabel>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select countries"
                                options={[
                                  { value: "USA", label: "USA" },
                                  { value: "CANADA", label: "Canada" },
                                  { value: "UK", label: "UK" },
                                  { value: "AUSTRALIA", label: "Australia" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select states"
                                options={[
                                  { value: "CA", label: "California" },
                                  { value: "TX", label: "Texas" },
                                  { value: "NY", label: "New York" },
                                  { value: "FL", label: "Florida" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select cities"
                                options={[
                                  { value: "NEW_YORK", label: "New York" },
                                  { value: "LONDON", label: "London" },
                                  { value: "TOKYO", label: "Tokyo" },
                                  { value: "PARIS", label: "Paris" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select marital statuses"
                            options={MARITAL_STATUS_OPTIONS.map(option => ({
                              value: option,
                              label: option.toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lookingFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Looking For</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select preferences"
                            options={MARITAL_STATUS_OPTIONS.map(option => ({
                              value: option,
                              label: option.toLowerCase()
                            }))}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherTounge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother Tongue</FormLabel>
                        <FormControl>
                          <MultiSelect
                            placeholder="Select languages"
                            options={[
                              { value: "ENGLISH", label: "English" },
                              { value: "URDU", label: "Urdu" },
                              { value: "HINDI", label: "Hindi" },
                              { value: "PUNJABI", label: "Punjabi" },
                              { value: "ARABIC", label: "Arabic" },
                              { value: "SPANISH", label: "Spanish" },
                              { value: "FRENCH", label: "French" },
                              { value: "GERMAN", label: "German" },
                              { value: "CHINESE", label: "Chinese" },
                              { value: "JAPANESE", label: "Japanese" },
                              { value: "KOREAN", label: "Korean" },
                              { value: "OTHER", label: "Other" }
                            ]}
                            selected={field.value || []}
                            onChange={(values) => field.onChange(values)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Purpose</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="purposeDomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select domains"
                                options={[
                                  { value: "EDUCATION", label: "Education" },
                                  { value: "TECHNOLOGY", label: "Technology" },
                                  { value: "HEALTHCARE", label: "Healthcare" },
                                  { value: "FINANCE", label: "Finance" },
                                  { value: "ENTERTAINMENT", label: "Entertainment" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purposeArchetype"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Archetype</FormLabel>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select archetypes"
                                options={[
                                  { value: "LEADER", label: "Leader" },
                                  { value: "FOLLOWER", label: "Follower" },
                                  { value: "INDEPENDENT", label: "Independent" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="purposeModality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modality</FormLabel>
                            <FormControl>
                              <MultiSelect
                                placeholder="Select modalities"
                                options={[
                                  { value: "ONLINE", label: "Online" },
                                  { value: "OFFLINE", label: "Offline" },
                                  { value: "HYBRID", label: "Hybrid" },
                                  { value: "OTHER", label: "Other" },
                                ]}
                                selected={field.value || []}
                                onChange={(values) => field.onChange(values)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button type="submit">Apply Filters</Button>
                  </div>
                </form>
              </Form>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* <Button variant="outline" className="gap-2" onClick={toggleSortOrder}>
          <ArrowUpDown className="h-4 w-4" />
          {sortOrder === "desc" ? "Newest First" : "Oldest First"}
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.current > 1) {
                    handlePageChange(pagination.current - 1)
                  }
                }}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(10, pagination.pages) }, (_, i) => {
              const start = Math.max(1, pagination.current - 4)
              const page = start + i
              return page <= pagination.pages ? (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.current}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : null
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.current < pagination.pages) {
                    handlePageChange(pagination.current + 1)
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
} 