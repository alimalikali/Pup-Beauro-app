"use client"

import ProfileForm from "@/components/profile/profile-form"
import PurposeProfileForm from "@/components/profile/purpose-profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { User, Target } from "lucide-react"



export default function ProfilePage() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Complete your profile information to improve your matching experience
        </p>
      </div>

      <Card>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Personal Profile</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="purpose"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Purpose Profile</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="p-6">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="purpose" className="p-6">
            <PurposeProfileForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
