"use client"

import { Badge } from "@/components/ui/badge"
import { NotificationBell } from "@/components/ui/notification-bell"
import { getRoleColor } from "@/components/ui/status-colors"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardHeaderProps {
  actions?: React.ReactNode
}

export function DashboardHeader({ actions }: DashboardHeaderProps) {
  const { user, isLoading: loading } = useAuth()

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Empty */}
          <div className="flex-1 min-w-0">
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
              ) : user && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}