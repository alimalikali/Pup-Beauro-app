import { SignupForm } from "@/components/auth/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Pup",
  description: "Create your Pup account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignupForm />
    </div>
  )
}
