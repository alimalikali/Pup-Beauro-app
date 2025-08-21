"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Flag, Ban, CheckCircle, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentUsersTable() {
  // Mock data for recent users
  const initialUsers = [
    {
      id: "u1",
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      status: "active",
      purpose: "Educational",
      joinDate: "2023-06-28",
      flagged: false,
    },
    {
      id: "u2",
      name: "Omar Farooq",
      email: "omar.f@example.com",
      status: "active",
      purpose: "Political",
      joinDate: "2023-06-27",
      flagged: false,
    },
    {
      id: "u3",
      name: "Layla Mahmoud",
      email: "layla.m@example.com",
      status: "pending",
      purpose: "Social Justice",
      joinDate: "2023-06-26",
      flagged: false,
    },
    {
      id: "u4",
      name: "Yusuf Ibrahim",
      email: "yusuf.i@example.com",
      status: "active",
      purpose: "Educational",
      joinDate: "2023-06-25",
      flagged: true,
    },
    {
      id: "u5",
      name: "Aisha Khan",
      email: "aisha.k@example.com",
      status: "suspended",
      purpose: "Spiritual",
      joinDate: "2023-06-24",
      flagged: false,
    },
  ]

  const [users, setUsers] = useState(initialUsers)

  const handleFlag = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, flagged: !user.flagged } : user)))
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
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
                    <DropdownMenuItem>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
