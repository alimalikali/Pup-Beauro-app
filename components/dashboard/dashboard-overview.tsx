"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Users, Edit, ChevronRight, User, Book, Settings, Target } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useProfileCompletion } from "@/lib/hooks/use-profile-completion"
import { useCurrentUserProfile } from "@/lib/hooks/use-queries"

export function DashboardOverview() {
  const { completion, sections, isLoading } = useProfileCompletion()
  const { data: profileData, isLoading: isLoadingPurpose } = useCurrentUserProfile()
  
  if (isLoading || isLoadingPurpose) {
    return <div>Loading...</div>
  }

  const user = profileData?.user

  const purposeSummary = {
    domain: "Educational",
    archetype: "Teacher",
    modality: "Organizing",
    anchor: "Islamic Education Reform",
  }

  const matchStats = {
    totalMatches: 12,
    newMatches: 3,
    highCompatibility: 5,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, John</h1>
        <p className="text-muted-foreground">Here's an overview of your profile and matches.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
              <CardDescription>Complete your profile to get better matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{completion}% complete</span>
                    <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                      <Link href="/dashboard/profile">
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>
                    </Button>
                  </div>
                  <Progress value={completion} className="h-2" />
                </div>

                {/* <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>Basic Info</span>
                      </div>
                      <span>{Math.round(sections.basicInfo)}%</span>
                    </div>
                    <Progress value={sections.basicInfo} className="h-1" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-primary" />
                        <span>Personal Info</span>
                      </div>
                      <span>{Math.round(sections.personalInfo)}%</span>
                    </div>
                    <Progress value={sections.personalInfo} className="h-1" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span>Preferences</span>
                      </div>
                      <span>{Math.round(sections.preferences)}%</span>
                    </div>
                    <Progress value={sections.preferences} className="h-1" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span>Purpose</span>
                      </div>
                      <span>{Math.round(sections.purpose)}%</span>
                    </div>
                    <Progress value={sections.purpose} className="h-1" />
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Matches</CardTitle>
              <CardDescription>People who share your purpose</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{matchStats.totalMatches}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{matchStats.newMatches}</div>
                    <div className="text-xs text-muted-foreground">New</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{matchStats.highCompatibility}</div>
                    <div className="text-xs text-muted-foreground">High Match</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-1" asChild>
                  <Link href="/matches">
                    <Users className="h-4 w-4" />
                    <span>View Matches</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Subscription</CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Free Plan</div>
                    <div className="text-sm text-muted-foreground">5 matches/month</div>
                  </div>
                  <Button variant="default" size="sm" className="h-8" asChild>
                    <Link href="/billing">Upgrade</Link>
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">3</span> matches remaining this month
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Your Purpose Profile
            </CardTitle>
            <CardDescription>This is how potential matches see your purpose</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Domain</div>
                    <div className="font-medium">{user?.domain || 'Not set'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Archetype</div>
                    <div className="font-medium">{user?.archetype || 'Not set'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Modality</div>
                    <div className="font-medium">{user?.modality || 'Not set'}</div>
                  </div>
                </div>
                <Button variant="outline" className="gap-1" asChild>
                  <Link href="/dashboard/profile">
                    <Edit className="h-4 w-4" />
                    <span>Edit Purpose</span>
                  </Link>
                </Button>
              </TabsContent>
              <TabsContent value="details" className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    {user?.narrative || 'No narrative set'}
                  </p>
                </div>
                <Button variant="outline" className="gap-1" asChild>
                  <Link href="/dashboard/profile">
                    <Edit className="h-4 w-4" />
                    <span>Edit Narrative</span>
                  </Link>
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>People who share your purpose and meet your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Sarah {index + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        {index === 0
                          ? "Educational Advocate"
                          : index === 1
                            ? "Environmental Activist"
                            : "Community Organizer"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{index === 0 ? "92%" : index === 1 ? "87%" : "83%"}</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/matches">View All Matches</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}
    </div>
  )
}
