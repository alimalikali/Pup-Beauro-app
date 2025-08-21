"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Users, UserCheck, UserPlus, Heart, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { RecentUsersTable } from "@/components/admin/recent-users-table"
import { OverviewChart } from "@/components/admin/overview-chart"
import { PurposeDistributionChart } from "@/components/admin/purpose-distribution-chart"

export function DashboardOverview() {
  // Mock data for the dashboard
  const stats = {
    totalUsers: 1248,
    totalMatches: 876,
    newSignups: 42,
    flaggedUsers: 5,
    userGrowth: 12.5,
    matchGrowth: 8.3,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Pup admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stats.userGrowth}%
                </span>
                from last month
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-500 flex items-center mr-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stats.matchGrowth}%
                </span>
                from last month
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Signups</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newSignups}</div>
              <div className="text-xs text-muted-foreground mt-1">in the last 7 days</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flagged Users</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flaggedUsers}</div>
              <div className="text-xs text-muted-foreground mt-1">requiring review</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>User signups over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Purpose Distribution</CardTitle>
                <CardDescription>User purpose domains</CardDescription>
              </CardHeader>
              <CardContent>
                <PurposeDistributionChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: UserPlus, text: "New user registered: Sarah Ahmed", time: "2 minutes ago" },
                    { icon: Heart, text: "New match created: Omar & Layla", time: "15 minutes ago" },
                    { icon: AlertTriangle, text: "User flagged for review: user_123", time: "1 hour ago" },
                    { icon: UserPlus, text: "New user registered: Yusuf Ibrahim", time: "3 hours ago" },
                    { icon: Heart, text: "New match created: Ahmed & Fatima", time: "5 hours ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <activity.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Match Statistics</CardTitle>
                <CardDescription>Match quality and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">High Compatibility Matches (85%+)</div>
                      <div className="text-sm text-muted-foreground">32%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Medium Compatibility (70-84%)</div>
                      <div className="text-sm text-muted-foreground">45%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Low Compatibility (50-69%)</div>
                      <div className="text-sm text-muted-foreground">23%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "23%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Mutual Likes</div>
                      <div className="text-sm text-muted-foreground">28%</div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Detailed analytics are available on the Analytics page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">User Retention</div>
                  <div className="text-2xl font-bold">76%</div>
                  <div className="text-xs text-muted-foreground">Monthly active users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Avg. Session</div>
                  <div className="text-2xl font-bold">12m 24s</div>
                  <div className="text-xs text-muted-foreground">Time spent on platform</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Premium Users</div>
                  <div className="text-2xl font-bold">18%</div>
                  <div className="text-xs text-muted-foreground">Of total user base</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-2xl font-bold">24%</div>
                  <div className="text-xs text-muted-foreground">Matches leading to relationships</div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/admin/analytics" className="flex items-center justify-center">
                  View Full Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Recently registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentUsersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
