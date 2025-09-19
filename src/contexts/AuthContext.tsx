"use client"

import { createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"

interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: "patient" | "doctor" | "admin"
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => authApi.getProfile(),
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const login = async (email: string, password: string) => {
    try {
      const { user: userData } = await authApi.login(email, password)
      
      queryClient.setQueryData(['auth-user'], userData)
      
      // Redirect based on role
      const dashboardPath = `/dashboard/${userData.role}`
      router.push(dashboardPath)
    } catch (error: unknown) {
      // Handle email not verified error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('verify your email') || (error as { emailNotVerified?: boolean }).emailNotVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }
      // Re-throw other errors
      throw error
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    queryClient.setQueryData(['auth-user'], null)
    queryClient.clear()
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}