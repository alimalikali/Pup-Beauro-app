"use client"

import React, { createContext, useContext } from "react"
import { useAuthStore } from "@/lib/store/auth-store"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null  // TODO: fix this
  login: (credentials: any) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, login: storeLogin, logout: storeLogout, isLoading } = useAuthStore()

  const login = async (credentials: any) => {
    await storeLogin(credentials, "/dashboard")
  }

  const logout = async () => {
    await storeLogout()
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

