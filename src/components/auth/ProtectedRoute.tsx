"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("patient" | "doctor" | "admin")[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  
  if (!isLoading && !user) {
    router.push(redirectTo)
    return null
  }

  if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
    router.push(`/dashboard/${user.role}`)
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}