"use client"

import { useEffect, useState } from "react"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationBell } from "@/components/ui/notification-bell"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

interface UserInfo {
  firstName: string
  lastName: string
  role: string
}

export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...")
        const response = await fetch("/api/auth/me")
        console.log("Response status:", response.status)
        if (response.ok) {
          const data = await response.json()
          console.log("User data:", data)
          setUser(data.user)
          setLoading(false)
        } else {
          const errorText = await response.text()
          console.error("Failed to fetch user:", response.status, errorText)
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800"
      case "doctor": return "bg-blue-100 text-blue-800"
      case "patient": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Title & Subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4">
              {title && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-slate-600 mt-0.5 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell />

            {/* Actions */}
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              {loading ? (
                <div className="animate-pulse flex items-center space-x-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div className="hidden sm:block w-20 h-4 bg-slate-200 rounded"></div>
                </div>
              ) : user ? (
                <>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <Badge className={`${getRoleColor(user.role)} text-xs`} variant="secondary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-500">Not logged in</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}