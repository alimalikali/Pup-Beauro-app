"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Flag,
  Ban,
  CheckCircle,
  AlertTriangle,
  Download,
  UserPlus,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function UserManagement() {
  // Mock data for users
  const initialUsers = [
    {
      id: "u1",
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      status: "active",
      purpose: "Educational",
      joinDate: "2023-06-28",
      flagged: false,
      premium: true,
      matches: 12,
    },
    {
      id: "u2",
      name: "Omar Farooq",
      email: "omar.f@example.com",
      status: "active",
      purpose: "Political",
      joinDate: "2023-06-27",
      flagged: false,
      premium: false,
      matches: 8,
    },
    {
      id: "u3",
      name: "Layla Mahmoud",
      email: "layla.m@example.com",
      status: "pending",
      purpose: "Social Justice",
      joinDate: "2023-06-26",
      flagged: false,
      premium: false,
      matches: 0,
    },
    {
      id: "u4",
      name: "Yusuf Ibrahim",
      email: "yusuf.i@example.com",
      status: "active",
      purpose: "Educational",
      joinDate: "2023-06-25",
      flagged: true,
      premium: true,
      matches: 5,
    },
    {
      id: "u5",
      name: "Aisha Khan",
      email: "aisha.k@example.com",
      status: "suspended",
      purpose: "Spiritual",
      joinDate: "2023-06-24",
      flagged: false,
      premium: false,
      matches: 3,
    },
    {
      id: "u6",
      name: "Zainab Ali",
      email: "zainab.a@example.com",
      status: "active",
      purpose: "Educational",
      joinDate: "2023-06-23",
      flagged: false,
      premium: true,
      matches: 15,
    },
    {
      id: "u7",
      name: "Ahmed Hassan",
      email: "ahmed.h@example.com",
      status: "active",
      purpose: "Environmental",
      joinDate: "2023-06-22",
      flagged: false,
      premium: false,
      matches: 7,
    },
    {
      id: "u8",
      name: "Fatima Malik",
      email: "fatima.m@example.com",
      status: "active",
      purpose: "Health & Wellness",
      joinDate: "2023-06-21",
      flagged: false,
      premium: true,
      matches: 10,
    },
    {
      id: "u9",
      name: "Khalid Rahman",
      email: "khalid.r@example.com",
      status: "suspended",
      purpose: "Political",
      joinDate: "2023-06-20",
      flagged: true,
      premium: false,
      matches: 2,
    },
    {
      id: "u10",
      name: "Noor Jahan",
      email: "noor.j@example.com",
      status: "active",
      purpose: "Spiritual",
      joinDate: "2023-06-19",
      flagged: false,
      premium: true,
      matches: 9,
    },
  ]

  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [purposeFilter, setPurposeFilter] = useState("all")
  const [premiumFilter, setPremiumFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    // Purpose filter
    const matchesPurpose = purposeFilter === "all" || user.purpose === purposeFilter

    // Premium filter
    const matchesPremium =
      premiumFilter === "all" ||
      (premiumFilter === "premium" && user.premium) ||
      (premiumFilter === "free" && !user.premium)

    return matchesSearch && matchesStatus && matchesPurpose && matchesPremium
  })

  const handleFlag = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, flagged: !user.flagged } : user)))
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPurposeFilter("all")
    setPremiumFilter("all")
  }

  const viewUserDetails = (user: any) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Pending
          </Badge>
        )
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage and monitor users on the Pup platform.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-full sm:w-[250px]"
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
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account manually.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose Domain</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="spiritual">Spiritual</SelectItem>
                          <SelectItem value="political">Political</SelectItem>
                          <SelectItem value="social-justice">Social Justice</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="health-wellness">Health & Wellness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="premium" />
                      <Label htmlFor="premium">Premium User</Label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filter Users</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Purpose Domain</Label>
                  <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Domains</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Spiritual">Spiritual</SelectItem>
                      <SelectItem value="Political">Political</SelectItem>
                      <SelectItem value="Social Justice">Social Justice</SelectItem>
                      <SelectItem value="Environmental">Environmental</SelectItem>
                      <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subscription</Label>
                  <Select value={premiumFilter} onValueChange={setPremiumFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="premium">Premium Only</SelectItem>
                      <SelectItem value="free">Free Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <UserTable
                users={filteredUsers}
                handleFlag={handleFlag}
                handleStatusChange={handleStatusChange}
                viewUserDetails={viewUserDetails}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="active">
              <UserTable
                users={filteredUsers.filter((user) => user.status === "active")}
                handleFlag={handleFlag}
                handleStatusChange={handleStatusChange}
                viewUserDetails={viewUserDetails}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="flagged">
              <UserTable
                users={filteredUsers.filter((user) => user.flagged)}
                handleFlag={handleFlag}
                handleStatusChange={handleStatusChange}
                viewUserDetails={viewUserDetails}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="premium">
              <UserTable
                users={filteredUsers.filter((user) => user.premium)}
                handleFlag={handleFlag}
                handleStatusChange={handleStatusChange}
                viewUserDetails={viewUserDetails}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the selected user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`/placeholder.svg?height=64&width=64&text=${selectedUser.name.charAt(0)}`}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedUser.status)}
                      {selectedUser.premium && (
                        <Badge variant="outline" className="bg-primary/10">
                          Premium
                        </Badge>
                      )}
                      {selectedUser.flagged && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">
                          Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID</span>
                        <span>{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Join Date</span>
                        <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subscription</span>
                        <span>{selectedUser.premium ? "Premium" : "Free"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span>{selectedUser.status}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Purpose Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain</span>
                        <span>{selectedUser.purpose}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Matches</span>
                        <span>{selectedUser.matches}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" onClick={() => handleFlag(selectedUser.id)}>
                      <Flag className="mr-2 h-4 w-4" />
                      {selectedUser.flagged ? "Remove Flag" : "Flag User"}
                    </Button>
                    {selectedUser.status !== "suspended" ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange(selectedUser.id, "suspended")}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange(selectedUser.id, "active")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate User
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Activity Log</h4>
                  <div className="bg-muted/30 rounded-lg p-4 h-[200px] overflow-y-auto">
                    <div className="space-y-3">
                      <div className="border-b pb-2">
                        <p className="text-sm">Logged in from New York, USA</p>
                        <p className="text-xs text-muted-foreground">Today, 10:23 AM</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm">Updated profile information</p>
                        <p className="text-xs text-muted-foreground">Yesterday, 3:45 PM</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm">Matched with Omar F.</p>
                        <p className="text-xs text-muted-foreground">Jun 25, 2023, 5:12 PM</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm">Completed purpose questionnaire</p>
                        <p className="text-xs text-muted-foreground">Jun 24, 2023, 11:30 AM</p>
                      </div>
                      <div>
                        <p className="text-sm">Account created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedUser.joinDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface UserTableProps {
  users: any[]
  handleFlag: (userId: string) => void
  handleStatusChange: (userId: string, newStatus: string) => void
  viewUserDetails: (user: any) => void
  getStatusBadge: (status: string) => React.ReactNode
}

function UserTable({ users, handleFlag, handleStatusChange, viewUserDetails, getStatusBadge }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <p className="text-muted-foreground">No users found</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32&text=${user.name.charAt(0)}`}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    {user.flagged && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.purpose}</TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.premium ? (
                    <Badge variant="outline" className="bg-primary/10">
                      Premium
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Free</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFlag(user.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        <span>{user.flagged ? "Remove flag" : "Flag user"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status !== "active" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Activate</span>
                        </DropdownMenuItem>
                      )}
                      {user.status !== "suspended" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Suspend</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
